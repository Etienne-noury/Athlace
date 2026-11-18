-- Questionnaire club : tout ce que le club remplit doit apparaître sur sa fiche publique après validation.
-- Nouvelles colonnes : détail des équipes, matériel (dotation / à acheter), précisions libres, plusieurs vidéos,
-- autres liens (Strava…). La vue publique les expose (toujours derrière l'accord fédération) et la conversion
-- du questionnaire les remplit ; X (Twitter) va dans twitter_url.

ALTER TABLE public.clubs
  ADD COLUMN IF NOT EXISTS teams jsonb,
  ADD COLUMN IF NOT EXISTS equipment_provided text[],
  ADD COLUMN IF NOT EXISTS equipment_to_buy text[],
  ADD COLUMN IF NOT EXISTS sport_notes text,
  ADD COLUMN IF NOT EXISTS video_urls text[],
  ADD COLUMN IF NOT EXISTS other_links jsonb;

CREATE OR REPLACE VIEW public.clubs_public AS
SELECT id, federation_code, external_id, name, acronym, league, committee, structure_type, affiliation_number,
  discipline, sub_disciplines, level, address, address_complement, postal_code, city, department_code, region,
  latitude, longitude, website, description, practice_types, competitions, age_categories, min_age, audiences,
  accessibility, labels, amenities, logo_url, colors, facebook_url, instagram_url, twitter_url, registration_url,
  licensees_total, licensees_youth, licensees_female, siret, rna_number, price_info, creation_date, source_url,
  scraped_at, claimed_by_club, created_at, updated_at, geocode_failed, position_checked_at, linkedin_url,
  youtube_url, tiktok_url, helloasso_url, licensees_senior_male, licensees_senior_female, licensees_youth_male,
  licensees_youth_female, competition_categories, access_conditions, courses, holes_total, practice_info,
  outing_durations, outing_places, transports, membership_fee, dance_families, photo_urls, video_url, trainings,
  fleet, opening_hours, practice_mode, beginners_accepted, max_age, required_level, medical_required,
  other_conditions, trial_sessions, registration_start, registration_end, season_start, waitlist, installments,
  accepted_aids, required_documents, qualified_coaches, atmosphere, annual_events, seeks_volunteers,
  club_verified_at, correspondence_address, kit_image_url,
  teams, equipment_provided, equipment_to_buy, sport_notes, video_urls, other_links
FROM public.clubs
WHERE NOT is_hidden
  AND (
    (SELECT private.is_admin())
    OR EXISTS (SELECT 1 FROM public.federation_publication fp WHERE fp.federation_code = clubs.federation_code AND fp.authorized)
  );

CREATE OR REPLACE FUNCTION public.submission_payload_to_club(p jsonb, p_discipline text, p_accessibility text[])
RETURNS jsonb LANGUAGE plpgsql IMMUTABLE SET search_path = public AS $$
DECLARE
  out jsonb := '{}'::jsonb;
  t text;
  subs jsonb;
  colors text;
  acc text[];
  amb numeric;
BEGIN
  -- Texte simple : clé payload -> colonne
  FOR t IN SELECT unnest(ARRAY[
    'video_url:video_url','description:description','league:league','required_level:required_level',
    'other_conditions:other_conditions','documents:required_documents','registration_url:registration_url',
    'events:annual_events','email:email','phone:phone','website:website','instagram_url:instagram_url',
    'facebook_url:facebook_url','tiktok_url:tiktok_url','youtube_url:youtube_url','linkedin_url:linkedin_url',
    'affiliation_number:affiliation_number','logo:logo_url','practice_level:practice_mode',
    'twitter_url:twitter_url','sport_notes:sport_notes'])
  LOOP
    IF NULLIF(btrim(p ->> split_part(t, ':', 1)), '') IS NOT NULL THEN
      out := out || jsonb_build_object(split_part(t, ':', 2), btrim(p ->> split_part(t, ':', 1)));
    END IF;
  END LOOP;

  -- Dates
  FOR t IN SELECT unnest(ARRAY['creation_date:creation_date','registration_start:registration_start',
    'registration_end:registration_end','season_start:season_start'])
  LOOP
    IF (p ->> split_part(t, ':', 1)) ~ '^\d{4}-\d{2}-\d{2}' THEN
      out := out || jsonb_build_object(split_part(t, ':', 2), left(p ->> split_part(t, ':', 1), 10));
    END IF;
  END LOOP;

  -- Entiers
  FOR t IN SELECT unnest(ARRAY['min_age:min_age','max_age:max_age','coaches_certified:qualified_coaches'])
  LOOP
    IF (p ->> split_part(t, ':', 1)) ~ '^\s*\d+(\.\d+)?\s*$' THEN
      out := out || jsonb_build_object(split_part(t, ':', 2), trunc((p ->> split_part(t, ':', 1))::numeric)::int);
    END IF;
  END LOOP;

  -- Booléens
  FOR t IN SELECT unnest(ARRAY['beginners_ok:beginners_accepted','health_certificate:medical_required',
    'waitlist:waitlist','installments:installments','volunteers:seeks_volunteers'])
  LOOP
    IF jsonb_typeof(p -> split_part(t, ':', 1)) = 'boolean' THEN
      out := out || jsonb_build_object(split_part(t, ':', 2), p -> split_part(t, ':', 1));
    END IF;
  END LOOP;

  -- Listes
  FOR t IN SELECT unnest(ARRAY['audiences:audiences','age_categories:age_categories','aids:accepted_aids',
    'amenities:amenities','photos:photo_urls','video_urls:video_urls','equipment_provided:equipment_provided',
    'equipment_to_buy:equipment_to_buy'])
  LOOP
    IF jsonb_typeof(p -> split_part(t, ':', 1)) = 'array' AND jsonb_array_length(p -> split_part(t, ':', 1)) > 0 THEN
      out := out || jsonb_build_object(split_part(t, ':', 2), p -> split_part(t, ':', 1));
    END IF;
  END LOOP;

  -- Labels : texte séparé par des virgules -> liste
  IF NULLIF(btrim(p ->> 'labels'), '') IS NOT NULL THEN
    out := out || jsonb_build_object('labels', (
      SELECT jsonb_agg(btrim(x)) FROM unnest(string_to_array(p ->> 'labels', ',')) x WHERE btrim(x) <> ''));
  END IF;

  -- Sous-disciplines (+ « Autre ») ; Danse -> dance_families
  subs := CASE WHEN jsonb_typeof(p -> 'sub_disciplines') = 'array' THEN p -> 'sub_disciplines' ELSE '[]'::jsonb END;
  IF NULLIF(btrim(p ->> 'sub_other'), '') IS NOT NULL THEN
    subs := subs || to_jsonb(btrim(p ->> 'sub_other'));
  END IF;
  IF jsonb_array_length(subs) > 0 THEN
    out := out || jsonb_build_object(CASE WHEN p_discipline = 'Danse' THEN 'dance_families' ELSE 'sub_disciplines' END, subs);
  END IF;

  -- Couleurs
  colors := concat_ws(',', NULLIF(p ->> 'color_1', ''), NULLIF(p ->> 'color_2', ''));
  IF colors <> '' THEN out := out || jsonb_build_object('colors', colors); END IF;

  -- Séance d'essai : non -> 0 ; oui -> nombre saisi
  IF (p -> 'trial') = 'false'::jsonb THEN
    out := out || jsonb_build_object('trial_sessions', 0);
  ELSIF (p -> 'trial') = 'true'::jsonb AND (p ->> 'trial_sessions') ~ '^\s*\d+\s*$' THEN
    out := out || jsonb_build_object('trial_sessions', (p ->> 'trial_sessions')::int);
  END IF;

  -- Ambiance : curseur 0-100 -> 1 (convivial) à 5 (compétitif)
  IF jsonb_typeof(p -> 'ambiance') = 'number' THEN
    amb := (p ->> 'ambiance')::numeric;
    out := out || jsonb_build_object('atmosphere', LEAST(5, GREATEST(1, round(amb / 25) + 1))::int);
  END IF;

  -- Accessibilité PMR : ajoute ou retire « PMR » de la liste existante
  IF jsonb_typeof(p -> 'pmr') = 'boolean' THEN
    acc := array_remove(COALESCE(p_accessibility, '{}'), 'PMR');
    IF (p -> 'pmr') = 'true'::jsonb THEN acc := acc || 'PMR'::text; END IF;
    out := out || jsonb_build_object('accessibility', to_jsonb(acc));
  END IF;

  -- Équipes et groupes (détail par équipe) et autres liens (Strava…) : gardés tels quels en jsonb.
  IF jsonb_typeof(p -> 'teams') = 'array' AND jsonb_array_length(p -> 'teams') > 0 THEN
    out := out || jsonb_build_object('teams', p -> 'teams');
  END IF;
  IF jsonb_typeof(p -> 'other_links') = 'array' AND jsonb_array_length(p -> 'other_links') > 0 THEN
    out := out || jsonb_build_object('other_links', p -> 'other_links');
  END IF;

  RETURN out;
END;
$$;
REVOKE ALL ON FUNCTION public.submission_payload_to_club(jsonb, text, text[]) FROM PUBLIC, anon, authenticated;

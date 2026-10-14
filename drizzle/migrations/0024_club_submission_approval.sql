ALTER TABLE public.clubs
  ADD COLUMN practice_mode text CHECK (practice_mode IN ('loisir','competition','les_deux')),
  ADD COLUMN beginners_accepted boolean,
  ADD COLUMN max_age int,
  ADD COLUMN required_level text,
  ADD COLUMN medical_required boolean,
  ADD COLUMN other_conditions text,
  ADD COLUMN trial_sessions int,
  ADD COLUMN registration_start date,
  ADD COLUMN registration_end date,
  ADD COLUMN season_start date,
  ADD COLUMN waitlist boolean,
  ADD COLUMN installments boolean,
  ADD COLUMN accepted_aids text[],
  ADD COLUMN required_documents text,
  ADD COLUMN qualified_coaches int,
  ADD COLUMN atmosphere int CHECK (atmosphere BETWEEN 1 AND 5),
  ADD COLUMN annual_events text,
  ADD COLUMN seeks_volunteers boolean,
  ADD COLUMN club_verified_at timestamptz;

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
  fleet, opening_hours,
  practice_mode, beginners_accepted, max_age, required_level, medical_required, other_conditions, trial_sessions,
  registration_start, registration_end, season_start, waitlist, installments, accepted_aids, required_documents,
  qualified_coaches, atmosphere, annual_events, seeks_volunteers, club_verified_at
FROM public.clubs;

CREATE TABLE public.club_sport_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  question_key text NOT NULL,
  value text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (club_id, question_key)
);
GRANT SELECT ON public.club_sport_answers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.club_sport_answers TO authenticated;
GRANT ALL ON public.club_sport_answers TO service_role;
ALTER TABLE public.club_sport_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read club_sport_answers" ON public.club_sport_answers
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins write club_sport_answers" ON public.club_sport_answers
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::text))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::text));
CREATE TRIGGER update_club_sport_answers_updated_at
  BEFORE UPDATE ON public.club_sport_answers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Convertit le brouillon (clés écrites par MyClub.tsx) en valeurs de colonnes de clubs.
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
    'affiliation_number:affiliation_number','logo:logo_url','practice_level:practice_mode'])
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
    'amenities:amenities','photos:photo_urls'])
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

  RETURN out;
END;
$$;
REVOKE ALL ON FUNCTION public.submission_payload_to_club(jsonb, text, text[]) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.approve_submission(submission_id uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  s public.club_submissions%ROWTYPE;
  p jsonb;
  v_club uuid;
  v_disc text;
  v_fed text;
  v_acc text[];
  vals jsonb;
  col text;
  newrow jsonb;
BEGIN
  IF NOT COALESCE(private.has_role(auth.uid(), 'admin'::text), false) THEN
    RAISE EXCEPTION 'Accès réservé aux administrateurs' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO s FROM public.club_submissions WHERE id = submission_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Fiche introuvable'; END IF;
  IF s.status <> 'submitted' THEN RAISE EXCEPTION 'Seule une fiche envoyée peut être validée (statut actuel : %)', s.status; END IF;
  p := COALESCE(s.payload, '{}'::jsonb);
  v_club := s.club_id;

  -- Club absent de la base : création
  IF v_club IS NULL THEN
    v_disc := NULLIF(btrim(p #>> '{new_club,discipline}'), '');
    IF v_disc IS NULL OR NULLIF(btrim(p #>> '{new_club,name}'), '') IS NULL THEN
      RAISE EXCEPTION 'Nom ou discipline du nouveau club manquant';
    END IF;
    SELECT f.sigle INTO v_fed FROM public.federations_sportives f
      WHERE lower(f.nom) LIKE '%' || lower(v_disc) || '%' ORDER BY length(f.nom) LIMIT 1;
    IF v_fed IS NULL THEN
      SELECT c.federation_code INTO v_fed FROM public.clubs c WHERE c.discipline = v_disc
        GROUP BY c.federation_code ORDER BY count(*) DESC LIMIT 1;
    END IF;
    INSERT INTO public.clubs (federation_code, external_id, name, discipline, city, source_url)
    VALUES (COALESCE(v_fed, 'NC'), 'athlace-' || submission_id, btrim(p #>> '{new_club,name}'), v_disc,
            NULLIF(btrim(p #>> '{new_club,city}'), ''), 'athlace')
    ON CONFLICT (federation_code, external_id) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_club;
  END IF;

  SELECT c.discipline, c.accessibility INTO v_disc, v_acc FROM public.clubs c WHERE c.id = v_club;
  vals := public.submission_payload_to_club(p, v_disc, v_acc);

  -- Valeur finale telle que la verra le trigger de verrouillage
  SELECT to_jsonb(jsonb_populate_record(c, vals)) INTO newrow FROM public.clubs c WHERE c.id = v_club;

  -- 1) verrouillage des champs, 2) mise à jour de clubs
  FOR col IN SELECT jsonb_object_keys(vals) LOOP
    INSERT INTO public.club_field_status (club_id, field, source, club_value, locked, conflict, verified_at)
    VALUES (v_club, col, 'club', public.club_value_as_text(newrow -> col), true, false, now())
    ON CONFLICT (club_id, field) DO UPDATE
      SET source = 'club', club_value = EXCLUDED.club_value, locked = true, conflict = false, verified_at = now();
  END LOOP;
  FOR col IN SELECT jsonb_object_keys(vals) LOOP
    EXECUTE format('UPDATE public.clubs SET %1$I = (jsonb_populate_record(NULL::public.clubs, $1)).%1$I WHERE id = $2', col)
      USING vals, v_club;
  END LOOP;

  -- Lieux, créneaux, tarifs : remplacés quand le brouillon en contient la liste
  IF jsonb_typeof(p -> 'venues') = 'array' THEN
    DELETE FROM public.club_venues WHERE club_id = v_club;
    INSERT INTO public.club_venues (club_id, name, address, is_main)
    SELECT v_club, NULLIF(btrim(x ->> 'name'), ''), NULLIF(btrim(x ->> 'address'), ''), COALESCE((x ->> 'is_main')::boolean, false)
    FROM jsonb_array_elements(p -> 'venues') x
    WHERE NULLIF(btrim(x ->> 'name'), '') IS NOT NULL OR NULLIF(btrim(x ->> 'address'), '') IS NOT NULL;
  END IF;
  IF jsonb_typeof(p -> 'schedules') = 'array' THEN
    DELETE FROM public.club_schedules WHERE club_id = v_club;
    INSERT INTO public.club_schedules (club_id, day, start_time, end_time, category, level, venue_name)
    SELECT v_club, NULLIF(x ->> 'day', ''),
      CASE WHEN (x ->> 'start_time') ~ '^\d{1,2}:\d{2}' THEN (x ->> 'start_time')::time END,
      CASE WHEN (x ->> 'end_time') ~ '^\d{1,2}:\d{2}' THEN (x ->> 'end_time')::time END,
      NULLIF(btrim(x ->> 'category'), ''), NULLIF(btrim(x ->> 'level'), ''), NULLIF(btrim(x ->> 'venue'), '')
    FROM jsonb_array_elements(p -> 'schedules') x
    WHERE NULLIF(x ->> 'day', '') IS NOT NULL OR NULLIF(x ->> 'start_time', '') IS NOT NULL;
  END IF;
  IF jsonb_typeof(p -> 'prices') = 'array' THEN
    DELETE FROM public.club_prices WHERE club_id = v_club;
    INSERT INTO public.club_prices (club_id, label, amount, period, includes_license)
    SELECT v_club, btrim(x ->> 'label'), replace(x ->> 'amount', ',', '.')::numeric,
      CASE WHEN x ->> 'period' IN ('saison','mois','trimestre','séance') THEN x ->> 'period' ELSE 'saison' END,
      COALESCE((x ->> 'includes_license')::boolean, true)
    FROM jsonb_array_elements(p -> 'prices') x
    WHERE NULLIF(btrim(x ->> 'label'), '') IS NOT NULL
      AND replace(x ->> 'amount', ',', '.') ~ '^\s*\d+(\.\d+)?\s*$';
  END IF;

  -- Réponses spécifiques au sport
  IF jsonb_typeof(p -> 'sport_answers') = 'object' THEN
    INSERT INTO public.club_sport_answers (club_id, question_key, value)
    SELECT v_club, a.key, public.club_value_as_text(a.value)
    FROM jsonb_each(p -> 'sport_answers') a
    WHERE public.club_value_as_text(a.value) IS NOT NULL AND public.club_value_as_text(a.value) NOT IN ('', '[]')
    ON CONFLICT (club_id, question_key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();
  END IF;

  UPDATE public.clubs SET claimed_by_club = true, club_verified_at = now() WHERE id = v_club;
  UPDATE public.club_submissions SET status = 'approved', club_id = v_club WHERE id = submission_id;
  RETURN v_club;
END;
$$;
REVOKE ALL ON FUNCTION public.approve_submission(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.approve_submission(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.reject_submission(submission_id uuid, note text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT COALESCE(private.has_role(auth.uid(), 'admin'::text), false) THEN
    RAISE EXCEPTION 'Accès réservé aux administrateurs' USING ERRCODE = '42501';
  END IF;
  UPDATE public.club_submissions SET status = 'rejected', admin_note = note WHERE id = submission_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Fiche introuvable'; END IF;
END;
$$;
REVOKE ALL ON FUNCTION public.reject_submission(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.reject_submission(uuid, text) TO authenticated;
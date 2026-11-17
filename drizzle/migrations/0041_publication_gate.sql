-- Publication des clubs scrapés : réservée aux admins tant que la fédération n'a pas donné son accord écrit.
-- Restent publics : les clubs créés ou revendiqués par le club lui-même (source Athlace, fiche validée).
CREATE TABLE IF NOT EXISTS public.federation_publication (
  federation_code text PRIMARY KEY,
  authorized boolean NOT NULL DEFAULT false,
  authorized_at timestamptz,
  note text CHECK (note IS NULL OR char_length(note) <= 500),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.federation_publication ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.federation_publication FROM anon, PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.federation_publication TO authenticated;
GRANT ALL ON public.federation_publication TO service_role;
DROP POLICY IF EXISTS "Admins manage federation publication" ON public.federation_publication;
CREATE POLICY "Admins manage federation publication" ON public.federation_publication FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

INSERT INTO public.federation_publication (federation_code)
SELECT DISTINCT federation_code FROM public.clubs WHERE federation_code IS NOT NULL
ON CONFLICT (federation_code) DO NOTHING;

CREATE OR REPLACE FUNCTION private.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$ SELECT COALESCE(private.has_role(auth.uid(), 'admin'), false) $$;
REVOKE ALL ON FUNCTION private.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.is_admin() TO anon, authenticated, service_role;

-- Même colonnes qu'avant, seul le filtre change.
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
  club_verified_at, correspondence_address, kit_image_url
FROM public.clubs
WHERE NOT is_hidden
  AND (
    (SELECT private.is_admin())
    OR claimed_by_club IS TRUE
    OR club_verified_at IS NOT NULL
    OR source_url = 'athlace'
    OR EXISTS (SELECT 1 FROM public.federation_publication fp WHERE fp.federation_code = clubs.federation_code AND fp.authorized)
  );

-- Contacts et données liées : seulement pour les clubs visibles.
CREATE OR REPLACE FUNCTION public.get_club_contact(p_club_id uuid)
RETURNS TABLE(email text, phone text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT c.email, c.phone FROM public.clubs c
  WHERE c.id = p_club_id AND EXISTS (SELECT 1 FROM public.clubs_public p WHERE p.id = c.id) LIMIT 1;
$$;

DROP POLICY IF EXISTS "Public read club_schedules" ON public.club_schedules;
CREATE POLICY "Public read club_schedules" ON public.club_schedules FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.clubs_public p WHERE p.id = club_schedules.club_id));
DROP POLICY IF EXISTS "Public read club_venues" ON public.club_venues;
CREATE POLICY "Public read club_venues" ON public.club_venues FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.clubs_public p WHERE p.id = club_venues.club_id));
DROP POLICY IF EXISTS "Public read club_prices" ON public.club_prices;
CREATE POLICY "Public read club_prices" ON public.club_prices FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.clubs_public p WHERE p.id = club_prices.club_id));
DROP POLICY IF EXISTS "Public read club_sport_answers" ON public.club_sport_answers;
CREATE POLICY "Public read club_sport_answers" ON public.club_sport_answers FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.clubs_public p WHERE p.id = club_sport_answers.club_id));

-- Compteurs : le cache (calculé sans session) ne compte que les clubs publiés ; un admin voit le calcul complet.
CREATE OR REPLACE FUNCTION public.available_disciplines()
RETURNS TABLE(discipline text, clubs integer, subs jsonb)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT x.discipline, x.clubs, x.subs
  FROM public.stats_cache c, jsonb_to_recordset(c.data) AS x(discipline text, clubs integer, subs jsonb)
  WHERE c.key = 'available_disciplines' AND NOT (SELECT private.is_admin())
  UNION ALL
  SELECT l.discipline, l.clubs, l.subs FROM private.available_disciplines_live() l WHERE (SELECT private.is_admin());
$$;

CREATE OR REPLACE FUNCTION public.federation_club_stats()
RETURNS TABLE(federation_code text, discipline text, clubs bigint, subs text[])
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT x.federation_code, x.discipline, x.clubs, x.subs
  FROM public.stats_cache c, jsonb_to_recordset(c.data) AS x(federation_code text, discipline text, clubs bigint, subs text[])
  WHERE c.key = 'federation_club_stats' AND NOT (SELECT private.is_admin())
  UNION ALL
  SELECT l.federation_code, l.discipline, l.clubs, l.subs FROM private.federation_club_stats_live() l WHERE (SELECT private.is_admin());
$$;

CREATE OR REPLACE FUNCTION public.home_stats()
RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT CASE WHEN (SELECT private.is_admin()) THEN private.home_stats_live()
    ELSE (SELECT c.data FROM public.stats_cache c WHERE c.key = 'home_stats') END;
$$;

CREATE OR REPLACE FUNCTION public.search_cities(p_q text DEFAULT NULL, p_limit integer DEFAULT 60)
RETURNS TABLE(city text, department_code text, postal_code text, region text, clubs integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  WITH q AS (SELECT private.norm_txt(p_q) AS v, btrim(coalesce(p_q, '')) AS raw),
  src AS (
    SELECT ci.city, ci.department_code, ci.postal_code, ci.region, ci.clubs, ci.search
    FROM public.city_index ci WHERE NOT (SELECT private.is_admin())
    UNION ALL
    SELECT (array_agg(c.city ORDER BY (c.city = upper(c.city) OR c.city = lower(c.city)), c.city))[1], c.department_code,
      mode() WITHIN GROUP (ORDER BY c.postal_code), mode() WITHIN GROUP (ORDER BY c.region), count(*)::int, private.norm_txt(min(c.city))
    FROM public.clubs_public c
    WHERE (SELECT private.is_admin()) AND c.city IS NOT NULL AND btrim(c.city) <> ''
    GROUP BY private.norm_txt(c.city), c.department_code
  )
  SELECT s.city, s.department_code, s.postal_code, s.region, s.clubs
  FROM src s, q
  WHERE q.v = '' OR s.search LIKE q.v || '%' OR s.search LIKE '% ' || q.v || '%'
     OR (q.raw ~ '^[0-9]{2,5}$' AND s.postal_code LIKE q.raw || '%')
  ORDER BY (q.v <> '' AND s.search = q.v) DESC, (q.v <> '' AND s.search LIKE q.v || '%') DESC, s.clubs DESC, s.city
  LIMIT LEAST(GREATEST(coalesce(p_limit, 60), 1), 500);
$$;

CREATE OR REPLACE FUNCTION public.location_stats()
RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT CASE WHEN (SELECT private.is_admin()) THEN jsonb_build_object(
      'departments', (SELECT COALESCE(jsonb_agg(jsonb_build_object('code', d.department_code, 'clubs', d.n) ORDER BY d.department_code), '[]'::jsonb)
        FROM (SELECT department_code, count(*)::int n FROM public.clubs_public WHERE department_code IS NOT NULL GROUP BY 1) d),
      'regions', (SELECT COALESCE(jsonb_agg(jsonb_build_object('region', r.region, 'clubs', r.n) ORDER BY r.n DESC), '[]'::jsonb)
        FROM (SELECT region, count(*)::int n FROM public.clubs_public WHERE region IS NOT NULL GROUP BY 1) r),
      'cities', (SELECT count(DISTINCT (private.norm_txt(city), department_code)) FROM public.clubs_public WHERE city IS NOT NULL))
    ELSE jsonb_build_object(
      'departments', COALESCE((SELECT data FROM public.stats_cache WHERE key = 'departments'), '[]'::jsonb),
      'regions', COALESCE((SELECT data FROM public.stats_cache WHERE key = 'regions'), '[]'::jsonb),
      'cities', (SELECT count(*) FROM public.city_index)) END;
$$;

-- Les caches publics sont recalculés tout de suite avec la nouvelle règle.
SELECT public.refresh_stats_cache();
SELECT public.refresh_location_index();

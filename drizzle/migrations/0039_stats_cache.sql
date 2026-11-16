-- Cache des statistiques publiques : les compteurs (clubs, sports, sous-disciplines) étaient recalculés
-- sur ~100 000 clubs à chaque visite (jusqu'à 2,4 s). Ils sont maintenant précalculés toutes les 10 min.
CREATE TABLE IF NOT EXISTS public.stats_cache (
  key text PRIMARY KEY,
  data jsonb NOT NULL,
  refreshed_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.stats_cache ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.stats_cache FROM anon, authenticated, PUBLIC;
GRANT ALL ON public.stats_cache TO service_role;

-- Calculs complets (anciennes versions des RPC), déplacés dans le schéma privé.
CREATE OR REPLACE FUNCTION private.available_disciplines_live()
RETURNS TABLE(discipline text, clubs integer, subs jsonb)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  WITH base AS (
    SELECT c.id, c.discipline, c.sub_disciplines, c.dance_families
    FROM public.clubs_public c
    WHERE c.discipline IS NOT NULL AND btrim(c.discipline) <> ''
  ), counts AS (
    SELECT b.discipline, count(*)::int AS clubs FROM base b GROUP BY b.discipline
  ), sub_vals AS (
    SELECT b.discipline, s.v, count(DISTINCT b.id)::int AS n
    FROM base b
    CROSS JOIN LATERAL (
      SELECT unnest(COALESCE(b.sub_disciplines, '{}'::text[])) AS v
      UNION
      SELECT unnest(COALESCE(b.dance_families, '{}'::text[]))
    ) s
    WHERE s.v IS NOT NULL AND btrim(s.v) <> ''
    GROUP BY b.discipline, s.v
  )
  SELECT c.discipline, c.clubs,
    COALESCE((SELECT jsonb_object_agg(sv.v, sv.n) FROM sub_vals sv WHERE sv.discipline = c.discipline), '{}'::jsonb)
  FROM counts c;
$$;

CREATE OR REPLACE FUNCTION private.federation_club_stats_live()
RETURNS TABLE(federation_code text, discipline text, clubs bigint, subs text[])
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT c.federation_code, c.discipline, count(*) AS clubs,
    ARRAY(SELECT DISTINCT s.name FROM public.clubs_public c2
      CROSS JOIN LATERAL unnest(CASE WHEN c2.discipline = 'Danse' THEN c2.dance_families ELSE c2.sub_disciplines END) s(name)
      WHERE c2.federation_code = c.federation_code AND c2.discipline = c.discipline
        AND s.name IS NOT NULL AND btrim(s.name) <> '' ORDER BY s.name) AS subs
  FROM public.clubs_public c GROUP BY c.federation_code, c.discipline;
$$;

CREATE OR REPLACE FUNCTION private.home_stats_live()
RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT jsonb_build_object(
    'clubs', (SELECT count(*) FROM public.clubs_public),
    'federations_covered', (SELECT count(DISTINCT federation_code) FROM public.clubs_public),
    'federations_total', (SELECT count(*) FROM public.federations_sportives),
    'cities', (SELECT count(DISTINCT lower(btrim(city))) FROM public.clubs_public WHERE city IS NOT NULL AND btrim(city) <> ''),
    'schedules', (SELECT count(*) FROM public.club_schedules s JOIN public.clubs_public c ON c.id = s.club_id),
    'venues', (SELECT count(*) FROM public.club_venues v JOIN public.clubs_public c ON c.id = v.club_id),
    'clubs_with_schedules', (SELECT count(DISTINCT s.club_id) FROM public.club_schedules s JOIN public.clubs_public c ON c.id = s.club_id),
    'last_update', (SELECT max(scraped_at) FROM public.clubs_public)
  );
$$;

CREATE OR REPLACE FUNCTION public.refresh_stats_cache()
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.stats_cache (key, data, refreshed_at) VALUES
    ('available_disciplines', (SELECT COALESCE(jsonb_agg(to_jsonb(t)), '[]'::jsonb) FROM private.available_disciplines_live() t), now()),
    ('federation_club_stats', (SELECT COALESCE(jsonb_agg(to_jsonb(t)), '[]'::jsonb) FROM private.federation_club_stats_live() t), now()),
    ('home_stats', private.home_stats_live(), now())
  ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, refreshed_at = EXCLUDED.refreshed_at;
END;
$$;
REVOKE ALL ON FUNCTION public.refresh_stats_cache() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.refresh_stats_cache() TO service_role;

-- Les RPC publiques gardent la même signature : elles lisent le cache (quelques ms).
CREATE OR REPLACE FUNCTION public.available_disciplines()
RETURNS TABLE(discipline text, clubs integer, subs jsonb)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT x.discipline, x.clubs, x.subs
  FROM public.stats_cache c, jsonb_to_recordset(c.data) AS x(discipline text, clubs integer, subs jsonb)
  WHERE c.key = 'available_disciplines';
$$;

CREATE OR REPLACE FUNCTION public.federation_club_stats()
RETURNS TABLE(federation_code text, discipline text, clubs bigint, subs text[])
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT x.federation_code, x.discipline, x.clubs, x.subs
  FROM public.stats_cache c, jsonb_to_recordset(c.data) AS x(federation_code text, discipline text, clubs bigint, subs text[])
  WHERE c.key = 'federation_club_stats';
$$;

CREATE OR REPLACE FUNCTION public.home_stats()
RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT c.data FROM public.stats_cache c WHERE c.key = 'home_stats';
$$;

GRANT EXECUTE ON FUNCTION public.available_disciplines() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.federation_club_stats() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.home_stats() TO anon, authenticated;

SELECT public.refresh_stats_cache();

SELECT cron.unschedule(jobid) FROM cron.job WHERE jobname = 'refresh-stats-cache';
SELECT cron.schedule('refresh-stats-cache', '*/10 * * * *', $cron$SELECT public.refresh_stats_cache()$cron$);

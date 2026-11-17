-- Recherche par localisation : index des villes, comptes par département et par région (précalculés),
-- et noms de région harmonisés (certains imports étaient en majuscules sans accents).
CREATE OR REPLACE FUNCTION private.norm_txt(t text)
RETURNS text LANGUAGE sql IMMUTABLE AS $$
  SELECT btrim(regexp_replace(lower(translate(coalesce(t, ''),
    'ÀÂÄÁÃÇÉÈÊËÍÎÏÓÔÖÕÙÛÜÚŸàâäáãçéèêëíîïóôöõùûüúÿ''’',
    'AAAAACEEEEIIIOOOOUUUUYaaaaaceeeeiiioooouuuuy  ')), '[^a-z0-9]+', ' ', 'g'));
$$;

UPDATE public.clubs c SET region = r.name
FROM (VALUES ('Auvergne-Rhône-Alpes'), ('Bourgogne-Franche-Comté'), ('Bretagne'), ('Centre-Val de Loire'), ('Corse'),
  ('Grand Est'), ('Hauts-de-France'), ('Île-de-France'), ('Normandie'), ('Nouvelle-Aquitaine'), ('Occitanie'),
  ('Pays de la Loire'), ('Provence-Alpes-Côte d''Azur'), ('Guadeloupe'), ('Martinique'), ('Guyane'), ('La Réunion'), ('Mayotte')) AS r(name)
WHERE c.region IS DISTINCT FROM r.name
  AND replace(private.norm_txt(c.region), ' ', '') = replace(private.norm_txt(r.name), ' ', '');

CREATE TABLE IF NOT EXISTS public.city_index (
  city text NOT NULL,
  department_code text,
  postal_code text,
  region text,
  clubs integer NOT NULL,
  search text NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_city_index_search ON public.city_index USING gin (search gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_city_index_clubs ON public.city_index (clubs DESC);
ALTER TABLE public.city_index ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.city_index FROM anon, authenticated, PUBLIC;
GRANT ALL ON public.city_index TO service_role;

CREATE OR REPLACE FUNCTION public.refresh_location_index()
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  DELETE FROM public.city_index;
  INSERT INTO public.city_index (city, department_code, postal_code, region, clubs, search)
  SELECT (array_agg(c.city ORDER BY (c.city = upper(c.city) OR c.city = lower(c.city)), c.city))[1],
    c.department_code,
    mode() WITHIN GROUP (ORDER BY c.postal_code),
    mode() WITHIN GROUP (ORDER BY c.region),
    count(*)::int,
    private.norm_txt(min(c.city))
  FROM public.clubs_public c
  WHERE c.city IS NOT NULL AND btrim(c.city) <> ''
  GROUP BY private.norm_txt(c.city), c.department_code;

  INSERT INTO public.stats_cache (key, data, refreshed_at) VALUES
    ('departments', (SELECT COALESCE(jsonb_agg(jsonb_build_object('code', d.department_code, 'clubs', d.n) ORDER BY d.department_code), '[]'::jsonb)
      FROM (SELECT department_code, count(*)::int n FROM public.clubs_public WHERE department_code IS NOT NULL GROUP BY 1) d), now()),
    ('regions', (SELECT COALESCE(jsonb_agg(jsonb_build_object('region', r.region, 'clubs', r.n) ORDER BY r.n DESC), '[]'::jsonb)
      FROM (SELECT region, count(*)::int n FROM public.clubs_public WHERE region IS NOT NULL GROUP BY 1) r), now())
  ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, refreshed_at = EXCLUDED.refreshed_at;
END;
$$;
REVOKE ALL ON FUNCTION public.refresh_location_index() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.refresh_location_index() TO service_role;

-- Villes : sans recherche, les plus fournies ; avec recherche, par nom (début de mot) ou code postal.
CREATE OR REPLACE FUNCTION public.search_cities(p_q text DEFAULT NULL, p_limit integer DEFAULT 60)
RETURNS TABLE(city text, department_code text, postal_code text, region text, clubs integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  WITH q AS (SELECT private.norm_txt(p_q) AS v, btrim(coalesce(p_q, '')) AS raw)
  SELECT ci.city, ci.department_code, ci.postal_code, ci.region, ci.clubs
  FROM public.city_index ci, q
  WHERE q.v = ''
     OR ci.search LIKE q.v || '%'
     OR ci.search LIKE '% ' || q.v || '%'
     OR (q.raw ~ '^[0-9]{2,5}$' AND ci.postal_code LIKE q.raw || '%')
  ORDER BY (q.v <> '' AND ci.search = q.v) DESC, (q.v <> '' AND ci.search LIKE q.v || '%') DESC, ci.clubs DESC, ci.city
  LIMIT LEAST(GREATEST(coalesce(p_limit, 60), 1), 500);
$$;

CREATE OR REPLACE FUNCTION public.location_stats()
RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT jsonb_build_object(
    'departments', COALESCE((SELECT data FROM public.stats_cache WHERE key = 'departments'), '[]'::jsonb),
    'regions', COALESCE((SELECT data FROM public.stats_cache WHERE key = 'regions'), '[]'::jsonb),
    'cities', (SELECT count(*) FROM public.city_index)
  );
$$;
GRANT EXECUTE ON FUNCTION public.search_cities(text, integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.location_stats() TO anon, authenticated;

SELECT public.refresh_location_index();

SELECT cron.unschedule(jobid) FROM cron.job WHERE jobname = 'refresh-location-index';
SELECT cron.schedule('refresh-location-index', '5,15,25,35,45,55 * * * *', $cron$SELECT public.refresh_location_index()$cron$);

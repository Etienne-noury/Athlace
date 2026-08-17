CREATE OR REPLACE FUNCTION public.site_stats()
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'clubs', (SELECT count(*) FROM public.clubs_enriched),
    'federations', (SELECT count(*) FROM public.federations_sportives),
    'cities', (SELECT count(DISTINCT lower(btrim(city))) FROM public.clubs_enriched WHERE city IS NOT NULL AND btrim(city) <> ''),
    'regions', (SELECT count(DISTINCT lower(btrim(region))) FROM public.clubs_enriched WHERE region IS NOT NULL AND btrim(region) <> ''),
    'disciplines', (SELECT count(DISTINCT lower(btrim(discipline))) FROM public.clubs_enriched WHERE discipline IS NOT NULL AND btrim(discipline) <> '')
  );
$$;

GRANT EXECUTE ON FUNCTION public.site_stats() TO anon, authenticated, service_role;
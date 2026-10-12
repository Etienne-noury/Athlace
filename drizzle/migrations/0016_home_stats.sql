CREATE OR REPLACE FUNCTION public.home_stats()
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT jsonb_build_object(
    'clubs', (SELECT count(*) FROM public.clubs_public),
    'federations_covered', (SELECT count(DISTINCT federation_code) FROM public.clubs_public),
    'federations_total', (SELECT count(*) FROM public.federations_sportives),
    'cities', (SELECT count(DISTINCT lower(btrim(city))) FROM public.clubs_public WHERE city IS NOT NULL AND btrim(city) <> ''),
    'schedules', (SELECT count(*) FROM public.club_schedules),
    'venues', (SELECT count(*) FROM public.club_venues),
    'clubs_with_schedules', (SELECT count(DISTINCT club_id) FROM public.club_schedules),
    'last_update', (SELECT max(scraped_at) FROM public.clubs_public)
  );
$$;
REVOKE ALL ON FUNCTION public.home_stats() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.home_stats() TO anon, authenticated;
ALTER TABLE public.clubs ADD COLUMN is_hidden boolean NOT NULL DEFAULT false;
COMMENT ON COLUMN public.clubs.is_hidden IS 'Club visibility controlled outside CSV imports; hidden clubs are excluded from the public directory and aggregates.';

DO $migration$
DECLARE view_sql text;
BEGIN
  SELECT pg_get_viewdef('public.clubs_public'::regclass, true) INTO view_sql;
  view_sql := regexp_replace(view_sql, ';\s*$', '');
  EXECUTE 'CREATE OR REPLACE VIEW public.clubs_public AS ' || view_sql || ' WHERE NOT is_hidden';
END;
$migration$;

-- available_disciplines, clubs_near, map_club_clusters and federation_club_stats
-- already read clubs_public exclusively, so inherit its visibility predicate.
CREATE OR REPLACE FUNCTION public.home_stats()
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.site_stats()
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  SELECT jsonb_build_object(
    'clubs', (SELECT count(*) FROM public.clubs_public),
    'federations', (SELECT count(*) FROM public.federations_sportives),
    'cities', (SELECT count(DISTINCT lower(btrim(city))) FROM public.clubs_public WHERE city IS NOT NULL AND btrim(city) <> ''),
    'regions', (SELECT count(DISTINCT lower(btrim(region))) FROM public.clubs_public WHERE region IS NOT NULL AND btrim(region) <> ''),
    'disciplines', (SELECT count(DISTINCT lower(btrim(discipline))) FROM public.clubs_public WHERE discipline IS NOT NULL AND btrim(discipline) <> '')
  );
$function$;

CREATE OR REPLACE FUNCTION public.get_club_contact(p_club_id uuid)
RETURNS TABLE(email text, phone text) LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  SELECT c.email, c.phone FROM public.clubs c WHERE c.id = p_club_id AND NOT c.is_hidden LIMIT 1;
$function$;
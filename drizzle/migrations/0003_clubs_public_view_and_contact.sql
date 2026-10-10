CREATE OR REPLACE VIEW public.clubs_public AS
SELECT id, federation_code, external_id, name, discipline, sub_disciplines, level,
       address, address_complement, postal_code, city, department_code, region,
       latitude, longitude, website, description, creation_date, source_url,
       scraped_at, claimed_by_club, created_at, updated_at, geocode_failed
FROM public.clubs;

GRANT SELECT ON public.clubs_public TO anon, authenticated;
GRANT ALL ON public.clubs_public TO service_role;

DROP POLICY IF EXISTS "Public read clubs" ON public.clubs;
REVOKE SELECT ON public.clubs FROM anon, authenticated;
GRANT ALL ON public.clubs TO service_role;

CREATE OR REPLACE FUNCTION public.get_club_contact(p_club_id uuid)
RETURNS TABLE(email text, phone text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO public
AS $$
  SELECT c.email, c.phone FROM public.clubs c WHERE c.id = p_club_id LIMIT 1;
$$;
REVOKE ALL ON FUNCTION public.get_club_contact(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_club_contact(uuid) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.map_club_clusters(p_lat_min double precision, p_lat_max double precision, p_lng_min double precision, p_lng_max double precision, p_precision double precision, p_disciplines text[] DEFAULT NULL::text[], p_postal_prefixes text[] DEFAULT NULL::text[], p_location text DEFAULT NULL::text)
 RETURNS TABLE(lat double precision, lng double precision, cnt bigint)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  SELECT avg(c.latitude)::double precision AS lat,
         avg(c.longitude)::double precision AS lng,
         count(*)::bigint AS cnt
  FROM public.clubs_public c
  WHERE c.latitude IS NOT NULL AND c.longitude IS NOT NULL
    AND c.latitude <> 0 AND c.longitude <> 0
    AND c.latitude BETWEEN p_lat_min AND p_lat_max
    AND c.longitude BETWEEN p_lng_min AND p_lng_max
    AND (
      p_disciplines IS NULL OR array_length(p_disciplines, 1) IS NULL
      OR EXISTS (SELECT 1 FROM unnest(p_disciplines) d WHERE c.discipline ILIKE '%' || d || '%')
    )
    AND (
      p_postal_prefixes IS NULL OR array_length(p_postal_prefixes, 1) IS NULL
      OR EXISTS (SELECT 1 FROM unnest(p_postal_prefixes) p WHERE c.postal_code ILIKE p || '%')
    )
    AND (
      p_location IS NULL OR btrim(p_location) = ''
      OR c.city ILIKE '%' || btrim(p_location) || '%'
      OR c.postal_code ILIKE btrim(p_location) || '%'
    )
  GROUP BY floor(c.latitude / p_precision), floor(c.longitude / p_precision)
$function$;

CREATE OR REPLACE FUNCTION public.site_stats()
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT jsonb_build_object(
    'clubs', (SELECT count(*) FROM public.clubs),
    'federations', (SELECT count(*) FROM public.federations_sportives),
    'cities', (SELECT count(DISTINCT lower(btrim(city))) FROM public.clubs WHERE city IS NOT NULL AND btrim(city) <> ''),
    'regions', (SELECT count(DISTINCT lower(btrim(region))) FROM public.clubs WHERE region IS NOT NULL AND btrim(region) <> ''),
    'disciplines', (SELECT count(DISTINCT lower(btrim(discipline))) FROM public.clubs WHERE discipline IS NOT NULL AND btrim(discipline) <> '')
  );
$function$;
GRANT EXECUTE ON FUNCTION public.site_stats() TO anon, authenticated;
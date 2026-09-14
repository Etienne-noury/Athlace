CREATE OR REPLACE FUNCTION public.map_club_clusters(
  p_lat_min double precision,
  p_lat_max double precision,
  p_lng_min double precision,
  p_lng_max double precision,
  p_precision double precision,
  p_disciplines text[] DEFAULT NULL,
  p_postal_prefixes text[] DEFAULT NULL,
  p_location text DEFAULT NULL
)
RETURNS TABLE (lat double precision, lng double precision, cnt bigint)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT avg(c.latitude)::double precision AS lat,
         avg(c.longitude)::double precision AS lng,
         count(*)::bigint AS cnt
  FROM public.clubs_enriched_public c
  WHERE c.latitude IS NOT NULL AND c.longitude IS NOT NULL
    AND c.latitude <> 0 AND c.longitude <> 0
    AND c.latitude BETWEEN p_lat_min AND p_lat_max
    AND c.longitude BETWEEN p_lng_min AND p_lng_max
    AND (
      p_disciplines IS NULL OR array_length(p_disciplines, 1) IS NULL
      OR EXISTS (
        SELECT 1 FROM unnest(p_disciplines) d
        WHERE c.discipline ILIKE '%' || d || '%'
      )
    )
    AND (
      p_postal_prefixes IS NULL OR array_length(p_postal_prefixes, 1) IS NULL
      OR EXISTS (
        SELECT 1 FROM unnest(p_postal_prefixes) p
        WHERE c.postal_code ILIKE p || '%'
      )
    )
    AND (
      p_location IS NULL OR btrim(p_location) = ''
      OR c.city ILIKE '%' || btrim(p_location) || '%'
      OR c.postal_code ILIKE btrim(p_location) || '%'
    )
  GROUP BY floor(c.latitude / p_precision), floor(c.longitude / p_precision)
$$;
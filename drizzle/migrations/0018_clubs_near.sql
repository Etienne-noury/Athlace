CREATE OR REPLACE FUNCTION public.clubs_near(
  p_lat double precision, p_lng double precision, p_radius_km double precision DEFAULT 30,
  p_disciplines text[] DEFAULT NULL, p_sub text DEFAULT NULL, p_region text DEFAULT NULL,
  p_limit int DEFAULT 100, p_offset int DEFAULT 0)
RETURNS TABLE(club jsonb, distance_km double precision, total bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  WITH c AS (
    SELECT cp.*, 6371 * 2 * asin(sqrt(
      power(sin(radians(cp.latitude - p_lat) / 2), 2) +
      cos(radians(p_lat)) * cos(radians(cp.latitude)) * power(sin(radians(cp.longitude - p_lng) / 2), 2)
    )) AS d
    FROM clubs_public cp
    WHERE cp.latitude IS NOT NULL AND cp.longitude IS NOT NULL
      AND cp.latitude BETWEEN p_lat - p_radius_km / 111.0 AND p_lat + p_radius_km / 111.0
      AND cp.longitude BETWEEN p_lng - p_radius_km / (111.0 * cos(radians(p_lat))) AND p_lng + p_radius_km / (111.0 * cos(radians(p_lat)))
      AND (p_disciplines IS NULL OR cardinality(p_disciplines) = 0 OR cp.discipline = ANY(p_disciplines))
      AND (p_sub IS NULL OR p_sub = ANY(cp.sub_disciplines) OR p_sub = ANY(cp.dance_families))
      AND (p_region IS NULL OR p_region = '' OR p_region = 'all' OR cp.region ILIKE '%' || p_region || '%')
  ), f AS (SELECT * FROM c WHERE d <= p_radius_km)
  SELECT to_jsonb(f) - 'd', f.d, count(*) OVER ()
  FROM f ORDER BY f.d LIMIT p_limit OFFSET p_offset;
$$;
GRANT EXECUTE ON FUNCTION public.clubs_near(double precision, double precision, double precision, text[], text, text, int, int) TO anon, authenticated;
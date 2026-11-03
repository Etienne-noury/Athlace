CREATE OR REPLACE FUNCTION public.federation_club_stats()
RETURNS TABLE(federation_code text, discipline text, clubs bigint, subs text[])
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public
AS $$
  SELECT c.federation_code, c.discipline, count(*) AS clubs,
    ARRAY(SELECT DISTINCT s.name FROM public.clubs_public c2
      CROSS JOIN LATERAL unnest(CASE WHEN c2.discipline = 'Danse' THEN c2.dance_families ELSE c2.sub_disciplines END) s(name)
      WHERE c2.federation_code = c.federation_code AND c2.discipline = c.discipline
        AND s.name IS NOT NULL AND btrim(s.name) <> '' ORDER BY s.name) AS subs
  FROM public.clubs_public c GROUP BY c.federation_code, c.discipline;
$$;
REVOKE ALL ON FUNCTION public.federation_club_stats() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.federation_club_stats() TO anon, authenticated, service_role;
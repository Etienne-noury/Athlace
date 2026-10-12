CREATE OR REPLACE FUNCTION public.available_disciplines()
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
REVOKE ALL ON FUNCTION public.available_disciplines() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.available_disciplines() TO anon, authenticated, service_role;
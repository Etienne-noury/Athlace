-- Statistiques admin par code fédération : clubs visibles, clubs géolocalisés et date du dernier import.
CREATE OR REPLACE FUNCTION public.admin_scraping_stats()
RETURNS TABLE(federation_code text, discipline text, clubs bigint, gps bigint, last_import date)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT COALESCE(private.has_role(auth.uid(), 'admin'::text), false) THEN
    RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501';
  END IF;
  RETURN QUERY
  SELECT c.federation_code, c.discipline, count(*)::bigint, count(c.latitude)::bigint,
    (max(c.created_at) AT TIME ZONE 'Europe/Paris')::date
  FROM public.clubs c
  WHERE NOT COALESCE(c.is_hidden, false) AND c.federation_code IS NOT NULL
  GROUP BY c.federation_code, c.discipline;
END;
$$;
REVOKE ALL ON FUNCTION public.admin_scraping_stats() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_scraping_stats() TO authenticated, service_role;

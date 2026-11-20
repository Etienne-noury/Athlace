-- Tant qu'une fédération n'a pas donné son accord écrit, le site peut la nommer (information) mais ne met
-- aucun lien vers ses sites (officiel, annuaire, sources). Le front lit la liste des fédérations autorisées ici.
CREATE OR REPLACE FUNCTION public.published_federations()
RETURNS SETOF text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT upper(federation_code) FROM public.federation_publication WHERE authorized;
$$;
REVOKE ALL ON FUNCTION public.published_federations() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.published_federations() TO anon, authenticated;

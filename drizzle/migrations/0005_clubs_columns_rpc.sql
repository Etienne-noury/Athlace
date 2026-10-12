CREATE OR REPLACE FUNCTION public.get_clubs_columns()
RETURNS TABLE(column_name text, data_type text, udt_name text)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public
AS $$
  SELECT c.column_name::text, c.data_type::text, c.udt_name::text
  FROM information_schema.columns c
  WHERE c.table_schema = 'public' AND c.table_name = 'clubs'
$$;
REVOKE ALL ON FUNCTION public.get_clubs_columns() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_clubs_columns() TO service_role;
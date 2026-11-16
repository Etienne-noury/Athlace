DROP POLICY IF EXISTS "Anon read non-sensitive clubs_enriched" ON public.clubs_enriched;
DROP POLICY IF EXISTS "Authenticated read clubs_enriched" ON public.clubs_enriched;
REVOKE ALL ON public.clubs_enriched FROM anon, authenticated, PUBLIC;
REVOKE ALL ON public.clubs_enriched_public FROM anon, authenticated, PUBLIC;
DROP POLICY IF EXISTS "Admins read clubs_enriched" ON public.clubs_enriched;
CREATE POLICY "Admins read clubs_enriched" ON public.clubs_enriched FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'));
GRANT SELECT ON public.clubs_enriched TO authenticated;
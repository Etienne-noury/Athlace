DROP VIEW IF EXISTS public.clubs_enriched_public;

ALTER TABLE public.clubs_enriched 
  DROP COLUMN IF EXISTS scraped_at,
  DROP COLUMN IF EXISTS created_at,
  DROP COLUMN IF EXISTS raw;

ALTER TABLE public.clubs_enriched 
  ADD COLUMN IF NOT EXISTS complement text,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS date_creation date,
  ADD COLUMN IF NOT EXISTS distrib text;

CREATE VIEW public.clubs_enriched_public
WITH (security_invoker = true)
AS
SELECT id, federation_code, external_id, name, discipline, address, postal_code, city, region, latitude, longitude, website, source_url, updated_at
FROM public.clubs_enriched;

GRANT SELECT ON public.clubs_enriched_public TO anon, authenticated;
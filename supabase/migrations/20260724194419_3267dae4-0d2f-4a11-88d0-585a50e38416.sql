DROP VIEW IF EXISTS public.clubs_enriched_public;

ALTER TABLE public.clubs_enriched 
  ALTER COLUMN date_creation TYPE timestamp USING date_creation::timestamp;

CREATE VIEW public.clubs_enriched_public
WITH (security_invoker = true)
AS
SELECT id, federation_code, external_id, name, description, discipline,
       address, complement, distrib, postal_code, city, region,
       latitude, longitude, phone, email, website,
       date_creation, source_url, updated_at
FROM public.clubs_enriched;

GRANT SELECT ON public.clubs_enriched_public TO anon, authenticated;
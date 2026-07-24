
DROP VIEW IF EXISTS public.clubs_enriched_public;

CREATE TABLE public.clubs_enriched_new (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id text,
  federation_code text NOT NULL,
  name text NOT NULL,
  description text,
  discipline text,
  address text,
  complement text,
  distrib text,
  postal_code text,
  city text,
  region text,
  latitude double precision,
  longitude double precision,
  phone text,
  email text,
  website text,
  date_creation text,
  source_url text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.clubs_enriched_new
SELECT id, external_id, federation_code, name, description, discipline,
       address, complement, distrib, postal_code, city, region,
       latitude, longitude, phone, email, website,
       to_char(date_creation, 'YYYY-MM-DD"T"HH24:MI:SS'),
       source_url, updated_at
FROM public.clubs_enriched;

DROP TABLE public.clubs_enriched CASCADE;
ALTER TABLE public.clubs_enriched_new RENAME TO clubs_enriched;

ALTER TABLE public.clubs_enriched
  ADD CONSTRAINT clubs_enriched_fed_ext_uniq UNIQUE (federation_code, external_id);

GRANT SELECT ON public.clubs_enriched TO anon, authenticated;
GRANT ALL ON public.clubs_enriched TO service_role;

ALTER TABLE public.clubs_enriched ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon read non-sensitive clubs_enriched" ON public.clubs_enriched
FOR SELECT TO anon USING (true);

CREATE POLICY "Authenticated read clubs_enriched" ON public.clubs_enriched
FOR SELECT TO authenticated USING (true);

CREATE VIEW public.clubs_enriched_public
WITH (security_invoker = true)
AS
SELECT id, external_id, federation_code, name, description, discipline,
       address, complement, distrib, postal_code, city, region,
       latitude, longitude, phone, email, website, date_creation,
       source_url, updated_at
FROM public.clubs_enriched;

GRANT SELECT ON public.clubs_enriched_public TO anon, authenticated;

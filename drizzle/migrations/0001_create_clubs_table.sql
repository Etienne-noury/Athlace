CREATE TABLE public.clubs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  federation_code text NOT NULL,
  external_id text NOT NULL,
  name text NOT NULL,
  discipline text NOT NULL,
  sub_disciplines text[],
  level text,
  address text,
  address_complement text,
  postal_code text,
  city text,
  department_code text,
  region text,
  latitude double precision,
  longitude double precision,
  phone text,
  email text,
  website text,
  description text,
  creation_date date,
  source_url text,
  scraped_at timestamptz,
  claimed_by_club boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT clubs_federation_external_uniq UNIQUE (federation_code, external_id)
);

CREATE INDEX idx_clubs_federation_code ON public.clubs (federation_code);
CREATE INDEX idx_clubs_postal_code ON public.clubs (postal_code);
CREATE INDEX idx_clubs_department_code ON public.clubs (department_code);
CREATE INDEX idx_clubs_lat_lng ON public.clubs (latitude, longitude);

GRANT SELECT ON public.clubs TO anon;
GRANT SELECT ON public.clubs TO authenticated;
GRANT ALL ON public.clubs TO service_role;

ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read clubs" ON public.clubs FOR SELECT TO anon, authenticated USING (true);
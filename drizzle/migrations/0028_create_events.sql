CREATE TABLE public.events (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' AND length(slug) <= 200),
 title text NOT NULL CHECK (length(btrim(title)) BETWEEN 1 AND 200),
 description text NOT NULL DEFAULT '' CHECK (length(description) <= 20000),
 start_date date NOT NULL,
 end_date date,
 city text NOT NULL CHECK (length(btrim(city)) BETWEEN 1 AND 200),
 address text CHECK (length(address) <= 500),
 latitude double precision CHECK (latitude BETWEEN -90 AND 90),
 longitude double precision CHECK (longitude BETWEEN -180 AND 180),
 sport_id text NOT NULL CHECK (sport_id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 federation_code text CHECK (length(federation_code) <= 50),
 organizer_name text NOT NULL CHECK (length(btrim(organizer_name)) BETWEEN 1 AND 200),
 is_athlace boolean NOT NULL DEFAULT false,
 external_url text CHECK (external_url IS NULL OR (external_url ~* '^https?://' AND length(external_url) <= 2000)),
 image_url text CHECK (image_url IS NULL OR (image_url ~* '^https?://' AND length(image_url) <= 2000)),
 created_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT events_date_order CHECK (end_date IS NULL OR end_date >= start_date),
 CONSTRAINT events_coordinates_pair CHECK ((latitude IS NULL) = (longitude IS NULL))
);
GRANT SELECT ON public.events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read upcoming and ongoing events" ON public.events FOR SELECT TO anon, authenticated USING (COALESCE(end_date, start_date) >= (now() AT TIME ZONE 'Europe/Paris')::date);
CREATE POLICY "Admins manage events" ON public.events FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'::text)) WITH CHECK (private.has_role(auth.uid(), 'admin'::text));
CREATE INDEX events_start_date_idx ON public.events(start_date);
CREATE INDEX events_sport_city_idx ON public.events(sport_id, city);

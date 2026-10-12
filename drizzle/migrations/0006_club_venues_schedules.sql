CREATE TABLE public.club_venues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  name text, kind text, address text, address_complement text, postal_code text, city text,
  latitude double precision, longitude double precision,
  is_main boolean DEFAULT false, accessibility text[], amenities text[],
  created_at timestamptz DEFAULT now()
);
CREATE TABLE public.club_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  venue_name text, day text, start_time time, end_time time, title text, category text,
  level text, discipline text, notes text,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX club_venues_club_id_idx ON public.club_venues(club_id);
CREATE INDEX club_schedules_club_id_idx ON public.club_schedules(club_id);
GRANT SELECT ON public.club_venues, public.club_schedules TO anon, authenticated;
GRANT ALL ON public.club_venues, public.club_schedules TO service_role;
ALTER TABLE public.club_venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read club_venues" ON public.club_venues FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read club_schedules" ON public.club_schedules FOR SELECT TO anon, authenticated USING (true);
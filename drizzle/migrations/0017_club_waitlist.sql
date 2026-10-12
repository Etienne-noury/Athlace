CREATE TABLE public.club_waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_name text NOT NULL CHECK (char_length(club_name) BETWEEN 1 AND 200),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 255),
  sport text CHECK (sport IS NULL OR char_length(sport) <= 100),
  members_estimate text CHECK (members_estimate IS NULL OR char_length(members_estimate) <= 50),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.club_waitlist TO anon;
GRANT SELECT, INSERT ON public.club_waitlist TO authenticated;
GRANT ALL ON public.club_waitlist TO service_role;
ALTER TABLE public.club_waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can join waitlist" ON public.club_waitlist FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins read waitlist" ON public.club_waitlist FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'));
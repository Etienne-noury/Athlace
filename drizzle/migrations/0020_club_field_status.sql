CREATE TABLE public.club_field_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  field text NOT NULL,
  source text NOT NULL CHECK (source IN ('federation','club')),
  federation_value text,
  club_value text,
  locked boolean NOT NULL DEFAULT false,
  conflict boolean NOT NULL DEFAULT false,
  verified_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (club_id, field)
);

GRANT SELECT ON public.club_field_status TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.club_field_status TO authenticated;
GRANT ALL ON public.club_field_status TO service_role;
ALTER TABLE public.club_field_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read club_field_status" ON public.club_field_status
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins write club_field_status" ON public.club_field_status
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::text))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::text));

CREATE TRIGGER update_club_field_status_updated_at
  BEFORE UPDATE ON public.club_field_status
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
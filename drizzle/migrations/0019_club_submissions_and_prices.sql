CREATE TABLE public.club_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid REFERENCES public.clubs(id) ON DELETE SET NULL,
  user_id uuid NOT NULL,
  role text CHECK (role IN ('président','secrétaire','trésorier','entraîneur','autre')),
  affiliation_number text,
  affiliation_match boolean NOT NULL DEFAULT false,
  current_step int NOT NULL DEFAULT 1,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','submitted','approved','rejected')),
  admin_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  submitted_at timestamptz
);
CREATE INDEX idx_club_submissions_user ON public.club_submissions(user_id);
CREATE INDEX idx_club_submissions_club ON public.club_submissions(club_id);

GRANT SELECT, INSERT, UPDATE ON public.club_submissions TO authenticated;
GRANT ALL ON public.club_submissions TO service_role;
ALTER TABLE public.club_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own submissions" ON public.club_submissions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users create own submissions" ON public.club_submissions
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND status IN ('draft','submitted'));
CREATE POLICY "Users update own submissions" ON public.club_submissions
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id AND status IN ('draft','submitted'))
  WITH CHECK (auth.uid() = user_id AND status IN ('draft','submitted'));
CREATE POLICY "Admins read all submissions" ON public.club_submissions
  FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::text));
CREATE POLICY "Admins update all submissions" ON public.club_submissions
  FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::text))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::text));

CREATE OR REPLACE FUNCTION public.club_submissions_before_write()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, private AS $$
DECLARE
  v_ref text;
  v_is_admin boolean := COALESCE(private.has_role(auth.uid(), 'admin'::text), false)
                        OR auth.role() = 'service_role';
BEGIN
  NEW.affiliation_match := false;
  IF NEW.club_id IS NOT NULL AND NEW.affiliation_number IS NOT NULL THEN
    SELECT c.affiliation_number INTO v_ref FROM public.clubs c WHERE c.id = NEW.club_id;
    IF v_ref IS NOT NULL
       AND lower(regexp_replace(v_ref, '\s', '', 'g')) <> ''
       AND lower(regexp_replace(v_ref, '\s', '', 'g')) = lower(regexp_replace(NEW.affiliation_number, '\s', '', 'g')) THEN
      NEW.affiliation_match := true;
    END IF;
  END IF;

  IF NOT v_is_admin THEN
    IF TG_OP = 'INSERT' THEN
      NEW.admin_note := NULL;
    ELSE
      NEW.admin_note := OLD.admin_note;
    END IF;
  END IF;

  IF TG_OP = 'INSERT' THEN
    NEW.created_at := now();
  END IF;
  NEW.updated_at := now();

  IF NEW.status = 'submitted' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'submitted') THEN
    NEW.submitted_at := now();
  ELSIF TG_OP = 'UPDATE' THEN
    NEW.submitted_at := COALESCE(NEW.submitted_at, OLD.submitted_at);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_club_submissions_before_write
  BEFORE INSERT OR UPDATE ON public.club_submissions
  FOR EACH ROW EXECUTE FUNCTION public.club_submissions_before_write();

CREATE TABLE public.club_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  label text NOT NULL,
  amount numeric NOT NULL,
  period text NOT NULL DEFAULT 'saison' CHECK (period IN ('saison','mois','trimestre','séance')),
  includes_license boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_club_prices_club ON public.club_prices(club_id);

GRANT SELECT ON public.club_prices TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.club_prices TO authenticated;
GRANT ALL ON public.club_prices TO service_role;
ALTER TABLE public.club_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read club_prices" ON public.club_prices
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins write club_prices" ON public.club_prices
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::text))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::text));
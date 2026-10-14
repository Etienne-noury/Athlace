CREATE TABLE public.sport_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  federation_code text,
  key text NOT NULL,
  label text NOT NULL,
  help text,
  type text NOT NULL DEFAULT 'text' CHECK (type IN ('text','number','boolean','select','multiselect')),
  options text[],
  sort int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true
);
CREATE UNIQUE INDEX sport_questions_fed_key_uniq ON public.sport_questions (COALESCE(federation_code, ''), key);

GRANT SELECT ON public.sport_questions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sport_questions TO authenticated;
GRANT ALL ON public.sport_questions TO service_role;
ALTER TABLE public.sport_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read sport_questions" ON public.sport_questions
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins write sport_questions" ON public.sport_questions
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::text))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::text));
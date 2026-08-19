CREATE TABLE public.equipements_sportifs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id text UNIQUE,
  nom_installation text,
  adresse text,
  postal_code text,
  city text,
  departement text,
  region text,
  latitude double precision,
  longitude double precision,
  type_equipement text,
  famille_equipement text,
  activites text,
  website text,
  acces_libre boolean,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.equipements_sportifs TO anon;
GRANT SELECT ON public.equipements_sportifs TO authenticated;
GRANT ALL ON public.equipements_sportifs TO service_role;

ALTER TABLE public.equipements_sportifs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read equipements_sportifs"
ON public.equipements_sportifs FOR SELECT TO anon, authenticated USING (true);

CREATE TRIGGER trg_equipements_sportifs_updated
BEFORE UPDATE ON public.equipements_sportifs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
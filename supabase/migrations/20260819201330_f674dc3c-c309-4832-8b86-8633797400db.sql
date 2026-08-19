CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA extensions;

ALTER TABLE public.clubs_enriched ADD COLUMN IF NOT EXISTS equipements text[];

CREATE INDEX IF NOT EXISTS idx_clubs_enriched_postal_code ON public.clubs_enriched (postal_code);
CREATE INDEX IF NOT EXISTS idx_equipements_sportifs_postal_code ON public.equipements_sportifs (postal_code);
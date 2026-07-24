ALTER TABLE public.clubs_enriched 
ADD COLUMN IF NOT EXISTS complement text,
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS date_creation date,
ADD COLUMN IF NOT EXISTS distrib text;
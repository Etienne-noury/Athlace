-- Suivi admin de l'avancement du scraping par fédération (lecture et écriture réservées aux admins).
CREATE TABLE IF NOT EXISTS public.federation_scraping_status (
  sigle text PRIMARY KEY,
  status text NOT NULL DEFAULT 'done' CHECK (status IN ('done', 'in_progress', 'to_import', 'blocked', 'todo')),
  block_reason text CHECK (block_reason IS NULL OR char_length(block_reason) <= 500),
  next_step text CHECK (next_step IS NULL OR char_length(next_step) <= 500),
  source_total integer CHECK (source_total IS NULL OR source_total >= 0),
  last_scraped_on date,
  updated_at timestamptz NOT NULL DEFAULT now()
);
REVOKE ALL ON public.federation_scraping_status FROM anon, PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.federation_scraping_status TO authenticated;
GRANT ALL ON public.federation_scraping_status TO service_role;
ALTER TABLE public.federation_scraping_status ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins manage scraping status" ON public.federation_scraping_status;
CREATE POLICY "Admins manage scraping status" ON public.federation_scraping_status FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

INSERT INTO public.federation_scraping_status (sigle)
SELECT sigle FROM public.federations_sportives WHERE sigle IS NOT NULL
ON CONFLICT (sigle) DO NOTHING;

INSERT INTO public.federation_scraping_status (sigle, status, block_reason, next_step, source_total, last_scraped_on)
VALUES
('FFKMDA','done',null,null,null,'2026-11-07'::date),
('FFM','done','Téléphones manquants : certificat SSL de carte.ffmoto.org expiré','Réessayer quand le certificat est réparé',null,null),
('FFB','done',null,null,null,'2026-11-07'::date),
('FFAAA','done',null,null,null,'2026-11-07'::date),
('FAEMC','done',null,null,null,'2026-11-07'::date),
('FFPS','done',null,null,null,'2026-11-07'::date),
('FFPLUM','done',null,null,null,'2026-11-07'::date),
('FFVL','done',null,null,null,'2026-11-07'::date),
('FFH-HDSP','in_progress','Limite de requêtes (HTTP 429) après 499 fiches','Reprendre plus lentement (8 s/fiche) en plusieurs sessions, ou demander un export',1686,'2026-11-07'::date),
('FFCAM','done',null,null,null,'2026-11-07'::date),
('FFS','done',null,null,null,'2026-11-07'::date),
('FFA-AERO','done',null,null,null,'2026-11-07'::date),
('FFSA','done',null,null,null,'2026-11-07'::date),
('FFFA','done',null,null,null,'2026-11-07'::date),
('FFSQUASH','done',null,null,null,'2026-11-07'::date),
('FFSURF','done',null,null,null,'2026-11-07'::date),
('FFSLC','done',null,null,null,'2026-11-07'::date),
('FFCO','done',null,null,null,'2026-11-07'::date),
('FFBS','done',null,null,null,'2026-11-07'::date),
('FFH','done',null,null,null,'2026-11-07'::date),
('FFR13','done',null,null,null,'2026-11-07'::date),
('FFSNW','done',null,null,null,'2026-11-07'::date),
('FFCV','done',null,null,null,'2026-11-07'::date),
('FFST','done',null,null,null,'2026-11-07'::date),
('FFPSA','todo','Pas encore tenté',null,null,null),
('FFMN','todo','Pas encore tenté',null,null,null),
('FFJSN','blocked','Aucun annuaire public trouvé','Contacter la fédé',null,null),
('FFKDA','blocked','Le site bloque le scraping','Réessayer plus tard et plus lentement, sinon demander un export',null,null),
('FFBABA','blocked','Aucun annuaire public trouvé','Contacter la fédé',null,null),
('FFJTC','todo','Pas encore tenté',null,null,null),
('FFAB','blocked','Pas de moteur de recherche de clubs exploitable','Pages des ligues régionales, ou demander la liste',null,null),
('FFPJP','blocked','Pas d''annuaire national','Sites des comités départementaux (gros chantier)',null,null),
('FFVRC','blocked','Seule l''adresse perso du président est publiée','Importer nom + commune + site, sans adresse (comme FFST)',null,null),
('FFPULKA','blocked','Aucun annuaire public trouvé','Contacter la fédé',null,null),
('FFGYM','blocked','Recherche de clubs en erreur (HTTP 500)','Réessayer, sinon passer par les comités régionaux',null,null),
('FFFORCE','blocked','Recherche sur carte, source de données introuvable','Chercher l''API dans les requêtes réseau',null,null),
('FFDTB','blocked','La page fige le navigateur','Trouver l''API derrière la carte (requêtes réseau)',null,null),
('FDDJR','blocked','Aucun annuaire public trouvé','Contacter la fédé',null,null),
('FFAM','blocked','Seule l''adresse perso du président est publiée','Importer nom + commune + site, sans adresse (comme FFST)',null,null),
('FFAERO','todo','Pas encore tenté',null,null,null),
('FFHELICO','todo','Pas encore tenté',null,null,null),
('FFBSQ','blocked','Site hors ligne','Réessayer plus tard, sinon comités régionaux',null,null),
('FFBT','blocked','Aucun annuaire public trouvé','Ligues régionales ou contact fédé',null,null),
('FFCL','todo','Pas encore tenté',null,null,null),
('FFSB','blocked','Site hors ligne','Réessayer plus tard, sinon comités régionaux',null,null),
('FFA','blocked','Mentions légales : copie des données interdite','Demander une autorisation ou un export à la fédé',null,null),
('FFCC','todo','Pas encore tenté',null,null,null),
('FFE-ECH','in_progress','Serveur très lent (~20 s par page), scraping en tâche de fond','Laisser finir le job, export auto à la fin',1018,null),
('FFPB','to_import','Fichier v2 livré, pas encore importé','Importer le CSV pelote v2 puis Géocoder',272,'2026-11-07'::date),
('FFJBT','todo','Pas encore tenté',null,null,null),
('FFBAP','todo','Pas encore tenté',null,null,null),
('FFLP','todo','Pas encore tenté',null,null,null)
ON CONFLICT (sigle) DO UPDATE SET
  status = EXCLUDED.status, block_reason = EXCLUDED.block_reason, next_step = EXCLUDED.next_step,
  source_total = EXCLUDED.source_total, last_scraped_on = EXCLUDED.last_scraped_on, updated_at = now();

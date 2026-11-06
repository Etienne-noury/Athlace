-- Les vues publiques ne servent qu'à la lecture.
-- clubs_public lit clubs avec les droits de son propriétaire (elle contourne la RLS
-- pour n'exposer que des colonnes sûres) : tout droit d'écriture accordé à anon ou
-- authenticated permettrait de modifier la table clubs sans contrôle.
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.clubs_public FROM anon, authenticated, PUBLIC;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.clubs_enriched_public FROM anon, authenticated, PUBLIC;
GRANT SELECT ON public.clubs_public TO anon, authenticated;
GRANT SELECT ON public.clubs_enriched_public TO anon, authenticated;

-- Audit du 20/11/2026 : l'historique des champs des clubs n'est plus lisible publiquement.
-- club_field_status garde, pour chaque club, la valeur venue de la fédération et celle saisie par le club.
-- La policy « Public read » (USING true) laissait n'importe quel visiteur lire ces valeurs pour TOUS les clubs,
-- y compris ceux dont la fédération n'a pas encore donné son accord : cela contournait clubs_public.
-- Seul l'écran admin « Conflits » s'en sert ; la policy admin existante (FOR ALL) couvre déjà sa lecture.
-- Rejouable sans erreur.

DROP POLICY IF EXISTS "Public read club_field_status" ON public.club_field_status;
REVOKE ALL ON public.club_field_status FROM anon;

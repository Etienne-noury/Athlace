-- « Votre fiche existe déjà » (Espace club) ne montre que les fiches publiées : la recherche élargie aux clubs
-- non publiés est réservée au questionnaire, donc aux sessions connectées (y compris la session anonyme du
-- questionnaire sans compte, ouvert ponctuellement pour les clubs ambassadeurs).
REVOKE EXECUTE ON FUNCTION public.search_clubs_for_claim(text) FROM anon;

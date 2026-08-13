# Corriger le header affiché deux fois sur /clubs/

## Problème
La page "Trouver un club" (`/clubs/`) affiche deux fois le header (et le footer).
Cause confirmée : `ClubsIndex` enveloppe son contenu dans `Layout`, et le composant
`Recherche` qu'il affiche contient lui aussi son propre `Layout`. Deux `Layout`
imbriqués = deux headers et deux footers.

## Correction
Dans `src/pages/ClubsIndex.tsx` : retirer le `Layout` englobant et ne garder que
`PageTitle` + `Recherche`, puisque `Recherche` fournit déjà l'ossature complète
(header, contenu, footer).

Aucun autre fichier modifié, aucun changement de contenu ou de style.

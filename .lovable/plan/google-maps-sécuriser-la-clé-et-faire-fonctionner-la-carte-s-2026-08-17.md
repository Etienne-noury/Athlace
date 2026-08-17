# Google Maps : sécuriser la clé et faire fonctionner la carte sur athlace.fr

## Ce qui est vrai aujourd'hui

- La clé `VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY` est la clé **navigateur gérée par Lovable**. Sa liste de domaines autorisés (`*.lovable.app`, `*.lovableproject.com`) n'est pas modifiable — ni par vous, ni par moi. Il n'existe donc aucun moyen de l'autoriser sur `athlace.fr` tout en la gardant gérée.
- Elle n'est pas régénérable depuis le projet : elle appartient à l'infrastructure Lovable.
- C'est une clé publique par conception : elle est déjà dans le bundle JS de chaque visiteur. Sa présence dans GitHub n'ajoute pas de risque, et elle est déjà restreinte par referrer.

Vérification du code : cette clé n'est utilisée qu'à **un seul endroit**, `src/components/foot/GoogleMiniMap.tsx` (mini-carte sur la fiche d'un club de foot). La grande carte de France (`FranceMap.tsx`) utilise Leaflet + OpenStreetMap et ne dépend d'aucune clé Google. Les appels Google côté serveur (`get-google-places`) passent par la passerelle avec la clé serveur : ils fonctionnent sur n'importe quel domaine, y compris athlace.fr, et ne sont pas concernés.

## La solution proposée

Puisque vous voulez rester sur la connexion Google Maps gérée, on retire simplement la clé navigateur du front — c'est le seul élément bloqué par le domaine.

1. **`GoogleMiniMap.tsx`** : supprimer l'iframe Google Maps Embed et le lecteur `import.meta.env...BROWSER_KEY`. Le composant utilisera l'affichage OpenStreetMap déjà présent dans le fichier comme repli, avec un marqueur sur les coordonnées du club et un lien « Ouvrir dans Google Maps » (un simple lien `https://www.google.com/maps/search/?api=1&query=...`, qui ne nécessite aucune clé).
2. Ajouter un repli propre quand le club n'a pas de coordonnées GPS : géocodage par adresse via le lien, sans carte cassée.
3. Conserver la connexion Google Maps gérée telle quelle : elle continue d'alimenter avis, horaires, téléphone et site web via la fonction serveur `get-google-places`.

Résultat : plus aucune clé Google dans le code livré au navigateur (donc plus rien à régénérer ni à exposer sur GitHub), et la mini-carte s'affiche correctement sur `athlace.fr` comme sur la preview.

## Ce que ça ne fait pas

Le rendu de la mini-carte sera celui d'OpenStreetMap, pas le style Google. Si le style Google est indispensable, la seule voie est votre propre clé Google Cloud restreinte à `https://athlace.fr/*` et `https://*.athlace.fr/*` — dites-le-moi et je vous guide.

## Détails techniques

- Fichier modifié : `src/components/foot/GoogleMiniMap.tsx` (renommage possible en `ClubMiniMap.tsx` avec mise à jour de l'import dans `src/pages/FootballClubDetail.tsx`).
- La variable `VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY` reste dans `.env` (gérée par le connecteur) mais n'est plus lue nulle part.
- Aucun changement de base de données, d'edge function ou de connecteur.

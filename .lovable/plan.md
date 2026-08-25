# Filtres en deux niveaux (sport → sous-discipline)

## Objectif

Rendre le filtrage plus lisible : un premier filtre "Sport" (les grands sports de l'arborescence, groupés par catégorie), puis un second filtre "Sous-discipline" qui n'apparaît que lorsqu'un sport est choisi. Le second filtre est facultatif : rester sur "Toutes les sous-disciplines" affiche tous les clubs du sport / de la fédération.

Aujourd'hui la liste déroulante mélange sports et sous-disciplines dans un seul menu très long, et la page Carte utilise encore l'ancienne liste de disciplines.

## Ce qui change

1. **Page Recherche** (sidebar desktop + panneau mobile)
   - Filtre 1 « Sport » : options groupées par les 12 catégories de l'arborescence, uniquement les sports parents.
   - Filtre 2 « Sous-discipline » : masqué tant qu'aucun sport n'est choisi ; sinon liste les sous-disciplines du sport + option « Toutes les sous-disciplines ».
   - Changer de sport réinitialise la sous-discipline.
   - Les deux valeurs sont synchronisées dans l'URL (`discipline`, `sous-discipline`) et comptent dans le badge « filtres actifs » / bouton Effacer.

2. **Page Carte** (`/carte`)
   - Même paire de filtres que la recherche (sport groupé par catégorie + sous-discipline conditionnelle), en remplacement de la liste actuelle.
   - Les filtres sont transmis à la carte et rechargent les marqueurs.

3. **Recherche côté base**
   - Sport seul sélectionné : on ramène les clubs dont la discipline correspond au sport **ou** à l'une de ses sous-disciplines (aujourd'hui seul le libellé exact du sport remonte, donc les clubs rattachés à une variante sont perdus).
   - Sous-discipline sélectionnée : filtrage sur ce seul libellé.

## Détails techniques

- `src/lib/api/enriched-clubs.ts` : accepter `disciplines?: string[]` en plus de `discipline`, et construire un `query.or(...)` de `discipline.ilike.<nom>` pour les listes ; comportement inchangé quand un seul libellé est fourni.
- Nouveau helper dans `src/data/disciplines.ts` (ou `src/lib/sports-menu.ts`) : `getSportNames(sportSlug)` retournant le nom du sport + noms de ses `subs`, à partir de `ARBORESCENCE`.
- Composant partagé `src/components/filters/DisciplineFilter.tsx` (Select sport + Select sous-discipline) réutilisé par `Recherche.tsx`, la feuille mobile et `Carte.tsx`, pour éviter la triple duplication actuelle.
- `src/components/map/FranceMap.tsx` : nouvelle prop `selectedSub`, et envoi des noms de disciplines (pas des slugs) à `fetchEnrichedClubs` — c'est ce qui fait que le filtre discipline de la carte ne filtre rien aujourd'hui.
- Aucun changement de schéma de base.

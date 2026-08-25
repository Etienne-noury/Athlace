# Corriger les filtres de la carte

## Constat vérifié

- `/carte` affiche déjà le composant à deux niveaux Sport → Sous-discipline, mais dans une barre compacte sans libellés, ce qui rend la hiérarchie peu visible.
- La carte ne possède actuellement aucun champ de recherche par ville ou code postal.
- Le filtre Région interroge la colonne `region`, alors que les 15 922 clubs de la vue publique ont cette valeur vide. Le filtre ne peut donc retourner aucun résultat.
- Les villes et codes postaux sont bien renseignés pour presque tous les clubs ; ils peuvent servir de source fiable pour les filtres géographiques.

## Modifications

1. **Clarifier les filtres sur `/carte`**
   - Présenter distinctement `Sport`, puis `Sous-discipline` lorsque le sport choisi en possède.
   - Conserver la possibilité de s’arrêter au sport parent pour afficher tous ses clubs et variantes.
   - Adapter la barre aux petits écrans sans débordement.

2. **Ajouter la recherche Ville / code postal**
   - Ajouter un champ dédié dans la barre de filtres de la carte.
   - Transmettre cette saisie à `FranceMap`, puis à la requête clubs.
   - Rechercher sur la ville et le code postal, avec une saisie partielle et insensible à la casse.

3. **Réparer le filtre Région**
   - Associer chaque région française à ses départements.
   - Lorsque l’utilisateur sélectionne une région, filtrer les clubs par préfixes de code postal plutôt que par la colonne `region` actuellement vide.
   - Couvrir la métropole et les territoires ultramarins présents dans les données.

4. **Synchroniser et fiabiliser l’état**
   - Synchroniser les filtres carte avec les paramètres d’URL (`q`, `discipline`, `sous-discipline`, `region`) pour conserver les recherches lors d’un partage ou rechargement.
   - Réinitialiser correctement la sous-discipline lorsqu’un autre sport est choisi.
   - Inclure tous les filtres dans la clé de cache afin que les marqueurs se mettent à jour immédiatement.

5. **Validation**
   - Vérifier sur `/carte` un sport parent, une sous-discipline, une ville, un code postal et plusieurs régions.
   - Contrôler que les marqueurs restent limités à la zone visible et que la mise en page fonctionne sur mobile et bureau.

## Détails techniques

- Étendre les paramètres de `FranceMap` et de `fetchEnrichedClubs` pour la recherche géographique.
- Construire le filtre Région avec une condition OU sur les préfixes `postal_code`, sans migration de données nécessaire.
- Réutiliser l’arborescence sportive centrale existante afin que la carte et `/recherche` restent alignées.

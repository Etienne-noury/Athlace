# Regroupement des clubs en bulles sur la carte

## Objectif

Sur `/carte`, les marqueurs se regroupent en bulles affichant le nombre de clubs de la zone. Plus l'utilisateur zoome, plus les groupes se divisent, jusqu'à l'affichage individuel des clubs au niveau quartier.

## Comportement retenu

- Le chiffre dans la bulle correspond aux clubs actuellement chargés dans la zone visible.
- Bulles rondes aux couleurs Athlace (bleu/lime), taille et intensité croissantes selon le nombre de clubs.
- Un clic sur une bulle zoome sur la zone correspondante.
- Le regroupement s'arrête au niveau quartier (zoom ~14) : au-delà, chaque club a son propre marqueur cliquable avec sa popup actuelle.

## Modifications

1. **Ajouter le regroupement à la carte**
   - Utiliser le plugin de clustering officiel de Leaflet dans `FranceMap.tsx`.
   - Remplacer le groupe de marqueurs actuel par un groupe avec clustering, en conservant les popups de club existantes.

2. **Style des bulles**
   - Bulles circulaires personnalisées avec les tokens de couleur du thème (aucune couleur en dur).
   - Trois paliers de taille : petit (<10), moyen (10-49), grand (50+).
   - Accessibilité : contraste suffisant du chiffre, `aria-label` indiquant le nombre de clubs.

3. **Réglages de zoom**
   - Désactiver le regroupement à partir du zoom 14.
   - Clic sur bulle : zoom sur les limites du groupe, sans animation d'éclatement au dernier niveau.

4. **Cohérence du chargement dynamique**
   - Conserver le chargement selon la zone visible et la limite dépendante du zoom.
   - Le compteur « X clubs sur la carte » en bas de carte reste aligné sur les clubs chargés.

5. **Validation**
   - Vérifier sur `/carte` : vue France (bulles), zoom sur Paris (division progressive), zoom quartier (marqueurs individuels + popups).
   - Contrôler le rendu mobile et paysage.

## Détails techniques

- Ajout de la dépendance `leaflet.markercluster` (+ types), avec import des styles et surcharge via `iconCreateFunction` pour le rendu Athlace.
- Nettoyage correct du groupe de clusters au démontage et à chaque mise à jour des filtres.

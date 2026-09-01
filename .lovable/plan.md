# Ergonomie mobile en mode paysage

## Problème constaté

Le menu mobile est rendu à l'intérieur du header, qui est `sticky top-0`. Le panneau (recherche + 4 liens + accordéon des 12 familles de sports + boutons compte) n'a ni hauteur maximale ni zone de défilement. En paysage sur smartphone (hauteur utile ~330-400 px), le contenu dépasse l'écran et n'est pas atteignable : impossible de dérouler le menu.

Deux autres points cassent en paysage :
- `/carte` réserve `calc(100vh - 220px)` pour la carte, ce qui laisse une bande de carte quasi nulle.
- Les barres de filtres et sections héros gardent leurs paddings verticaux desktop, qui mangent toute la hauteur.

## Ce qui sera fait

1. **Menu mobile déroulant scrollable** (`Header.tsx`)
   - Le panneau ouvert devient une zone à hauteur bornée (`max-h-[calc(100dvh-4rem)]`) avec défilement vertical interne et défilement fluide sur iOS.
   - Blocage du scroll de la page en arrière-plan quand le menu est ouvert, fermeture au changement de route.
   - En paysage (hauteur faible), passage de la liste des familles de sports en 2 colonnes et réduction des paddings verticaux pour limiter le scroll.
   - Ajout des liens Connexion / Créer un compte dans le menu mobile (aujourd'hui visibles seulement à partir de `sm`), et affichage de l'état connecté.

2. **Hauteurs basées sur `dvh`**
   - Remplacement des hauteurs `vh` par `dvh` (barres d'URL mobiles) pour le menu et la carte.
   - `/carte` : hauteur minimale garantie pour la carte en paysage, barre de filtres repliable derrière un bouton « Filtres » sous `lg` afin de ne pas manger la hauteur.

3. **Densité verticale en paysage**
   - Ajout d'une règle utilitaire ciblant les petites hauteurs (`@media (max-height: 500px) and (orientation: landscape)`) dans `index.css` : réduction des paddings de section, du header (hauteur 3.5rem) et des tailles de titres héros.
   - Le header reste sticky mais compact, les menus déroulants (Select, mega-menu) obtiennent une hauteur max liée à la hauteur d'écran pour rester scrollables.

## Détails techniques

- Fichiers touchés : `src/components/layout/Header.tsx`, `src/pages/Carte.tsx`, `src/index.css`, et `src/components/home/HeroSection.tsx` (max-height des `SelectContent` en `dvh`).
- Aucune modification de logique métier, de requêtes ou de base de données.
- Vérification via Playwright avec un viewport paysage 844x390 : ouverture du menu, défilement jusqu'aux derniers éléments, accès à la carte et aux filtres.

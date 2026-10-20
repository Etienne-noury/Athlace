# Design system Athlace (Brand Style Guide, règles strictes)

Source de vérité visuelle. Ne jamais coder une couleur, une police ou un logo en dur.

## Palette (4 couleurs + blanc)
- bleu-athlace #415CAF : couleur principale, ~60 % des surfaces. Classes : bg-bleu-athlace / text-bleu-athlace (= primary).
- lime #D5DE5B : accent (le soleil du symbole), ~10 %. Texte nuit dessus.
- creme #F2EFE6 : fond des pages et des cartes, ~30 %. Texte et logo sur bleu-athlace.
- nuit #0F172A : textes et fonds sombres uniquement.
- blanc : cartes sur fond coloré, barre de recherche. Avec parcimonie.
- Texte secondaire : text-nuit/70. Bordures : border (nuit 12 % sur crème).
- Contrastes OK : creme sur bleu-athlace (5,41:1), nuit sur lime (12,27:1), bleu-athlace sur creme (5,41:1).
- Lime sur bleu-athlace et bleu-athlace sur lime : grands titres seulement (4,28:1).
- INTERDIT : bleu-athlace sur nuit (2,87:1), lime sur creme (1,27:1).
- Plus de slate, olive, tint, surface-alt, blue-700, ink, cream-100 : remplacés par les 5 couleurs ci-dessus.

## Typographie : Poppins uniquement, 3 graisses
- Headlines : font-black (900). Subheads : font-bold (700). Texte : font-light (300). Jamais font-medium ni font-semibold.
- Échelle : headline-xl 56/60, headline 40/44, headline-sm 28/34, subhead 22/30, subhead-sm 16/24, eyebrow 12/16 (majuscules), button 14/20, body-lg 18/28, body 15/24, body-sm 13/20.

## Rayons et espacements
- Champs rounded-md, cartes rounded-lg/xl, blocs rounded-2xl/3xl, boutons et pastilles rounded-pill.
- Espacements : 4, 8, 12, 16, 24, 32, 48, 64 px.

## Boutons (rounded-pill, texte button)
- Principal : bg-primary text-primary-foreground (bleu-athlace + creme).
- Secondaire : bg-secondary text-secondary-foreground (lime + nuit).
- Contour : fond blanc ou creme, filet et texte bleu-athlace.
- Sombre : bg-nuit text-creme.
- Survol : pas de bleu plus foncé dans la charte, utiliser hover:bg-primary/90.

## Logos (public/logos/)
- Fichiers : logotype-bleu-lime, logotype-creme-lime, logotype-creme, logotype-nuit, symbole-bleu-lime, symbole-creme-lime, symbole-creme, symbole-nuit, wordmark-bleu, wordmark-creme, wordmark-lime, wordmark-nuit (.png).
- Header sur fond clair : logotype-bleu-lime.png. Footer sur bleu-athlace : logotype-creme-lime.png.
- Favicon et petits formats : symbole-bleu-lime.png. Taille min : logotype 96 px de large, symbole 40 px de haut.
- Wordmark bleu sur creme ou blanc, creme sur bleu-athlace ou nuit, lime sur nuit ou bleu-athlace, nuit sur creme, lime ou blanc.
- Zone de protection : la hauteur du « A » autour du logo. Ne pas recolorer, déformer, incliner, encadrer ni contourner.

## Pictogramme et motif (public/brand/)
- picto-info-bleu.svg (sur creme ou blanc), picto-info-creme.svg (sur nuit), picto-info-blanc.svg (sur bleu-athlace). Ton « Simple » : pages d'aide, encarts d'information, états vides.
- motif-A-filigrane.png : « A » en chevron gris foncé, appliqué à 28 % d'opacité sur fond bleu-athlace (hero, footer, bandeaux). Jamais sur un autre fond.

## Voix
- Simple, proche, dynamique (garde-fous : clair pas sec, chaleureux pas familier, motivant pas survolté).

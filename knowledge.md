# Design system Athlace (règles strictes)

## Principes
- Bleu d'abord : blue-500 porte la marque. lime-500 ponctue, jamais en grande surface.
- Arrondis généreux. Clair, aéré, peu d'ombres.
- Jamais de couleur codée en dur : uniquement les tokens Tailwind/variables de index.css.

## Couleurs
- Fond section bleu (bg-blue-500) : titres text-cream-100, paragraphes text-surface-alt.
- Fond clair : titres text-ink ou text-blue-500, texte text-slate-600, secondaire text-slate-500.
- Sur bg-lime-500 : texte text-ink uniquement.
- Survol/actif : blue-700. Bordures : border. Pastilles/cartes légères : bg-tint-100.
- Hero sur photo : bg-overlay ; panneau translucide : bg-glass + border-glass-border + backdrop-blur-glass.

## Typographie
- Titres : font-display (Outfit) : display 42/48 ExtraBold, heading-1 32/40, heading-2 28/36, title 20/28, subtitle 16/24, label-title 14/20 (Bold).
- Texte : font-sans (Figtree) : body-lg 18/28, body 15/24, small 14/20, caption 13/18, micro 12/16.

## Espacements : 4, 8, 12, 16, 24, 32, 48, 64 px.
## Rayons : champs rounded-md, cartes rounded-lg/xl, blocs rounded-2xl/3xl, boutons et pastilles rounded-pill.

## Boutons (tous rounded-pill)
- Principal : bg-primary text-primary-foreground, hover blue-700.
- Secondaire : bg-secondary text-secondary-foreground.
- Tertiaire : bg-surface-alt text-blue-500.

## Logos
- Wordmark bleu sur fond clair, wordmark blanc sur photo/bleu, symbole seul pour favicon/petits formats.
- Ne pas recolorer ni déformer.

## Composants existants
Button, StepCard, SearchBar, CtaBanner, PhotoCard (verre), FeatureItem (coche), Footer, CarnetTile.

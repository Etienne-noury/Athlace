# Chiffres réels, retour en haut de page, bouton inscription

## 1. Statistiques de la page d'accueil (StatsSection)

Aujourd'hui les 4 chiffres sont écrits en dur. Ils deviennent réels :

- **Clubs référencés** : compté en direct dans la base (actuellement 8 210 enregistrements), affiché arrondi à la centaine inférieure avec un « + » (ex. « 8 200+ »).
- **Fédérations sportives** : remplace « 250+ disciplines » — compté en direct (actuellement 93 fédérations agréées), libellé « Fédérations sportives », description « Fédérations françaises agréées ».
- **Couverture** : remplace « 18 régions ». La colonne région n'est pas renseignée dans la base, donc pas de comptage possible : le bloc devient « France entière » / « Métropole et Outre-mer ».
- **Données ouvertes 100 %** : inchangé.

Pendant le chargement, un léger placeholder est affiché à la place des chiffres.

## 2. Retour en haut lors d'un changement de page

Ajout d'un composant de remontée automatique monté une seule fois dans le routeur : à chaque changement d'URL, la fenêtre repart en haut (sauf navigation arrière/avant du navigateur, qui conserve la position, et ancres `#`).

## 3. Bouton « Créer un compte »

Dans l'en-tête, à côté de « Connexion » (visible uniquement quand l'utilisateur n'est pas connecté) : un bouton principal « Créer un compte » pointant vers `/compte/inscription/`. Même ajout dans le menu mobile pour rester cohérent.

## 4. Titre du hero

« Trouvez votre club sportif … » devient « Trouvez LE club sportif qui vous correspond », en conservant la mise en forme actuelle (mot mis en valeur en couleur d'accent sur « LE »).

## Détails techniques

- `src/components/home/StatsSection.tsx` : passage en composant client avec `useQuery` (react-query déjà en place) et `supabase.from(...).select('id', { count: 'exact', head: true })` sur `clubs_enriched` et `federations_sportives`.
- Nouveau `src/components/ScrollToTop.tsx` utilisant `useLocation` + `useNavigationType`, monté dans `src/App.tsx` sous `BrowserRouter`.
- `src/components/layout/Header.tsx` : ajout du lien inscription (desktop + menu mobile).
- `src/components/home/HeroSection.tsx` : nouveau titre.

Aucune modification de schéma ni de données.

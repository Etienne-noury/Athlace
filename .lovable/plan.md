# Refonte de l'arborescence Athlace

Mise en place de la structure complète du site telle que définie dans l'arborescence : méga-menu Header, hub SEO géo × sport, fiches produit sport & club, contenu éditorial, espace membre avec authentification, footer complet.

## 1. Navigation — Header méga-menu

Nouveau Header façon Decathlon, avec :
- Barre de recherche permanente (suggestion ville + sport)
- **Trouver un sport** (`/sports/`) : colonnes par famille — Sports de raquette (badminton, tennis de table, squash), Sports collectifs (football, basketball, volleyball, handball), Sports individuels (course à pied, natation, yoga), Arts martiaux, Fitness & bien-être
- **Trouver un club** (`/clubs/`) : par ville, par sport, autour de moi (géolocalisation)
- **Pour les clubs** (`/pour-les-clubs/`) : gestion adhérents, événements, communication, paiements
- **Mon compte** et **Une question ?**
- Version mobile : menu accordéon reprenant la même hiérarchie

## 2. Hub SEO géo × sport

Pages générées dynamiquement à partir des clubs en base :
- `/clubs/tout/region/` — index des régions
- `/clubs/tout/ville/` — index des villes
- `/sports/tout/` — index des sports
- `/clubs/[region]/` — région (redescente vers départements)
- `/clubs/[region]/[dpt]/` — département
- `/clubs/[dpt]/[ville]/` — ville
- `/clubs/[region]/[sport]/` — région × sport
- `/clubs/[ville]/[sport]/` — ville × sport
- `/clubs/[ville]/[sport]/[arrondissement]/` — arrondissements Paris

Chaque page : titre/H1 unique, texte d'intro contextualisé, liste de clubs filtrée, maillage interne vers les niveaux voisins, carte.

## 3. Fiches produit

- **Sport** `/sports/[sport]/` : présentation & bienfaits, comment débuter, matériel & équipement, budget moyen (licence, cotisation), sous-catégories loisir/compétition, villes disponibles, clubs les mieux notés
- **Club** `/clubs/[nom]-[ville]/` : infos pratiques (adresse, horaires, contact), sports proposés & créneaux, tarifs & niveaux, avis & photos, CTA « voir les créneaux ». Les blocs sans données réelles restent en « Disponible prochainement ».

## 4. Contenu éditorial (rédigé en dur)

- `/decouvrir/` + articles : quel sport choisir, sport en famille, sport pour enfant, reprendre le sport, budget sport associatif, guide licences & fédérations
- `/blog/` + `/blog/[id]/` et `/blog/dossier-[id]/` : vie associative, pratique sportive, guides clubs, actualités
- `/pour-les-clubs/` (B2B) : gestion adhérents, événements, communication, paiements/cotisations, tarifs, témoignages, rejoindre (démo), ressources clubs

## 5. Espace membre (authentification réelle)

- `/compte/connexion/`, `/compte/inscription/`, `/compte/profil/`, `/compte/mes-clubs/` (favoris), `/compte/mon-club/` (admin club), notifications
- Authentification e-mail + Google
- Base de données : table `profiles` (nom, avatar, ville), table `favorites` (club favori par utilisateur), table `user_roles` séparée (rôles `admin`, `club_admin`, `user`) pour l'accès admin club
- Routes protégées : redirection vers connexion si non connecté

## 6. Footer complet

Colonnes : Notre entreprise (qui sommes-nous, mission, presse, recrutement, partenaires), Besoin d'aide (FAQ, comment ça marche, contact, aide clubs/pratiquants), Faire du sport, Nos services, Application, Suivez-nous, Informations légales (mentions, CGU/CGV, confidentialité RGPD, cookies, accessibilité).

## 7. Anciennes URLs

Redirections vers les nouvelles :
- `/recherche` → `/clubs/`
- `/disciplines` → `/sports/`
- `/football` → `/sports/football/`
- `/football/club/:id` → `/clubs/[nom]-[ville]/`
- `/club/:id` → fiche club nouvelle URL
- `/carte` conservée (accessible via « Autour de moi »)
- `/federations` → intégrée dans `/decouvrir/guide-licences-federations/`
- `/aide` → `/aide/faq/`
- `/admin` inchangée

## Détails techniques

- Routes React Router restructurées dans `App.tsx`, avec un fichier de redirections dédié.
- Les segments géo (`region`, `dpt`, `ville`, `sport`) sont slugifiés ; un utilitaire `src/lib/geo.ts` gère slug ↔ libellé et la table régions/départements français.
- Les pages hub interrogent `clubs_enriched` via `fetchEnrichedClubs` avec filtres ville/département/région/discipline (ajout des filtres manquants côté API).
- `src/data/disciplines.ts` est conservé comme source des sports ; ajout d'un mapping vers les familles du méga-menu.
- Nouvelles tables backend : `profiles`, `favorites`, `user_roles` + fonction `has_role`, avec RLS et GRANTs.
- Métadonnées `<head>` mises à jour dans `index.html` ; l'app étant une SPA statique, le SEO par page n'est pas visible des crawlers — je le signale et on pourra envisager une migration SSR ensuite.
- Volume : environ 30 nouvelles pages/composants ; je procède par blocs (navigation → hub géo → fiches → éditorial → compte).

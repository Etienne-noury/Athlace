# Athlace

Annuaire des clubs sportifs français : recherche de clubs par sport, ville ou carte, fiches détaillées, espace compte (favoris, profil) et espace « Mon club » où un responsable peut proposer ou compléter la fiche de son club (validée ensuite par un administrateur).

Le projet est édité avec [Lovable](https://lovable.dev) : les modifications faites dans Lovable arrivent automatiquement dans ce dépôt, et inversement.

## Stack

- **Front** : React 18 + TypeScript, Vite, Tailwind CSS, composants shadcn/ui, React Router, TanStack Query, Leaflet (carte).
- **Back** : Supabase (PostgreSQL + RLS, Auth, Storage, fonctions edge Deno).
- **Tests** : Vitest + Testing Library.

## Structure des dossiers

| Dossier | Rôle |
| --- | --- |
| `src/pages/` | Une page = une route (voir `src/App.tsx` pour la table des routes). Une page trop longue est découpée dans un sous-dossier à son nom (ex. `my-club/` pour « Mon club »). |
| `src/components/` | Composants réutilisables, rangés par domaine (`clubs`, `map`, `search`, `admin`, `auth`, `layout`…). `ui/` = composants shadcn générés. |
| `src/lib/` | Logique sans affichage : accès aux données (`api/`), authentification (`auth.tsx`), formulaire club (`club-form.ts`), helpers (`safe-url.ts`, `geo.ts`…). |
| `src/hooks/` | Hooks React partagés. |
| `src/data/` | Données statiques (disciplines, fédérations). |
| `src/integrations/supabase/` | Client et types **générés** par Lovable/Supabase : ne pas modifier à la main. |
| `supabase/functions/` | Fonctions edge (imports de données, géocodage, suppression de compte, e-mails d'authentification…). `_shared/require-admin.ts` vérifie le rôle admin. |
| `supabase/migrations/` | Migrations SQL historiques (tables d'origine, rôles, profils, favoris). |
| `drizzle/migrations/` | Migrations SQL plus récentes (table `clubs`, vue `clubs_public`, fiches proposées par les clubs, tarifs, horaires…). |
| `docs/` | Documentation technique (`ARCHITECTURE.md`, `PHOTOS-ET-SCHEMAS.md`). |

## Fichiers à la racine

Presque tous sont imposés par les outils, qui vont les chercher à cet endroit précis.

| Fichier | Rôle |
| --- | --- |
| `package.json`, `package-lock.json` | Dépendances npm et scripts (`dev`, `build`, `lint`, `test`). Le lockfile fige les versions exactes. |
| `index.html` | Page HTML d'entrée chargée par Vite ; le code démarre dans `src/main.tsx`. |
| `vite.config.ts` | Configuration du serveur de développement et du build (alias `@/` vers `src/`, plugins Lovable). |
| `vitest.config.ts` | Configuration des tests (environnement navigateur simulé, fichiers dans `src/test/`). |
| `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` | TypeScript : réglages communs, code du site, fichiers de configuration. |
| `eslint.config.js` | Règles de qualité du code (`npm run lint`). |
| `tailwind.config.ts`, `postcss.config.js` | Tailwind CSS : couleurs et polices de la charte, traitement du CSS. |
| `components.json` | Réglages du générateur de composants shadcn/ui (`src/components/ui/`). |
| `drizzle.config.ts` | Outil de migrations SQL : lit `drizzle/schema.ts`, écrit dans `drizzle/migrations/`. |
| `.env`, `.env.example` | Clés publiques Supabase et Google Maps (voir plus bas) ; `.env.example` liste les variables attendues. |
| `AGENTS.md` | Règles du projet pour les agents IA (Lovable, Claude) : charte, publication, migrations. |
| `knowledge.md` | Charte graphique Athlace (couleurs, police, logo), source de vérité du design. Tenu par l'agent Lovable : laissé à la racine. |
| `roadmap.md` | Liste de tâches de l'agent Lovable (cases cochées au fil des chantiers). Tenue par Lovable : laissée à la racine. |
| `.lovable/` | Plans de chantier et vision produit écrits par Lovable. Historique, pas de code. |
| `docs/` | Documentation technique : `ARCHITECTURE.md` (vue d'ensemble, droits d'accès), `PHOTOS-ET-SCHEMAS.md` (fiches sport). |

## Lancer en local

```sh
npm install
npm run dev        # serveur de développement
npm run build      # build de production
npm run lint       # ESLint
npm test           # tests Vitest
```

Le `package-lock.json` pointe uniquement vers le registre npm public : `npm ci` fonctionne aussi hors de Lovable. Si Lovable y réintroduit son miroir privé (`europe-west4-npm.pkg.dev`), remplacer ces adresses par `https://registry.npmjs.org/`.

Les variables nécessaires sont dans `.env` (URL et clé publique Supabase, clé navigateur Google Maps). Ce fichier est versionné exprès par Lovable, bien qu'il figure dans `.gitignore` : il ne contient que des clés publiques, protégées côté serveur (RLS pour Supabase, restriction par domaine pour Google Maps). Tout ce qui commence par `VITE_` est inclus dans le code envoyé au navigateur : **n'y mettre aucun secret**. Les secrets (clé `service_role`, clés d'API) se configurent uniquement dans les réglages des fonctions edge Supabase.

## Sécurité, en bref

- Les données publiques sont lues via la vue `clubs_public` ; e-mail et téléphone des clubs ne sont accessibles qu'un par un via la fonction `get_club_contact`.
- Les écritures sensibles passent par des fonctions SQL ou edge qui vérifient le rôle `admin` côté serveur. Les protections de routes côté navigateur (`RequireAuth`, `RequireAdmin`) ne servent qu'à l'affichage.
- Un visiteur non connecté n'a aucun droit d'écriture en base ; les formulaires publics passent par une fonction edge qui valide et limite les envois.
- Supprimer son compte efface toutes ses données (fonction `delete-account` + cascade en base).
- Tout lien externe affiché sur le site passe par `safeExternalUrl` (`src/lib/safe-url.ts`).

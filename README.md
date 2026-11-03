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
| `src/pages/` | Une page = une route (voir `src/App.tsx` pour la table des routes). |
| `src/components/` | Composants réutilisables, rangés par domaine (`clubs`, `map`, `search`, `admin`, `auth`, `layout`…). `ui/` = composants shadcn générés. |
| `src/lib/` | Logique sans affichage : accès aux données (`api/`), authentification (`auth.tsx`), formulaire club (`club-form.ts`), helpers (`safe-url.ts`, `geo.ts`…). |
| `src/hooks/` | Hooks React partagés. |
| `src/data/` | Données statiques (disciplines, fédérations). |
| `src/integrations/supabase/` | Client et types **générés** par Lovable/Supabase : ne pas modifier à la main. |
| `supabase/functions/` | Fonctions edge (imports de données, géocodage, suppression de compte, e-mails d'authentification…). `_shared/require-admin.ts` vérifie le rôle admin. |
| `supabase/migrations/` | Migrations SQL historiques (tables d'origine, rôles, profils, favoris). |
| `drizzle/migrations/` | Migrations SQL plus récentes (table `clubs`, vue `clubs_public`, fiches proposées par les clubs, tarifs, horaires…). |
| `docs/` | Documentation technique (`ARCHITECTURE.md`). |

## Lancer en local

```sh
npm install
npm run dev        # serveur de développement
npm run build      # build de production
npm run lint       # ESLint
npm test           # tests Vitest
```

Les variables nécessaires sont dans `.env` (URL et clé publique Supabase). Tout ce qui commence par `VITE_` est inclus dans le code envoyé au navigateur : **n'y mettre aucun secret**. Les secrets (clé `service_role`, clés d'API) se configurent uniquement dans les réglages des fonctions edge Supabase.

## Sécurité, en bref

- Les données publiques sont lues via la vue `clubs_public` ; e-mail et téléphone des clubs ne sont accessibles qu'un par un via la fonction `get_club_contact`.
- Les écritures sensibles passent par des fonctions SQL ou edge qui vérifient le rôle `admin` côté serveur. Les protections de routes côté navigateur (`RequireAuth`, `RequireAdmin`) ne servent qu'à l'affichage.
- Tout lien externe affiché sur le site passe par `safeExternalUrl` (`src/lib/safe-url.ts`).

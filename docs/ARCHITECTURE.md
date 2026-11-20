# Architecture d'Athlace

## Vue d'ensemble

```
Navigateur (React, Vite)
   │  clé publique Supabase (anon) + session utilisateur
   ▼
Supabase
   ├─ PostgreSQL + RLS ── tables, vues publiques, fonctions SQL (RPC)
   ├─ Auth ──────────── comptes, e-mails via la fonction auth-email-hook
   ├─ Storage ───────── avatars/, club-media/ (un dossier par utilisateur)
   └─ Fonctions edge ── imports et outils admin (clé service_role côté serveur)
```

Le navigateur ne détient jamais de secret : il parle à Supabase avec la clé publique, et ce sont les règles RLS et les vérifications dans les fonctions qui décident de ce qui est autorisé.

## Données principales

| Objet | Accès public | Écriture |
| --- | --- | --- |
| `clubs` (table) | non, via la vue `clubs_public` (sans e-mail ni téléphone, seulement les clubs des fédérations autorisées) | admin / fonctions serveur |
| `federation_publication` (accord écrit de chaque fédération, onglet admin « Scraping ») | non | admin |
| `get_club_contact(id)` | oui, un club à la fois | - |
| `club_venues`, `club_schedules`, `club_prices`, `club_sport_answers` | lecture, seulement pour les clubs visibles dans `clubs_public` | admin |
| `club_field_status` (valeur fédération / valeur club, écran admin « Conflits ») | non (depuis `0046`) | admin |
| `search_clubs_for_claim(q)`, `get_club_for_claim(id)` (revendication d'une fiche) | nom, ville, discipline pour tous ; fiche sans contact pour un compte connecté | - |
| `stats_cache`, `city_index` (compteurs publics, recalculés toutes les 10 min) | non, lus par `home_stats`, `available_disciplines`, `federation_club_stats`, `search_cities`, `location_stats` | `refresh_stats_cache()` / `refresh_location_index()` via pg_cron |
| `club_submissions` (fiche proposée par un club) | chaque utilisateur voit les siennes | l'utilisateur tant que la fiche n'est pas validée ; validation par `approve_submission` (admin) |
| `club_waitlist` (demandes de rendez-vous club) | non | uniquement via la fonction edge `club-appointment` (validation + délai anti-spam) ; lecture admin |
| `profiles`, `favorites` | chaque utilisateur voit les siens | idem |
| `favorite_cities`, `favorite_sports`, `alert_preferences` (espace sportif) | chaque utilisateur voit les siens | idem |
| `events` (calendrier) | événements à venir ou en cours uniquement | admin (qui voit aussi les archives) |
| `sport_questions` | lecture | admin |
| `federations_sportives`, `equipements_sportifs` | lecture | fonctions serveur uniquement |
| `clubs_enriched` (ancienne base RNA, plus affichée sur le site) | non, admin seulement | fonctions serveur uniquement |
| `federation_scraping_status` (onglet admin « Scraping ») | non | admin |
| `admin_scraping_stats()` (RPC) | non, refuse tout non-admin | - |
| `user_roles` | chaque utilisateur voit les siens | aucune écriture depuis le navigateur |

**Règle des vues publiques** : `clubs_public` lit `clubs` avec les droits de son propriétaire (elle contourne la RLS pour n'exposer que des colonnes sûres). Elle ne doit donc avoir que le droit `SELECT` pour `anon` et `authenticated`. Toute nouvelle vue publique suit la même règle (voir `drizzle/migrations/0033_revoke_public_view_writes.sql`).

Le rôle admin est vérifié côté serveur par `private.has_role(uid, 'admin')` (SQL) et `requireAdmin()` (fonctions edge).

**Règle de publication** : un club n'est public que si sa fédération est autorisée dans `federation_publication` (filtre dans `clubs_public`, migrations `0041` et `0042`). Toute table liée à un club se filtre en vérifiant que le club existe dans `clubs_public`. Seule exception assumée : la revendication (`0044`), qui ne sert jamais à afficher une page publique.

**Règle des droits** : un visiteur non connecté (`anon`) n'a aucun droit d'écriture sur aucune table, en plus de la RLS (voir `drizzle/migrations/0038_security_hardening.sql`). Toute écriture anonyme passe par une fonction edge qui valide les données.

**Suppression de compte** : la fonction edge `delete-account` efface fichiers et lignes de l'utilisateur ; les tables qui portent un `user_id` sont aussi reliées à `auth.users` en `ON DELETE CASCADE`. Toute nouvelle table de données personnelles doit suivre les deux règles.

## Parcours clés

1. **Recherche / carte** : `src/lib/api/*` appelle `clubs_public` et les RPC `clubs_near`, `map_club_clusters`, `available_disciplines`.
2. **Fiche club** : `src/pages/ClubDetail.tsx` lit `clubs_public`, puis `get_club_contact` pour le contact. Les liens externes passent par `safeExternalUrl`.
3. **Mon club** : `src/pages/MyClub.tsx` + `src/lib/club-form.ts` écrivent un brouillon dans `club_submissions` ; un admin valide dans `/admin` (`ClubSubmissionsAdmin`), ce qui copie les données dans `clubs` via `approve_submission`.
4. **Imports** : les fonctions edge `import-*`, `geocode-clubs`, `enrich-from-es`, `suggest-federation` sont réservées aux admins.

## Lire le code : par où commencer

1. `src/App.tsx` : la table des routes, une ligne par URL. Chaque page est chargée à la demande.
2. `src/pages/Recherche.tsx` et `src/pages/ClubDetail.tsx` : le cœur du site (recherche + fiche club).
3. `src/lib/api/` : toutes les lectures de la base côté navigateur.
4. `supabase/functions/` : tout ce qui tourne côté serveur. Chaque fichier commence par un commentaire qui dit à quoi il sert et qui a le droit de l'appeler.
5. `drizzle/migrations/` : l'état de la base (tables, droits, fonctions SQL), à lire dans l'ordre.

## Code en sommeil

Ces fichiers ne sont plus affichés dans le parcours normal, mais sont gardés volontairement :

| Fichier | État |
| --- | --- |
| `src/pages/Carte.tsx`, `Discover.tsx`, `DiscoverArticle.tsx` | non montés (aucune route), remplacés par la recherche et le blog |
| `src/pages/Aide.tsx`, `Federations.tsx`, `Football.tsx`, `FootballClubDetail.tsx` (+ `src/components/foot/`, `src/lib/api/foot.ts`) | accessibles seulement par les URL `/…-old`, aucun lien du site n'y mène |
| `supabase/functions/import-rna`, `admin-bulk-upsert`, `enrich-from-es`, `suggest-federation` | outils de l'ancienne base `clubs_enriched`, réservés aux admins |

Tout le reste du dossier `src/` est utilisé. `src/components/ui/` est le kit shadcn standard : tous ses composants ne servent pas encore.

## Où sont les migrations ?

Deux dossiers coexistent pour des raisons historiques : `supabase/migrations/` (début du projet) puis `drizzle/migrations/` (schéma actuel des clubs). Lire les deux par ordre de date pour avoir l'état complet de la base.

Fusionner une PR GitHub met à jour le code dans Lovable mais n'applique pas les migrations à la base en ligne : il faut demander à Lovable d'appliquer le fichier. Lovable les exécute directement, sans toujours remplir la table de suivi `drizzle.__drizzle_migrations` : pour savoir si une migration est en place, contrôler son effet en base (table, droit ou fonction créés) plutôt que le nombre de lignes de cette table. Chaque migration doit pouvoir être rejouée sans erreur (`IF NOT EXISTS`, `CREATE OR REPLACE`, `DROP POLICY IF EXISTS`).

**État au 20/11/2026** : toutes les migrations jusqu'à `0044` ont leur effet en base, sauf `0038_security_hardening.sql` (fusionnée le 16/11, pas encore appliquée). `0046` est ajoutée par l'audit du 20/11.

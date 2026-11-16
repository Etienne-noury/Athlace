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
| `clubs` (table) | non, via la vue `clubs_public` (sans e-mail ni téléphone) | admin / fonctions serveur |
| `get_club_contact(id)` | oui, un club à la fois | - |
| `club_venues`, `club_schedules`, `club_prices`, `club_sport_answers`, `club_field_status` | lecture | admin |
| `club_submissions` (fiche proposée par un club) | chaque utilisateur voit les siennes | l'utilisateur tant que la fiche n'est pas validée ; validation par `approve_submission` (admin) |
| `club_waitlist` | dépôt anonyme | lecture admin |
| `profiles`, `favorites` | chaque utilisateur voit les siens | idem |
| `favorite_cities`, `favorite_sports`, `alert_preferences` (espace sportif) | chaque utilisateur voit les siens | idem |
| `events` (calendrier) | événements à venir ou en cours uniquement | admin (qui voit aussi les archives) |
| `sport_questions` | lecture | admin |
| `federations_sportives`, `equipements_sportifs`, `clubs_enriched` | lecture | fonctions serveur uniquement |
| `federation_scraping_status` (onglet admin « Scraping ») | non | admin |
| `admin_scraping_stats()` (RPC) | non, refuse tout non-admin | - |
| `user_roles` | chaque utilisateur voit les siens | aucune écriture depuis le navigateur |

**Règle des vues publiques** : `clubs_public` lit `clubs` avec les droits de son propriétaire (elle contourne la RLS pour n'exposer que des colonnes sûres). Elle ne doit donc avoir que le droit `SELECT` pour `anon` et `authenticated`. Toute nouvelle vue publique suit la même règle (voir `drizzle/migrations/0033_revoke_public_view_writes.sql`).

Le rôle admin est vérifié côté serveur par `private.has_role(uid, 'admin')` (SQL) et `requireAdmin()` (fonctions edge).

## Parcours clés

1. **Recherche / carte** : `src/lib/api/*` appelle `clubs_public` et les RPC `clubs_near`, `map_club_clusters`, `available_disciplines`.
2. **Fiche club** : `src/pages/ClubDetail.tsx` lit `clubs_public`, puis `get_club_contact` pour le contact. Les liens externes passent par `safeExternalUrl`.
3. **Mon club** : `src/pages/MyClub.tsx` + `src/lib/club-form.ts` écrivent un brouillon dans `club_submissions` ; un admin valide dans `/admin` (`ClubSubmissionsAdmin`), ce qui copie les données dans `clubs` via `approve_submission`.
4. **Imports** : les fonctions edge `import-*`, `geocode-clubs`, `enrich-from-es`, `suggest-federation` sont réservées aux admins.

## Où sont les migrations ?

Deux dossiers coexistent pour des raisons historiques : `supabase/migrations/` (début du projet) puis `drizzle/migrations/` (schéma actuel des clubs). Lire les deux par ordre de date pour avoir l'état complet de la base.

Fusionner une PR GitHub met à jour le code dans Lovable mais n'applique pas les migrations à la base en ligne : il faut demander à Lovable d'appliquer le fichier. Lovable les exécute directement, sans toujours remplir la table de suivi `drizzle.__drizzle_migrations` : pour savoir si une migration est en place, contrôler son effet en base (table, droit ou fonction créés) plutôt que le nombre de lignes de cette table. Chaque migration doit pouvoir être rejouée sans erreur (`IF NOT EXISTS`, `CREATE OR REPLACE`, `DROP POLICY IF EXISTS`).

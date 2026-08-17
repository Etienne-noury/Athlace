# Tous les chiffres du site branchés sur la base

Objectif : plus aucun nombre écrit en dur dans les pages. Chaque compteur (clubs, fédérations, villes, régions, disciplines) est lu depuis la base et se met à jour tout seul.

## Source unique des chiffres

Une fonction en base `site_stats()` renvoie en un seul appel :
- nombre de clubs référencés
- nombre de fédérations agréées
- nombre de villes distinctes
- nombre de régions distinctes
- nombre de disciplines distinctes

Un hook front `useSiteStats()` appelle cette fonction, met le résultat en cache (1 h) et le partage entre toutes les pages, avec un affichage discret pendant le chargement (pas de « 0 » qui clignote).

Formatage cohérent : espaces pour les milliers, arrondi « 8 200+ » au-dessus de 1 000, chiffre exact en dessous.

## Endroits corrigés

| Endroit | Aujourd'hui | Après |
|---|---|---|
| Accueil — bandeau hero | « Plus de 100 000 clubs référencés » | nombre réel de clubs |
| Accueil — section statistiques | déjà dynamique (clubs, fédérations) | inchangé, passe par le hook commun |
| Page Sports (`/sports/`) — description | « les 93 fédérations » | nombre réel |
| Guide des licences | `total || 93` | nombre réel, sans repli codé en dur |
| Régions (`/clubs/tout/region/`) | « les 13 régions » | nombre réel de régions présentes en base |
| Aide (FAQ ancienne page) | « plus de 100 000 clubs » | nombre réel |
| Accueil — meta description | « plus de 100 disciplines » | nombre réel de disciplines |

Les compteurs déjà calculés à partir des données (hubs ville/département/sport, nombre de résultats de recherche, favoris) restent tels quels : ils sont déjà dynamiques.

Hors périmètre : les chiffres qui ne sont pas des données (capital social et numéro RCS des mentions légales, prix, dates).

## Détails techniques

- Migration : fonction `public.site_stats()` en `security definer`, `stable`, `search_path = public`, exécutable par `anon` et `authenticated`, qui agrège `clubs_enriched` et `federations_sportives` (villes/régions/disciplines = `count(distinct ...)` en ignorant les valeurs vides).
- `src/hooks/useSiteStats.ts` : `useQuery` sur `supabase.rpc('site_stats')`, `staleTime` 1 h.
- `src/lib/format-stats.ts` : helper de formatage (`formatCount`).
- Pages modifiées : `HeroSection.tsx`, `StatsSection.tsx`, `SportsIndex.tsx`, `RegionsIndex.tsx`, `DiscoverArticle.tsx`, `Aide.tsx`, `Index.tsx`.
- Les meta descriptions étant rendues côté client, elles se mettent à jour une fois les chiffres chargés.

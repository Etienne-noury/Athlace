# Project rules

- Follow `knowledge.md` (Athlace Brand Style Guide) for all visual design decisions: Poppins only, the 4 brand colors plus white, no hardcoded colors, fonts or logos. It is the brand source of truth and must not be overwritten by component-local styles. This keeps future pages consistent.
- Use only brand color names from `knowledge.md` or semantic tokens; legacy color aliases have been removed to keep all pages on the same palette.
- Keep Leaflet-specific layout and marker styles in `src/styles/map-and-layout.css`, separate from the supplied `src/index.css`. This preserves map and mobile behavior while keeping the supplied tokens unchanged.
- Resolve dynamic sub-discipline IDs with the availability hook's sports map passed explicitly to discipline helpers; this preserves exact database names and reactive query updates without mutable global state.
- FranceMap accepts optional current-page results and selection callbacks for search; its default database-driven mode must remain unchanged for the home and map pages.
- Keep the legacy Carte component unmounted; redirect map URLs with their query strings to search, which reuses fetchClubsNear for both cities and browser coordinates to preserve identical proximity rules.
- Federation directory pages fetch the official table through a distinct query key and aggregate only public club fields via federation_club_stats; legacy club codes require matching discipline to avoid ambiguous federation collisions.
- Keep journal article metadata, categories and further-reading targets in src/data/journal.ts; render migrated live guides through JournalGuide while leaving legacy Discover components unmounted to preserve their code.
- Events use date-only boundaries in Europe/Paris, public queries exclude ended events even for admins, and shared validation in src/lib/events.ts; this keeps the public calendar consistent with RLS while admin queries retain archives.
- Club appointment requests use a dedicated validated, rate-limited edge function to persist in club_waitlist before sending a fixed owner notification; this preserves requests when email delivery fails.
- Athlete favorites and alert preferences use user-scoped queries and RLS with shared count invalidation; this keeps private account data and dashboard totals consistent without enabling email alerts.

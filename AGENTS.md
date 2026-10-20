# Project rules

- Follow `knowledge.md` (Athlace Brand Style Guide) for all visual design decisions: Poppins only, the 4 brand colors plus white, no hardcoded colors, fonts or logos. It is the brand source of truth and must not be overwritten by component-local styles. This keeps future pages consistent.
- Legacy color names in `src/index.css` and `tailwind.config.ts` are temporary aliases of the brand tokens; new code must use the brand names from `knowledge.md`. This keeps the site working until the refactor removes them.
- Keep Leaflet-specific layout and marker styles in `src/styles/map-and-layout.css`, separate from the supplied `src/index.css`. This preserves map and mobile behavior while keeping the supplied tokens unchanged.

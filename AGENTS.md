# Project rules

- Follow `knowledge.md` (Athlace Brand Style Guide) for all visual design decisions: Poppins only, the 4 brand colors plus white, no hardcoded colors, fonts or logos. It is the brand source of truth and must not be overwritten by component-local styles. This keeps future pages consistent.
- Use only brand color names from `knowledge.md` or semantic tokens; legacy color aliases have been removed to keep all pages on the same palette.
- Keep Leaflet-specific layout and marker styles in `src/styles/map-and-layout.css`, separate from the supplied `src/index.css`. This preserves map and mobile behavior while keeping the supplied tokens unchanged.

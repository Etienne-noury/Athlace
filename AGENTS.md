# Project rules

- Follow `knowledge.md` for all visual design decisions; it is the Athlace brand source of truth and must not be overwritten by component-local colors. This keeps future pages consistent.
- Keep Leaflet-specific layout and marker styles in `src/styles/map-and-layout.css`, separate from the supplied `src/index.css`. This preserves map and mobile behavior while keeping the supplied tokens unchanged.

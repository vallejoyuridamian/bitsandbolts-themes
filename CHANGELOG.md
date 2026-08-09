# Bits and Bolts Themes - Changelog

Keep new changes easy to scan at the top.

---

## Session wrap-up (2026-08-08) - Theme contract v2 web reference

### What changed
- Ratified the deep-research architecture: DTCG 2025.10 as the portable
  value/resolution substrate and a separate B&B contract for recipes, art
  direction, assets, fallbacks, validation, provenance, and overrides.
- Added the B&B v2 light/dark reference with four identity colors, 48 semantic
  roles, fourteen text styles, exact primary/mono/accent families, visual
  grammar specimens, and the declarative Button recipe.
- Added generated catalog data plus theme-owned Product Entry, Theme Gallery,
  Page Gallery, Selection Controls, Button v2, and typography recipes.
- Standardized AppScreen Themes and Pages selectors through one shared recipe;
  Pages previews one real landing directly with no metadata bar or nested scroll.
- Declared base tokens as generator defaults and family tokens as authoritative
  overrides, removing collision warnings without changing generated output.

### Verification
- `pnpm build` passed without token-collision warnings.
- All 94 generated artifact hashes were unchanged by the override correction.
- AppScreen's focused Themes/Pages tests and production build passed.
- No package publish, deployment, push, or external mutation occurred.

## Session wrap-up (2026-06-25) - Bits & Bolts brand theme

### What changed
- Added the `bitsandbolts` theme with light, dark, and icon token files.
- Added generated web CSS for the `bitsandbolts` theme.
- Added Montserrat and Orbitron web font assets and copied them into the web distribution folder.
- Updated the theme build list so `bitsandbolts` is built with the other themes.
- Extended the build script to copy web font assets into `dist/web/fonts`.
- Documented `bitsandbolts` in the README theme table.

### Verification
- JSON token files parsed successfully.
- `node --check build.js` passed.

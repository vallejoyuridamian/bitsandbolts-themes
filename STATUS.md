# Bits and Bolts Themes — Status

Last verified: 2026-08-08

## Current Truth

- Five themes are generated: `cloud`, `ocean`, `slate`, `robot`, and
  `bitsandbolts`, each with light and dark variants.
- The deep-research architecture is ratified: pinned DTCG 2025.10 values and
  resolution plus a separately versioned B&B contract for recipes, art
  direction, assets, fallbacks, validation, provenance, and overrides.
- The first B&B v2 web reference now includes light/dark standard-density family
  data, four identity colors, 48 semantic color roles, fourteen text styles,
  shape/material/depth/motion specimens, and a declarative Button recipe.
- Generated web catalog data drives AppScreen's Themes tab one family/mode at a
  time. AppScreen's Pages tab previews one real landing at a time.
- Product Entry, Theme Gallery, Page Gallery, Button v2, typography, and the
  shared Selection Controls recipe are canonical theme-owned web components.
- Themes and Pages share one selector recipe and one product markup owner. Pages
  has no metadata title bar or outer scroll owner.
- `pnpm build` is clean. Declaring base tokens as defaults and family tokens as
  authoritative overrides removed collision warnings without changing any of
  the 94 generated artifact hashes.

## Open Gates

- The v2 web reference is not the full research-mandated vertical Button slice.
  Pinned DTCG Resolver validation, provenance/reproducibility manifests,
  license/glyph coverage, platform fallbacks, and React/Compose/RN adapters are
  still required.
- Versioned npm/Maven/static delivery is not implemented; manual mirrors remain
  forbidden but still exist as migration debt.
- `mywebsite/public/theme/` is such a copy today; its button and marketing
  components differ from the current canonical files.
- Cloud Clipboard still loads copied Slate assets, the main React website remains
  app-local, and AppScreen's legacy Studio stylesheet still contains visual debt.
- Cloud, Ocean, Slate, and Robot remain v1 until migrated one family at a time.

## Next Boundary

- Continue plan Slice 2: executable DTCG/B&B validation, allowed resolver tuples,
  deterministic generation/provenance, capabilities, fallbacks, and overrides.
- Then complete Button vertically across static/web, React/AppScreen, Compose,
  and React Native before broad component or consumer restyling.
- Use AppScreen Pages only as a visual inventory surface; migrate repeated
  landing elements in small accepted recipe batches after ownership is named.

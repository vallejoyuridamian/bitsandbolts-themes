# Bits and Bolts Themes: Status

Last verified: 2026-09-07

## Current Truth

- Themes owns product tokens, components, fonts, semantic icons, assets,
  catalog data, committed generated outputs, and shared editor recipes.
- Nine V2 families ship in both modes. AppScreen owns behavior, persistence,
  Guest state, interaction, rendering, and orchestration.
- Source components, `dist/web`, and `docs/theme` are generated together and
  must remain synchronized.
- Identity foreground rules, canonical Select, mixed states, palette rows,
  Project color Add, Image Original, project information, Background, fixed
  overlays, arrangement, Geometry, Gap, Line endpoints, and Icon cards retain
  their accepted shared recipes.
- The workspace control bar exposes one canonical section separator. Project
  information composes the Themes-owned destructive action button, including
  its semantic Delete icon, for project deletion inside the information window.
- Coffee retains Besley for signature typography and Roboto Slab for interface
  typography in both modes.
- Safe areas now have a Themes-owned semantic vector, checkbox checklist, and
  pointer-transparent SVG shade/edge recipe. Source, web, and docs are generated;
  focused tests pass. The owner accepted the final AppScreen result and locked static.

## Closed Geometry and Appearance Recipes

- The shared layout editor now owns reusable numeric and range fields with
  canonical mixed-state presentation.
- Shape consumers can compose Fill, Border, Width, and continuous Roundness
  without product-local control styling.
- The palette recipe exposes a semantic None choice for no Fill or no Border.
- Roundness publishes Sharp, Soft, Rounded, and Pill stops while AppScreen owns
  the continuous authored value and geometric interpretation.
- The Background recipe exposes Opacity with the same labeled percentage range
  presentation used by element appearance.
- AppScreen owns mutation, history, grouping semantics, rendering, Preview,
  export, and animation-opacity composition.

## Closed Text and Cohort Support

- The existing layout editor remains the only toolbar and sidebar presentation
  owner for Text formatting, Text Style identity, Geometry, and appearance.
- Mixed controls remain truthful for Group and multi-selection editing.
- Group copy, duplicate, placement preview, cross-Screen transfer, settlement,
  and z-order are AppScreen behavior and add no competing Themes recipe.

## Expanded Semantic Content Icons

- The shared catalog contains 68 semantic content icons: 44 Interface, 14
  Product, 8 Outdoors, and 2 Coffee.
- Product includes the roles used by the Themes presentation: Idea, Call,
  Agreement, Analysis, Design, Build, Firmware, Mobile, Launch, Global,
  Delivery, Support, Data, and Growth.
- Outdoors includes Trophy, Hiking, Mountain, Map, Route, Snow, Altitude, and
  Flag for the Winter composition.
- Material Symbols Outlined and Filled plus Font Awesome Solid resolve through
  one semantic provider map. V60 and AeroPress remain first-party vectors.
- `@material-symbols/svg-400` is pinned at `0.47.1` as a build input. Generated
  output includes its Apache license and notice.
- The five previously accepted Material vectors remain byte-for-byte stable;
  newly exposed Material roles come from the pinned package.

## Evidence

- Focused workspace item information coverage proves the destructive Project
  action and the shared control-bar separator recipe.
- Focused Background, layout editor, and semantic Icon tests pass.
- Every catalog role resolves and every generated SVG exists for Material
  Outlined, Material Filled, and Font Awesome Solid.
- The Themes production build and repository diff check pass.
- The paired AppScreen production bundle audit verifies every catalog asset
  before Cloudflare packaging can complete.
- No push, deployment, publication, or activation occurred.

## Current Boundary

- Preserve all accepted shared recipes and both accepted AppScreen demos.
- Universal typeface safety remains parked.
- The Winter iPhone draft and future iPad adaptation are AppScreen composition
  work. They do not activate another Themes implementation cluster.
- Toolbar ordering, Duplicate Project behavior, and global element order remain
  AppScreen-owned behavior built from these shared recipes.
- Static/video guide eligibility, geometry, project preferences, and export
  exclusion belong to AppScreen. Universal typeface safety remains parked.
- Preview, export, owner browser interaction, and deployment remain outside
  Themes ownership.

# Bits and Bolts Themes: Status

Last verified: 2026-09-10

## Current Truth
- Six requested standalone patterns now join Squiggle: Plus 2, Chinese Pattern 4, New Pattern 13, Cubes 2, New Pattern 2 and Diamonds 17. All use two colors; four declare source-default stroke width/caps/joins. Exact source geometry and MIT provenance are retained. The existing Background recipe consumes the expanded catalog without UI changes; AppScreen owns shared SVG stroke painting. Seven AppScreen pattern checks, two Themes checks, both builds, exact source-geometry checks and generated source/web/docs parity pass. The owner accepts the catalog/sliders and requests all current changes committed before AppScreen edge-fill investigation. Preserve earlier color cleanup, accepted recipes, assets and diagnostics. Multi-color slots and theme defaults remain later work. Paired local checkpoint commits are authorized; no push.
- Shared viewport gallery gaps and Device continuation are owner-accepted. Screen/Scene selection now scales its 7 px outward edge with zoom, capped at one third of the visible gap; its 2 px stroke stays fixed and glow spread scales. Element hull recipes are untouched. Themes generation, consumer recipe checks and exact source/web/docs parity pass; the selection follow-up is included in the owner-accepted 2026-09-10 checkpoint. Timeline ruler/track recipes are extracted into shared components; endpoint labels align inward and off-grid endpoints reserve an interval. Generation passes; the consumer transition correction now passes 24 focused checks and Studio build and is owner-accepted on 2026-09-10.

- Themes owns product tokens, components, fonts, semantic icons, assets, catalog data, committed generated outputs, and shared editor recipes.
- Nine V2 families ship in both modes. AppScreen owns behavior, persistence, Guest state, interaction, rendering, and orchestration.
- Source components, `dist/web`, and `docs/theme` are generated together and remain synchronized.
- Cluna monochrome app marks are included in the owner-accepted AppScreen checkpoint. One brand-mark recipe serves navbar/footer, workspace and loading/auth. Inner artwork owns masking so the existing outer shadow is no longer clipped. The original mark, latest single-line owner-outlined Studio wordmark with increased luna/Studio spacing and primary-color favicon are generated together. Expanded chrome uses the contained 188 x 36 wordmark; collapsed chrome only the mark, without separate text. Old assets remain. Themes/Studio builds, asset/markup checks and generated parity pass. AppScreen-facing copy now uses Cluna Studio; domain and landing remain owner-directed. Earlier accepted recipes and static behavior remain intact.
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
- Slice 2: three Themes checks, generation and six source/web/docs component comparisons pass; owner-approved. Shared hull generation/parity passed; owner-approved. Audio migration: one Themes generation, exact parity for all three Audio components and 34 focused AppScreen checks pass; the owner accepted the final rendered state on 2026-09-08.
- Every catalog role resolves and every generated SVG exists for Material
  Outlined, Material Filled, and Font Awesome Solid.
- The Themes production build and repository diff check pass.
- The paired AppScreen production bundle audit verifies every catalog asset
  before Cloudflare packaging can complete.
- No push, deployment, publication, or activation occurred.

## Current Boundary

- Select reserves space in every floating window: grow/reposition, then use its
  existing scroll area at viewport limits. Five-option cap and close restoration
  remain. Six focused checks and Themes build pass; the owner accepted the final result.
- Animation has its own semantic vector (Material Animation, Font Awesome wand),
  distinct from Edit Video. Generated providers and source/web/docs agree; build
  and focused icon coverage pass. The owner accepted the accumulated cleanup checkpoint.

- Scene and element animations now share the same Themes card/Add/Delete/region
  recipes and Type dropdowns. Audio settings support optional slot Add/Replace/
  Remove actions without changing ordinary Play/Volume controls. AppScreen owns
  one project backing slot and first-card window growth within the viewport.
  Fifteen focused AppScreen checks, syntax, and Themes generation pass; generated
  web/docs sources match. This is included in the owner-accepted cleanup checkpoint.

- Popovers retain attachment-before-hydration and failure lease cleanup. Their
  lifecycle now requires a consumer-supplied event router. Ten Themes checks and
  generation pass; AppScreen supplies its router. Owner accepts the checkpoint for now.

- Audio follow-up: annotated-text now owns editable cue presentation, destructive
  pill state, and semantic Close; opt-in Select descriptions use native titles.
  Eight Select and nineteen AppScreen checks pass, including the annotation
  consumer; generated web/docs output is synchronized. Owner accepted the Audio result.

- Audio actions share Add/Replace/Remove. Picker card bodies select without playback cues; Vault/sample previews play through the common ancestor. Generation/checks pass; checkpoint accepted for now.
- Window content owns padding/gap; Animation cards are borderless. Audio retains brown/yellow selection/handles and one brown outline, without blue/inner borders or center rules. Build/source/web/docs passed; owner accepts the checkpoint for now. AppScreen Add is owner-confirmed working and resolved on 2026-09-08.
- The Winter iPhone draft and future iPad adaptation are AppScreen composition
  work. They do not activate another Themes implementation cluster.
- Toolbar ordering, Duplicate Project behavior, and global element order remain
  AppScreen-owned behavior built from these shared recipes.
- Static/video guide eligibility, geometry, project preferences, and export
  exclusion belong to AppScreen. Universal typeface safety remains parked.
- Preview, export, owner browser interaction, and deployment remain outside
  Themes ownership.

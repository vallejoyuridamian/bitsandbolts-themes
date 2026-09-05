# Bits and Bolts Themes: Status

Last verified: 2026-09-04

## Current Truth

- This repository owns product tokens, components, fonts, semantic icons,
  assets, catalog data, committed generated outputs, and shared editor recipes.
- Nine v2 families ship in both modes, including all accepted first-party themes.
- Themes owns canonical visual recipes. AppScreen owns behavior, persistence,
  Guest state, interaction, rendering, and orchestration.
- The accepted shared workspace project-info recipe is implementation `a766904`,
  paired with AppScreen implementation `42f846a`.
- Compact Theme, Phase 4 hull, magnet, viewport-centering, and actionable mixed
  control states are accepted.
- Semantic `group` and `ungroup` vector roles are owner-accepted for AppScreen
  V1 grouping, with source and generated web and documentation outputs aligned.
- V1 arrangement recipes are owner-accepted after healthy paired AppScreen
  interaction and runtime verification.
- Canonical Select preserves an intentionally blank mixed Text-font label. The
  paired AppScreen behavior is owner-accepted.
- Identity foreground purpose, contrast, derivation, mode behavior, and consumer
  rules are now explicit in README and the canonical color-system reference.
- Theme identity swatches present exact foreground pairs; source and generated
  outputs match, and the paired AppScreen result is owner-accepted.
- The canonical palette owns aligned Theme, On top, Project, and optional Original
  rows. Project Add previews native colors and returns to plus at input baseline.
- Coffee uses Besley for signature typography and Roboto Slab for interface typography in both modes.
- Line geometry uses the shared compact popover with endpoint labels and the
  canonical resize cursor for handle hover and captured drag.
- Standalone Screen icons resolve through Themes-owned provider mappings and
  vectors. Home, Recipes, Timer, Profile, and Submenu follow the active Theme;
  V60 and AeroPress are first-party semantic roles.

## Preserved Shared Editor Recipes

- Background editor markup and presentation, visible palette swatches, semantic
  `swap_horiz`, selection signals, snap guides, resize handles, and placement
  values remain accepted.
- Placement separates transparent transformed-iframe content borders from
  equivalent outer-canvas paint. AppScreen placement remains trace-free.
- `layout-text-editor.css` and `layout-text-editor.js` own toolbar and sidebar
  presentation without owning AppScreen behavior.
- The toolbar recipe retains compact geometry, text alignment, viewport
  centering, hover help, color popovers, explicit
  consumer-owned portal retention, and canonical Select.
- Project color Add and image Original retain the shared cut-corner recipes and
  semantic vector roles.
- Every repeated Select receives its own trigger. Only explicitly marked native
  selects may bind an external trigger.
- Mixed Select, numeric, color, toggle, and checkbox presentation is owned by
  one shared adapter. Numeric and text inputs use an empty mixed value, toggles
  use `aria-pressed="mixed"`, and checkboxes use native indeterminate state.

## Accepted Background and Project Info Recipes

- One Background recipe owns Project versus Screen or Scene scope presentation,
  reusable Theme, mode, and background controls across Screens and Scenes.
- Canonical Background Theme swatches expose their semantic identity role for consumer persistence.
- One `Project info` recipe supplies both surfaces with project and selected
  layout names plus informative read-only resolution.
- AppScreen owns selected-layout and project mutation, persistence, window
  orchestration, and the differing sidebar boundaries.
- Source, generated web output, documentation output, and tests are synchronized.

## Accepted Device and Overlay Recipes

- Shared checkbox, numeric-field, status, popover, Original-color, semantic
  rotate, and Device-pose recipes retain their accepted presentation.
- One shared zoom-compensated overlay recipe keeps dashed lines at 1px, square
  handles at 8px, axes subdued, rotation icons flat at 16px, and text drawing
  feedback canonical.
- The hull recipe gives every shape one path, preserves the resize pointer, and
  owns one chrome plane above consumer element content.
- Themes owns both viewport-centering roles and the bounded vertical rotation
  descriptor.

## Accepted Paired AppScreen Result

- Text, Image, Device, and Stopwatch selection use one shared toolbar-context
  boundary while retaining distinct behavior owners.
- V1 multi-selection uses Themes mixed and indeterminate states for capability
  intersection without adding product-local control styling.
- Same-kind Text exposes typography; same-kind Device exposes rotation and
  visibility; shared eligible kinds expose canonical Size and Color controls.
- Device screen-media replacement remains excluded from bulk selection.
- AppScreen owns ordered selection, Shift-click routing, group movement,
  clipboard behavior, semantic Size, history, and cross-owner settlement.
- Workspace-tab changes clear element and timeline selection, popovers, rendered
  overlays, and selection toolbar contexts together.

## Evidence and Acceptance Boundary

- Multi-selection, grouping, arrangement, Geometry, Gap, Coffee typography, and
  semantic Background recipes are paired, tested, built, and owner-accepted.
- The owner accepted the paired Line endpoint controls and standalone Screen
  Icon V1. Source, generated web output, documentation output, licensing, and
  focused recipe coverage are synchronized.
- No push, deployment, publication, or activation occurred.

## Next Boundary

- Preserve accepted project-info, Background, placement, multi-selection, custom-dimension, project-resource, Image, Device, toolbar-focus, arrangement, and fixed overlay recipes.
- The typography owner computes the modular size ladder and publishes the V2 default line heights. The current presentation is owner-accepted. Local font metrics prove those values are not universal overlap guarantees, so typeface-specific safety remains discussion-pending.
- Geometry is owner-locked and uses the shared popover Segmented Control recipe for px/% in the X/Y row. Its wrapper matches the popover surface exactly, has no border, and its centered options retain equal horizontal padding. Percent inputs show one decimal and step by 0.5 while saved geometry stays canonical pixels. A separate Gap trigger owns Related 1u through Major 4u plus both axis actions using `min(0.022W, 0.030H)`. Source, generated outputs, 13 layout-editor checks, five AppScreen geometry checks, syntax, and the build pass.
- Coffee typography and semantic Background swatches are owner-accepted in paired AppScreen use. Eight focused Themes checks and the production build pass.
- Preserve accepted Line and Icon recipes. Inline Text icons, social icons, and
  Scene icon workflows remain outside V1. The Winter iPhone and iPad Guest
  projects are AppScreen composition work and do not activate another Themes
  feature cluster. Universal typeface safety remains parked.

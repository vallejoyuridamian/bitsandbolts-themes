# Bits and Bolts Themes: Status

Last verified: 2026-08-30

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

## Preserved Shared Editor Recipes

- Background editor markup and presentation, visible palette swatches, semantic
  `swap_horiz`, selection signals, snap guides, resize handles, and placement
  values remain accepted.
- Placement separates transparent transformed-iframe content borders from
  equivalent outer-canvas paint. AppScreen placement remains trace-free.
- `layout-text-editor.css` and `layout-text-editor.js` own toolbar and sidebar
  presentation without owning AppScreen behavior.
- The toolbar recipe retains compact geometry, semantic clipboard, text
  alignment, viewport centering, hover help, color popovers, and canonical Select.
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

- The owner accepted the complete paired V1 multi-selection presentation after
  Text, Image, and Device mixed-state verification.
- Themes source, generated web output, documentation output, and tests are
  synchronized. Focused mixed-state checks pass 8/8 and the production build passed.
- Paired AppScreen owner verification is healthy, including equal Image Size,
  mixed numeric stepping, selected hulls, and Device minimum clamping.
- AppScreen V1 grouping is owner-accepted. Focused grouping icon checks pass
  3/3 and the Themes production build passed.
- No push, deployment, publication, or activation occurred.

## Next Boundary

- Preserve accepted project-info, Background, placement, multi-selection,
  project-resource, Image, Device, toolbar-focus, and fixed overlay recipes.
- Preserve accepted compact and full Theme cards during owner-directed product use.
- Further Themes work requires a concrete recipe gap. Do not add speculative UI
  recipes or perform external activation.

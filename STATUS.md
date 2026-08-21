# Bits and Bolts Themes: Status

Last verified: 2026-08-21

## Current Truth

- This repository owns product tokens, components, fonts, semantic icons, assets,
  catalog data, and committed generated outputs.
- Nine v2 families ship in light and dark modes: Cloud, Bits and Bolts, Brutus,
  Forest, Winter, Coffee, Bubblegum, Inferno, and Sober.
- Themes owns canonical visual recipes. AppScreen owns user Theme behavior,
  persistence, Guest state, interaction, rendering, and orchestration.
- The accepted project-color add recipe is implementation `02bd65b`. The paired
  AppScreen project text-resource implementation is `eb91a57`.
- The owner accepted the canonical transparent Original image-color swatch and
  toolbar-trigger indicator with the semantic `close` icon, paired with the
  AppScreen image-toolbar migration.
- Nothing is pushed, deployed, published, or activated.

## Preserved Shared Editor Recipes

- Background editor markup and presentation, visible palette swatches, semantic
  `swap_horiz`, selection signals, snap guides, resize handles, and placement
  values remain accepted.
- Placement separates transparent transformed-iframe content borders from
  equivalent outer-canvas paint. AppScreen placement remains trace-free.
- `layout-text-editor.css` and `layout-text-editor.js` own toolbar and sidebar
  presentation without owning AppScreen behavior.
- The text-editor floating-window variant remains removed while generic floating
  windows remain available to unrelated workflows.
- The toolbar recipe retains compact geometry, hidden labels, semantic clipboard,
  style and alignment controls, hover help, active-color popover, and canonical
  Select presentation.
- Every ordinary repeated Select receives its own trigger. Only explicitly marked
  native selects may bind an external trigger.
- The canonical Select retains its five-visible-item limit, caret, animation, and
  font preview behavior.
- The shared cut-corner swatch recipe owns accepted color geometry.

## Accepted Project Color Add Recipe

- `layoutTextEditorProjectColorAddMarkup` owns the reusable project color action.
- The action has the same compact geometry as color swatches and composes the
  shared cut-corner swatch and workspace add-tile recipes.
- A transparent native color input covers the action while the visible affordance
  uses the Themes semantic `add` icon.
- Hover and focus use the established dashed add treatment and identity color.
- AppScreen consumes the same markup in the toolbar popover and migration sidebar.
- AppScreen owns project color mutation, deduplication, ordering, selection, and
  Screen Set and Video persistence.

## Accepted Paired Consumer Result

- AppScreen font Selects show the selected canvas theme's actual family names and
  retain the Themes five-item menu boundary.
- Existing theme and project font picker choices select without being duplicated.
  Genuinely new project fonts are added and selected.
- Text palettes expose Primary, Secondary, Accent, and Neutral, followed by black,
  white, project colors, and the add tile.
- Project color help is hex-only. Theme and utility labels remain semantic.
- Canonical Theme detail uses exact identity values and identity-anchored Accent
  and Neutral ramps. Diagnostic swatches use the cut-corner recipe.

## Evidence and Acceptance Boundary

- The owner accepted the complete project font, project color, ordering,
  deduplication, selection, and canonical palette result.
- Themes focused recipe checks and the production build pass.
- AppScreen focused project-resource, toolbar, picker, and Preview checks and its
  production build pass.
- Source, `dist/web`, and documentation copies are byte-identical for the changed
  recipe. Tests and semantic assets remain synchronized.
- The accepted Original-color recipe passes 9/9 focused checks and the Themes
  production build. Its source, generated web, and docs outputs are synchronized.
- The paired AppScreen result preserves selection through targeted image color and
  mode replacement without rebuilding the screen.
- Focused diagnostics are disabled and development logging remains quiet.
- The former 3 MB bundle gate remains retired and non-blocking.

## Next Boundary

- The Original image-color recipe and paired AppScreen toolbar are accepted.
- No additional Themes implementation is selected. Preserve generated output and
  wait for owner direction.
- Push, deployment, publication, and activation remain user-owned.

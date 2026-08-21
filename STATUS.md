# Bits and Bolts Themes: Status

Last verified: 2026-08-21

## Current Truth

- This repository canonically owns product tokens, components, fonts, semantic
  icons, assets, catalog data, and committed generated outputs.
- Nine v2 families ship in light and dark modes: Cloud, Bits and Bolts, Brutus,
  Forest, Winter, Coffee, Bubblegum, Inferno, and Sober.
- Themes remains the canonical-only gallery and read-only family-detail owner.
  AppScreen owns user Theme behavior, persistence, Guest state, and orchestration.
- Every icon-like affordance must use an exact Themes-owned semantic recipe.
- The shared editor-recipe checkpoint described here is locally accepted. Nothing
  is pushed, deployed, published, or activated.
- The accepted toolbar-first text-controls recipe checkpoint is `69b260b`.
  The paired AppScreen consumer implementation checkpoint is `78e88e7`.

## Accepted Shared Editor Recipes

- `components/background-editor.css` and `background-editor.js` own the shared
  screen and scene Background form presentation and markup.
- Source, `dist/web`, and docs copies are present and synchronized by the Themes
  build completed during this session.
- The recipe includes visible palette swatches and a semantic `swap_horiz` icon.
- AppScreen owns binding, background state, persistence, media choices, and the
  shared floating-window behavior that consumes this recipe.
- The owner reported the swatch visibility correction was good before work moved
  to the unrelated selection-trace defect.
- The owner accepted the Background consumer result for the local checkpoint.

## Selection Recipe Boundary

- `components/layout-editor-selection.js` and its synchronized `dist/web` copy own
  the existing selection signal, snap-guide, resize-handle, and placement-preview
  values without changing their established colors or dimensions.
- The placement recipe separates a transparent 4 px content border from the same
  dashed red border painted by AppScreen outside its transformed preview iframe.
  This preserves placement geometry and presentation while avoiding stale iframe
  border paint.
- Themes owns these visual values. AppScreen owns placement behavior, geometry,
  scaling, lifecycle, and cleanup.
- A speculative AppScreen route serving arbitrary Themes source files broke
  generated semantic icon delivery and remains removed. AppScreen serves Themes
  from `bitsandbolts-themes/dist/web`.

## Accepted Layout Text Editor Recipe

- `layout-text-editor.css` and `layout-text-editor.js` own the shared toolbar and
  sidebar presentation without owning AppScreen behavior.
- The text-editor floating-window presentation is removed. Generic floating-window
  recipes remain available to unrelated consumers.
- The toolbar recipe owns centered 30 px controls, compact spacing, hidden labels,
  expanded font Select geometry, and semantic icon sizing.
- `toolbar-popover.js` and its interface recipe own the active-color trigger,
  floating palette positioning, viewport bounds, dismissal, and focus restoration.
- The canonical Select controller gives every ordinary repeated select its own
  generated trigger. Only explicitly marked native selects bind external triggers.
- Canonical Select font-preview options render selected-theme family names in the
  represented families. Signature, Interface, and Technical map to accent, primary,
  and mono without changing stored AppScreen font values.
- The canonical Select caret and open-state rotation remain the unique definition.
- A shared cut-corner swatch recipe now owns the accepted two-cut-corner geometry
  used by Themes presentation and AppScreen text color controls.
- Copy, Cut, Paste, Bold, Italic, Underline, and text alignment use the exact
  workspace icon-button recipe with accessible labels and hover help.
- New semantic roles `content_paste`, `format_align_left`,
  `format_align_center`, and `format_align_right` map to generated Font Awesome
  vectors. Existing Copy, Cut, Bold, Italic, and Underline roles are reused.
- Source, `dist/web`, docs, semantic CSS, and generated vector assets remain
  synchronized and accepted through the AppScreen consumer.

## Earlier Accepted Theme Boundaries

- Catalog schema 2 retains exact identity foreground pairs, semantic typography,
  licensed fonts, and canonical light and dark output for all families.
- Global and User Theme sections share workspace-section and Theme-card recipes.
- Theme cards retain semantic font roles, persistent Bold, Italic, and Underline,
  fixed card rows, and application-neutral `displayLarge` titles.
- One floating-form and floating-window system owns naming, media selection,
  confirmation, sizing, and bounded Select reservation.
- Workspace settings, Account, navbar, resizer, media cards, reference images,
  font controls, Product Entry, and semantic icon recipes remain accepted.
- Source, generated web output, and documentation remain synchronized at the
  current accepted local checkpoint.

## Evidence and Acceptance Boundary

- The Themes production build passed after adding the Background editor recipe.
- The owner confirmed the exact corrected placement after diagnostic and
  failed-attempt cleanup.
- The Background and layout-editor selection recipes are accepted as the current
  local Themes checkpoint.
- Source, `dist/web`, and documentation copies compare byte-for-byte where present;
  changed JavaScript syntax and Git whitespace checks pass.
- AppScreen reuses the existing `play_arrow` role. The text-controls slice adds
  the accepted layout-text-editor recipe and four missing semantic icon roles.
- Themes final toolbar checks pass 9/9 and the production build passes.
- AppScreen final toolbar checks pass 11/11 and its production build passes.
- Final AppScreen logs contain no error or warning indicators, and the owner
  accepted click depth, caret routing, wrapping, scaling, cursor, and placement.
- The toolbar refinement passes Themes checks 11/11 and AppScreen checks 21/21.
  Both production builds pass, and the owner accepted the final visual result.

## Next Boundary

- No next Themes implementation is selected. A fresh chat must load both projects'
  complete hot context and handoffs, then stop for owner direction.
- Preserve implementation checkpoint `69b260b`. Do not push, deploy, publish, or
  add speculative editor recipes.

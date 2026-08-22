# Bits and Bolts Themes: Status

Last verified: 2026-08-21

## Current Truth

- This repository owns product tokens, components, fonts, semantic icons, assets,
  catalog data, committed generated outputs, and shared editor recipes.
- Nine v2 families ship in light and dark modes: Cloud, Bits and Bolts, Brutus,
  Forest, Winter, Coffee, Bubblegum, Inferno, and Sober.
- Themes owns canonical visual recipes. AppScreen owns user Theme behavior,
  persistence, Guest state, interaction, rendering, and orchestration.
- The accepted fixed screen-space editor-overlay recipe is implementation
  `bbb236c`, paired with AppScreen implementation `615c022`.
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
  style and alignment controls, hover help, color popovers, and canonical Select.
- Project color Add and image Original retain the shared cut-corner recipes and
  semantic vector roles.
- Every ordinary repeated Select receives its own trigger. Only explicitly marked
  native selects may bind an external trigger.

## Accepted Device Toolbar Recipes

- `layoutTextEditorCheckboxMarkup` owns reusable checkbox markup for toolbar
  popovers without taking AppScreen mutation ownership.
- `toolbarPopoverNumericFieldMarkup` and `toolbarPopoverStatusMarkup` own compact
  numeric rows and status presentation.
- Numeric toolbar inputs share the same control recipe as top-toolbar Size.
- Toolbar popovers share the workspace toolbar background and border tokens.
- Numeric field labels match the accepted checkbox-label typography, including
  the Studio-resolved semibold weight.
- The Original-color trigger indicator retains its accepted centered 9px vector.
- The semantic `rotate` role maps to the Themes-owned Font Awesome vector.
- `layoutEditorSelectionRotationStyles` and
  `layoutEditorRotationIconMarkup` own device-pose overlay presentation.
- AppScreen owns rotation interaction, media-picker routing, visibility mutation,
  integer geometry settlement, selection clearing, and toolbar orchestration.

## Accepted Fixed Screen-Space Overlay Recipe

- Programmatically focused workspace surfaces do not paint a white container
  outline when the user clicks empty toolbar space.
- Every editor selection, placement, snap, region, and rotation presentation
  consumes one shared zoom-compensated recipe.
- Dashed selection and rotation lines remain 1px in screen space at every zoom.
- Resize handles remain solid 8px accent squares with no border or radius.
- Rotation axes retain subdued idle opacity. Rotation vectors remain flat 16px
  semantic accent icons without a border, background, or shadow.
- AppScreen owns zoom publication and interaction. Themes owns every metric,
  color, vector, and presentation rule.

## Accepted Paired AppScreen Result

- Text, image, and device selection use one shared toolbar-context boundary while
  retaining distinct controls and behavior owners.
- Device sidebar, Name, Source, Add from disk, Width, Height, Play, Reset, Hide
  image, and Transparent body controls remain absent.
- Screens opens the image picker directly. Scenes exposes image and video choices
  through the shared popover before opening the existing picker.
- Device Size preserves aspect ratio, writes real integer geometry, and remains
  synchronized through field and handle resizing.
- Visibility and rotation popovers retain accepted checkbox and Tilt, Turn, and
  Roll presentation.
- Workspace-tab changes clear element and timeline selection, popovers, rendered
  overlays, and selection toolbar contexts together.
- The preserved image toolbar still uses targeted color and mode replacement with
  visible selection intact.

## Evidence and Acceptance Boundary

- The owner accepted the paired device-toolbar baseline, toolbar focus fix, and
  complete fixed screen-space overlay appearance across zoom levels.
- This slice's Themes focused checks pass 3/3 and its production build passes.
- This slice's AppScreen focused checks pass 4/4 and its production build passes.
- Source, `dist/web`, and documentation copies are synchronized for changed
  recipes. Git whitespace checks pass in both repositories.
- Focused diagnostics remain disabled and development logging remains quiet.
- The former 3 MB bundle gate remains retired and non-blocking.

## Next Boundary

- Preserve the accepted placement, text, project-resource, image, device,
  toolbar-focus, and fixed screen-space overlay recipes.
- No additional Themes implementation is selected. Preserve generated output and
  wait for owner direction.
- Push, deployment, publication, and activation remain user-owned.

# Bits and Bolts Themes: Status

Last verified: 2026-08-23

## Current Truth

- This repository owns product tokens, components, fonts, semantic icons, assets,
  catalog data, committed generated outputs, and shared editor recipes.
- Nine v2 families ship in both modes, including all accepted first-party themes.
- Themes owns canonical visual recipes. AppScreen owns user Theme behavior,
  persistence, Guest state, interaction, rendering, and orchestration.
- The accepted shared workspace project-info recipe is implementation `a766904`,
  paired with AppScreen implementation `42f846a`.
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

## Accepted Background Scope Recipe

- The shared Background editor owns Project versus Screen or Scene scope
  presentation plus reusable Theme, mode, and background controls.
- The same markup and style contract serves Screens and Scenes. AppScreen owns
  selected-layout and project mutation, persistence, and window orchestration.
- AppScreen sidebars retain project and layout names while background and Theme
  editing stays in the shared floating window.
- The existing Themes semantic image action supplies the toolbar Background icon
  and hover-help presentation without creating a parallel recipe.
- Source, generated output, documentation, and focused coverage are synchronized.

## Accepted Workspace Project Info Recipe

- One reusable recipe supplies the `Project info` floating window for both
  Screens and Scenes without owning AppScreen behavior or persistence.
- The recipe exposes editable project and selected-layout name fields plus an
  informative read-only resolution value.
- The existing semantic settings icon, toolbar action, hover help, window shell,
  form fields, and spacing recipes remain the only presentation owners.
- AppScreen uses the same action and controller on both surfaces, removes the
  complete Screens sidebar, and preserves the Scenes sidebar.
- Background hover help is visibly `Background (B)` on both surfaces.
- Source, generated web output, documentation output, and tests are synchronized.

## Accepted Device Toolbar Recipes

- Shared checkbox, numeric-field, status, popover, Original-color, semantic
  rotate, and device-pose recipes retain their accepted presentation.
- AppScreen owns rotation, media routing, visibility, integer geometry,
  selection clearing, and toolbar orchestration.

## Accepted Fixed Screen-Space Overlay Recipe

- Programmatically focused workspace surfaces do not paint a white container
  outline when the user clicks empty toolbar space.
- One shared zoom-compensated recipe keeps dashed lines at 1px, square handles at
  8px, axes subdued, and semantic rotation icons flat at 16px.
- AppScreen owns zoom and interaction. Themes owns presentation.

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

- The owner accepted the complete paired editor baseline.
- Themes project-info and Background checks pass 2/2; its production build passes.
- The paired AppScreen batch passes 39/40 with one unrelated old spelling assertion; its build and `Background (B)` contract pass.
- Stages 2 through 7 completed in AppScreen using exact existing comparison recipes.
- Stage 7 audits passed with the exact checksum and no Themes source or generated-output change.
- Three.js Lean PBR 512 without glass is the accepted Stage 7 winner. Renderer
  behavior, evidence, and the future efficiency audit remain AppScreen-owned.
- Diagnostics remain quiet and the former 3 MB bundle gate remains retired.

## Next Boundary

- Preserve the accepted project-info, Background, placement, text,
  project-resource, image, device, toolbar-focus, and fixed overlay recipes.
- Stage 7 is complete. Stage 8 awaits explicit fresh-chat authorization.
- Preserve the checksum-pinned Stage 5 through 7 audits and exact recipe.
- Stage 9 and production migration remain unauthorized.
- Do not add speculative UI recipes or perform external activation.

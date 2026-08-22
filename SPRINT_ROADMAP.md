# Bits and Bolts Themes: Sprint Roadmap

## Current Focus

- Preserve Themes as the visual owner across every Bits and Bolts product.
- Keep AppScreen behavior in AppScreen while sharing exact presentation recipes.
- Continue only through bounded, owner-selected, approval-gated slices.

## Completed Foundation

- [x] Ship nine complete light and dark v2 families with semantic mappings,
  licensed fonts, assets, recipes, and generated platform output.
- [x] Own canonical product tokens, components, fonts, semantic icons, assets,
  catalog data, and synchronized generated output.
- [x] Keep Theme behavior in AppScreen while sharing one portable renderer and
  complete visual schema for first-party and user-authored themes.
- [x] Own shared Background, text-editor, toolbar, Select, palette, cut-corner,
  placement, snap-guide, resize-handle, and selection recipes.
- [x] Own shared checkbox, numeric-field, status, popover, rotation-vector, and
  device-pose overlay presentation for the accepted device toolbar.

## Completed Background Scope Recipe

- [x] Extend the shared Background editor with Project versus selected Screen or
  Scene scope presentation.
- [x] Share Theme, mode, and background controls across both scopes without
  taking AppScreen mutation or persistence ownership.
- [x] Keep Screens and Scenes on one reusable markup and style contract.
- [x] Reuse the existing semantic image action for the AppScreen Background
  toolbar entry and hover help.
- [x] Synchronize source, generated web output, documentation output, and tests.
- [x] Accept Themes `8d17e97` and AppScreen `8495618`.

## Completed Fixed Screen-Space Overlay Recipe

- [x] Remove programmatic workspace focus paint from empty toolbar clicks.
- [x] Define one zoom-compensated metric contract for every editor overlay.
- [x] Standardize 1px dashed selection, placement, snap, region, and rotation
  lines at every zoom level.
- [x] Standardize solid 8px accent square handles without borders or radius.
- [x] Standardize subdued rotation axes and flat 16px semantic rotation icons
  without borders, backgrounds, or shadows.
- [x] Replace AppScreen's duplicated scene-region and draw-overlay styling with
  generic Themes-owned region recipes.
- [x] Synchronize source, generated web output, documentation output, and tests.
- [x] Accept Themes `bbb236c` and AppScreen `615c022`.

## Current Boundary

- No further Themes or AppScreen implementation is selected.
- Preserve every accepted editor recipe and paired AppScreen behavior.
- Push, deployment, publication, and activation remain user-owned.

# Bits and Bolts Themes: Status

Last verified: 2026-08-17

## Current Truth

- This public repository is the canonical visual owner for Bits and Bolts
  products. Tokens, components, fonts, licenses, semantic icons, platform assets,
  catalog data, and committed generated outputs live here.
- Nine v2 families ship in light and dark modes: `cloud`, `bitsandbolts`,
  `brutus`, `forest`, `winter`, `coffee`, `bubblegum`, `inferno`, and
  `sober`. Ocean and Robot remain removed without aliases.
- Bits and Bolts web icons use packaged Font Awesome Free Solid 7.3.1 through
  semantic roles. The other families retain Material Symbols.
- All families include semantic colors, typography, interface roles, recipes,
  catalog data, web CSS, Android, React Native, and showcase artifacts.
- Catalog schema 2 publishes four exact identity foreground pairs per mode. All
  72 pairs pass 4.5:1 after exact serialization, with palette-aware art direction
  retained and literal black or white reserved for deliberate or safety use.
- V1 authored and generated color paths are removed. All consumers use V2.
- The established typography, licensed local fonts, Brutus native Ultra weight,
  Forest Hero leading, and semantic summary-card typography remain intact.

## Theme Workspace Ownership

- Themes is a full-width gallery and read-only family-detail workspace. It does
  not own user project creation, persistence, or an editable product.
- User-authored Theme projects live in AppScreen Studio. AppScreen owns behavior,
  persistence, and transient reference-image state.
- Gallery and AppScreen share one detail renderer. Standalone keeps the full
  showcase, while AppScreen detail stops after Colors and Typography.
- Colors and local Theme font assignment are accepted editable slices. Themes owns
  the font add tiles, assigned specimens, and accepted reduced picker presentation;
  AppScreen owns picker behavior and persistence.
- Exact canonical family pairs are the fit corpus for AppScreen's deterministic
  first-selection light-dark equivalence and foreground generation. Themes does
  not add ad hoc family exceptions or alter public preset values.
- The Palette heading now states `DARK MODE` or `LIGHT MODE`.
- Editable Palette spacing is compact, cropped-corner swatches are shorter, and
  Auto-complete plus its Select remain flush left on one row.

## Accepted Media and Reference Recipes

- Themes owns media preview cards, add cards, picker layout, reference-image
  presentation, and the semantic media icon mappings.
- Managed component registry entries expose `media-preview-card` and
  `reference-image-picker` as canonical recipes.
- Semantic roles cover image, audio, video, device, progress, visibility,
  transport, close, favorite, and all related picker affordances.
- The reference-image action is an exact workspace icon-and-label button. Shared
  layout uses a tokenized 8 px gap, equal 18 px icon and label alignment boxes,
  centered midpoints, and a 1 px label font-metric correction.
- Reference-image presentation owns hover and focus controls for semantic Swap,
  Zoom out, Fit, Zoom in, and Remove actions. The separate change-image row,
  filename caption, and grey lower strip are absent.
- The toolbar clears the viewport scrollbar. Theme page and image scrollbars
  follow the live Primary identity, and toolbar icons use the inverse surface
  role for light and dark contrast.
- The standalone showcase includes the canonical media picker and reference-image
  specimen. Asset URLs are repository-relative so GitHub Pages and local
  `pnpm dev` render the required assets.
- AppScreen imports the exact browser recipe through its `/theme/components`
  boundary and retains behavior only.

## Accepted Typography and Font Recipes

- Signature, Interface, and Technical rows show each centered family name once in its own face.
- Bold, Italic, and Underline controls are transient inspection affordances using semantic vector roles.
- One media-card base owns checker, typography, borders, preview, favorite, and add-card rules. Full Vault and reduced picker cards are explicit siblings.
- Reduced font cards omit the lower body and use an accepted 56 px preview. Font picker grids share the widest rendered family width instead of the generic 116 px media width.
- Themes owns presentation and semantic icons only. AppScreen owns Vault records, loading, upload, references, usage, persistence, and selection behavior.

## Shared Recipes and Icons

- Themes owns Navbar, Footer, Hero, Button, Select, Menu, handled windows,
  workspace chrome, control bars, Stage, selection controls, Dialog, Product
  Entry, galleries, editorial layouts, cards, forms, timelines, prose, detail
  media, store badges, and shared interface recipes.
- Every icon-like affordance routes through a Themes-owned semantic role and
  provider mapping. Text glyphs, emoji, entities, CSS text content, and
  consumer-local artwork are not icon implementations.
- Open uses the same semantic action-button recipe as Back and New. Its exact
  Select/Menu popup contains only openable projects.
- Back and mode use shared control-bar architecture. Theme cards and detail use
  the same semantic sun and moon assets.
- The handled-window recipe owns its shell, grip, glowing semantic close control,
  balanced spacing, stable danger treatment, buttons, and Theme-viewer specimen.
- Build cleanup removes stale generated component and icon outputs before
  generation. Source, `dist/web`, and `docs` remain synchronized.

## Evidence and Acceptance Boundary

- The focused media-picker suite passes 8/8. AppScreen's corrected picker and
  presentation checks pass 4/4. Both production builds pass.
- The owner accepted the compact Palette, reference viewer, shared font picker,
  Theme assignments, shared font widths, and 56 px body-free reduced font cards.
- Any later UI, CSS, theme, icon, or renderer change requires fresh visual
  acceptance before another visual checkpoint commit.
- This accepted checkpoint is committed locally. Nothing is pushed or deployed.

## Open Gates

- This local font picker and Theme assignment slice is complete and accepted.
- The v2 contract still needs pinned DTCG resolver validation, full provenance,
  glyph and fallback checks, and complete platform component adapters.
- Versioned npm, Maven, and static distribution remain unimplemented. Manual
  consumer mirrors are migration debt and must not become authorities.

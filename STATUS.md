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
- The completed editable builder slice is Colors. Typography and font editing is
  the next owner-directed slice.
- Exact canonical family pairs are the fit corpus for AppScreen's deterministic
  first-selection light-dark equivalence and foreground generation. Themes does
  not add ad hoc family exceptions or alter public preset values.
- The Palette heading now states `DARK MODE` or `LIGHT MODE`.

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
- Reference-image presentation contains only the image and semantic close action.
  The filename caption and grey lower strip are removed.
- The standalone showcase includes the canonical media picker and reference-image
  specimen. Asset URLs are repository-relative so GitHub Pages and local
  `pnpm dev` render the required assets.
- AppScreen imports the exact browser recipe through its `/theme/components`
  boundary and retains behavior only.

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

- The focused media-picker suite passes 4/4 and the Themes production build passes.
- AppScreen passed its 50 focused media, layout, and Theme-manager checks, 30
  resolver-affected checks, and 19 Theme-gallery checks for this slice.
- AppScreen's production build and direct development module boundary pass.
  Both repositories pass `git diff --check`.
- The owner accepted the exact final color, reference-image, button-alignment,
  caption-free, and showcase result.
- Any later UI, CSS, theme, icon, or renderer change requires fresh visual
  acceptance before another visual checkpoint commit.
- This checkpoint is committed locally. Nothing has been pushed or deployed.

## Open Gates

- Typography and font editing is next only when the owner directs it.
- The v2 contract still needs pinned DTCG resolver validation, full provenance,
  glyph and fallback checks, and complete platform component adapters.
- Versioned npm, Maven, and static distribution remain unimplemented. Manual
  consumer mirrors are migration debt and must not become authorities.

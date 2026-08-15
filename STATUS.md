# Bits and Bolts Themes: Status

Last verified: 2026-08-15

## Current Truth

- This public repository is the canonical visual owner for Bits and Bolts
  products. Source tokens, reusable components, fonts, licenses, semantic icons,
  platform assets, and committed generated outputs live here.
- Nine v2 families are generated in light and dark modes: `cloud`,
  `bitsandbolts`, `brutus`, `forest`, `winter`, `coffee`, `bubblegum`,
  `inferno`, and `sober`. Ocean and Robot remain removed with no aliases.
- Bits and Bolts web icons use packaged Font Awesome Free Solid 7.3.1 through
  Themes-owned semantic roles. The other eight families retain Material Symbols.
- All nine families include semantic colors, typography, interface roles,
  reusable recipes, catalog data, web CSS, Android outputs, React Native outputs,
  and GitHub Pages showcase artifacts.
- The established family typography, licensed local fonts, Brutus native Ultra
  weight, Forest Hero leading, and semantic summary-card typography remain intact.

## Theme Workspace Ownership

- Themes is a full-width gallery and read-only family-detail workspace. It does
  not own user project creation, project persistence, or an editable product.
- The previous standalone theme editor, its local server, bespoke chrome, custom
  variables, save implementation, and package entry point are removed.
- User-authored Theme projects now live in AppScreen Studio and consume exact
  Themes-owned recipes. AppScreen owns their behavior and persistence.
- The gallery's read-only detail and AppScreen's editable Theme project detail
  share the same root renderer and specialize only where editing requires it.
- Theme project editing currently exposes colors and fonts. All other values
  inherit the selected source family until a later owner-directed slice.
- Editable identity colors begin as the shared add-tile recipe. Once chosen, the
  full sample is the browser-native picker surface. Colors is the section label.

## Shared Recipes and Icons

- Themes owns Navbar, Footer, Hero, Button, Select, Menu, handled floating windows,
  workspace chrome, control bars, Stage, selection controls, Dialog, Product Entry,
  galleries, editorial layouts, cards, forms, timelines, prose, detail media,
  store badges, and shared interface recipes.
- Every icon-like affordance is routed through a Themes-owned semantic role and
  provider mapping. Text glyphs, emoji, HTML entities, and CSS text content are
  not icon implementations.
- `folder_open` maps in the Bits and Bolts provider to packaged Font Awesome Solid
  `faFolderOpen`. Open is rendered as the same normal semantic action button as
  Back and New, not as a special icon-only Select.
- Screens, Scenes, and Themes consume one shared project Open action recipe and
  behavior boundary. The visible project-choice popup is the exact Select/Menu
  recipe anchored to the shared action.
- Theme summary cards and both kinds of Theme detail use the same semantic
  `light_mode` and `dark_mode` sun/moon assets.
- Back and mode live in the shared workspace control bar, not in a bespoke Theme
  detail row. Applicable project actions render left and mode renders right.
- Menu carets, submenu indicators, save, save-as, edit, video, transport, and
  other toolbar artwork also use owned semantic recipes.
- Build cleanup removes stale `dist/web/components` and `dist/web/icons` outputs
  before generation, matching the existing documentation cleanup boundary.
- The handled window recipe owns the shell, grip, small glowing semantic close
  control, balanced confirmation spacing and type, stable danger treatment,
  buttons, and exact Theme-viewer specimen. The rejected confirmation-dialog
  module is removed; unrelated legacy Dialog consumers remain for later work.

## Managed Product Consumption

- AppScreen Studio consumes shared workspace tabs, project control bars,
  semantic action buttons, checkerboard, preview selection frame, add tile,
  Select, Menu, and the embedded Theme gallery/detail root.
- Theme changes retain the previous presentation until target CSS and fonts are
  ready. Webfonts use a blocking display policy.
- Sites continues to consume the accepted managed landing, My Website editorial
  pages, portfolio detail recipes, and shared visual assets.

## Evidence and Acceptance Boundary

- Bits and Bolts Themes and AppScreen Studio builds pass.
- The latest focused handled-window and Theme-viewer checks pass 18/18. The
  preceding integrated selection, gallery, and persistence run passed 32/32.
- Diff checks pass in both repositories, and both builds pass their existing gates.
- The owner accepted the Open action, palette direction, refined handled window,
  and its exact Theme-viewer specimen. Broader browser acceptance of the complete
  Theme workflow remains pending.
- The coordinated Theme-project and handled-window checkpoint is the current
  local baseline. Nothing was pushed.

## Open Gates

- Await owner direction before extending Theme project fields, migrating
  remaining legacy dialogs, changing composition, or beginning browser acceptance.
- The v2 contract still needs pinned DTCG resolver validation, full provenance
  enforcement, glyph and fallback checks, and complete React, Compose, and React
  Native component adapters.
- Versioned npm, Maven, and static distribution is not implemented. Manual
  consumer mirrors remain migration debt and must not become authorities.
- Any later UI, CSS, theme, icon, or renderer change requires fresh owner visual
  acceptance before another visual checkpoint commit.

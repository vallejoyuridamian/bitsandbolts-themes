# Bits and Bolts Themes: Status

Last verified: 2026-08-14

## Current Truth

- This public repository is the canonical visual owner for Bits and Bolts
  products. Source tokens, reusable components, fonts, licenses, and platform
  assets live here; generated `dist/` and `docs/` outputs are committed.
- Nine v2 families are generated in light and dark modes: `cloud`,
  `bitsandbolts`, `brutus`, `forest`, `winter`, `coffee`, `bubblegum`,
  `inferno`, and `sober`. Ocean and Robot are removed with no aliases.
- All nine families include semantic colors, typography, interface roles,
  Button recipes, catalog data, web CSS, Android outputs, React Native outputs,
  and GitHub Pages showcase artifacts.
- Family names and current typography are:
  - Brutus: Ultra 400 display and Roboto Slab 100 body.
  - Forest: Arima display and Mulish body.
  - Winter: Syne display and Inter body.
  - Coffee: Rokkitt display and Ubuntu body.
  - Bubblegum, Inferno, and Sober retain their accepted family typography.
  - Cloud uses Plus Jakarta Sans display and Inter body.
- Brutus disables synthetic display bolding so Ultra renders only its native
  Regular outline. The owner visually accepted this result.
- Forest owns a `1.08` Hero heading line height to compensate for Arima's font
  metrics. The default Hero leading remains unchanged for other families.
- Theme summary cards consume each family's semantic title, caption, compact
  body, and marketing-Hero family and weight declarations. They do not impose
  universal bold weights.
- Arima, Mulish, Rokkitt, and Syne are bundled under OFL. Roboto Slab and Ultra
  are bundled under Apache 2.0. Ubuntu is bundled under Ubuntu Font Licence 1.0.
  Licenses and official local font files are committed with generated copies.
- The Themes gallery is compact and card-first. A card opens the existing full
  theme view, and each summary card owns an Accent-colored light/dark control.
  Summary headers and identity rails have exact shared heights, and mode icons
  use Themes-owned vector masks that remain centered across browser zoom levels.
- Themes owns the reusable Navbar, Footer, Hero, Button, Select, Menu,
  Selection Controls, Dialog, Product Entry, Theme Readiness, Theme Gallery,
  Page Gallery, editorial layouts, cards, forms, timelines, prose, question
  lists, detail media, store badges, and shared interface recipes.
- The AppScreen Studio managed landing and Studio theme selectors expose the
  current catalog families. Select owns its menu lifecycle and delegated event
  contract. Theme changes retain the previous presentation until target CSS and
  fonts are ready, then commit atomically.
- Webfonts use a blocking display policy. Sites keeps first paint hidden until
  active fonts are ready, so fallback typography is never shown and replaced.
- Navbar and Footer declare their shared brand-mark module dependency. The
  canonical Dialog recipe owns the guest account-creation gate.
- The managed AppScreen landing's navigation, headline copy, themed brand mark,
  and footer treatment are owner-accepted at the current checkpoint.
- The 13-page managed My Website candidate is owner-accepted. Its homepage,
  secondary pages, and six live portfolio details use only declarative Sites
  content plus Themes-owned recipes, with source-exact copy and project images.
- Public copy and tracked source contain no attribution to the visual-inspiration
  source used during theme exploration.
- The build, readiness tests 2/2, Sites checks 41/41, AppScreen guest checks 9/9,
  routed Select contract, and portfolio detail checks 3/3 pass. Five known stale
  gallery assertions remain. The coordinated checkpoint is locally committed
  and unpushed.

## Parked Font Candidates

These are ideas for a future font library, not approved bundled assets. Source
and redistribution licenses must be verified before use.

- BBBouquet Bold: hippie 1970s or disco.
- Regalia Free Regular: rock and roll.
- Super Monday: hippie 1970s.
- Hansen: cowboy.
- NCAA Wisconsin Badger Bold: cowboy.

## Open Gates

- The owner accepted the AppScreen guest-consumer correction and the exact
  current Theme Summary Card rendering, visible guest gates, Navbar restoration,
  and fallback-free font transitions. Navbar action wrapper height remains
  intrinsic to the canonical Navbar height.
- The owner accepted the My Website managed editorial and portfolio-detail
  recipes, including the source-matched detail-title letter spacing.
- Any later UI, CSS, theme, or renderer change requires fresh owner visual
  acceptance before another visual checkpoint commit.
- The v2 contract still needs pinned DTCG resolver validation, full provenance
  enforcement, glyph and fallback checks, and complete React, Compose, and
  React Native component adapters.
- Versioned npm, Maven, and static distribution is not implemented. Manual
  consumer mirrors remain migration debt and must not become new authorities.
- User-authored themes remain a later contract and safety slice.

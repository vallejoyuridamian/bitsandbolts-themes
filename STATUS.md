# Bits and Bolts Themes: Status

Last verified: 2026-08-18

## Current Truth

- This public repository canonically owns product tokens, components, fonts,
  icons, assets, catalog data, and committed generated outputs.
- Nine v2 families ship in light and dark modes: `cloud`, `bitsandbolts`,
  `brutus`, `forest`, `winter`, `coffee`, `bubblegum`, `inferno`, and `sober`.
- Bits and Bolts web icons use packaged Font Awesome Free Solid 7.3.1 through
  semantic roles. Other families retain Material Symbols.
- Catalog schema 2 publishes exact identity foreground pairs in both modes. All
  72 pairs pass 4.5:1 after serialization. V1 color paths are removed.
- Canonical typography, licensed fonts, Brutus native Ultra 400, Forest Hero
  leading, and semantic summary-card typography remain intact.

## Theme Workspace Ownership

- Themes remains the canonical-only gallery and read-only family-detail owner.
  It does not own or expose AppScreen user Theme projects.
- AppScreen owns user Theme behavior, persistence, Guest state, picker
  orchestration, and transient reference images while sharing the renderer.
- The Palette states its active mode, keeps compact cropped swatches, and places
  Auto-complete with its Select on one row.
- AppScreen uses tinted light Neutral and releases stale copied semantics on edit
  or load while preserving manual values and alpha scrims.
- Optional inspection policies expose full output after compact AppScreen detail.

## Accepted Gallery and Theme-Card Recipes

- One workspace-section recipe owns layout, disclosure, and divider rhythm.
- Global and User Theme sections consume that same recipe. User Theme cards keep
  the canonical card width and the same shared Theme-card composition.
- User Theme fallback shape, Button shape, and hover state inherit Cloud. Their
  cards omit the canonical art-direction label and use a fixed product-identity
  summary supplied by AppScreen.
- Theme cards consume semantic font roles across all text and controls with
  AppScreen-supplied Signature to Interface to Technical fallback.
- Bold, Italic, and Underline persist per role across cards and the Signature
  title. Canonical files publish all fields, and descriptions omit `Utility`.
- Fixed shared card rows keep the lower identity swatch and label region equal
  across canonical families and user Themes.
- Every canonical card title consumes its actual Signature family through the
  application-agnostic `displayLarge` role.

## Accepted Theme Detail and Floating Windows

- The toolbar centers a Signature title and semantic pencil without clipping.
- One floating form owns naming, media picking, and optional secondary confirmation.
- Editable translucent colors derive valid opaque native-control bases while
  retaining their alpha representation.
- `displayLarge` replaces the use-specific `marketingHero` contract name across
  authored families, generated outputs, components, showcase, and documentation.

## Accepted Workspace Account and Entry Recipes

- One product-neutral workspace-settings recipe owns Account page structure,
  sections, rows, status, forms, simulation controls, and responsive layout.
- Shared workspace brand presentation is smaller while workspace tabs use the
  accepted larger height, padding, and tablist grouping.
- The navbar action consumes the Signature family at title size with bold and
  persistent Signature variants. Ordinary navigation links remain Interface.
- Product Entry icon selectors use the exact shared semantic-icon ancestor.

## Accepted Media, Reference, and Font Recipes

- Themes owns media preview cards, add cards, picker layout, reference-image
  presentation, and all semantic media icon mappings.
- One media-card base owns full Vault and reduced picker siblings for every media.
- Reduced cards never show format or metadata pills. Reduced font cards also omit
  the lower body, use a 56 px preview, and share the widest rendered family width.
- Signature, Interface, and Technical rows show one centered family-name specimen.
  Bold, Italic, and Underline are persistent semantic-vector controls.
- Reference presentation owns semantic controls, exact Fit, and safe framing.

## Accepted Shared Presentation Corrections

- Landing recipes consume semantic typography roles. Bits and Bolts display copy
  retains Orbitron. Brutus uses native Ultra 400 without browser-synthesized heavy
  weight or hardcoded positive display tracking.
- Selection Controls declares its semantic-icons dependency, and shared placement
  ignores horizontal clipping so Theme Open renders its complete option list.
- One resizable-toolbar component owns both top and side handles. A 9 px stripe,
  96 px by 3 px grip, equal subtle divider lines, and grid centering are shared;
  `aria-orientation` is the only visual variant.
- Shared workspace surfaces preserve the accepted dark, almost-black background
  role instead of introducing product-local blue wrappers.
- Account headers center titles independently and align Back to the content gutter.

## Shared Recipes and Icons

- Every icon-like affordance uses a Themes-owned role; text glyphs, CSS text content, and consumer artwork remain forbidden.
- Source, `dist/web`, and `docs` remain synchronized.

## Evidence and Acceptance Boundary

- AppScreen focused account checks pass 16/16 and its production build passes.
  Themes account-funnel checks pass 3/3 and the Themes build passes.
- The owner accepted workspace Account presentation, Guest project creation
  windows, larger workspace tabs, compact brand, and bold Signature navbar action.
- The earlier Theme authoring and gallery checkpoint remains accepted.
- The owner accepted the account-funnel recipe and bounded polish as good enough
  for this local checkpoint. It is not pushed or deployed.

## Open Gates

- No next work is selected; wait for owner direction.
- DTCG resolver validation, full provenance, glyph and fallback checks, platform
  adapters, and versioned distribution remain future owner-directed work.

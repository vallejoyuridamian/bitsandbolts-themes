# Bits and Bolts Themes: Status

Last verified: 2026-08-18

## Current Truth

- This public repository is the canonical visual owner for Bits and Bolts
  products. Tokens, components, fonts, licenses, semantic icons, platform assets,
  catalog data, and committed generated outputs live here.
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
- User Themes live in AppScreen Studio. AppScreen owns project behavior,
  persistence, guest state, picker orchestration, and transient reference images.
- Gallery and AppScreen share one Theme renderer. Standalone detail keeps the
  full showcase; AppScreen defaults to compact Colors and Typography detail.
- The Palette states its active mode, keeps compact cropped swatches, and places
  Auto-complete with its Select on one row.
- The transient Full UI showcase and Color ramps and diagnostics switches are
  optional renderer policies. They expose the shared complete composition after
  compact AppScreen detail without changing the standalone gallery.

## Accepted Gallery and Theme-Card Recipes

- One workspace-section recipe owns transparent section layout, divider rhythm,
  heading spacing, disclosure behavior, and closed-only count presentation.
- Global and User Theme sections consume that same recipe. User Theme cards keep
  the canonical card width and the same shared Theme-card composition.
- User Theme fallback shape, Button shape, and hover state inherit Cloud. Their
  cards omit the canonical art-direction label and use a fixed product-identity
  summary supplied by AppScreen.
- Theme cards consume semantic Signature, Interface, and Technical font roles
  across all text and controls. AppScreen supplies missing-role fallback from
  Signature to Interface to Technical.
- Bold, Italic, and Underline persist per role across cards and the Signature
  title. Canonical files publish all fields, and descriptions omit `Utility`.
- Fixed shared card rows keep the lower identity swatch and label region equal
  across canonical families and user Themes.
- Every canonical card title consumes its actual Signature family through the
  application-agnostic `displayLarge` role.

## Accepted Theme Detail and Floating Windows

- The toolbar centers a Signature title and semantic pencil without clipping.
- One floating form owns confirmation, naming, and media-picker structure.
- Editable translucent colors derive valid opaque native-control bases while
  retaining their alpha representation.
- `displayLarge` replaces the use-specific `marketingHero` contract name across
  authored families, generated outputs, components, showcase, and documentation.

## Accepted Media, Reference, and Font Recipes

- Themes owns media preview cards, add cards, picker layout, reference-image
  presentation, and all semantic media icon mappings.
- One media-card base owns checker, typography, borders, preview, favorite, and
  add-card rules. Full Vault and reduced picker cards are explicit siblings for
  image, audio, video, device, and font media.
- Reduced cards never show format or metadata pills. Reduced font cards also omit
  the lower body, use a 56 px preview, and share the widest rendered family width.
- Signature, Interface, and Technical rows show one centered family-name specimen.
  Bold, Italic, and Underline are persistent semantic-vector controls.
- Reference presentation owns Swap, Zoom out, Fit, Zoom in, and Remove controls,
  exact Fit framing, scrollbar clearance, and contrast-safe toolbar roles.

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

## Shared Recipes and Icons

- Every icon-like affordance routes through a Themes-owned semantic role and
  provider mapping. Text glyphs, CSS text content, and consumer artwork are forbidden.
- Source, `dist/web`, and `docs` remain synchronized.

## Evidence and Acceptance Boundary

- Focused Themes variant and Select checks pass 16/16. The corrected AppScreen
  canonical-copy recovery and editor-click persistence checks pass 2/2.
- Themes and AppScreen production builds pass. Repository diff checks pass before
  closeout docs. Sites was not changed in this checkpoint.
- The owner accepted shared Open behavior, saved variants, variant-aware cards and
  title, and canonical descriptions without `Utility`.
- Any later UI, CSS, Theme, icon, or renderer change requires fresh acceptance.
- This checkpoint is closed in a local repository commit. Nothing is pushed or
  deployed.

## Open Gates

- No implementation is preselected. Wait for the owner's next direction.
- DTCG resolver validation, full provenance, glyph and fallback checks, platform
  adapters, and versioned distribution remain future owner-directed work.

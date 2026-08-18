# Bits and Bolts Themes - Changelog

Keep new changes easy to scan at the top.

---

## Session wrap-up (2026-08-18) - Project replacement confirmation accepted

### What changed
- Extended the canonical floating-window confirmation recipe with an optional
  secondary action and independent destructive presentation.
- Kept Cancel and primary confirmation behavior unchanged when no secondary
  action is requested.
- Synchronized the source component, generated web output, and documentation
  output. AppScreen uses the recipe for signed-in Discard Changes beside Save
  Project; Guest receives only Cancel and destructive Discard Changes.

### Acceptance and boundary
- Themes confirmation checks pass 2/2 with exact generated-source parity.
  AppScreen focused creation checks pass 45/45 and its production build passes.
- The owner accepted the AppScreen Guest creation flow. Nothing was pushed,
  deployed, published, or activated.

## Session wrap-up (2026-08-18) - Account workspace and Guest entry accepted

### What changed
- Added a product-neutral workspace-settings recipe for full-page Account
  composition, including sections, rows, statuses, forms, private simulation
  controls, destructive panels, loading state, and responsive behavior.
- Added shared compact workspace branding, larger workspace tabs, one grouped
  tablist owner, and an action slot that can switch Account into Sign in without
  creating a separate consumer button group.
- Updated the shared navbar action to use the Signature family at title size with
  bold and persistent Signature variants. Ordinary navigation links retain their
  Interface typography.
- Updated Product Entry descendants to target the exact semantic-icon ancestor.
- Rebuilt and synchronized source, `dist/web`, and `docs` outputs.

### Acceptance and boundary
- Focused AppScreen Guest, Account, experience, route, and Open checks pass 20/20.
  Themes and AppScreen production builds pass and generated outputs match source.
- The owner accepted the final larger bold Sign in action and workspace chrome.
  Nothing was pushed, deployed, published, or activated.

## Session wrap-up (2026-08-18) - Theme authoring closure accepted

### What changed
- AppScreen now consumes the existing mode-neutral ramp contract correctly:
  light Neutral uses primary-tinted step 50 instead of the absolute-white surface
  pole, while dark Neutral remains at step 950.
- Canonical user copies retain exact source semantics until an identity changes.
  AppScreen then releases still-source generated semantics so Buttons, headline
  action copy, hover states, and other consumers follow the edited palette.
- Existing edited copies migrate during load. Manual semantic edits and alpha
  scrims remain preserved. No Themes source or generated output changed.

### Acceptance and boundary
- The focused AppScreen Theme model suite passes 20/20 and the final diff check is
  clean. The owner accepted existing Bits and Bolts and Brutus copies in light
  and dark modes. Nothing was pushed or deployed.

## Session wrap-up (2026-08-18) - Theme variants and shared Open accepted

### What changed
- Added a shared Theme typography variant contract for Bold, Italic, and Underline
  across Signature, Interface, and Technical roles. Canonical families and the
  generated catalog now publish every value explicitly.
- Applied saved variants to Typography specimens, semantic Theme-card content,
  card titles, and the centered Signature Theme name. Existing documents retain a
  safe legacy weight-derived default when explicit values are absent.
- Corrected shared Select placement so horizontal-only overflow does not act as a
  vertical menu boundary. AppScreen Theme Open now exposes the same complete list
  behavior already shared by Screens and Scenes.
- Removed `Utility` from the eight affected canonical art-direction descriptions.

### Acceptance and boundary
- Focused Themes variant and Select checks pass 16/16. Corrected AppScreen
  canonical-copy recovery and editor-click persistence checks pass 2/2. Themes
  and AppScreen production builds pass, and generated outputs are synchronized.
- The owner accepted the result. Nothing was pushed or deployed. Sites was not
  changed in this checkpoint.

## Session wrap-up (2026-08-18) - Theme creation surfaces accepted

### What changed
- Centered a larger Signature Theme title in the existing detail toolbar and
  exposed shared layout support for a semantic pencil action without clipping.
- Made every canonical card title consume its actual Signature family, including
  Bits and Bolts, across the source gallery and generated GitHub Pages output.
- Added shared floating-window panel and form abstractions for handle, close
  action, title, description, field, validation, and actions. Confirmation,
  naming, and handled media-picker examples now use the same hierarchy.
- Replaced the use-specific `marketingHero` typography contract with the
  application-neutral `displayLarge` role across families, components, tests,
  generated platform output, the showcase, and documentation.
- Made translucent serialized semantic colors safe for native editable color
  inputs by deriving an opaque control base while preserving alpha representation.

### Acceptance and boundary
- Focused Themes media and shared-surface checks pass 13/13. The Themes production
  build and repository diff check pass, and generated `dist` and `docs` outputs
  are synchronized.
- The owner accepted the exact Theme title, card Signature, floating-window,
  application-neutral typography, and color-input result. Nothing was pushed or
  deployed. Sites was not changed in this checkpoint.

## Session wrap-up (2026-08-17) - Theme gallery and shared UI checkpoint accepted

### What changed
- Added the shared workspace-section recipe used by AppScreen's conditional Global
  Themes and User Themes sections, with transparent divider presentation,
  canonical card widths, heading spacing, and closed-only count badges.
- Extended the canonical Theme-card composition for user-authored Theme inputs.
  Shared rows align the identity strip, semantic font roles cover every text and
  control, and Cloud supplies fallback card, Button, and hover shape.
- Added optional full-showcase and color-diagnostics policies to the shared Theme
  renderer so AppScreen can inspect complete UI and ramp output after its compact
  detail without changing the public repository gallery.
- Corrected shared landing typography roles. Bits and Bolts display surfaces keep
  Orbitron, while Brutus uses native Ultra 400 without synthesized weight or
  hardcoded wide tracking. Selection Controls now declares its semantic-icon
  dependency for managed Product Entry.
- Unified horizontal and vertical workspace resizers under one Themes-owned
  toolbar-handle recipe with a 9 px stripe, 96 px by 3 px centered grip, equal
  subtle divider lines, and orientation as the only variant.

### Acceptance and boundary
- Focused Themes checks pass 12/12, final AppScreen Theme and handle checks pass
  23/23, Sites Product Entry checks pass 3/3, and all three production builds pass.
- The owner accepted the final gallery, cards, landing typography, dependency,
  and shared handle presentation. Nothing was pushed or deployed.

## Session wrap-up (2026-08-17) - Shared font picker presentation accepted

### What changed
- Extended the canonical Theme Typography composition with Themes-owned add tiles
  and replaceable Signature, Interface, and Technical family specimens while
  retaining transient Bold, Italic, and Underline controls.
- Formalized one common media-card base with explicit full Vault and reduced picker
  siblings. Image, video, audio, device, and font pickers consume the same reduced
  presentation, which never emits metadata or format pills.
- Kept font-specific specialization at the shared owner: all font grids use the
  widest rendered family width, reduced font cards omit the duplicate lower name
  body, and their accepted preview height is 56 px. Full Vault font cards retain
  their 120 px preview and ordinary metadata body.
- Updated the standalone specimen and synchronized source, `dist/web`, and `docs`
  outputs. AppScreen retains all picker behavior, Vault data, upload, references,
  assignments, and persistence.

### Acceptance and boundary
- The owner accepted the final shared picker, assignment composition, pill-free
  reduced cards, shared font widths, and compact body-free font presentation.
- The focused Themes suite passes 8/8, corrected AppScreen picker and presentation
  checks pass, both production builds pass, and repository diff checks pass.
- This checkpoint commit was authorized. Nothing was pushed or deployed. Detach,
  render parity, Screens and Scenes adoption, and hosted font work remain separate.

## Session wrap-up (2026-08-16) - Exact identity pairs and V1 retirement implemented

### What changed
- Added an exact foreground token to Primary, Secondary, Accent, and Neutral for
  all nine families in both modes. Catalog entries include the pair, token, and
  serialized contrast ratio, while web outputs publish exact identity variables.
- Preserved every authored foreground that already passed 4.5:1. Repaired 8
  Primary or Secondary pairs and 4 Accent fallback candidates with family tokens
  or role-colored ramp values. All 72 canonical pairs pass, with 59 palette-derived
  foregrounds and 13 deliberate literal black or white values.
- Added structured DTCG color serialization and a generated-CSS guard so an object
  value cannot silently invalidate Menu or floating-window backgrounds again.
- Removed authored V1 color blocks, generated V1 web variables, top-level
  catalog modes, gallery fallbacks, and consumer references. Android and React
  Native generation now consume the V2 semantic and identity contract directly.
- Updated Selection Controls and Theme detail recipes so text placed on exact
  Neutral uses its exact foreground, including AppScreen live picker preview.
- Projected live Neutral foreground/background and Primary interaction roles at
  the Theme root. The shared Select controller carries the resolved roles and active
  font into its body-portaled menu, preserving one canonical interface state.

### Acceptance and boundary
- The Themes build and `pnpm dev` health check pass without generator warnings.
  AppScreen affected checks pass 83/83, its build passes, and V1 searches are empty.
- The owner accepted the exact-pair, Neutral completion, Theme-root Select, font
  Select, portaled menu, and handled-window result. A local checkpoint commit was
  authorized; nothing was pushed.

## Session wrap-up (2026-08-16) - Palette completion recipe accepted

### What changed
- Extended the canonical Selection Controls recipe with disabled Select state
  support and added optional palette-completion composition to the shared Theme
  detail renderer.
- Kept the control absent until AppScreen supplies a selected Primary. The same
  renderer continues to own standalone, read-only, and editable Theme details.
- Preserved exact identity swatches, Neutral background ownership, typography,
  icon recipes, and the complete standalone showcase.

### Acceptance and boundary
- The owner accepted the final AppScreen creator result. Focused AppScreen checks
  pass 56/56, the AppScreen build passes, and the preceding Themes build passed.
- The next authorized slice compares all canonical families before adding exact
  identity foreground pairs and retiring superseded v1 color paths. Nothing was pushed.

## Session wrap-up (2026-08-16) - Focused AppScreen Theme presentation accepted

### What changed
- Kept one shared Theme detail renderer and added an explicit showcase policy.
  Standalone Themes details retain the full reusable recipe showcase, while
  AppScreen read-only and creator details end after Colors and Typography.
- Added the Themes-owned Neutral fallback application used while an AppScreen
  Theme has no selected Neutral. The fallback affects presentation only and does
  not select, persist, or mutate the Theme project.
- Preserved shared Colors and Typography markup for both consumers. AppScreen
  received no local hide CSS, copied renderer, or presentation override.

### Acceptance and boundary
- The owner accepted the final state. The Themes build and AppScreen focused
  renderer checks 17/17 pass, generated outputs match source, and diff checks pass.
- Typography values, color generation, project models, persistence, diagnostics,
  blockers, reset paths, and guest gates remain unchanged. Nothing was pushed.

## Session wrap-up (2026-08-16) - Showcase standardization and consumer parity accepted

### What changed
- Bound every Theme detail to its mode's exact Neutral identity, removed the grid
  and artificial specimen frames, and standardized safe shared recipes under one
  themed section-title hierarchy.
- Expanded semantic-role coverage, clarified Select/Menu states versus used
  Selection Controls, retained the used Lab horseshoe recipe, and removed the
  handled-window specimen's checkerboard.
- Declared the gallery's complete component dependency set in its owning stylesheet.
  Standalone Themes and embedded AppScreen now render the same enriched text,
  card rails, editorial layouts, and segmented controls.
- Allowed text-effect glow to render without clipping and neutralized consumer
  button minimum height inside the segmented-control recipe.

### Acceptance and boundary
- The owner accepted the final visual state. The Themes build, AppScreen focused
  gallery checks 16/16, and repository diff checks pass.
- Typography, color behavior, models, persistence, diagnostics, reset paths,
  guest gates, and parked product areas remain unchanged. Nothing was pushed.

## Session wrap-up (2026-08-16) - Theme gallery identity alignment accepted

### What changed
- Let Theme detail fill its workspace, reduced only the identity-card add icons,
  and fixed gallery headlines to four lines so card sections and buttons align.
- Aligned each saved mode identity with the card it already presented: Primary
  drives the primary button and `matters.`, Secondary drives the secondary button,
  Neutral drives the background, and Accent drives the mode circle.
- Removed the Bits and Bolts neon primary-button exception. Where an old Secondary
  was displaced by the visible button color, moved it to Accent when useful.
- Enforced all four identities as distinct during generation without changing
  semantic role values, persistence, generation, typography, or other products.

### Acceptance and boundary
- The owner accepted the focused visual state. The Themes build, AppScreen gallery
  checks 15/15, and repository diff checks pass.
- Theme standardization continues only through the next owner-directed slice.
  Typography has not started. Nothing was pushed.

## Session wrap-up (2026-08-15) - Theme projects and handled windows accepted

### What changed
- Removed the standalone Themes editor, local server, bespoke chrome, saving path,
  and package entry point. User Theme projects now belong to AppScreen Studio and
  share the same read-only/editable Theme detail root.
- Added the canonical handled floating-window shell, grip, small glowing semantic
  close control, centered confirmation composition, stable danger treatment, and
  action buttons. The accepted spacing balances the original and compact drafts.
- Added the exact handled-window specimen to every Theme detail viewer using the
  same shell and confirmation functions plus each theme's configured icon provider.
- Kept the visible Open popup on the canonical Select/Menu recipe and the Open
  action on the normal workspace semantic-button path with packaged Font Awesome
  Solid `folder_open` artwork for Bits and Bolts.
- Generated matching `dist/web` and documentation component outputs. AppScreen now
  uses the handled window for dirty drafts, item deletion, and Screen-set,
  video-project, and Theme-project deletion without native delete confirmations.

### Acceptance and boundary
- The owner accepted the final handled window and its Theme-viewer specimen, along
  with the Open control and palette direction accepted earlier in the slice.
- Latest focused window/viewer checks pass 18/18, the preceding integrated run
  passed 32/32, and both Themes and AppScreen builds pass.
- Broader Theme workflow browser acceptance remains pending. Nothing was pushed;
  remaining legacy Dialog consumers stay outside this checkpoint.

## Session wrap-up (2026-08-14) - Workspace chrome accepted

### What changed
- Added canonical workspace topbar, tab, control-bar button, semantic toolbar
  icon, checkerboard stage, selected preview frame, and add-tile recipes.
- Added theme contract roles for stage checker colors and selection signals
  across all nine families, preserving the accepted Bits and Bolts dark values.
- Added Font Awesome Solid mappings and generated assets for save, undo, redo,
  zoom out, fit, and zoom in while retaining Material Symbols in other families.
- Added the complete workspace specimen to every theme detail showcase and
  regenerated web, Android, React Native, catalog, and documentation outputs.
- AppScreen Studio now consumes these recipes directly, and its embedded gallery
  loads the same semantic icon assets as the standalone showcase.

### Acceptance and boundary
- The owner accepted the standalone specimen, embedded gallery parity, live
  Studio consumption, and the restored glow-only hover without a border leak.
- The final Themes build passes and AppScreen's focused guest UI contract passes
  9/9. No browser automation, deployment, publication, or push ran.
- Further AppScreen presentation consolidation remains a future bounded slice.

## Session wrap-up (2026-08-14) - Managed My Website UI completed

### What changed
- Added abstract Themes-owned content layouts, cards, media/copy sections,
  information panels, timelines, prose, question lists, form fields, spotlight
  media, store badges, inline vector icons, and text effects.
- Replaced My Website-specific service and roadmap presentation with those
  reusable recipes and generated matching `dist` and documentation outputs.
- Added the shared presentation required by the managed About, Portfolio,
  Roadmap, Services, FAQs, Quote, and six live portfolio detail pages.
- Matched the source detail-page image, copy, typography, spacing, external-link
  icon, CTA, and NeuroSharp store-badge presentation. The detail title explicitly
  uses normal letter spacing to match the live React source.

### Acceptance and boundary
- The owner accepted all 13 managed My Website pages at the final visual
  checkpoint. Themes builds successfully; Sites passes 41/41 tests and build;
  the focused portfolio-detail checks pass 3/3.
- The original React site remains the unchanged visual and copy reference.
- No deployment, publication, route mutation, package publication, or push ran.

## Session wrap-up (2026-08-12) - Brutus and Forest families

### What changed
- Added Brutus and Forest as complete v2 light/dark theme families with their
  authoritative colors, radius, and declared typography.
- Added independent B&B semantic mappings, Button recipes, interface roles,
  catalog entries, and generated web, Android, React Native, docs, and showcase
  outputs for both families.
- Bundled DM Sans, Space Mono, Merriweather, and Source Code Pro from official
  OFL sources. Montserrat remains the Forest interface family.

### Acceptance and boundary
- The owner accepted both families as useful initial checkpoints. The focused
  Themes build passes with all six families.
- Reusable component recipes are original Themes-owned implementations. Roles
  absent from the family foundations are explicit Themes-owned derivations.
- Detailed browser refinement remains owner-owned. No push, publication,
  deployment, or consumer mutation ran.

## Session wrap-up (2026-08-11) - Navbar second consumer accepted

### What changed
- Migrated managed Cloud Clipboard from Sites-owned topbar markup to the
  canonical Themes Navbar without consumer CSS or changes to its routes/content.
- Added nested theme scope, external-brand behavior, actionless desktop/compact
  alignment, and a self-contained scrollbar dependency to the shared recipe.
- Hide-on-scroll now reserves `--bb-navbar-height` by default; the accepted My
  Website hero explicitly selects overlay while Cloud Clipboard uses the default.
- The Themes showcase now uses an exact copy of My Website's accepted
  black-background favicon.

### Acceptance and boundary
- The owner accepted Cloud Clipboard and revalidated My Website across desktop,
  compact, hide-on-scroll, and content-spacing behavior.
- Themes generation, the combined 7/7 Sites consumer contracts, generated
  source/`dist/web`/`docs` equality, and repository diff checks pass.
- Sites still owns a transitional header-model adapter plus explicit placement
  and CSS/JavaScript includes. Declarative dispatch remains a separate next slice;
  Footer migration and compact-rule deduplication remain separately gated.
- No deployment, publication, route mutation, version change, push, or external
  mutation ran.

## Session wrap-up (2026-08-11) - Canonical Navbar accepted

### What changed
- Added the Themes-owned reusable Navbar markup, CSS, and controller with static,
  sticky, hide-on-scroll, and responsive internal-side-panel behavior.
- The gallery uses that same renderer across local development, generated GitHub
  Pages, and AppScreen; managed My Website JSON is the first accepted consumer.
- Sites no longer hand-builds the managed homepage navbar or owns its behavior.

### Acceptance and boundary
- The owner accepted the managed homepage and gallery. Themes generation, Sites'
  30/30 checks plus build, and AppScreen's 9/9 gallery contract pass; generated
  source, `dist/web`, and `docs` Navbar/gallery artifacts match.
- Studio and Cloud Clipboard navigation are unchanged. Placement and asset
  wiring remain explicit in Sites, so full JSON dispatch is a separate slice.
- No deployment, publication, version change, route mutation, or push ran.

## Session wrap-up (2026-08-10) - Portfolio recovery baseline committed

### What changed
- Locked the owner-accepted managed homepage after restoring the alternating
  roadmap layout and the shared testimonial/NeuroSharp image fade.
- Removed failed-refactor navbar, signature-icon, carousel, and local-flag
  artifacts instead of preserving dead generated output or dependencies.
- Kept the accepted inline vector UI icons and lightweight 64x48 review flags;
  no emoji or Unicode text glyph was introduced as a UI icon.

### Verification and next boundary
- Themes generation, the accepted Sites asset/build gate, the focused AppScreen
  Pages gate, and AppScreen's production build pass.
- Future canonicalization starts from this commit and moves one visual element at
  a time: navbar first, owner acceptance, then its own commit. The rejected B&B
  v2 specimen family is not the visual reference except for the cut-out button.
- No deployment, publication, route mutation, package publication, or push ran.

## Session wrap-up (2026-08-10) - Managed portfolio homepage accepted

### What changed
- Added the canonical `portfolio-home` recipe and generated assets used by the
  managed My Website homepage, preserving the original responsive composition,
  typography boundaries, mobile drawer, carousels, roadmap, CTAs, and footer.
- Added the minimal portfolio semantic color roles required by the source
  composition and kept reusable visual ownership in Themes.
- Replaced every UI-icon substitute with proper vectors or original assets.
  Carousel controls use vector outlines derived from the original bold system
  glyph geometry; stars are SVG artwork, never emoji UI icons.

### Acceptance and boundary
- The owner accepted the desktop and narrow managed homepage as good enough and
  locked this checkpoint without claiming pixel-perfect parity.
- Themes and Sites builds pass. The original React homepage remains untouched as
  the visual reference.
- No version, package publication, deployment, route mutation, commit, or push
  occurred. Cross-site navbar homogenization awaits a fresh owner instruction.

## Session wrap-up (2026-08-10) - Canonical gallery correction

### What changed
- Made the shared gallery top bar itself render the canonical Select trigger and
  Menu recipe instead of leaving native selects as the visible controls.
- Applied the canonical workspace role to the gallery/showcase surface; Bits &
  Bolts Dark resolves it to AppScreen's exact `#0f1415`. Header/control chrome
  continues to use the canonical app background role.

### Verification and boundary
- Themes generation, AppScreen's 16 focused Themes/Pages contracts, AppScreen's
  production build, and both repository diff checks pass.
- Browser acceptance remains owner-owned. No deploy, publish, route, Access,
  version, Cloud Clipboard, commit, or push operation occurred.

## Session wrap-up (2026-08-10) - One shared theme showcase owner

### What changed
- Moved the complete gallery renderer from AppScreen into Themes and reduced the
  product to a one-line adapter to that canonical owner.
- Replaced the independent legacy GitHub preview with a generated `docs/` bundle
  using the same catalog, renderer, CSS, fonts, icons, and brand assets.
- Added `pnpm dev` for the local showcase, fixed selector overflow, compacted the
  Bits & Bolts-themed shell, and removed the internal Art direction section.

### Verification and next boundary
- Themes build and local asset delivery pass; AppScreen's focused gallery checks
  pass 15/15 and its production web build resolves the shared renderer.
- Next, extract AppScreen's accepted workspace background, dropdown/select, shared
  hover-state, and context-menu visuals into canonical theme recipes. Keep this a
  transition patch where possible; no theme-version bump is approved yet.
- No GitHub Pages publication, commit, push, route, Access, or Cloud Clipboard
  mutation occurred.

## Session wrap-up (2026-08-10) - First app-owned site publication accepted

### What changed
- Finalized the accepted theme-owned `Publish online` control and preserved one
  presentation for local and hosted AppScreen.
- Kept route mutation in AppScreen/Sites while managed Cloud Clipboard delivery
  consumes the canonical generated Slate Dark and Bits & Bolts Dark assets.

### Verification
- The owner completed the first app-driven publication without manual cutover.
- Canonical route readback reports public delivery enabled, and the managed HTML
  plus stylesheet both return 200 with accepted styling.
- No package publish or push occurred.

## Session wrap-up (2026-08-10) - Pages publication control acceptance

### What changed
- Kept the managed-draft publication action below the shared selectors with the
  original dark subtle-gradient toolbar treatment.
- Removed the idle description, changed the label to `Publish online`, and used
  the canonical light foreground token instead of cyan text.
- Preserved the same theme-owned presentation for local and hosted AppScreen;
  route activation remains an AppScreen/Sites behavior concern.

### Verification
- The owner accepted the control in local and hosted Pages.
- The focused AppScreen Pages checks passed 5/5 and the Themes build passed.
- No package publish, commit, push, or public route mutation is implied.

## Session wrap-up (2026-08-08) - Theme contract v2 web reference

### What changed
- Ratified the deep-research architecture: DTCG 2025.10 as the portable
  value/resolution substrate and a separate B&B contract for recipes, art
  direction, assets, fallbacks, validation, provenance, and overrides.
- Added the B&B v2 light/dark reference with four identity colors, 48 semantic
  roles, fourteen text styles, exact primary/mono/accent families, visual
  grammar specimens, and the declarative Button recipe.
- Added generated catalog data plus theme-owned Product Entry, Theme Gallery,
  Page Gallery, Selection Controls, Button v2, and typography recipes.
- Standardized AppScreen Themes and Pages selectors through one shared recipe;
  Pages previews one real landing directly with no metadata bar or nested scroll.
- Declared base tokens as generator defaults and family tokens as authoritative
  overrides, removing collision warnings without changing generated output.

### Verification
- `pnpm build` passed without token-collision warnings.
- All 94 generated artifact hashes were unchanged by the override correction.
- AppScreen's focused Themes/Pages tests and production build passed.
- No package publish, deployment, push, or external mutation occurred.

## Session wrap-up (2026-06-25) - Bits & Bolts brand theme

### What changed
- Added the `bitsandbolts` theme with light, dark, and icon token files.
- Added generated web CSS for the `bitsandbolts` theme.
- Added Montserrat and Orbitron web font assets and copied them into the web distribution folder.
- Updated the theme build list so `bitsandbolts` is built with the other themes.
- Extended the build script to copy web font assets into `dist/web/fonts`.
- Documented `bitsandbolts` in the README theme table.

### Verification
- JSON token files parsed successfully.
- `node --check build.js` passed.

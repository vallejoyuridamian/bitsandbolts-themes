# Bits and Bolts Themes: Status
Updated: 2026-09-26

## Current Checkpoint

- Owner authorizes this paired local checkpoint commit with Studio. Preserve the
  accepted rendering result; Studio next closes M1 interaction gates, then M2.
  No source changes, fresh browser run, push or deployment during finalization.

- The shared viewport surface now has a composed-background modifier. Studio
  activates it only after its unified background/artwork composition presents.
  Source/web/docs generation and exact parity pass; the 39 existing token
  warnings remain separate. Studio owns the full-gallery trial everywhere and
  accepted iPhone visuals: complete rendering, smooth scrolling, no flicker.
  Native-resource gates remain open. No new Themes canvas or renderer.

- Studio M1 fourth phone trace proves editable font inflation under CSS zoom:
  136 px becomes 430 px when WebKit supplies text-size-adjust:none. The shared
  Text/dynamic artwork recipe now keeps text-size-adjust:auto across selection.
  One Themes build and exact source/web/docs parity pass. Studio's eleven
  focused checks pass. The fifth iPhone run accepts text and hull box size.
  The latest iPhone run accepts complete backgrounds and flicker-free swipes.
  Studio owns remaining interaction proof and M2 uneven hull stroke.
- Shared authored text/shape/dynamic and composed-pixel recipes preserve native
  hit order; only visual children become transparent after composition.
- Paired Studio v69 checkpoint: the owner accepts iPhone multi-Device stability
  and remaining brief paint flicker. Shared containment, viewport and Device
  diagnostic recipes are preserved unchanged. This is not production cutover
  or complete editor parity: interaction proof, Device shadows and hull stroke
  remain Studio migration gates. The controlling sequence is
  `../appscreen-studio/docs/RENDERING_ARCHITECTURE_MIGRATION_PLAN.md`.
  M1 desktop exposure and initial owner audit are complete. Existing
  Studio stage positioning moved into `bb-layout-world-stage`; the shared
  `bb-layout-world-layer` recipe replaces six identical injected layer rules.
  Values are preserved. Themes build and source/web/docs CSS parity passed;
  Studio's focused parent-stage check passed. The owner reports zoom lag,
  uncertain alignment, intermittent hull paint and known image/Device stacking
  failure; otherwise LGTM. Studio's plan records these gates and stacking next.
  Full migration visual acceptance remains open.
- AppScreen's owner-authorized LAN-only v66 iPhone gallery-paint comparison
  uses the generic `bb-layout-world-stage` containment recipe and its
  `--no-paint-containment` modifier. The default remains `contain: layout paint`;
  only the flagged diagnostic stage uses `contain: layout`. Source, generated
  web, and documentation CSS match after one Themes build. The owner reports
  faster incoming 2D content on iPhone, but it still paints during swipes.
  AppScreen owns the physical-phone result. Production remains on the default
  recipe. The owner approved a LAN-only constant-scale CSS `zoom` comparison
  for the live 2D stage and viewport backgrounds; AppScreen owns its geometry
  and iPhone result. The existing viewport background declarations moved into
  the new generic `bb-layout-viewport-surface` recipe without changing their
  values. Themes generation and source/web/docs CSS parity passed.
- AppScreen's owner-approved LAN-only Device v56 compositing test uses a generic
  `bb-layout-render-surface--geometry-probe` transform recipe while retaining
  the existing Device surface role. The `/gl` version label now uses a generic
  Themes diagnostic recipe. AppScreen owns the exact geometry, render output,
  and physical-phone evidence. Themes generation and source/web/docs CSS parity
  pass. Production presentation remains unchanged.
- AppScreen's owner-authorized LAN Device shadow comparison uses a generic
  `bb-layout-render-surface--no-shadow` modifier. Its default Device shadow
  recipe remains unchanged; only the named diagnostic canvas opts into the
  modifier. Themes generation and source/web/docs parity passed. The physical
  iPhone acceptance belongs to AppScreen.
- AppScreen's v39 LAN paint split uses the generic
  `bb-layout-render-surface--paint-suppressed` modifier. Its default output
  remains visible; the flagged diagnostic keeps its output canvas connected
  and drawn while suppressing browser paint. Themes generation and exact
  source/web/docs parity passed. AppScreen owns the comparison.
- An iPhone Safari LAN Guest diagnostic proved an early font registration race
  in `components/theme-readiness.js`. All 16 initial `document.fonts.load`
  calls resolved with zero faces while the font set had zero registered faces;
  the same visit later registered 40. `waitForThemeFonts` returns false and the
  page remains hidden by readiness CSS. AppScreen's Guest Phase 4 plan owns
  the acceptance sequence. The owner forbids retrying this deterministic bug.
  The last AppScreen LAN probe found Typography loaded, but semantic-icons CSS
  lacked a sheet and three enabled stylesheet load events were pending at the
  first font call. All eight load by 115 ms; 40 faces are registered by page
  load at 121 ms. Initial readiness now waits for page load before one font
  check, with no retry. The focused test and Themes build pass, with source,
  generated web and documentation copies matching. Guest iPhone acceptance
  remains open. The owner-confirmed rebuilt `/hello` page now displays on iPhone;
  two logged loads show readiness resolving true, all 16 font queries finding
  one face each, and 40 registered faces. This test page omits readiness CSS,
  so the full landing was unverified at that stage. Workspace UI strategy now allows a stable fallback presentation
  when required resources fail or readiness stalls. No fallback UI has been
  implemented in this correction; deterministic startup causes remain the
  priority.
- The owner confirmed the real LAN landing appears on iPhone; its readiness
  settled at 3042 ms. The owner authorized icon-only branding in Studio's
  narrow top bar so navigation buttons have more space. The exact Themes
  workspace brand recipe now selects the 36 px mark at widths through 760 px
  and drops the 188 px reserved wordmark width. Studio consumes the recipe.
  Themes generation and source/web/docs parity and focused AppScreen checks
  pass. A later iPhone photo showed the tabs clipped under the handle despite
  the narrow mark. The recipe now puts the mark and scrollable tabs in one
  narrow grid row, with no second horizontal scroll container. The regenerated
  files match source and 14 focused Guest checks pass. Fresh LAN composition
  and owner visual approval remain open.
- A shared one-second attention pulse now owns the previously Animation-only focus glow. Animation cards retain the same presentation, and Cluna Studio's annotated voiceover editor consumes the same recipe after Emotion or Expression insertion. Source, generated web and documentation copies match. Seven focused consumer checks and the Themes build pass; the owner accepted the exact Guest consumer presentation in Phase 2.
- Floating-window content now has one shared explicit change event for requesting a fit after its own DOM mutation. AppScreen coalesces requests into one next-frame measurement, uses grow-only fitting for card changes, and resets height only for whole-card deletion. The contract does not observe window size, so resizing the window cannot feed another fit request. Source, generated web and documentation copies match; the Themes build and 37 focused consumer checks pass, and the owner accepted the exact Guest consumer presentation in Phase 2.
- The owner confirmed the shared Timeline origin correction. One `--timeline-content-inset` includes the canonical gutter, frame border and handle clearance. Embedded and main Timeline rails consume it; the embedded editor no longer substitutes container padding plus zero-gutter/full-width overrides. Nine focused AppScreen geometry/handle checks, generation and six exact source/web/docs comparisons pass. Audio scheduling and authored media are unchanged.
- The shared time-track and collapsed-range checkpoint is owner-accepted. AppScreen passed all 19 combined Phase 3/4/5 browser checks and its clean closing log. Themes generation and exact source/web/docs parity stand.
- Wide Video Demo 2 is locked at 99.78 s after complete local visual review, successful full media decode and a clean 226-record export window. The owner authorized the complete paired AppScreen and Themes checkpoint for local commit. Exact resulting hashes belong in AppScreen's ignored local `HANDOFF.md`. No push occurs.
- The owner-directed compact audio-control correction is implemented and awaits visual acceptance. One `audioTimingMarkup` recipe serves the embedded toolbar and Audio popovers through the existing inline numeric field, with matching typography and 68 px inputs. Toolbar Volume/Hold stay on one line and hidden fields retain canonical hiding. Two focused numeric-field checks, generation and exact source/web/docs parity pass. No other Themes feature cluster is active.

## Current Ownership and Contracts

- Themes owns tokens, components, fonts, semantic icons, brand assets, catalog data and committed generated outputs. Nine V2 families ship in both modes. AppScreen owns behavior, state, persistence, history, rendering and orchestration.
- Source components, `dist/web` and `docs/theme` are generated together and stay synchronized. The repository rules in `CODEX.md` govern shared controls and consumer boundaries.
- `bb-time-track-system` owns one content plane for backdrops, elements, overlays and playheads, with symmetric handle clearance. Neutral row layers add no time origin. Main Timeline and Video Editor share the recipe. One fixed collapsed shell serves plain ranges, editable media and all Audio subtypes; distinct transparent edge targets preserve routing.
- Theme save requires an authored color and font. Sparse assignments, transient ordered fallbacks, authored-only deduplicated choices and semantic project references remain. User Theme edits and renames retain stable identity; project-owned colors and fonts stay literal. Font availability and default-off variant selection remain independent.
- Theme grid cards retain 293 px geometry; font cards use the prepared 350 px recipe with no runtime label measurement. Prepared Regular SVG specimens serve browsing; actual selection loads the family. Browser and renderer share font aliases. Original fonts and licenses stay preserved.
- Catalog pickers share Themes search presentation. AppScreen owns the metadata index and input lifecycle, including 150 ms debounce, a 32-query cache and no search database requests. Chrome hover dwell is 400 ms.
- Cluna uses one brand-mark recipe across navbar/footer, workspace and loading/auth. Inner masking preserves the outer shadow. Expanded chrome uses the contained 188 x 36 outlined Studio wordmark; collapsed chrome uses only the mark. Preserve the original mark, prior assets and primary-color favicon. Domain and landing decisions remain owner-directed.
- Identity foregrounds, Select, mixed states, palette rows, Project color Add, Image Original, project information, Background, fixed overlays, arrangement, Geometry, Gap, Line endpoints and Icon cards retain their shared recipes. The control bar owns one section separator; project deletion uses the shared destructive action and semantic Delete icon.
- Layout editing shares numeric fields, labeled ranges, Text formatting, Text Style identity and mixed-state presentation. Shape Fill, Border, Width, None and continuous Roundness use those owners. Sharp, Soft, Rounded and Pill stops do not impose a global radius. Background Opacity uses the shared labeled percentage range.
- Coffee retains Besley signature typography and Roboto Slab interface typography in both modes. Static Safe areas remains accepted and locked, using the semantic vector, checkbox checklist and pointer-transparent SVG shade/edge recipe.
- Semantic content icons share one provider map for Material Symbols Outlined/Filled and Font Awesome Solid. V60 and AeroPress remain first-party vectors. Preserve the original accepted Material vectors and the pinned `@material-symbols/svg-400` build input with its license and notice. Animation has its own semantic role, distinct from Edit Video.
- Select grows/repositions floating windows, then uses the existing scroll area at viewport limits; its five-option cap and close restoration remain. Dynamic window content uses the shared explicit content-change event after DOM mutation rather than observing window size. Toolbar popovers retain attachment-before-hydration, failure lease cleanup and consumer-supplied event routing/disposal.
- Scene and element animations share card, Add/Delete, region and Type recipes. Animation cards remain borderless; window content owns padding/gap. Audio slot actions share Add/Replace/Remove without changing ordinary Play/Volume. AppScreen owns the backing slot and window growth within the viewport.
- Audio retains brown/yellow selection and handles with one brown outline, without blue/inner borders, center rules or pills. Annotated text owns editable cues, destructive pill state and semantic Close; opt-in Select descriptions use native titles. Picker bodies select without playback cues; Vault/sample previews play through their common ancestor.
- Rectangular media, media-editor presentation and mixed popover checkbox rows use shared recipes. Checkbox rows span the numeric grid vertically. Background Scale is unitless 0-1 with the established logarithmic mapping; stable pattern IDs, vectors and provenance remain.
- Screen/Scene selection scales its 7 px outward edge with zoom, capped at one third of the visible gap; its 2 px stroke remains fixed and glow spread scales. Element hull recipes remain unchanged. Timeline endpoint labels align inward and off-grid endpoints reserve an interval.
- Paper backgrounds retain the shared 15-Hz, 960-long-edge field policy and bounded interpolation lifecycle. AppScreen owns shared clone preparation. Preserve Smoke appearance and documented sibling evidence; acceptance does not establish a strict cost ceiling. Button feedback and its playground remain accepted shared recipes.

## Pending and Parked Boundaries

- AppScreen's current `STATUS.md` and `SPRINT_ROADMAP.md` own pending consumer checks. The animation ordering/defaults follow-up and removed Preview preparation popup await owner browser acceptance. The corrected circular range/progress thumb has not received separate owner visual approval; the accepted time-track checkpoint does not close these checks.
- The existing 39 token-collision warnings remain a separate known gate. Historical builds and checks are evidence for their recorded slices, not new validation of later changes.
- Universal typeface safety remains parked. Hosted font admission, commercial fonts, pairing suggestions and adjustable per-video bars with per-device defaults remain separate work.
- Winter/iPad, social, Square and cover remain AppScreen owner work. Wide Video Demo 2 is locked. Preserve all owner projects, assets, original fonts, SVG/audio, diagnostics, ignored evidence and static locks.
- Embedded audio is closed. Historical Preview performance and the Video Editor hiccup remain parked; do not reopen them automatically.
- Browser actions, live and visual acceptance, deployment, publication and pushes remain user-owned.

## Cold History and Evidence

Completed reports, measurements, file counts and per-slice acceptance limits stay in their existing cold owners:

- `CHANGELOG.md`: shared recipes, assets, generation/parity and accepted checkpoints.
- `../appscreen-studio/docs/THEME_DEMO_PREPARATION_PLAN.md`: Theme roles and references, including the Accepted 87-file closure audit.
- `../appscreen-studio/docs/FONT_ROSTER_ACQUISITION.md`: font admission, specimens and the paired search/font closure.
- `../appscreen-studio/docs/PICKER_SEARCH_AND_CHROME_HOVER_PLAN.md`: shared picker search and hover behavior.
- `../appscreen-studio/docs/SEPTEMBER_11_CLOSURE_AUDIT.md`: earlier paired closure.
- `../appscreen-studio/docs/PAPER_ANIMATED_BACKGROUNDS_PLAN.md` and `../appscreen-studio/docs/BUTTON_FEEDBACK_PLAYGROUND.md`: appearance, performance evidence and feedback settings.

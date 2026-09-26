# Bits and Bolts Themes: Sprint Roadmap

## Current Focus

- Preserve the paired v69 checkpoint; migration implementation is paused.
  Studio's `docs/RENDERING_ARCHITECTURE_MIGRATION_PLAN.md` now controls the
  sequence: desktop mixed stacking first after explicit start, followed by
  editor parity, shared output contracts and real-phone cutover gates. Existing
  recipes and generated outputs remain unchanged during this checkpoint.
- AppScreen's LAN-only v66 stage-paint test consumes the generic world-stage
  containment recipe and its no-paint modifier. The approved v67 comparison
  also consumes the new generic viewport background surface recipe, preserving
  the prior declarations. Themes generation and exact source/web/docs CSS
  parity pass; AppScreen owns iPhone acceptance. The
  default presentation remains unchanged.
- The iPhone Safari landing probe isolated hidden first paint to font queries before stylesheet loading finished. The Themes readiness correction waits for native page load, verifies active theme and typography sheets, then waits for required fonts before reveal. The focused test and Themes generation/parity pass. The owner confirmed the real landing appears on iPhone in about 3 to 4 s. The owner photo showed tabs clipped under the narrow Studio top bar handle despite the adaptive mark. Themes now places the mark and scrollable tabs in one grid row; build/parity and focused AppScreen checks pass, with fresh owner visual approval open. Studio WebGL context loss remains AppScreen-owned. The workspace UI strategy permits a deliberate stable fallback if resources fail or readiness stalls, but no fallback UI is implemented in this slice.
- The shared attention pulse preserves the accepted Animation-card feedback and now serves Cluna Studio's annotated voiceover editor after cue insertion. Generation, exact source/web/docs parity and the focused consumer checks pass. The exact Guest consumer presentation is owner-accepted for Phase 2.
- The shared floating-window content-change event lets content request one post-mutation fit without observing the window itself. AppScreen coalesces the request, retains grow-only fitting for card changes, and resets height only after whole-card deletion. Generation, exact source/web/docs parity and 37 focused consumer checks pass. The exact Guest consumer presentation is owner-accepted for Phase 2.
- The shared Timeline origin correction is owner-confirmed: playhead, ruler and clips include the same gutter, frame border and handle clearance. Both Timeline surfaces consume the shared inset, and duplicate embedded spacing is removed. Nine focused consumer checks and generation/parity pass.
- The shared time-track and collapsed-range checkpoint is closed and owner-accepted, including AppScreen's 19 combined Phase 3/4/5 browser checks and clean closing log.
- Wide Video Demo 2 is locked at 99.78 s after complete local visual review, successful media decode and a clean focused export log. This complete paired checkpoint is authorized for local commit.
- The compact audio-control correction awaits owner visual acceptance: one trim row and canonical 68 px inline numeric fields in both toolbar and popover, with one-line Volume/Hold toolbar controls. Focused checks and generated source/web/docs parity pass. No other Themes feature cluster is active.
- Current contracts and evidence links live in `STATUS.md`; completed slice reports belong in `CHANGELOG.md` and their cold task documents.

## Pending Owner Acceptance

- AppScreen owns the remaining consumer checks in its current status and roadmap, including animation defaults/order and removal of the Preview preparation popup.
- The corrected circular range/progress thumb still needs separate owner visual approval. Do not infer it from acceptance of the time-track checkpoint.
- These pending checks do not authorize a new implementation slice or agent-owned browser work.

## Parked

- Universal typeface safety.
- Hosted font admission, commercial fonts and pairing suggestions.
- Adjustable per-video bars with per-device defaults.
- Historical Preview performance and the Video Editor hiccup remain AppScreen-owned and parked.

## Boundaries

- Themes owns exact shared presentation; AppScreen owns behavior, mutation, persistence, rendering, Preview, export and composition.
- Keep source components, generated web output and documentation output aligned.
- Preserve every accepted recipe, owner project, asset, original font, SVG/audio file, diagnostic selector, ignored evidence and static lock.
- The existing token-collision gate stays separate from any newly selected work.
- Embedded audio remains closed. Do not reopen accepted slices or activate parked work without owner direction.
- Commits need explicit authorization. Browser actions, live/visual acceptance, pushes, deployment and publication remain user-owned.

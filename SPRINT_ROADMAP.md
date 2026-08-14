# Bits and Bolts Themes: Sprint Roadmap

## Current Focus

- Preserve the accepted AppScreen guest gates, shared controls, Theme Summary
  Cards, Navbar behavior, and fallback-free atomic theme presentation.
- Keep Themes as the enforceable visual owner across every Bits and Bolts
  product and supported platform.
- Continue future theme inspiration as small, approval-gated family slices.

## Completed Checkpoint

- [x] Ratify the DTCG 2025.10 plus Bits and Bolts contract architecture.
- [x] Implement nine complete light/dark v2 families with semantic mappings,
  Button recipes, interface roles, and generated platform outputs.
- [x] Remove Ocean and Robot with no aliases.
- [x] Rename the inspiration families to Brutus, Forest, Winter, Coffee,
  Bubblegum, Inferno, and Sober.
- [x] Build the compact card-first Themes home and preserve full family pages.
- [x] Move reusable Hero, Navbar, Footer, Select, Menu, landing, gallery, and
  interface presentation into Themes-owned components.
- [x] Align AppScreen Studio's managed landing and in-app selectors with the
  canonical theme catalog.
- [x] Fix theme switching continuity, viewport-aware menu placement, anchor
  navigation, and theme-aware Navbar and Footer marks.
- [x] Bundle and license the accepted Forest, Winter, Coffee, and Brutus fonts.
- [x] Accept Forest with Arima and Mulish plus family-owned Hero leading.
- [x] Accept Brutus with native Ultra 400, no synthetic bold, and Roboto Slab
  Thin body typography.
- [x] Make the summary card consume semantic typography families and weights.
- [x] Record future font-library candidates without bundling unverified files.
- [x] Move the guest account gate into the canonical Dialog recipe and expose
  all guest workspace tabs without moving product authorization into Themes.
- [x] Make Select the complete menu owner and route Studio control events
  through one product-side adapter instead of a parallel local Select.
- [x] Declare Navbar/Footer brand-mark dependencies and restore canonical
  hide-on-scroll behavior after module loading.
- [x] Add atomic first-paint and theme-change font readiness, replace webfont
  swap policy with blocking presentation, and rebuild generated outputs.
- [x] Pass the build, readiness, guest, routed Select, and Sites checks; record
  five stale gallery assertions; commit the accepted checkpoint without push.

## Next Task Menu

Choose one bounded slice in a future chat:

1. Inspect and approve another public preset before implementing a new family.
2. Review an existing family and apply one focused visual correction.
3. Design the longer family detail page from the accepted summary card grammar.
4. Begin the font-library contract and verify candidate redistribution licenses.
5. Advance DTCG validation or versioned package delivery.

## Guardrails

- Verify every named repository is clean before editing.
- Preserve exact public preset values where available. Identify every derived
  or invented value explicitly.
- Use only official locally bundled fonts with compatible licenses.
- Reuse Themes-owned components. Do not create product-local presentation.
- For theme visual slices, run only `pnpm build`, then stop for owner review.
- Do not use browser automation. Do not commit or push unless explicitly asked.

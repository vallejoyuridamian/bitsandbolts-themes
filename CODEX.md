# Bits and Bolts Themes — Project Context

## Purpose

This repository is the public, canonical UI source of truth for every Bits and
Bolts product. It owns theme data, fonts, icons, brand assets, reusable visual
components, and generators for supported platforms.

## Authority

- Edit source tokens under `tokens/`, shared web components under `components/`,
  and source assets under `assets/` or the existing platform source folders.
- `dist/` is generated and committed for direct consumption. Never hand-edit a
  generated artifact without changing its source and rebuilding it.
- Product repositories may own structure, behavior, content, accessibility, and
  domain-specific state. They do not own independent colors, typography, icons,
  radii, shadows, control styling, or unratified visual overrides.
- An exception must be rare, justified, named, and represented in this repo as
  a theme or shared semantic contract so it remains portable.

## Current Outputs

- Web CSS custom properties and shared component CSS
- Android/Kotlin Compose color, typography, shape, component, icon, and font assets
- React Native/Expo typed theme constants
- Shared public web fonts, platform icons, store badges, and brand assets

## Working Boundary

- `pnpm build` is the focused generation check.
- For a focused owner correction to an existing Themes specimen, go directly to
  the named canonical component and token source after the required bounded
  context load. Do not inventory repositories, reread already-loaded context,
  open cold plans/history, or expand into consumers without a concrete failing
  dependency.
- Keep correction validation proportional: run the Themes build once and, only
  when a consumer contract changed, its smallest named focused check once. Then
  stop for owner-run browser acceptance; do not add duplicate validation phases.
- Keep shell search patterns literal; never place backticks or command
  substitutions in an interpolated command string used only for verification.
- A shared-gallery visual correction belongs in Themes first. Regenerate its
  existing outputs from the same source; do not create product-local styling or
  turn a two-property correction into a broader refactor.
- Exact-parity work must preserve every source typography property by element,
  including family, weight, size, and letter spacing. Never normalize title and
  content typography across a shared component unless the source matches.
- CSS parity validation must verify the effective final cascade when a selector
  or property appears more than once. A presence-only assertion is insufficient.
- Theme showcase and gallery specimens must use semantic role labels such as
  `Primary headline`, `Supporting copy`, and `Primary CTA`. Never paste live
  product or site marketing copy into a theme specimen; real copy stays in the
  owning Sites document.
- Themes components and recipes must remain product- and page-agnostic. A site
  may compose abstract text layouts, fields, cards, carousels, and controls,
  but Themes must never know about a contact page, portfolio route, landing
  page, product workflow, or other consumer-specific composition.
- Before adding a component or presentation recipe, search Themes and accepted
  consumers for the same visual role. When that role exists only inside a
  legacy page-specific recipe, extract one abstract Themes recipe and migrate
  both callers in the same bounded change. Equivalent parallel UI recipes are
  prohibited, including temporary copies.
- The long-term delivery mechanism must prevent copied consumer assets from
  becoming a second source of truth; that mechanism is not yet ratified.
- A theme must eventually be switchable as a complete visual system, not only a
  color palette.
- The future AppScreen Studio Themes tab and user-authored themes must consume
  the same portable schema as first-party themes.

## Context

Read `STATUS.md` and `SPRINT_ROADMAP.md` after this file. Load workspace
`UI_STRATEGY.md` for the cross-project hard rules.

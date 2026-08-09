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
- The long-term delivery mechanism must prevent copied consumer assets from
  becoming a second source of truth; that mechanism is not yet ratified.
- A theme must eventually be switchable as a complete visual system, not only a
  color palette.
- The future AppScreen Studio Themes tab and user-authored themes must consume
  the same portable schema as first-party themes.

## Context

Read `STATUS.md` and `SPRINT_ROADMAP.md` after this file. Load workspace
`UI_STRATEGY.md` for the cross-project hard rules.

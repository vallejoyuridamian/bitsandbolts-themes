# Bits and Bolts Theme Color System

This is the authoritative explanation of the v2 color model. The source of
truth remains each family contract and its light and dark mode token files under
`families/<family>/v2/`.

## Mental Model

Each Theme family ships two independently resolved modes: light and dark. Each
mode contains three related color layers:

1. Palette values are the authored or creator-generated color ingredients.
2. Four identity pairs express the Theme's recognizable colors and their exact
   readable foregrounds.
3. Forty-eight semantic roles assign colors to product jobs such as surfaces,
   ordinary content, borders, interactions, and status.

The build resolves references between these layers, serializes exact platform
values, calculates identity-pair contrast, and rejects invalid contracts. It
does not silently replace a failing canonical foreground.

## Four Identity Pairs

| Identity | Background purpose | Foreground purpose |
| --- | --- | --- |
| Primary | Main action and strongest identity signal | Text or icons directly on Primary |
| Secondary | Supporting identity surface and selected treatment | Text or icons directly on Secondary |
| Accent | Distinct emphasis and art-direction signal | Text or icons directly on Accent |
| Neutral | Theme-defining neutral surface | Text or icons directly on Neutral |

Every entry in `family.bb.json` declares an `id`, `token`, and
`foregroundToken`. The token resolves the identity background. The
foreground token resolves its exact paired foreground.

There is one exact foreground per identity in each mode. A family therefore
has four light-mode pairs and four dark-mode pairs. These are independent
results, not two foreground alternatives exposed simultaneously in one mode.

## Contrast Contract

The build converts color values to linear sRGB, calculates relative luminance,
and applies the contrast-ratio formula. Every identity foreground must reach at
least 4.5:1 against its exact identity background after serialization.

Canonical foregrounds may be:

- Authored colors retained for deliberate art direction when they pass.
- Palette-derived colors selected during Theme creation.
- Deterministically calculated foregrounds produced by the Theme creator when
  no accepted authored foreground exists.
- Literal black or white when that exact pole is intentional for the family.

The canonical family source stores the result. The ordinary build validates
and distributes it. A build failure identifies the Theme, mode, identity role,
measured ratio, and required minimum.

## Semantic Color Roles

Identity is not a substitute for semantic UI color. Every mode also provides
48 required roles in these groups:

- `color.surface.*`: canvas, ordinary, raised, sunken, overlay, inverse,
  disabled, and scrim surfaces.
- `color.content.*`: primary, secondary, tertiary, placeholder, disabled,
  inverse, brand, link, and visited-link content.
- `color.border.*`: subtle, default, strong, disabled, divider, focus ring,
  and focus-ring offset.
- `color.interaction.*`: action, paired action content, selected and selection
  pairs, caret, drop target, and drag preview.
- `color.status.*`: information, success, warning, and danger surfaces,
  content, and borders.

Use semantic roles for ordinary application UI. Use an identity foreground
only when text, icons, or another foreground element sits directly on the
matching identity background.

## Generated Contract

Web output exposes these identity variables per mode:

```text
--bb-v2-identity-primary
--bb-v2-identity-primary-foreground
--bb-v2-identity-secondary
--bb-v2-identity-secondary-foreground
--bb-v2-identity-accent
--bb-v2-identity-accent-foreground
--bb-v2-identity-neutral
--bb-v2-identity-neutral-foreground
```

The generated catalog records each identity value, foreground value,
foreground token, and measured contrast ratio. Android maps the same resolved
pairs into its color-scheme foreground roles. React Native exposes each
identity as a typed `{ background, foreground }` pair.

## Consumer Rules

- Resolve colors from the active family and active light or dark mode.
- Keep each identity background paired with its exact foreground.
- Do not substitute generic black or white when the Theme provides a pair.
- Do not infer an identity color from an unrelated semantic alias.
- Do not use identity foregrounds as universal text colors. Their contrast
  guarantee applies to their paired background.
- Preserve an explicitly authored consumer color. Automatic foreground choice
  is a creation-time suggestion, not persistent automatic recoloring.
- When a consumer presents color choices, label identity backgrounds and
  identity foregrounds distinctly and collapse duplicate resolved values.

## AppScreen Studio Use

AppScreen Studio exposes the active mode's four identity colors and four exact
identity foregrounds for Text, Stopwatch, and Image tint choices. New Text and
Stopwatch elements may use background-aware identity foreground selection as a
creation-time default. Copied, duplicated, pasted, moved, or previously
authored elements retain their explicit color.

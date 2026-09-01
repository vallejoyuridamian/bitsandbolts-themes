# bitsandbolts-themes

Cross-platform design token system for Bits and Bolts apps. One source of truth → CSS custom properties, Kotlin Compose color schemes, and React Native/Expo constants.

**[Live preview →](https://vallejoyuridamian.github.io/bitsandbolts-themes/)**

## Showcase

```bash
pnpm dev
```

This rebuilds the canonical theme artifacts, serves the same showcase published
through GitHub Pages at `http://127.0.0.1:4181/`, and opens it in the default
browser. AppScreen Studio's Themes workspace consumes the same gallery renderer
and generated catalog from this repository.

All catalog families implement the current v2 contract.

## Themes

| Theme | Primary | Secondary | Personality |
|-------|---------|-----------|-------------|
| **cloud** | `#4F46E5` indigo | `#7C3AED` violet | Calm, clear utility |
| **bitsandbolts** | `#12E6D5` neon cyan | `#65FFBF` neon green | Portfolio brand, launch energy |
| **brutus** | `#FF3333` signal red | `#FFFF00` signal yellow | Square, graphic, hard-shadow utility |
| **forest** | `#2E7D32` forest green | `#E8F5E9` pale green | Warm, organic, editorial utility |
| **winter** | `oklch(0.7227 0.1920 149.5793)` green | `oklch(0.9514 0.0250 236.8242)` mist | Crisp coastal utility |
| **coffee** | `oklch(0.6083 0.0623 44.3588)` mocha | `oklch(0.7473 0.0387 80.5476)` cream | Warm cafe utility |
| **bubblegum** | `oklch(0.8677 0.0735 7.0855)` pink | `oklch(0.8148 0.0819 225.7537)` blue | Playful candy utility |
| **inferno** | `oklch(0.6397 0.1720 36.4421)` hot orange | `oklch(0.9670 0.0029 264.5419)` cool gray | Hot signal utility |
| **sober** | `oklch(0.6333 0.0309 154.9039)` sage | `oklch(0.8596 0.0291 119.9919)` stone | Restrained garden utility |

Each theme has light + dark variants. All tokens follow the Material 3 color system.

## Color system at a glance

Every Theme mode starts with four creator-facing identity colors: Primary,
Secondary, Accent, and Neutral. Each identity color has one exact foreground
paired to it for readable text, icons, and other content placed directly on
that color. Light and dark modes resolve their four pairs independently.

The build calculates the contrast ratio for all eight pairs in a family and
rejects any pair below 4.5:1. It then exposes the exact pairs consistently to
web, Android, React Native, the generated catalog, and shared components.

Identity colors are not the complete application palette. Each mode also owns
48 semantic roles covering surfaces, content, borders, interactions, and
status. Consumers use semantic roles for ordinary product UI and use an
identity foreground only when content sits directly on its matching identity
background.

Read [Color System](docs/COLOR_SYSTEM.md) for the authoritative role model,
calculation boundary, light and dark behavior, generated names, and consumer
rules.

Friendly migration note for Universal Clipboard: the retired `slate` family is
now Cloud. The released app is intentionally untouched. Before its next theme
sync, change the configured theme ID from `slate` to `cloud`; the generated
visual values are already equivalent. No alias exists.

---

## Add to your project (git submodule)

```bash
# From your project root
git submodule add https://github.com/bitsandbolts/bitsandbolts-themes themes-source
git submodule update --init --recursive
```

The `dist/` folder is committed to this repo, so you can use the generated files immediately without running the build yourself.

---

## Generated outputs

After `pnpm build` (or on first clone, since dist is pre-built):

```
dist/
  web/{theme}/light.css        CSS custom properties, selector :root
  web/{theme}/dark.css         CSS custom properties, selector [data-theme="dark"]
  web/{theme}/scoped.css       Light/dark variables for nested family regions
  android/{theme}/LightColors.kt   Compose lightColorScheme(...)
  android/{theme}/DarkColors.kt    Compose darkColorScheme(...)
  react-native/{theme}/light.ts    typed color/spacing/radii constants
  react-native/{theme}/dark.ts
docs/
  index.html                    GitHub Pages showcase shell
  theme/                        generated web catalog and showcase artifacts
```

---

## Platform integration

### Tauri / Vue / Web

```css
/* main.css or index.css */
@import '../themes-source/dist/web/cloud/light.css';

@media (prefers-color-scheme: dark) {
  @import '../themes-source/dist/web/cloud/dark.css';
}
```

Or for manual dark mode toggle:

```js
document.documentElement.setAttribute('data-theme', 'dark');
```

Use tokens in your CSS/Vue:

```css
.button-primary {
  background: var(--bb-v2-identity-primary);
  color: var(--bb-v2-identity-primary-foreground);
  border-radius: var(--bb-radius-md);
  padding: var(--bb-spacing-3) var(--bb-spacing-6);
  font-family: var(--bb-font-family-body);
  font-size: var(--bb-font-size-md);
}
```

### Android (Jetpack Compose)

1. Copy or symlink the generated Kotlin files into your project:

```bash
ANDROID_PACKAGE=com.yourapp pnpm build
cp themes-source/dist/android/cloud/LightColors.kt \
   android/app/src/main/java/com/yourapp/ui/theme/generated/
cp themes-source/dist/android/cloud/DarkColors.kt \
   android/app/src/main/java/com/yourapp/ui/theme/generated/
```

   Or find-and-replace `REPLACE_ME` with your package name after copying.

2. Write a thin `Theme.kt` in your app (not generated, you own this):

```kotlin
// ui/theme/Theme.kt
package com.yourapp.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.runtime.Composable
import com.yourapp.ui.theme.generated.CloudLightColorScheme
import com.yourapp.ui.theme.generated.CloudDarkColorScheme

@Composable
fun AppTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) CloudDarkColorScheme else CloudLightColorScheme
    MaterialTheme(
        colorScheme = colorScheme,
        typography = AppTypography,  // you define this with your bundled fonts
        content = content
    )
}
```

3. Add font files to `res/font/` (Inter, Plus Jakarta Sans, JetBrains Mono from Google Fonts) and define `AppTypography` using `CloudLightColorScheme` sizes as reference.

### React Native / Expo

```ts
// Import light or dark based on color scheme
import { useColorScheme } from 'react-native';
import { colors as lightColors, spacing, radii, fontSize } from '../themes-source/dist/react-native/cloud/light';
import { colors as darkColors } from '../themes-source/dist/react-native/cloud/dark';

export function useTheme() {
  const scheme = useColorScheme();
  return {
    colors: scheme === 'dark' ? darkColors : lightColors,
    spacing,
    radii,
    fontSize,
  };
}
```

---

## Build your own output

```bash
pnpm install
pnpm build

# With your Android package name baked in:
ANDROID_PACKAGE=com.myapp pnpm build
```

Requires Node 18+.

---

## Customising a theme

Edit the family contract and mode tokens under `families/<family>/v2/`. Each
identity role declares both its background token and exact foreground token.
The build rejects any identity pair below 4.5:1 contrast.

The build resolves and validates canonical color source. It does not silently
repair an invalid foreground. Theme creation may calculate a deterministic
foreground before canonical source is written, while an intentional authored
foreground is preserved when it passes the contract. See
[Color System](docs/COLOR_SYSTEM.md).

---

## Token reference

All CSS variables are prefixed `--bb-`. Full list after running `pnpm build`:

Font-family roles contain exactly one primary family name. Fallback stacks and
generic family names are invalid, and every declared family must have a bundled
font face in the generated web distribution.

```
--bb-v2-identity-primary
--bb-v2-identity-primary-foreground
--bb-v2-identity-secondary
--bb-v2-identity-secondary-foreground
--bb-v2-identity-accent
--bb-v2-identity-accent-foreground
--bb-v2-identity-neutral
--bb-v2-identity-neutral-foreground
--bb-v2-color-surface-* / content-* / border-* / interaction-* / status-*
...
--bb-spacing-1 through --bb-spacing-24
--bb-radius-none through --bb-radius-full
--bb-font-family-display / body / mono / terminal
--bb-font-size-xs through --bb-font-size-5xl
--bb-font-weight-regular / medium / semibold / bold
--bb-shadow-none through --bb-shadow-xl
--bb-marketing-* shared marketing shell, chrome, information, plan, and status roles
```

Every family/mode must resolve the complete marketing-role set. The generated
`scoped.css` artifact allows a semantic region such as a product header or
footer to use another family without replacing the page's root family.

Coal, silver, and gold plan colors are universal shared-recipe inputs. The build
rejects family/mode overrides of those colors. Typography and spacing resolve
from the active family; component geometry and depth live in the consuming
recipe. `catalog.json.sharedAssets` records the single global platform-icon and
official store-badge asset set.

---

## Updating the submodule

```bash
# From your project root
git submodule update --remote themes-source
```

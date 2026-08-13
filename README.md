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

Bits & Bolts, Cloud, Neo Brutalism, and Nature implement the current v2
contract. Ocean and Robot remain legacy catalog families; the shared showcase
represents that difference honestly.

## Themes

| Theme | Primary | Secondary | Personality |
|-------|---------|-----------|-------------|
| **cloud** | `#4F46E5` indigo | `#7C3AED` violet | Calm, clear utility |
| **ocean** | `#0061A3` deep blue | `#00696B` teal | Professional, calm |
| **robot** | `#3FB950` terminal green | `#58A6FF` telemetry blue | Industrial, diagnostic, systems-focused |
| **bitsandbolts** | `#12E6D5` neon cyan | `#65FFBF` neon green | Portfolio brand, launch energy |
| **neobrutalism** | `#FF3333` signal red | `#FFFF00` signal yellow | Square, graphic, hard-shadow utility |
| **nature** | `#2E7D32` forest green | `#E8F5E9` pale green | Warm, organic, editorial utility |

Each theme has light + dark variants. All tokens follow the Material 3 color system.

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

After `pnpm build` (or on first clone — dist is pre-built):

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
  background: var(--bb-color-primary);
  color: var(--bb-color-on-primary);
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

2. Write a thin `Theme.kt` in your app (not generated — you own this):

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

To use a theme with an override (e.g. cloud colors but a different primary), add an override token file in `tokens/themes/` and merge it in `build.js` by adding it to the `source` array:

```js
source: [
  'tokens/base/**/*.json',
  `tokens/themes/${theme}/${mode}.json`,
  'tokens/themes/my-override.json',   // wins last-write
],
```

Alternatively, just copy the theme JSON and change what you need — it's just JSON.

---

## Token reference

All CSS variables are prefixed `--bb-`. Full list after running `pnpm build`:

Font-family roles contain exactly one primary family name. Fallback stacks and
generic family names are invalid, and every declared family must have a bundled
font face in the generated web distribution.

```
--bb-color-primary
--bb-color-on-primary
--bb-color-primary-container
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

# bitsandbolts-themes

Cross-platform design token system for Bits and Bolts apps. One source of truth → CSS custom properties, Kotlin Compose color schemes, and React Native/Expo constants.

**[Live preview →](https://vallejoyuridamian.github.io/bitsandbolts-themes/)**

## Themes

| Theme | Primary | Secondary | Personality |
|-------|---------|-----------|-------------|
| **cloud** | `#E8521A` warm orange | `#2B7A2E` forest green | Energetic, friendly (Universal Clipboard) |
| **ocean** | `#0061A3` deep blue | `#00696B` teal | Professional, calm |
| **slate** | `#4F46E5` indigo | `#7C3AED` violet | Bold, modern |
| **robot** | `#3FB950` terminal green | `#58A6FF` telemetry blue | Industrial, diagnostic, systems-focused |
| **bitsandbolts** | `#12E6D5` neon cyan | `#65FFBF` neon green | Portfolio brand, launch energy |

Each theme has light + dark variants. All tokens follow the Material 3 color system.

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
  android/{theme}/LightColors.kt   Compose lightColorScheme(...)
  android/{theme}/DarkColors.kt    Compose darkColorScheme(...)
  react-native/{theme}/light.ts    typed color/spacing/radii constants
  react-native/{theme}/dark.ts
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

```
--bb-color-primary
--bb-color-on-primary
--bb-color-primary-container
...
--bb-spacing-1 through --bb-spacing-24
--bb-radius-none through --bb-radius-full
--bb-font-family-display / body / mono
--bb-font-size-xs through --bb-font-size-5xl
--bb-font-weight-regular / medium / semibold / bold
--bb-shadow-none through --bb-shadow-xl
```

---

## Updating the submodule

```bash
# From your project root
git submodule update --remote themes-source
```

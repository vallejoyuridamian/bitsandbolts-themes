/**
 * bitsandbolts-themes — build.js
 *
 * Reads design tokens from tokens/ and generates platform-specific outputs:
 *   dist/web/{theme}/light.css, dark.css       — CSS custom properties
 *   dist/android/{theme}/LightColors.kt        — Compose lightColorScheme
 *   dist/android/{theme}/DarkColors.kt         — Compose darkColorScheme
 *   dist/react-native/{theme}/light.ts         — typed constants
 *   dist/react-native/{theme}/dark.ts
 *
 * Usage:
 *   pnpm build
 *   ANDROID_PACKAGE=com.myapp pnpm build   (sets package in Kotlin output)
 *
 * Run from repo root. Requires Node 18+.
 */

import StyleDictionary from 'style-dictionary';
import {
  readdirSync,
  copyFileSync,
  mkdirSync,
  existsSync,
  readFileSync,
  writeFileSync,
  statSync,
} from 'fs';
import { join } from 'path';

const THEMES = ['cloud', 'ocean', 'slate', 'robot', 'bitsandbolts'];
const MODES  = ['light', 'dark'];
const ANDROID_PACKAGE = process.env.ANDROID_PACKAGE || 'REPLACE_ME';
const THEME_LABELS = Object.freeze({
  bitsandbolts: 'Bits & Bolts',
  cloud: 'Cloud',
  ocean: 'Ocean',
  robot: 'Robot',
  slate: 'Slate',
});
const ICON_PREVIEW_NAMES = Object.freeze([
  'settings',
  'arrow_back',
  'share',
  'logout',
  'home',
  'search',
  'notifications',
  'close',
  'add',
  'check',
  'person',
  'star',
  'favorite',
  'delete',
  'edit',
  'content_copy',
  'cloud_upload',
  'cloud_download',
  'menu',
  'more_vert',
  'info',
  'warning',
  'lock',
  'visibility',
  'download',
]);
const GENERIC_FONT_FAMILIES = new Set([
  'cursive',
  'fantasy',
  'monospace',
  'sans-serif',
  'serif',
  'system-ui',
]);
const REQUIRED_MARKETING_VARIABLES = Object.freeze([
  '--bb-marketing-page-canvas',
  '--bb-marketing-chrome-background',
  '--bb-marketing-chrome-accent',
  '--bb-marketing-chrome-on-accent',
  '--bb-marketing-chrome-navigation',
  '--bb-marketing-chrome-meta-font',
  '--bb-marketing-hero-icon-glow',
  '--bb-marketing-highlight',
  '--bb-marketing-store-badge-surface',
  '--bb-marketing-store-badge-content',
  '--bb-marketing-terminal-blend',
  '--bb-marketing-plan-content',
  '--bb-marketing-plan-free-surface',
  '--bb-marketing-plan-free-border',
  '--bb-marketing-plan-free-label',
  '--bb-marketing-plan-monthly-surface-start',
  '--bb-marketing-plan-monthly-surface-end',
  '--bb-marketing-plan-monthly-border',
  '--bb-marketing-plan-monthly-label',
  '--bb-marketing-plan-yearly-surface',
  '--bb-marketing-plan-yearly-border',
  '--bb-marketing-plan-yearly-label',
  '--bb-marketing-plan-positive',
  '--bb-marketing-plan-negative',
]);
const UNIVERSAL_PLAN_VARIABLES = Object.freeze([
  '--bb-marketing-plan-content',
  '--bb-marketing-plan-free-surface',
  '--bb-marketing-plan-free-border',
  '--bb-marketing-plan-free-label',
  '--bb-marketing-plan-monthly-surface-start',
  '--bb-marketing-plan-monthly-surface-end',
  '--bb-marketing-plan-monthly-border',
  '--bb-marketing-plan-monthly-label',
  '--bb-marketing-plan-yearly-surface',
  '--bb-marketing-plan-yearly-border',
  '--bb-marketing-plan-yearly-label',
  '--bb-marketing-plan-positive',
  '--bb-marketing-plan-negative',
]);
const SHARED_WEB_ASSETS = Object.freeze([
  Object.freeze({ id: 'platform-android', mediaType: 'image/svg+xml', path: 'icons/android.svg', sourcePath: 'assets/icons/android.svg' }),
  Object.freeze({ id: 'platform-windows', mediaType: 'image/svg+xml', path: 'icons/windows.svg', sourcePath: 'assets/icons/windows.svg' }),
  Object.freeze({ id: 'platform-linux', mediaType: 'image/svg+xml', path: 'icons/linux.svg', sourcePath: 'assets/icons/linux.svg' }),
  Object.freeze({ id: 'store-google-play', mediaType: 'image/png', path: 'brand/store/google-play-badge.png', sourcePath: 'assets/brand/store/google-play-badge.png' }),
  Object.freeze({ id: 'store-app-store', mediaType: 'image/svg+xml', path: 'brand/store/app-store-badge.svg', sourcePath: 'assets/brand/store/app-store-badge.svg' }),
]);
const V2_CONTRACT_FILE = 'theme-contract/v2/contract.bb.json';
const BITSANDBOLTS_V2_ROOT = 'families/bitsandbolts/v2';

function assertSingleFontFamilyTokens() {
  const files = [
    'tokens/base/typography.json',
    ...THEMES.flatMap((theme) => MODES.map((mode) => `tokens/themes/${theme}/${mode}.json`)),
  ];
  for (const file of files) {
    if (!existsSync(file)) continue;
    const families = JSON.parse(readFileSync(file, 'utf8'))?.font?.family ?? {};
    for (const [role, token] of Object.entries(families)) {
      const value = String(token?.$value ?? '').trim();
      if (!value || value.includes(',') || GENERIC_FONT_FAMILIES.has(value.toLowerCase())) {
        throw new Error(`[font-contract] ${file} font.family.${role} must name exactly one primary font family.`);
      }
    }
  }
}

assertSingleFontFamilyTokens();

function assertNoComponentFontFallbacks() {
  for (const file of readdirSync('components').filter((name) => name.endsWith('.css'))) {
    const css = readFileSync(join('components', file), 'utf8');
    for (const match of css.matchAll(/font-family\s*:\s*([^;]+);/gi)) {
      if (match[1].includes(',')) {
        throw new Error(`[font-contract] components/${file} must name exactly one primary font family.`);
      }
    }
  }
}

assertNoComponentFontFallbacks();

// ─── Custom Format: Kotlin Color Scheme ──────────────────────────────────────

StyleDictionary.registerFormat({
  name: 'kotlin/color-scheme',
  format: ({ dictionary, options }) => {
    const { theme, mode } = options;
    const ThemeName  = theme.charAt(0).toUpperCase() + theme.slice(1);
    const ModeName   = mode.charAt(0).toUpperCase() + mode.slice(1);
    const schemeType = mode === 'light' ? 'lightColorScheme' : 'darkColorScheme';

    // M3 ColorScheme only accepts these standard roles; extra tokens become standalone vals.
    const M3_ROLES = new Set([
      'primary','onPrimary','primaryContainer','onPrimaryContainer',
      'secondary','onSecondary','secondaryContainer','onSecondaryContainer',
      'tertiary','onTertiary','tertiaryContainer','onTertiaryContainer',
      'background','onBackground',
      'surface','onSurface','surfaceVariant','onSurfaceVariant','surfaceTint',
      'inversePrimary','inverseSurface','inverseOnSurface',
      'error','onError','errorContainer','onErrorContainer',
      'outline','outlineVariant','scrim',
    ]);

    const colorTokens  = dictionary.allTokens.filter(t => t.path[0] === 'color');
    const opacityTokens = dictionary.allTokens.filter(t => t.path[0] === 'opacity');
    const m3Tokens     = colorTokens.filter(t => M3_ROLES.has(t.path[1]));
    const extraTokens  = colorTokens.filter(t => !M3_ROLES.has(t.path[1]));
    const val = t => t.value ?? t.$value;
    const toPascal = parts => parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');

    const toKotlin = hex => `Color(0xFF${hex.replace('#', '').toUpperCase()})`;
    const consts   = colorTokens.map(t => `private val _${t.path[1]} = ${toKotlin(val(t))}`).join('\n');
    const entries  = m3Tokens.map(t => `    ${t.path[1]} = _${t.path[1]}`).join(',\n');
    const extraColorVals = extraTokens.map(t => `val ${ThemeName}${ModeName}${t.path[1].charAt(0).toUpperCase() + t.path[1].slice(1)} = _${t.path[1]}`);
    const extraOpacityVals = opacityTokens.map(t => {
      const name = toPascal(t.path.slice(1));
      return `val ${ThemeName}${ModeName}${name} = ${parseFloat(val(t)).toFixed(2)}f`;
    });
    const allExtras = [...extraColorVals, ...extraOpacityVals];
    const extras   = allExtras.length ? `\n${allExtras.join('\n')}` : '';

    return `// Auto-generated by bitsandbolts-themes — do not edit
// Theme: ${ThemeName} / Mode: ${ModeName}
//
// To set your package name, run:
//   ANDROID_PACKAGE=com.yourapp pnpm build
// or find-and-replace REPLACE_ME after copying.
package ${ANDROID_PACKAGE}.ui.theme.generated

import androidx.compose.material3.${schemeType}
import androidx.compose.ui.graphics.Color

${consts}

val ${ThemeName}${ModeName}ColorScheme = ${schemeType}(
${entries}
)
${extras}
`;
  },
});

// ─── Custom Format: TypeScript / React Native ─────────────────────────────────

StyleDictionary.registerFormat({
  name: 'typescript/react-native',
  format: ({ dictionary, options }) => {
    const { theme, mode } = options;

    const colorTokens    = dictionary.allTokens.filter(t => t.path[0] === 'color');
    const spacingTokens  = dictionary.allTokens.filter(t => t.path[0] === 'spacing');
    const radiusTokens   = dictionary.allTokens.filter(t => t.path[0] === 'radius');
    const fontSizeTokens = dictionary.allTokens.filter(t => t.path[0] === 'font' && t.path[1] === 'size');
    const fontWtTokens   = dictionary.allTokens.filter(t => t.path[0] === 'font' && t.path[1] === 'weight');
    const fontFamTokens  = dictionary.allTokens.filter(t => t.path[0] === 'font' && t.path[1] === 'family');

    const v     = t => t.value ?? t.$value;
    const toNum = t => parseFloat(v(t));
    const colFmt  = colorTokens.map(t => `  ${t.path[1]}: '${v(t)}'`).join(',\n');
    const spFmt   = spacingTokens.map(t => `  '${t.path[1]}': ${toNum(t)}`).join(',\n');
    const radFmt  = radiusTokens.map(t => `  '${t.path[1]}': ${toNum(t)}`).join(',\n');
    const fsFmt   = fontSizeTokens.map(t => `  '${t.path[2]}': ${toNum(t)}`).join(',\n');
    const fwFmt   = fontWtTokens.map(t => `  '${t.path[2]}': '${v(t)}'`).join(',\n');
    const ffFmt   = fontFamTokens.map(t => `  ${t.path[2]}: '${v(t)}'`).join(',\n');

    return `// Auto-generated by bitsandbolts-themes — do not edit
// Theme: ${theme} / Mode: ${mode}
// Note: font files must be bundled in your app — see README.

export const colors = {
${colFmt}
} as const;

export const spacing = {
${spFmt}
} as const;

export const radii = {
${radFmt}
} as const;

export const fontSize = {
${fsFmt}
} as const;

export const fontWeight = {
${fwFmt}
} as const;

export const fontFamily = {
${ffFmt}
} as const;
`;
  },
});

// ─── Build ────────────────────────────────────────────────────────────────────

for (const theme of THEMES) {
  for (const mode of MODES) {
    const modeName = mode.charAt(0).toUpperCase() + mode.slice(1);
    const selector = mode === 'light' ? ':root' : '[data-theme="dark"]';

    const sd = new StyleDictionary({
      include: [
        'tokens/base/**/*.json',
      ],
      source: [
        `tokens/themes/${theme}/${mode}.json`,
      ],
      platforms: {
        // CSS custom properties — import in Tauri/Vue or any web project
        web: {
          transformGroup: 'css',
          prefix: 'bb',
          buildPath: `dist/web/${theme}/`,
          files: [{
            destination: `${mode}.css`,
            format: 'css/variables',
            options: { selector, outputReferences: false },
          }],
        },

        // Kotlin color scheme — copy to ui/theme/generated/ in Android project
        android: {
          transforms: ['attribute/cti'],
          buildPath: `dist/android/${theme}/`,
          files: [{
            destination: `${modeName}Colors.kt`,
            format: 'kotlin/color-scheme',
            filter: token => token.path[0] === 'color' || token.path[0] === 'opacity',
            options: { theme, mode },
          }],
        },

        // TypeScript constants — import in React Native or Expo project
        reactNative: {
          transformGroup: 'js',
          buildPath: `dist/react-native/${theme}/`,
          files: [{
            destination: `${mode}.ts`,
            format: 'typescript/react-native',
            options: { theme, mode },
          }],
        },
      },
    });

    await sd.buildAllPlatforms();
    process.stdout.write(`  [${theme}/${mode}] done\n`);
  }

  const scopedCss = MODES.map((mode) => {
    const source = readFileSync(`dist/web/${theme}/${mode}.css`, 'utf8');
    const globalSelector = mode === 'light' ? ':root' : '[data-theme="dark"]';
    const scopedSelector = `[data-bb-theme-family="${theme}"][data-bb-theme-mode="${mode}"]`;
    if (!source.includes(`${globalSelector} {`)) {
      throw new Error(`[scoped-theme] ${theme}/${mode} is missing its expected selector.`);
    }
    return source.replace(`${globalSelector} {`, `${scopedSelector} {`);
  }).join('\n');
  writeFileSync(`dist/web/${theme}/scoped.css`, scopedCss);
  process.stdout.write(`  [${theme}/scoped] done\n`);
}

function assertMarketingRecipeContract() {
  const recipe = readFileSync('components/marketing.css', 'utf8');
  if (/#[0-9a-f]{3,8}\b|rgba?\s*\(/i.test(recipe)) {
    throw new Error('[marketing-contract] components/marketing.css contains an unowned literal color.');
  }
  let universalPlan = null;
  for (const theme of THEMES) {
    for (const mode of MODES) {
      const generatedPath = `dist/web/${theme}/${mode}.css`;
      const generated = readFileSync(generatedPath, 'utf8');
      const variables = cssVariablesFromGeneratedFile(generatedPath);
      for (const variable of REQUIRED_MARKETING_VARIABLES) {
        if (!generated.includes(`${variable}:`)) {
          throw new Error(`[marketing-contract] ${theme}/${mode} is missing ${variable}.`);
        }
      }
      const resolvedPlan = Object.fromEntries(UNIVERSAL_PLAN_VARIABLES.map((variable) => [variable, variables[variable]]));
      if (universalPlan === null) universalPlan = resolvedPlan;
      else if (JSON.stringify(resolvedPlan) !== JSON.stringify(universalPlan)) {
        throw new Error(`[marketing-contract] ${theme}/${mode} overrides universal coal/silver/gold colors.`);
      }
    }
    const scoped = readFileSync(`dist/web/${theme}/scoped.css`, 'utf8');
    for (const mode of MODES) {
      const selector = `[data-bb-theme-family="${theme}"][data-bb-theme-mode="${mode}"]`;
      if (!scoped.includes(selector)) throw new Error(`[scoped-theme] ${theme} is missing ${mode}.`);
    }
  }
}

assertMarketingRecipeContract();

function assertSharedWebAssets() {
  const ids = new Set();
  const destinations = new Set();
  for (const asset of SHARED_WEB_ASSETS) {
    if (ids.has(asset.id) || destinations.has(asset.path)) throw new Error('[shared-assets] IDs and output paths must be unique.');
    if (!existsSync(asset.sourcePath)) throw new Error(`[shared-assets] Missing ${asset.sourcePath}.`);
    ids.add(asset.id);
    destinations.add(asset.path);
  }
}

assertSharedWebAssets();

// ─── Copy static components to dist ─────────────────────────────────────────

function copyDirRecursive(srcDir, destDir, pathLabel) {
  if (!existsSync(srcDir)) return;
  mkdirSync(destDir, { recursive: true });
  for (const entry of readdirSync(srcDir)) {
    const srcPath = join(srcDir, entry);
    const destPath = join(destDir, entry);
    if (statSync(srcPath).isDirectory()) {
      copyDirRecursive(srcPath, destPath, pathLabel ? `${pathLabel}/${entry}` : entry);
      continue;
    }
    copyFileSync(srcPath, destPath);
    process.stdout.write(`  [${pathLabel ? `${pathLabel}/` : ''}${entry}] done\n`);
  }
}

const COMPONENTS_SRC  = 'components';
const COMPONENTS_DIST = 'dist/web/components';
mkdirSync(COMPONENTS_DIST, { recursive: true });
for (const file of readdirSync(COMPONENTS_SRC)) {
  if (file.endsWith('.css')) {
    copyFileSync(join(COMPONENTS_SRC, file), join(COMPONENTS_DIST, file));
    process.stdout.write(`  [components/${file}] done\n`);
  }
}

// Copy icon assets to dist for use in apps
const ICONS_SRC  = 'assets/icons';
const ICONS_DIST = 'dist/web/icons';
mkdirSync(ICONS_DIST, { recursive: true });
for (const file of readdirSync(ICONS_SRC)) {
  if (file.endsWith('.svg')) {
    copyFileSync(join(ICONS_SRC, file), join(ICONS_DIST, file));
    process.stdout.write(`  [icons/${file}] done\n`);
  }
}

copyDirRecursive('assets/brand', 'dist/web/brand', 'brand');

// Copy static Android Kotlin sources to dist/android/
// These use REPLACE_ME as a package placeholder; dev.sh substitutes the real package.
const ANDROID_STATIC_SRC  = 'android';
const ANDROID_STATIC_DIST = 'dist/android';
mkdirSync(ANDROID_STATIC_DIST, { recursive: true });
for (const file of readdirSync(ANDROID_STATIC_SRC)) {
  if (file.endsWith('.kt')) {
    copyFileSync(join(ANDROID_STATIC_SRC, file), join(ANDROID_STATIC_DIST, file));
    process.stdout.write(`  [android/${file}] done\n`);
  }
}

// Copy bundled Android TTF fonts to dist/android/fonts/
const ANDROID_FONTS_SRC  = 'assets/android-fonts';
const SHARED_FONTS_SRC = 'assets/shared-fonts';
const ANDROID_FONTS_DIST = 'dist/android/fonts';
mkdirSync(ANDROID_FONTS_DIST, { recursive: true });
for (const file of readdirSync(ANDROID_FONTS_SRC)) {
  if (file.endsWith('.ttf')) {
    copyFileSync(join(ANDROID_FONTS_SRC, file), join(ANDROID_FONTS_DIST, file));
    process.stdout.write(`  [android/fonts/${file}] done\n`);
  }
}
copyDirRecursive(SHARED_FONTS_SRC, ANDROID_FONTS_DIST, 'android/fonts');

// Copy Android vector drawables to dist/android/drawables/
const ANDROID_DRAWABLES_DIST = 'dist/android/drawables';
mkdirSync(ANDROID_DRAWABLES_DIST, { recursive: true });
for (const file of readdirSync(ICONS_SRC)) {
  if (file.endsWith('.xml')) {
    copyFileSync(join(ICONS_SRC, file), join(ANDROID_DRAWABLES_DIST, file));
    process.stdout.write(`  [android/drawables/${file}] done\n`);
  }
}

// Copy locally bundled fonts to dist so apps never need to fetch from network
const FONTS_SRC  = 'fonts';
const FONTS_DIST = 'dist/web/fonts';
mkdirSync(FONTS_DIST, { recursive: true });
for (const file of readdirSync(FONTS_SRC)) {
  copyFileSync(join(FONTS_SRC, file), join(FONTS_DIST, file));
  process.stdout.write(`  [fonts/${file}] done\n`);
}

const WEB_FONTS_SRC = 'assets/web-fonts';
for (const source of [ANDROID_FONTS_SRC, WEB_FONTS_SRC, SHARED_FONTS_SRC]) {
  copyDirRecursive(source, FONTS_DIST, 'web-fonts');
}

function assertBundledPrimaryFonts() {
  const declaredFamilies = new Set();
  for (const file of readdirSync(COMPONENTS_DIST).filter((name) => name.endsWith('.css'))) {
    const css = readFileSync(join(COMPONENTS_DIST, file), 'utf8');
    for (const match of css.matchAll(/@font-face\s*\{([\s\S]*?)\}/gi)) {
      const family = match[1].match(/font-family\s*:\s*['"]?([^;'"\n]+)['"]?\s*;/i)?.[1]?.trim();
      const relativeUrl = match[1].match(/url\(['"]?([^)'"\n]+)['"]?\)/i)?.[1];
      if (family) declaredFamilies.add(family);
      if (relativeUrl && !existsSync(join(COMPONENTS_DIST, relativeUrl))) {
        throw new Error(`[font-contract] components/${file} references missing bundled font ${relativeUrl}.`);
      }
    }
  }

  const tokenFamilies = new Set();
  const files = [
    'tokens/base/typography.json',
    ...THEMES.flatMap((theme) => MODES.map((mode) => `tokens/themes/${theme}/${mode}.json`)),
  ];
  for (const file of files) {
    if (!existsSync(file)) continue;
    const families = JSON.parse(readFileSync(file, 'utf8'))?.font?.family ?? {};
    Object.values(families).forEach((token) => tokenFamilies.add(String(token?.$value ?? '').trim()));
  }
  for (const family of tokenFamilies) {
    if (!declaredFamilies.has(family)) {
      throw new Error(`[font-contract] ${family} is declared by a theme token but has no bundled @font-face.`);
    }
  }
}

assertBundledPrimaryFonts();

console.log('\n✓ All themes built successfully.');
console.log(`  dist/web/           CSS custom properties + components + icons`);
console.log(`  dist/android/       Kotlin Color Schemes (package: ${ANDROID_PACKAGE})`);
console.log(`  dist/react-native/  TypeScript constants`);

// ─── Per-theme icon config ────────────────────────────────────────────────────
for (const theme of THEMES) {
  const iconsFile = `tokens/themes/${theme}/icons.json`;
  const icons = existsSync(iconsFile)
    ? JSON.parse(readFileSync(iconsFile, 'utf8'))
    : { family: 'material-symbols', style: 'filled' };

  // Web: CSS custom properties consumed by BbIcon.vue
  writeFileSync(`dist/web/${theme}/icons.css`,
    `/* Auto-generated by bitsandbolts-themes build.js — do not edit */\n` +
    `:root {\n` +
    `  --bb-icon-family: ${icons.family};\n` +
    `  --bb-icon-style: ${icons.style};\n` +
    `}\n`);
  process.stdout.write(`  [${theme}/icons.css] done\n`);

  // Android: Kotlin icon object with resolved filled/outlined ImageVectors
  const ThemeName    = theme[0].toUpperCase() + theme.slice(1);
  const composeStyle = icons.style === 'filled' ? 'Filled' : 'Outlined';
  writeFileSync(`dist/android/${theme}/IconStyle.kt`,
    `// Auto-generated by bitsandbolts-themes — do not edit\n` +
    `// Theme: ${ThemeName} / Icon style: ${icons.style}\n` +
    `package ${ANDROID_PACKAGE}.ui.theme.generated\n\n` +
    `import androidx.compose.material.icons.Icons\n` +
    `import androidx.compose.material.icons.filled.*\n` +
    `import androidx.compose.material.icons.outlined.*\n` +
    `import androidx.compose.material.icons.automirrored.filled.*\n` +
    `import androidx.compose.material.icons.automirrored.outlined.*\n` +
    `import androidx.compose.ui.graphics.vector.ImageVector\n\n` +
    `object ${ThemeName}Icons {\n` +
    `    val Settings:      ImageVector = Icons.${composeStyle}.Settings\n` +
    `    val CloudUpload:   ImageVector = Icons.${composeStyle}.CloudUpload\n` +
    `    val CloudDownload: ImageVector = Icons.${composeStyle}.CloudDownload\n` +
    `    val ArrowBack:     ImageVector = Icons.AutoMirrored.${composeStyle}.ArrowBack\n` +
    `    val Person:        ImageVector = Icons.${composeStyle}.Person\n` +
    `    val Logout:        ImageVector = Icons.AutoMirrored.${composeStyle}.ExitToApp\n` +
    `    val Devices:       ImageVector = Icons.${composeStyle}.Devices\n` +
    `    val Smartphone:    ImageVector = Icons.${composeStyle}.Smartphone\n` +
    `    val Computer:      ImageVector = Icons.${composeStyle}.Computer\n` +
    `    val Visibility:    ImageVector = Icons.${composeStyle}.Visibility\n` +
    `    val VisibilityOff: ImageVector = Icons.${composeStyle}.VisibilityOff\n` +
    `    val Lock:          ImageVector = Icons.${composeStyle}.Lock\n` +
    `    val MarkEmailRead: ImageVector = Icons.${composeStyle}.MarkEmailRead\n` +
    `}\n`);
  process.stdout.write(`  [${theme}/IconStyle.kt] done\n`);
}

// ─── First-party web catalog ────────────────────────────────────────────────

function cssVariablesFromGeneratedFile(file) {
  const css = readFileSync(file, 'utf8');
  return Object.fromEntries([...css.matchAll(/(--bb-[a-z0-9-]+):\s*([^;]+);/gi)]
    .map((match) => [match[1], match[2].trim()]));
}

function iconConfigForTheme(theme) {
  const file = `tokens/themes/${theme}/icons.json`;
  return existsSync(file)
    ? JSON.parse(readFileSync(file, 'utf8'))
    : { family: 'material-symbols', style: 'filled' };
}

function readJsonFile(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

function flattenDtcgTokens(value, prefix = [], tokens = new Map()) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return tokens;
  if (Object.hasOwn(value, '$value')) {
    tokens.set(prefix.join('.'), value.$value);
    return tokens;
  }
  for (const [key, child] of Object.entries(value)) {
    if (!key.startsWith('$')) flattenDtcgTokens(child, [...prefix, key], tokens);
  }
  return tokens;
}

function resolveDtcgToken(tokens, path, resolving = new Set()) {
  if (!tokens.has(path)) throw new Error(`[v2-contract] Missing token reference: ${path}`);
  if (resolving.has(path)) throw new Error(`[v2-contract] Circular token reference: ${path}`);
  const rawValue = tokens.get(path);
  const reference = typeof rawValue === 'string' ? rawValue.match(/^\{([^}]+)\}$/)?.[1] : '';
  if (!reference) return rawValue;
  resolving.add(path);
  const resolved = resolveDtcgToken(tokens, reference, resolving);
  resolving.delete(path);
  return resolved;
}

function colorValueToCss(value, path) {
  if (!value || value.colorSpace !== 'srgb' || !Array.isArray(value.components) || value.components.length !== 3) {
    throw new Error(`[v2-contract] ${path} must resolve to a DTCG sRGB color.`);
  }
  if (!value.components.every((component) => Number.isFinite(component) && component >= 0 && component <= 1)) {
    throw new Error(`[v2-contract] ${path} contains an invalid sRGB component.`);
  }
  const alpha = value.alpha ?? 1;
  if (!Number.isFinite(alpha) || alpha < 0 || alpha > 1 || !/^#[0-9A-F]{6}$/i.test(value.hex || '')) {
    throw new Error(`[v2-contract] ${path} contains invalid color metadata.`);
  }
  if (alpha === 1) return value.hex.toUpperCase();
  const channels = value.components.map((component) => Math.round(component * 255));
  return `rgb(${channels.join(' ')} / ${alpha})`;
}

function kebabCase(value) {
  return String(value)
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replaceAll('.', '-')
    .toLowerCase();
}

function assertExactMembers(actual, expected, label) {
  const actualSet = new Set(actual);
  const expectedSet = new Set(expected);
  const missing = expected.filter((member) => !actualSet.has(member));
  const unexpected = actual.filter((member) => !expectedSet.has(member));
  if (missing.length || unexpected.length) {
    throw new Error(`[v2-contract] ${label} mismatch. Missing: ${missing.join(', ') || 'none'}. Unexpected: ${unexpected.join(', ') || 'none'}.`);
  }
}

function assertSingleV2FontFamily(family, role) {
  const normalized = String(family || '').trim();
  if (!normalized || normalized.includes(',') || GENERIC_FONT_FAMILIES.has(normalized.toLowerCase())) {
    throw new Error(`[v2-contract] typography.families.${role} must name exactly one bundled font family.`);
  }
}

function buildBitsAndBoltsV2CatalogPayload() {
  const contract = readJsonFile(V2_CONTRACT_FILE);
  const family = readJsonFile(`${BITSANDBOLTS_V2_ROOT}/family.bb.json`);
  const button = readJsonFile(`${BITSANDBOLTS_V2_ROOT}/recipes/button.recipe.json`);
  if (contract.contractVersion !== '2.0.0' || family.contractVersion !== contract.contractVersion || button.contractVersion !== contract.contractVersion) {
    throw new Error('[v2-contract] Contract, family, and Button recipe versions must match 2.0.0.');
  }

  assertExactMembers(
    family.allowedResolutions.map(({ mode, density }) => `${mode}/${density}`),
    MODES.map((mode) => `${mode}/standard`),
    'Bits & Bolts runtime resolutions'
  );
  assertExactMembers(
    family.identity.map(({ id }) => id),
    contract.color.creatorIdentityRoles,
    'creator identity roles'
  );

  for (const role of contract.typography.mandatoryFamilyRoles) {
    assertSingleV2FontFamily(family.typography.families?.[role], role);
  }
  for (const role of contract.typography.optionalFamilyRoles) {
    if (family.typography.families?.[role]) assertSingleV2FontFamily(family.typography.families[role], role);
  }
  assertExactMembers(
    Object.keys(family.typography.styles || {}),
    contract.typography.mandatoryStyles,
    'semantic typography styles'
  );
  for (const [styleId, style] of Object.entries(family.typography.styles)) {
    if (!family.typography.families[style.familyRole]) {
      throw new Error(`[v2-contract] typography.styles.${styleId} references unknown family role ${style.familyRole}.`);
    }
  }

  for (const field of contract.componentRecipes.requiredFields) {
    if (!Object.hasOwn(button, field)) throw new Error(`[v2-contract] Button recipe is missing ${field}.`);
  }
  assertExactMembers(button.stateMatrix, ['rest', 'hover', 'focusVisible', 'pressed', 'loading', 'disabled'], 'Button states');
  if (button.id !== contract.componentRecipes.mandatoryFirstSlice[0]) {
    throw new Error('[v2-contract] The mandatory first component recipe must be Button.');
  }

  const modes = Object.fromEntries(MODES.map((mode) => {
    const tokens = flattenDtcgTokens(readJsonFile(`${BITSANDBOLTS_V2_ROOT}/modes/${mode}.tokens.json`));
    const semanticPaths = [...tokens.keys()].filter((path) => path.startsWith('color.'));
    assertExactMembers(semanticPaths, contract.color.mandatoryRoles, `${mode} semantic color roles`);

    const resolvedColors = Object.fromEntries(contract.color.mandatoryRoles.map((path) => [
      path,
      colorValueToCss(resolveDtcgToken(tokens, path), path),
    ]));
    const identity = family.identity.map((entry) => ({
      ...entry,
      value: colorValueToCss(resolveDtcgToken(tokens, entry.token), entry.token),
    }));
    const variables = Object.fromEntries(Object.entries(resolvedColors).map(([path, value]) => [
      `--bb-v2-${kebabCase(path)}`,
      value,
    ]));

    for (const [role, familyName] of Object.entries(family.typography.families)) {
      variables[`--bb-v2-font-family-${kebabCase(role)}`] = familyName;
    }
    for (const [styleId, style] of Object.entries(family.typography.styles)) {
      for (const [property, value] of Object.entries(style)) {
        if (property !== 'familyRole') variables[`--bb-v2-type-${kebabCase(styleId)}-${kebabCase(property)}`] = value;
      }
      variables[`--bb-v2-type-${kebabCase(styleId)}-family`] = family.typography.families[style.familyRole];
    }
    for (const shape of family.shapeSpecimens) {
      variables[`--bb-v2-shape-${shape.id}-radius`] = shape.radius;
      variables[`--bb-v2-shape-${shape.id}-cut`] = shape.cut;
    }
    for (const material of family.materialSpecimens) {
      variables[`--bb-v2-material-${material.id}-border-width`] = material.borderWidth;
    }
    for (const [depth, value] of Object.entries(family.depth)) variables[`--bb-v2-depth-${depth}`] = value;
    for (const [motion, values] of Object.entries(family.motion)) {
      variables[`--bb-v2-motion-${motion}-duration`] = values.duration;
      variables[`--bb-v2-motion-${motion}-easing`] = values.easing;
    }
    for (const [size, values] of Object.entries(button.sizes)) {
      for (const [property, value] of Object.entries(values)) {
        variables[`--bb-v2-button-${size}-${kebabCase(property)}`] = value;
      }
    }
    variables['--bb-v2-button-shape-radius'] = family.shapeSpecimens.find(({ id }) => id === 'control').radius;
    variables['--bb-v2-button-shape-cut'] = family.shapeSpecimens.find(({ id }) => id === 'control').cut;
    variables['--bb-v2-button-depth'] = family.depth.low;

    return [mode, {
      identity,
      semanticColors: contract.color.mandatoryRoles.map((role) => ({ role, value: resolvedColors[role] })),
      variables,
    }];
  }));

  return {
    contractVersion: contract.contractVersion,
    themeVersion: family.themeVersion,
    artDirection: family.artDirection,
    typography: family.typography,
    shapes: family.shapeSpecimens,
    materials: family.materialSpecimens,
    depth: family.depth,
    motion: family.motion,
    button,
    modes,
  };
}

const packageManifest = JSON.parse(readFileSync('package.json', 'utf8'));
const bitsAndBoltsV2 = buildBitsAndBoltsV2CatalogPayload();
const catalog = {
  schemaVersion: 1,
  packageVersion: packageManifest.version,
  sharedAssets: SHARED_WEB_ASSETS.map(({ sourcePath: _sourcePath, ...asset }) => asset),
  themes: THEMES.map((theme) => {
    const configuredIcons = iconConfigForTheme(theme);
    const entry = {
      id: theme,
      label: THEME_LABELS[theme] ?? theme,
      source: 'first-party',
      modes: Object.fromEntries(MODES.map((mode) => [
        mode,
        {
          cssPath: `${theme}/${mode}.css`,
          variables: cssVariablesFromGeneratedFile(`dist/web/${theme}/${mode}.css`),
        },
      ])),
      icons: {
        family: configuredIcons.family,
        style: configuredIcons.style,
        previewFamily: 'material-symbols',
        exactPreview: configuredIcons.family === 'material-symbols',
        previewNames: ICON_PREVIEW_NAMES,
      },
    };
    if (theme === 'bitsandbolts') entry.v2 = bitsAndBoltsV2;
    return entry;
  }),
};

writeFileSync('dist/web/catalog.json', `${JSON.stringify(catalog, null, 2)}\n`);
process.stdout.write('  [web/catalog.json] done\n');

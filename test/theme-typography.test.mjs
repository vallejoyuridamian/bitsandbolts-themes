import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  normalizeThemeCatalog,
  themeDetailTitlePresentation,
  themeGalleryMarkup
} from '../components/theme-gallery.js';
import {
  normalizeThemeTypographyVariants,
  normalizeThemeTextStylePresetId,
  resolveThemeTextStylePreset,
  THEME_TEXT_STYLE_PRESETS,
  themeTypographyVariantPresentation,
  themeTypographyVariantVariables
} from '../components/theme-typography.js';

const familyIds = [
  'bitsandbolts',
  'brutus',
  'bubblegum',
  'cloud',
  'coffee',
  'forest',
  'inferno',
  'sober',
  'winter'
];

test('canonical Theme families declare complete font variants without utility labels', async () => {
  const families = await Promise.all(familyIds.map(async (id) => JSON.parse(await readFile(
    new URL(`../families/${id}/v2/family.bb.json`, import.meta.url),
    'utf8'
  ))));

  families.forEach((family) => {
    assert.doesNotMatch(family.artDirection.label, /\butility\b/i);
    assert.deepEqual(Object.keys(family.typography.variants), ['signature', 'interface', 'technical']);
    Object.values(family.typography.variants).forEach((variant) => {
      assert.deepEqual(Object.keys(variant), ['bold', 'italic', 'underline']);
      Object.values(variant).forEach((selected) => assert.equal(typeof selected, 'boolean'));
    });
  });
});

test('Theme font variants normalize legacy values and publish presentation variables', () => {
  const variants = normalizeThemeTypographyVariants({}, [{
    label: 'Signature',
    fontWeight: '700'
  }]);
  variants.signature.italic = true;
  variants.signature.underline = true;

  assert.deepEqual(themeTypographyVariantPresentation(variants.signature), {
    fontStyle: 'italic',
    fontWeight: '700',
    textDecoration: 'underline'
  });
  assert.deepEqual(themeTypographyVariantVariables(variants), {
    '--bb-theme-typography-signature-font-weight': '700',
    '--bb-theme-typography-signature-font-style': 'italic',
    '--bb-theme-typography-signature-text-decoration': 'underline',
    '--bb-theme-typography-interface-font-weight': '400',
    '--bb-theme-typography-interface-font-style': 'normal',
    '--bb-theme-typography-interface-text-decoration': 'none',
    '--bb-theme-typography-technical-font-weight': '400',
    '--bb-theme-typography-technical-font-style': 'normal',
    '--bb-theme-typography-technical-text-decoration': 'none'
  });
});

test('Theme text style presets resolve the research-backed width-height modular hierarchy', () => {
  assert.deepEqual(
    THEME_TEXT_STYLE_PRESETS.map(({ id, label, fontRole, lineHeight, referenceSize }) => ({
      id,
      label,
      fontRole,
      lineHeight,
      referenceSize
    })),
    [
      { id: 'display', label: 'Display', fontRole: 'signature', lineHeight: 0.98, referenceSize: 136 },
      { id: 'title', label: 'Title', fontRole: 'signature', lineHeight: 1.02, referenceSize: 113 },
      { id: 'heading', label: 'Heading', fontRole: 'interface', lineHeight: 1.08, referenceSize: 94 },
      { id: 'body', label: 'Body', fontRole: 'interface', lineHeight: 1.2, referenceSize: 79 },
      { id: 'caption', label: 'Caption', fontRole: 'interface', lineHeight: 1.2, referenceSize: 66 }
    ]
  );
  assert.equal(normalizeThemeTextStylePresetId(' TITLE '), 'title');
  assert.equal(normalizeThemeTextStylePresetId('unknown'), '');
  assert.deepEqual(resolveThemeTextStylePreset('title', {
    width: 1080,
    height: 1920,
    typography: {
      variants: {
        signature: { bold: false, italic: false, underline: false }
      }
    }
  }), {
    baseSize: 136,
    fontRole: 'signature',
    height: 1920,
    id: 'title',
    label: 'Title',
    lineHeight: 1.02,
    normalizedSize: 113.33333333333334,
    referenceHeight: 1920,
    referenceSize: 113,
    referenceWidth: 1080,
    size: 113,
    width: 1080
  });
  assert.equal(resolveThemeTextStylePreset('display', { width: 1920, height: 1080 }).size, 194);
  assert.equal(resolveThemeTextStylePreset('caption', { width: 1500, height: 500 }).size, 43);
});

test('Theme text style presets retain a future per-Theme recipe override seam', () => {
  assert.deepEqual(resolveThemeTextStylePreset('body', {
    width: 2160,
    height: 3840,
    typography: {
      textStylePresets: {
        body: { fontRole: 'technical', lineHeight: 1.1, referenceSize: 54 }
      },
      variants: {
        technical: { bold: true, italic: false, underline: false }
      }
    }
  }), {
    baseSize: 272,
    fontRole: 'technical',
    height: 3840,
    id: 'body',
    label: 'Body',
    lineHeight: 1.1,
    normalizedSize: 108,
    referenceHeight: 1920,
    referenceSize: 54,
    referenceWidth: 1080,
    size: 108,
    width: 2160
  });
});

test('Theme cards and detail titles expose saved semantic font variants', async () => {
  const catalog = normalizeThemeCatalog(JSON.parse(await readFile(
    new URL('../dist/web/catalog.json', import.meta.url),
    'utf8'
  )));
  const theme = catalog.themes.find((candidate) => candidate.id === 'bitsandbolts');
  const markup = themeGalleryMarkup(catalog);
  const title = themeDetailTitlePresentation(theme);

  assert.match(markup, /--bb-theme-typography-signature-font-weight: 700/);
  assert.match(markup, /--bb-theme-typography-interface-font-style: normal/);
  assert.deepEqual(title, {
    fontFamily: 'Orbitron',
    fontStyle: 'normal',
    fontWeight: '700',
    label: 'Bits & Bolts',
    textDecoration: 'none'
  });
});

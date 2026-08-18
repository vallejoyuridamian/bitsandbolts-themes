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

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { backgroundEditorMarkup } from '../components/background-editor.js';
import { layoutTextEditorRangeFieldMarkup } from '../components/layout-text-editor.js';
import { backgroundPatternAssets } from '../assets/patterns/catalog.js';

test('Pattern choices compose the canonical Select and labeled sliders', () => {
  const field = { key: 'scale', label: 'Scale', min: 0, max: 1000, step: 1, initial: 375, unit: '%', valueLabel: '200%' };
  const markup = backgroundEditorMarkup({ patterns: backgroundPatternAssets, patternFields: [field] });
  assert.match(markup, /<option value="pattern">Pattern<\/option>/);
  assert.match(markup, /<option value="squiggle">Squiggle<\/option>/);
  for (const asset of backgroundPatternAssets) {
    assert.ok(markup.includes(`<option value="${asset.id}">${asset.name}</option>`));
  }
  assert.doesNotMatch(markup, /type="number"/);
  assert.ok(markup.includes(layoutTextEditorRangeFieldMarkup({
    label: field.label, min: field.min, max: field.max, step: field.step, value: field.initial,
    unit: field.unit, valueLabel: field.valueLabel, attributes: {
    'aria-label': field.label, 'aria-valuetext': field.valueLabel, 'data-bb-background-pattern-field': field.key
  } })));
});

test('Background editor owns scope, theme, and background presentation', async () => {
  const css = await readFile(new URL('../components/background-editor.css', import.meta.url), 'utf8');
  const markup = backgroundEditorMarkup({
    id: 'sceneBackground',
    itemScopeLabel: 'Scene',
    presentation: 'window',
    showScope: true
  });

  assert.match(markup, /class="bb-background-editor__scope bb-segmented-control"/);
  assert.match(markup, /data-bb-background-editor-scope="project">Project<\/button>/);
  assert.match(markup, /data-bb-background-editor-scope="surface">Scene<\/button>/);
  assert.match(markup, /data-bb-background-editor-role="theme-control"/);
  assert.match(markup, />Background<\/label>/);
  assert.match(markup, /<option value="transparent">Transparent<\/option>/);
  assert.doesNotMatch(markup, /<option value="(?:default|gradient-image)"/);
  assert.match(markup, /class="bb-toolbar-popover__color-input bb-cut-corner-swatch"/);
  assert.match(markup, /data-bb-background-editor-role="opacity"/);
  assert.match(markup, /data-bb-background-editor-role="opacity-output"/);
  assert.match(markup, />Opacity<\/span>/);
  assert.equal((markup.match(/data-bb-background-editor-when="paint"/g) ?? []).length, 3);
  assert.match(css, /\.bb-background-editor__color-row \{[\s\S]*?grid-template-columns: minmax\(66px, 1fr\) 36px minmax\(66px, 1fr\)/);
});

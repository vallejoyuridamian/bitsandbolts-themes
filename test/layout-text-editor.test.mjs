import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  applyLayoutTextEditorRecipe,
  layoutTextEditorIconButtonMarkup
} from '../components/layout-text-editor.js';

function classList() {
  const values = new Set();
  return {
    add: (...classes) => classes.forEach((className) => values.add(className)),
    contains: (className) => values.has(className)
  };
}

test('layout text editor applies the canonical sidebar recipe', () => {
  const summaryClasses = classList();
  const node = {
    classList: classList(),
    dataset: {},
    querySelector: () => ({ classList: summaryClasses })
  };

  assert.equal(applyLayoutTextEditorRecipe({ node, presentation: 'sidebar' }), true);
  assert.equal(node.classList.contains('bb-layout-text-editor'), true);
  assert.equal(node.classList.contains('bb-interface-controls'), true);
  assert.equal(node.classList.contains('bb-layout-text-editor--sidebar'), true);
  assert.equal(summaryClasses.contains('bb-layout-text-editor__summary'), true);
});

test('layout text editor applies the canonical toolbar recipe', () => {
  const node = {
    classList: classList(),
    dataset: {},
    querySelector: () => null
  };

  assert.equal(applyLayoutTextEditorRecipe({ node, presentation: 'toolbar' }), true);
  assert.equal(node.classList.contains('bb-layout-text-editor'), true);
  assert.equal(node.classList.contains('bb-interface-controls'), true);
  assert.equal(node.classList.contains('bb-layout-text-editor--toolbar'), true);
});

test('layout text editor CSS owns its text, segmented, animation, and range controls', async () => {
  const css = await readFile(new URL('../components/layout-text-editor.css', import.meta.url), 'utf8');
  const interfaceCss = await readFile(new URL('../components/interface-primitives.css', import.meta.url), 'utf8');
  assert.match(css, /\.bb-layout-text-editor \.segmented/);
  assert.match(css, /\.bb-layout-text-editor \.animation-item/);
  assert.match(css, /\.bb-layout-text-editor \.range-control/);
  assert.match(css, /\.bb-layout-text-editor input\[type="color"\]/);
  assert.match(css, /\.bb-layout-text-editor\.bb-layout-text-editor--toolbar/);
  assert.match(css, /\.bb-workspace-control-bar__leading:has\(> \.bb-layout-text-editor--toolbar\)/);
  assert.match(css, /\.bb-layout-text-editor\.bb-layout-text-editor--toolbar > \*/);
  assert.match(css, /align-items: center;/);
  assert.match(css, /gap: 5px;/);
  assert.match(css, /input\[type="number"\]/);
  assert.match(css, /\.bb-semantic-icon/);
  assert.match(css, /> \.bb-layout-text-editor__font-control > \.bb-select/);
  assert.doesNotMatch(css, /bb-layout-text-editor--window/);
  assert.doesNotMatch(css, /\.bb-select__caret/);
  assert.doesNotMatch(css, /\.bb-layout-text-editor__font-control \.bb-select__trigger/);
  assert.match(interfaceCss, /\.bb-select:is\(\.is-open, \[data-specimen-state="open"\]\) \.bb-select__caret/);
  assert.match(interfaceCss, /transform: rotate\(180deg\);/);
});

test('layout text editor icon buttons use the workspace icon recipe and hover help', () => {
  const markup = layoutTextEditorIconButtonMarkup({
    attributes: {
      'aria-pressed': 'false',
      'data-text-toggle': 'bold'
    },
    iconRole: 'format_bold',
    label: 'Bold',
    shortcut: 'Ctrl+B'
  });

  assert.match(markup, /bb-workspace-control-button--icon/);
  assert.match(markup, /data-bb-icon-role="format_bold"/);
  assert.match(markup, /aria-label="Bold"/);
  assert.match(markup, /title="Bold \(Ctrl\+B\)"/);
  assert.match(markup, /aria-pressed="false"/);
});

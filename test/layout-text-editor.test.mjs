import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  applyLayoutTextEditorRecipe,
  LAYOUT_TEXT_EDITOR_MIXED_VALUE,
  layoutTextEditorColorPaletteMarkup,
  layoutTextEditorColorSwatchMarkup,
  layoutTextEditorCheckboxMarkup,
  layoutTextEditorArrangePopoverMarkup,
  layoutTextEditorIconButtonMarkup,
  layoutTextEditorMixedOptionMarkup,
  layoutTextEditorOriginalColorMarkup,
  layoutTextEditorProjectColorAddMarkup,
  syncLayoutTextEditorProjectColorPreview,
  syncLayoutTextEditorMixedState
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

test('layout text editor owns the arrangement popover composition', async () => {
  const twoSelection = layoutTextEditorArrangePopoverMarkup({
    includeViewportDistribution: true,
    layoutLabel: 'Scene'
  });
  const threeSelection = layoutTextEditorArrangePopoverMarkup({
    includeSelectionDistribution: true,
    includeViewportDistribution: true,
    layoutLabel: 'Screen'
  });
  const css = await readFile(new URL('../components/layout-text-editor.css', import.meta.url), 'utf8');

  assert.match(twoSelection, /data-bb-layout-arrange-popover/);
  assert.match(twoSelection, /data-bb-layout-arrange-alignment/);
  assert.match(twoSelection, /data-bb-layout-arrange-viewport-distribution/);
  assert.match(twoSelection, /Distribute within Scene/);
  assert.doesNotMatch(twoSelection, /data-bb-layout-arrange-selection-distribution/);
  assert.match(threeSelection, /data-bb-layout-arrange-selection-distribution/);
  assert.match(threeSelection, /data-bb-layout-arrange-action="align-center-x"/);
  assert.match(threeSelection, /data-bb-layout-arrange-action="distribute-selection-horizontal"/);
  assert.match(threeSelection, /data-bb-layout-arrange-action="distribute-viewport-vertical"/);
  assert.match(threeSelection, /data-bb-icon-role="align_selection_bottom"/);
  assert.match(css, /\.bb-layout-arrange-popover \{/);
  assert.match(css, /\.bb-layout-arrange-popover__actions \{/);
});

test('layout text editor owns checkbox markup', async () => {
  const checkbox = layoutTextEditorCheckboxMarkup({
    attributes: { 'data-device-debug': 'hide-screen' },
    checked: true,
    label: 'Hide image'
  });
  const css = await readFile(new URL('../components/layout-text-editor.css', import.meta.url), 'utf8');

  assert.match(checkbox, /bb-checkbox-field__label bb-layout-text-editor__checkbox/);
  assert.match(checkbox, /data-device-debug="hide-screen"/);
  assert.match(checkbox, / checked/);
  assert.match(css, /\.bb-layout-text-editor \.bb-layout-text-editor__checkbox/);
});

test('layout text editor owns actionable mixed and indeterminate control states', async () => {
  const attributes = new Map([['aria-pressed', 'false']]);
  const toggle = {
    dataset: {},
    tagName: 'BUTTON',
    hasAttribute: (name) => attributes.has(name),
    setAttribute: (name, value) => attributes.set(name, value)
  };
  const checkboxAttributes = new Map();
  const checkbox = {
    dataset: {},
    indeterminate: false,
    tagName: 'INPUT',
    type: 'checkbox',
    setAttribute: (name, value) => checkboxAttributes.set(name, value),
    removeAttribute: (name) => checkboxAttributes.delete(name)
  };
  const number = {
    dataset: {},
    placeholder: '',
    tagName: 'INPUT',
    type: 'number',
    value: '24',
    removeAttribute(name) {
      if (name === 'placeholder') this.placeholder = '';
    }
  };

  assert.match(
    layoutTextEditorMixedOptionMarkup(),
    new RegExp(`value="${LAYOUT_TEXT_EDITOR_MIXED_VALUE}"[^>]*data-bb-layout-text-editor-mixed-option[^>]*hidden`)
  );
  assert.equal(syncLayoutTextEditorMixedState(toggle, { mixed: true }), true);
  assert.equal(attributes.get('aria-pressed'), 'mixed');
  assert.equal(syncLayoutTextEditorMixedState(checkbox, { mixed: true }), true);
  assert.equal(checkbox.indeterminate, true);
  assert.equal(checkboxAttributes.get('aria-checked'), 'mixed');
  assert.equal(syncLayoutTextEditorMixedState(number, { mixed: true }), true);
  assert.equal(number.value, '');
  assert.equal(number.placeholder, 'Mixed');
  syncLayoutTextEditorMixedState(number, { mixed: true, placeholder: '' });
  assert.equal(number.placeholder, '');

  syncLayoutTextEditorMixedState(toggle, { mixed: false });
  syncLayoutTextEditorMixedState(checkbox, { mixed: false });
  syncLayoutTextEditorMixedState(number, { mixed: false });
  assert.equal(attributes.get('aria-pressed'), 'false');
  assert.equal(checkbox.indeterminate, false);
  assert.equal(checkboxAttributes.has('aria-checked'), false);
  assert.equal(number.placeholder, '');

  const css = await readFile(new URL('../components/layout-text-editor.css', import.meta.url), 'utf8');
  assert.match(css, /\[data-bb-layout-text-editor-mixed\]::placeholder/);
  assert.match(css, /button\[aria-pressed="mixed"\]/);
  assert.match(css, /data-bb-layout-text-editor-mixed[^\n]*\.bb-toolbar-popover__trigger-value/);
});

test('layout text editor project colors use the shared add-tile and semantic icon recipes', async () => {
  const markup = layoutTextEditorProjectColorAddMarkup({
    attributes: { 'data-text-color-add': '' },
    value: '#12AB34'
  });
  const interfaceCss = await readFile(new URL('../components/interface-primitives.css', import.meta.url), 'utf8');

  assert.match(markup, /bb-color-swatch-add bb-workspace-add-tile bb-cut-corner-swatch/);
  assert.match(markup, /data-text-color-add=""/);
  assert.match(markup, /data-bb-icon-role="add"/);
  assert.match(markup, /value="#12AB34"/);
  assert.match(interfaceCss, /\.bb-color-swatch-add \{/);
  assert.match(interfaceCss, /\.bb-color-swatch-add:is\(:hover, :focus-within\)/);
  assert.match(interfaceCss, /\.bb-color-swatch-add\[data-bb-color-swatch-preview\]/);
  assert.match(interfaceCss, /\.bb-color-swatch-add__input \{/);
});

test('layout text editor project color preview paints and resets the add tile', () => {
  const properties = new Map();
  const tile = {
    dataset: {},
    matches: () => false,
    style: {
      removeProperty: (name) => properties.delete(name),
      setProperty: (name, value) => properties.set(name, value)
    }
  };
  const input = { closest: () => tile, defaultValue: '#EAEFFC' };

  assert.equal(syncLayoutTextEditorProjectColorPreview(input, '#12E6D5'), true);
  assert.equal(Object.hasOwn(tile.dataset, 'bbColorSwatchPreview'), true);
  assert.equal(properties.get('--bb-color-swatch-add-preview'), '#12E6D5');

  assert.equal(syncLayoutTextEditorProjectColorPreview(input, '#eaeffc'), true);
  assert.equal(Object.hasOwn(tile.dataset, 'bbColorSwatchPreview'), false);
  assert.equal(properties.has('--bb-color-swatch-add-preview'), false);

  syncLayoutTextEditorProjectColorPreview(input, '#12E6D5');

  assert.equal(syncLayoutTextEditorProjectColorPreview(input), true);
  assert.equal(Object.hasOwn(tile.dataset, 'bbColorSwatchPreview'), false);
  assert.equal(properties.has('--bb-color-swatch-add-preview'), false);
});

test('layout editor original image color uses the shared cut-corner and semantic icon recipes', async () => {
  const markup = layoutTextEditorOriginalColorMarkup({
    attributes: { 'data-image-color-original': '' },
    selected: true
  });
  const interfaceCss = await readFile(new URL('../components/interface-primitives.css', import.meta.url), 'utf8');

  assert.match(markup, /theme-swatch bb-color-swatch-original bb-cut-corner-swatch/);
  assert.match(markup, /data-image-color-original=""/);
  assert.match(markup, /data-bb-icon-role="close"/);
  assert.match(markup, /aria-pressed="true"/);
  assert.match(markup, /title="Original"/);
  assert.match(interfaceCss, /\.bb-color-swatch-original \{/);
  assert.match(interfaceCss, /\.bb-color-swatch-original \.bb-semantic-icon \{/);
});

test('layout editor color palette owns labeled rows, aligned swatches, and exact swatch help', async () => {
  const swatch = layoutTextEditorColorSwatchMarkup({
    attributes: { 'data-text-color-swatch': '#12E6D5' },
    color: '#12E6D5',
    help: 'Primary: #12E6D5',
    selected: true
  });
  const markup = layoutTextEditorColorPaletteMarkup({
    onTopMarkup: '<button data-on-top></button>',
    originalMarkup: '<button data-original></button>',
    projectMarkup: '<button data-project></button>',
    themeMarkup: swatch
  });
  const interfaceCss = await readFile(new URL('../components/interface-primitives.css', import.meta.url), 'utf8');

  assert.match(swatch, /class="theme-swatch bb-cut-corner-swatch"/);
  assert.match(swatch, /aria-label="Use Primary: #12E6D5"/);
  assert.match(swatch, /title="Primary: #12E6D5"/);
  assert.match(swatch, /style="--swatch:#12E6D5"/);
  assert.match(swatch, /aria-pressed="true"/);
  assert.match(swatch, /data-text-color-swatch="#12E6D5"/);
  assert.ok(markup.indexOf('>Original<') < markup.indexOf('>Theme<'));
  assert.ok(markup.indexOf('>Theme<') < markup.indexOf('>On top<'));
  assert.ok(markup.indexOf('>On top<') < markup.indexOf('>Project<'));
  assert.match(markup, /role="group" aria-label="Theme colors"/);
  assert.match(interfaceCss, /\.bb-color-palette \{/);
  assert.match(interfaceCss, /\.bb-color-palette__row \{/);
  assert.match(interfaceCss, /grid-template-columns: 48px minmax\(0, 1fr\);/);
  assert.match(interfaceCss, /\.bb-color-palette__swatches \{/);
  assert.match(interfaceCss, /grid-template-columns: repeat\(4, 30px\);/);
});

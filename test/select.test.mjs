import assert from 'node:assert/strict';
import test from 'node:test';

import {
  isSelectMenuVerticalBoundary,
  resolveSelectMenuPreferredHeight,
  resolveSelectMenuPosition,
  selectUsesExplicitExternalTrigger
} from '../components/select.js';

test('canonical Select owns opt-in font preview presentation', async () => {
  const source = await import('node:fs/promises').then(({ readFile }) => (
    readFile(new URL('../components/select.js', import.meta.url), 'utf8')
  ));
  const css = await import('node:fs/promises').then(({ readFile }) => (
    readFile(new URL('../components/interface-primitives.css', import.meta.url), 'utf8')
  ));

  assert.match(source, /bbSelectFontFamily/);
  assert.match(source, /bb-select__font-preview/);
  assert.match(css, /\.bb-select__font-preview/);
});

test('only explicitly hidden native selects can bind an external trigger', () => {
  const classList = (classes = []) => ({
    contains: (className) => classes.includes(className)
  });

  assert.equal(selectUsesExplicitExternalTrigger({ classList: classList([]) }), false);
  assert.equal(selectUsesExplicitExternalTrigger({
    classList: classList(['bb-select__native'])
  }), true);
});

test('portaled Select menus ignore horizontal-only toolbar overflow', () => {
  assert.equal(isSelectMenuVerticalBoundary({ overflowX: 'auto', overflowY: 'hidden' }), false);
  assert.equal(isSelectMenuVerticalBoundary({ overflowX: 'hidden', overflowY: 'clip' }), false);
  assert.equal(isSelectMenuVerticalBoundary({ overflowY: 'auto' }), true);
  assert.equal(isSelectMenuVerticalBoundary({ overflowY: 'scroll' }), true);
});

test('an unconstrained portaled Select menu keeps its natural height', () => {
  const position = resolveSelectMenuPosition({
    containerAvailableHeight: Number.POSITIVE_INFINITY,
    menuHeight: 240,
    menuWidth: 180,
    triggerRect: {
      bottom: 46,
      height: 30,
      left: 12,
      right: 42,
      top: 16,
      width: 30
    },
    viewportWidth: 320
  });

  assert.equal(position.maxHeight, 240);
  assert.equal(position.placement, 'below');
});

test('a Select menu reserves its full short list and caps long lists at five options', () => {
  assert.equal(resolveSelectMenuPreferredHeight({
    menuHeight: 74,
    menuTop: 100,
    optionBottoms: [131, 162],
    tailInset: 6
  }), 74);
  assert.equal(resolveSelectMenuPreferredHeight({
    menuHeight: 291,
    menuTop: 100,
    optionBottoms: [131, 162, 193, 224, 255, 286, 317, 348, 379],
    tailInset: 6
  }), 161);
});

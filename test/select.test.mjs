import assert from 'node:assert/strict';
import test from 'node:test';

import {
  isSelectMenuVerticalBoundary,
  resolveSelectMenuPosition
} from '../components/select.js';

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

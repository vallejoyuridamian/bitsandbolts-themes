import assert from 'node:assert/strict';
import test from 'node:test';

import {
  LAYOUT_GAP_PRESETS,
  normalizeLayoutGapPresetId,
  resolveLayoutGapPreset
} from '../components/layout-spacing.js';

test('layout gap presets resolve the research spacing unit from both canvas dimensions', () => {
  assert.deepEqual(LAYOUT_GAP_PRESETS.map(({ id, label, multiplier }) => ({
    id,
    label,
    multiplier
  })), [
    { id: 'related', label: 'Related', multiplier: 1 },
    { id: 'group', label: 'Group', multiplier: 2 },
    { id: 'section', label: 'Section', multiplier: 3 },
    { id: 'major', label: 'Major', multiplier: 4 }
  ]);
  assert.equal(normalizeLayoutGapPresetId(' SECTION '), 'section');
  assert.equal(normalizeLayoutGapPresetId('unknown'), '');
  const group = resolveLayoutGapPreset('group', { width: 1080, height: 1920 });
  assert.equal(Math.abs(group.unit - 23.76) < 0.000001, true);
  assert.equal(Math.abs(group.gap - 47.52) < 0.000001, true);
  assert.deepEqual({
    height: group.height,
    id: group.id,
    label: group.label,
    multiplier: group.multiplier,
    width: group.width
  }, {
    height: 1920,
    id: 'group',
    label: 'Group',
    multiplier: 2,
    width: 1080
  });
  assert.equal(resolveLayoutGapPreset('major', { width: 1000, height: 500 }).gap, 60);
});

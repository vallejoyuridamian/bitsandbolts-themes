import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { contentIconGeometry } from '../scripts/content-icon-geometry.mjs';
import { semanticContentIconCatalog, semanticIconAssetPath, semanticIconContentGeometry } from '../components/semantic-icons.js';

test('generated content geometry matches every admitted original and variant', () => {
  for (const family of ['font-awesome-solid', 'material-symbols-outlined', 'material-symbols-filled']) {
    for (const item of semanticContentIconCatalog({ family })) {
      const options = { family: item.iconFamily };
      const original = readFileSync(`dist/web/${semanticIconAssetPath(item.iconRole, options)}`, 'utf8');
      const expected = contentIconGeometry(original);
      const actual = semanticIconContentGeometry(item.iconRole, options);
      assert.deepEqual(actual.bounds, expected.bounds);
      assert.deepEqual(actual.canvas, expected.canvas);
      assert.equal(readFileSync(`dist/web/${actual.path}`, 'utf8'), expected.svg);
    }
  }
});

test('Material Image trims its inset while native canvas aspect does not replace painted aspect', () => {
  const material = semanticIconContentGeometry('media_image', { family: 'material-symbols-outlined' });
  assert.deepEqual(material.bounds, { x: 120, y: -840, width: 720, height: 720 });
  assert.deepEqual(semanticIconContentGeometry('media_image', { family: 'font-awesome-solid' }).sourceSize, { width: 448, height: 448 });
  assert.deepEqual(semanticIconContentGeometry('mobile', { family: 'font-awesome-solid' }).sourceSize, { width: 352, height: 512 });
});

test('round stroke extrema are included and unsupported geometry fails admission', () => {
  const measured = contentIconGeometry('<svg viewBox="0 0 24 24"><path d="M4 4h16M6 7l4 9h4l4-9M8 19h8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>');
  assert.deepEqual(measured.bounds, { x: 3, y: 3, width: 18, height: 17 });
  assert.throws(() => contentIconGeometry('<svg viewBox="0 0 24 24"><g transform="rotate(5)"><path d="M0 0h20v20z"/></g></svg>'), /Unsupported/);
});

test('tight variants retain the original viewport clip', () => {
  const measured = contentIconGeometry('<svg viewBox="0 0 24 24"><path d="M3 -10h15v50H3z"/></svg>');
  assert.deepEqual(measured.bounds, { x: 3, y: 0, width: 15, height: 24 });
});

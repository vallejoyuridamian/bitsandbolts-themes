import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  SEMANTIC_ICON_FAMILIES,
  semanticIconMarkup
} from '../components/semantic-icons.js';

test('snap preferences use Themes-owned magnet and crossed-magnet semantic roles', async () => {
  const roles = SEMANTIC_ICON_FAMILIES['font-awesome-solid'];
  assert.equal(roles.magnet, 'faMagnet');
  assert.deepEqual(roles.magnet_off, ['faMagnet', 'faSlash']);
  assert.match(semanticIconMarkup('magnet'), /data-bb-icon-role="magnet"/);
  assert.match(semanticIconMarkup('magnet_off'), /data-bb-icon-role="magnet_off"/);

  const css = await readFile(new URL('../dist/web/components/semantic-icons.css', import.meta.url), 'utf8');
  const crossedMagnet = await readFile(new URL(
    '../dist/web/icons/font-awesome-solid/magnet-off.svg',
    import.meta.url
  ), 'utf8');
  assert.match(css, /data-bb-icon-role="magnet_off"/);
  assert.match(css, /magnet-off\.svg/);
  assert.match(crossedMagnet, /translate\(64 0\)/);
  assert.equal((crossedMagnet.match(/<path /g) ?? []).length, 2);
});

test('viewport centering controls use Themes-owned axis-specific semantic roles', async () => {
  const roles = SEMANTIC_ICON_FAMILIES['font-awesome-solid'];
  assert.equal(roles.align_viewport_horizontal, 'faArrowsLeftRightToLine');
  assert.deepEqual(roles.align_viewport_vertical, {
    exportName: 'faArrowsLeftRightToLine',
    rotate: 90
  });
  assert.match(
    semanticIconMarkup('align_viewport_horizontal'),
    /data-bb-icon-role="align_viewport_horizontal"/
  );
  assert.match(
    semanticIconMarkup('align_viewport_vertical'),
    /data-bb-icon-role="align_viewport_vertical"/
  );

  const css = await readFile(new URL('../dist/web/components/semantic-icons.css', import.meta.url), 'utf8');
  const vertical = await readFile(new URL(
    '../dist/web/icons/font-awesome-solid/align-viewport-vertical.svg',
    import.meta.url
  ), 'utf8');
  assert.match(css, /data-bb-icon-role="align_viewport_horizontal"/);
  assert.match(css, /data-bb-icon-role="align_viewport_vertical"/);
  assert.match(vertical, /viewBox="0 0 512 576"/);
  assert.match(vertical, /matrix\(0 1 -1 0 512 0\)/);
});

test('layout grouping controls use Themes-owned semantic roles', async () => {
  const roles = SEMANTIC_ICON_FAMILIES['font-awesome-solid'];
  assert.equal(roles.group, 'faObjectGroup');
  assert.equal(roles.ungroup, 'faObjectUngroup');
  assert.match(semanticIconMarkup('group'), /data-bb-icon-role="group"/);
  assert.match(semanticIconMarkup('ungroup'), /data-bb-icon-role="ungroup"/);

  const css = await readFile(new URL('../dist/web/components/semantic-icons.css', import.meta.url), 'utf8');
  assert.match(css, /data-bb-icon-role="group"/);
  assert.match(css, /data-bb-icon-role="ungroup"/);
});

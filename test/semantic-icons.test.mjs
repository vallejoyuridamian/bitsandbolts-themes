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

test('layout transform controls use Themes-owned mirror semantic roles', async () => {
  const roles = SEMANTIC_ICON_FAMILIES['bitsandbolts-theme'];
  assert.equal(roles.mirror_horizontal, 'mirror-horizontal.svg');
  assert.equal(roles.mirror_vertical, 'mirror-vertical.svg');
  assert.match(
    semanticIconMarkup('mirror_horizontal', '', { family: 'bitsandbolts-theme' }),
    /data-bb-icon-family="bitsandbolts-theme"[^>]+data-bb-icon-role="mirror_horizontal"/
  );
  assert.match(
    semanticIconMarkup('mirror_vertical', '', { family: 'bitsandbolts-theme' }),
    /data-bb-icon-family="bitsandbolts-theme"[^>]+data-bb-icon-role="mirror_vertical"/
  );

  const css = await readFile(new URL('../dist/web/components/semantic-icons.css', import.meta.url), 'utf8');
  assert.match(css, /data-bb-icon-family="bitsandbolts-theme"\]\[data-bb-icon-role="mirror_horizontal"\]/);
  assert.match(css, /data-bb-icon-family="bitsandbolts-theme"\]\[data-bb-icon-role="mirror_vertical"\]/);
  const horizontal = await readFile(new URL('../dist/web/icons/mirror-horizontal.svg', import.meta.url), 'utf8');
  const vertical = await readFile(new URL('../dist/web/icons/mirror-vertical.svg', import.meta.url), 'utf8');
  assert.match(horizontal, /data-bb-vector-role="mirror-horizontal"/);
  assert.match(vertical, /data-bb-vector-role="mirror-vertical"/);
});

test('layout arrangement controls use axis-specific Themes-owned roles', async () => {
  const roles = SEMANTIC_ICON_FAMILIES['font-awesome-solid'];
  assert.equal(roles.arrange, 'faAlignCenter');
  assert.equal(roles.align_selection_left, 'faAlignLeft');
  assert.equal(roles.align_selection_center_x, 'faAlignCenter');
  assert.equal(roles.align_selection_right, 'faAlignRight');
  assert.deepEqual(roles.align_selection_top, { exportName: 'faAlignLeft', rotate: 90 });
  assert.deepEqual(roles.align_selection_center_y, { exportName: 'faAlignCenter', rotate: 90 });
  assert.deepEqual(roles.align_selection_bottom, { exportName: 'faAlignRight', rotate: 90 });
  assert.equal(roles.distribute_horizontal, 'faArrowsLeftRight');
  assert.equal(roles.distribute_vertical, 'faArrowsUpDown');

  for (const role of [
    'arrange',
    'align_selection_left',
    'align_selection_center_x',
    'align_selection_right',
    'align_selection_top',
    'align_selection_center_y',
    'align_selection_bottom',
    'distribute_horizontal',
    'distribute_vertical'
  ]) {
    assert.match(semanticIconMarkup(role), new RegExp(`data-bb-icon-role="${role}"`));
  }

  const css = await readFile(new URL('../dist/web/components/semantic-icons.css', import.meta.url), 'utf8');
  for (const role of [
    'arrange',
    'align_selection_left',
    'align_selection_center_x',
    'align_selection_right',
    'align_selection_top',
    'align_selection_center_y',
    'align_selection_bottom',
    'distribute_horizontal',
    'distribute_vertical'
  ]) {
    assert.match(css, new RegExp(`data-bb-icon-role="${role}"`));
  }
  for (const asset of [
    'align-selection-top.svg',
    'align-selection-center-y.svg',
    'align-selection-bottom.svg'
  ]) {
    const svg = await readFile(new URL(
      `../dist/web/icons/font-awesome-solid/${asset}`,
      import.meta.url
    ), 'utf8');
    assert.match(svg, /viewBox="0 0 512 448"/);
    assert.match(svg, /matrix\(0 1 -1 0 512 0\)/);
  }
});

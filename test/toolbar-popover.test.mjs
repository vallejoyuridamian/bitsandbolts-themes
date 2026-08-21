import assert from 'node:assert/strict';
import test from 'node:test';

import {
  resolveToolbarPopoverPosition,
  toolbarPopoverTriggerMarkup
} from '../components/toolbar-popover.js';

test('toolbar popover trigger uses the canonical workspace button recipe', () => {
  const markup = toolbarPopoverTriggerMarkup({
    attributes: { 'data-text-color-trigger': '' },
    help: 'Text color',
    label: 'Choose text color'
  });

  assert.match(markup, /bb-toolbar-popover__trigger/);
  assert.match(markup, /bb-workspace-control-button--icon/);
  assert.match(markup, /aria-haspopup="dialog"/);
  assert.match(markup, /aria-expanded="false"/);
  assert.match(markup, /data-text-color-trigger=""/);
  assert.match(markup, /title="Text color"/);
  assert.match(markup, /bb-toolbar-popover__trigger-value bb-cut-corner-swatch/);
});

test('toolbar popover trigger can expose a semantic original-color indicator', () => {
  const markup = toolbarPopoverTriggerMarkup({
    attributes: { 'data-image-color-trigger': '' },
    help: 'Image color',
    label: 'Choose image color',
    valueIconRole: 'close'
  });

  assert.match(markup, /data-image-color-trigger=""/);
  assert.match(markup, /bb-toolbar-popover__trigger-value-icon/);
  assert.match(markup, /data-bb-icon-role="close"/);
});

test('toolbar popover stays in the viewport and flips above when needed', () => {
  assert.deepEqual(resolveToolbarPopoverPosition({
    anchorRect: { bottom: 46, left: 12, top: 16 },
    panelRect: { height: 52, width: 180 },
    viewportHeight: 240,
    viewportWidth: 320
  }), { left: 12, placement: 'below', top: 52 });

  assert.deepEqual(resolveToolbarPopoverPosition({
    anchorRect: { bottom: 232, left: 280, top: 202 },
    panelRect: { height: 80, width: 180 },
    viewportHeight: 240,
    viewportWidth: 320
  }), { left: 132, placement: 'above', top: 116 });
});

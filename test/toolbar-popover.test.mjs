import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createToolbarPopoverController,
  resolveToolbarPopoverPosition,
  syncToolbarPopoverTriggerValue,
  toolbarPopoverNumericFieldMarkup,
  toolbarPopoverStatusMarkup,
  toolbarPopoverTriggerMarkup
} from '../components/toolbar-popover.js';

function fakeNode() {
  const attributes = new Map();
  return {
    attributes,
    classList: { add() {} },
    contains: () => false,
    dataset: {},
    getBoundingClientRect: () => ({ bottom: 20, height: 10, left: 10, top: 10, width: 20 }),
    isConnected: true,
    remove() { this.isConnected = false; },
    removeAttribute(name) { attributes.delete(name); },
    setAttribute(name, value) { attributes.set(name, value); },
    style: {}
  };
}

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

test('toolbar popover trigger value synchronizes the rendered swatch', () => {
  const triggerProperties = new Map();
  const swatchProperties = new Map();
  const trigger = {
    querySelector: (selector) => selector === '.bb-toolbar-popover__trigger-value'
      ? { style: { setProperty: (name, value) => swatchProperties.set(name, value) } }
      : null,
    style: { setProperty: (name, value) => triggerProperties.set(name, value) }
  };

  assert.equal(syncToolbarPopoverTriggerValue(trigger, '#12E6D5'), true);
  assert.equal(triggerProperties.get('--bb-toolbar-popover-trigger-value'), '#12E6D5');
  assert.equal(swatchProperties.get('--bb-toolbar-popover-trigger-value'), '#12E6D5');
});

test('toolbar popover supports the canonical semantic icon trigger recipe', () => {
  const markup = toolbarPopoverTriggerMarkup({
    attributes: { 'data-layout-arrange-trigger': '' },
    iconRole: 'arrange',
    label: 'Arrange selection'
  });

  assert.match(markup, /bb-toolbar-popover__trigger/);
  assert.match(markup, /bb-workspace-control-button/);
  assert.match(markup, /data-bb-icon-role="arrange"/);
  assert.match(markup, /data-bb-toolbar-popover-trigger=""/);
  assert.match(markup, /data-layout-arrange-trigger=""/);
  assert.match(markup, /aria-haspopup="dialog"/);
  assert.doesNotMatch(markup, /bb-toolbar-popover__trigger-value/);
});

test('toolbar popover owns numeric fields and status text', async () => {
  const field = toolbarPopoverNumericFieldMarkup({
    attributes: {
      'data-body-tool': 'rotateX',
      max: 180,
      min: -180,
      step: 1
    },
    label: 'X rotation'
  });
  const status = toolbarPopoverStatusMarkup({
    attributes: { 'data-device-tool': 'screenVideoLength' },
    text: 'Length unknown'
  });
  const css = await import('node:fs/promises').then(({ readFile }) => (
    readFile(new URL('../components/interface-primitives.css', import.meta.url), 'utf8')
  ));

  assert.match(field, /bb-workspace-control-input bb-toolbar-popover__field-input/);
  assert.match(field, /data-body-tool="rotateX"/);
  assert.match(field, />X rotation</);
  assert.match(status, /bb-toolbar-popover__status/);
  assert.match(status, /data-device-tool="screenVideoLength"/);
  assert.match(css, /\.bb-toolbar-popover__fields/);
  assert.match(css, /\.bb-toolbar-popover__field-input/);
  assert.match(css, /\.bb-toolbar-popover__status/);
  assert.match(css, /grid-template-columns: max-content 68px;/);
  assert.match(css, /input\.bb-workspace-control-input\.bb-workspace-control-input\[type="number"\]/);
  assert.match(css, /border: 1px solid transparent;/);
  assert.match(css, /background: transparent;/);
  assert.match(css, /font-size: var\(--bb-font-size-xs\);/);
  assert.match(css, /font-weight: var\(--bb-font-weight-bold\);/);
  assert.match(css, /\.bb-toolbar-popover__field-label\s*\{[^}]*color: var\(--bb-v2-color-content-secondary\);[^}]*font-family: var\(--bb-font-family-body\);[^}]*font-size: var\(--bb-font-size-xs\);[^}]*font-weight: var\(--bb-font-weight-semibold\);[^}]*line-height: var\(--bb-font-line-height-normal\);/s);
  assert.match(css, /background: var\(--bb-v2-color-surface-canvas\);/);
  assert.match(css, /border: 1px solid var\(--bb-v2-color-border-subtle\);/);
});

test('toolbar popover trigger keeps its original-color indicator centered inside the swatch', async () => {
  const css = await import('node:fs/promises').then(({ readFile }) => (
    readFile(new URL('../components/interface-primitives.css', import.meta.url), 'utf8')
  ));

  assert.match(css, /\.bb-toolbar-popover__trigger-value \{/);
  assert.match(css, /place-items: center;/);
  assert.match(css, /\.bb-toolbar-popover__trigger\[data-bb-toolbar-popover-trigger\] \.bb-toolbar-popover__trigger-value-icon/);
  assert.match(css, /width: 9px;/);
  assert.match(css, /height: 9px;/);
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

test('toolbar popover can retain an explicitly owned portal interaction', () => {
  const listeners = new Map();
  const retainedTarget = {};
  const rootDocument = {
    addEventListener(type, listener) { listeners.set(type, listener); },
    body: { appendChild(node) { node.isConnected = true; } },
    createElement: () => fakeNode(),
    defaultView: {
      addEventListener() {},
      innerHeight: 240,
      innerWidth: 320,
      removeEventListener() {}
    },
    documentElement: { clientHeight: 240, clientWidth: 320 },
    removeEventListener() {}
  };
  const anchor = fakeNode();
  const closeReasons = [];
  const controller = createToolbarPopoverController({
    rootDocument,
    shouldRetainPointerTarget: (target) => target === retainedTarget
  });
  controller.open({
    anchor,
    onClose: ({ reason }) => closeReasons.push(reason)
  });

  listeners.get('pointerdown')({ target: retainedTarget });
  assert.equal(controller.isOpenFor(anchor), true);
  assert.deepEqual(closeReasons, []);

  listeners.get('pointerdown')({ target: {} });
  assert.equal(controller.isOpenFor(anchor), false);
  assert.deepEqual(closeReasons, ['outside-pointer']);
  controller.destroy();
});

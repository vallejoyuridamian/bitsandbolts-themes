import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createSelectWindowSpaceReservation,
  isSelectMenuVerticalBoundary,
  resolveSelectMenuPreferredHeight,
  resolveSelectMenuPosition,
  selectOptionLabel,
  selectDescriptionTitle,
  selectTriggerValue,
  selectUsesExplicitExternalTrigger
} from '../components/select.js';

function windowFixture({ viewportHeight = 600, height = 576, top = 12, triggerOffset = height - 68, menuHeight = 161 } = {}) {
  const originalHeight = height;
  const originalTop = top;
  const windowNode = {
    style: { height: `${height}px`, top: `${top}px` },
    getBoundingClientRect() {
      const renderedHeight = Math.min(viewportHeight - 24, Number.parseFloat(this.style.height) || originalHeight);
      const renderedTop = Number.parseFloat(this.style.top) || originalTop;
      return { top: renderedTop, bottom: renderedTop + renderedHeight, height: renderedHeight };
    }
  };
  const container = {
    style: { paddingBottom: '' },
    scrollTop: 0,
    getBoundingClientRect() {
      const frame = windowNode.getBoundingClientRect();
      return { top: frame.top + 26, bottom: frame.bottom, height: frame.height - 26 };
    },
    get scrollHeight() {
      return Math.max(this.getBoundingClientRect().height, originalHeight - 26 + (Number.parseFloat(this.style.paddingBottom) || 0));
    }
  };
  const trigger = {
    getBoundingClientRect() {
      const y = container.getBoundingClientRect().top + triggerOffset - container.scrollTop;
      return { top: y, bottom: y + 30, height: 30, width: 300, left: 20, right: 320 };
    }
  };
  const reservation = createSelectWindowSpaceReservation({ container, windowNode, trigger, menuHeight, getViewportHeight: () => viewportHeight });
  const availableHeight = () => Math.max(0, Math.min(container.getBoundingClientRect().bottom, viewportHeight - 8) - trigger.getBoundingClientRect().bottom - 12);
  return { availableHeight, container, reservation, trigger, windowNode };
}

test('a Select at the last field of a maximum-height window reserves scroll space instead of collapsing', () => {
  const fixture = windowFixture();
  assert.equal(fixture.availableHeight(), 0);
  fixture.reservation.update();
  assert.equal(fixture.availableHeight(), 161);
  assert.ok(fixture.container.scrollTop > 0);
  assert.ok(Number.parseFloat(fixture.container.style.paddingBottom) > 0);
  assert.ok(fixture.trigger.getBoundingClientRect().top >= fixture.container.getBoundingClientRect().top);
  assert.ok(fixture.windowNode.getBoundingClientRect().bottom <= 592);
  const settled = JSON.stringify([fixture.windowNode.style, fixture.container.style, fixture.container.scrollTop]);
  fixture.reservation.update();
  assert.equal(JSON.stringify([fixture.windowNode.style, fixture.container.style, fixture.container.scrollTop]), settled);
  fixture.reservation.release();
  assert.deepEqual(fixture.windowNode.style, { height: '576px', top: '12px' });
  assert.equal(fixture.container.style.paddingBottom, '');
  assert.equal(fixture.container.scrollTop, 0);
});

test('a Select grows and repositions a smaller window before consuming scroll space', () => {
  const fixture = windowFixture({ height: 200, top: 380 });
  fixture.reservation.update();
  assert.equal(fixture.availableHeight(), 161);
  assert.ok(fixture.windowNode.getBoundingClientRect().height > 200);
  assert.ok(fixture.windowNode.getBoundingClientRect().top < 380);
  assert.equal(fixture.container.scrollTop, 0);
  assert.equal(fixture.container.style.paddingBottom, '');
});

test('short Select lists reserve only their height and tiny viewports retain a visible trigger', () => {
  const shortList = windowFixture({ menuHeight: 74 });
  shortList.reservation.update();
  assert.equal(shortList.availableHeight(), 74);
  const tiny = windowFixture({ viewportHeight: 180, height: 156 });
  tiny.reservation.update();
  assert.ok(tiny.availableHeight() > 0 && tiny.availableHeight() < 161);
  assert.ok(tiny.trigger.getBoundingClientRect().top >= tiny.container.getBoundingClientRect().top);
});

test('canonical Select preserves the intentionally empty mixed font label', () => {
  const mixed = {
    label: '',
    textContent: '',
    value: '__bb_layout_text_editor_mixed__',
    hasAttribute: (name) => name === 'data-bb-layout-text-editor-mixed-option'
  };

  assert.equal(selectOptionLabel(mixed), '__bb_layout_text_editor_mixed__');
  assert.equal(selectTriggerValue(mixed, mixed.value), '');
  assert.equal(selectTriggerValue({ label: '', textContent: '', value: 'fallback' }, 'fallback'), 'fallback');
});

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

test('canonical Select identifies its menu as a shared floating portal', async () => {
  const source = await import('node:fs/promises').then(({ readFile }) => (
    readFile(new URL('../components/select.js', import.meta.url), 'utf8')
  ));

  assert.match(source, /menu\.dataset\.floatingWindowPortal = 'true';/);
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


test('option descriptions follow the selected voice and open choices only when enabled', () => {
  const select = { dataset: {}, title: 'Choose a voice' };
  const first = { title: 'Steady Broadcaster' };
  const second = { title: 'Mature, Reassuring, Confident' };
  assert.equal(selectDescriptionTitle(select, first, { trigger: true }), 'Choose a voice');
  assert.equal(selectDescriptionTitle(select, first), '');
  select.dataset.bbSelectOptionDescriptions = 'true';
  for (const option of [first, second]) {
    assert.equal(selectDescriptionTitle(select, option, { trigger: true }), option.title);
    assert.equal(selectDescriptionTitle(select, option), option.title);
  }
  assert.equal(selectDescriptionTitle(select, {}, { trigger: true }), 'Choose a voice');
  assert.equal(selectDescriptionTitle(select, {}), '');
});

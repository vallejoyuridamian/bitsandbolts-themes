import assert from 'node:assert/strict';
import test from 'node:test';
import { createMediaControlsDemand } from '../components/media-controls-demand.js';

function fixture({ adapter = true } = {}) {
  const zone = new EventTarget(), reveal = new EventTarget();
  const view = new EventTarget(), document = new EventTarget();
  const viewport = new EventTarget(), hover = new EventTarget();
  let opacity = 0, target = 0, reads = 0, at = 0, bindings = 0, releases = 0;
  Object.assign(view, { visualViewport: viewport, matchMedia: () => hover });
  Object.assign(document, { hidden: false, defaultView: view });
  Object.assign(zone, { classList: { contains: () => true }, querySelector: () => reveal, contains: () => true });
  const root = { hidden: false, ownerDocument: document, querySelectorAll: () => [zone] };
  const changes = [], observations = [];
  let observer;
  class Observer {
    constructor(callback) { this.callback = callback; observer = this; }
    observe(node, options) { observations.push({ node, options }); }
    disconnect() { observations.length = 0; }
  }
  const demand = createMediaControlsDemand({ root, Observer, now: () => at,
    readStyle() { reads++; return { opacity: String(opacity), getPropertyValue: () => String(target) }; },
    onChange: change => changes.push(change),
    ...(adapter ? { bindEvent(node, type, handler, options) {
      bindings++; node.addEventListener(type, handler, options);
      return () => { releases++; node.removeEventListener(type, handler, options); };
    } } : {})
  });
  function dispatch(node, type, propertyName = '') {
    const event = new Event(type); Object.defineProperty(event, 'propertyName', { value: propertyName });
    node.dispatchEvent(event);
  }
  return { demand, root, document, zone, reveal, view, viewport, hover, changes, observations,
    dispatch, observer: () => observer, reads: () => reads, bindings: () => bindings, releases: () => releases,
    style(nextTarget, nextOpacity) { target = nextTarget; opacity = nextOpacity; }, advance(ms) { at += ms; } };
}

for (const adapter of [true, false]) {
  test(`hidden/reveal/fade admission preserves CSS authority with ${adapter ? 'consumer router' : 'standalone'} bindings`, () => {
    const f = fixture({ adapter });
    f.demand.activate();
    const initialReads = f.reads();
    for (let i = 0; i < 120; i++) assert.equal(f.demand.admit(), false);
    assert.equal(f.reads(), initialReads, 'hidden playback does not read styles or geometry');
    f.advance(1000);
    f.style(1, 0); f.dispatch(f.zone, 'pointerenter');
    assert.equal(f.changes.at(-1).phase, 'revealing');
    assert.equal(f.demand.admit(), true, 'current values publish before first visible paint');
    f.style(1, 1); f.dispatch(f.reveal, 'transitionend', 'opacity');
    assert.equal(f.changes.at(-1).phase, 'visible');
    f.style(0, 1); f.dispatch(f.zone, 'pointerleave');
    assert.equal(f.changes.at(-1).phase, 'hiding');
    assert.equal(f.demand.admit(), true, 'fade-out retains advancing content');
    f.style(0, 0); f.dispatch(f.reveal, 'transitionend', 'opacity');
    assert.equal(f.demand.admit(), false);
    const stats = f.demand.snapshot()[0];
    assert.equal(stats.phaseMs.hidden, 1000);
    assert.equal(stats.skippedUpdates, 121);
    assert.equal(stats.admittedUpdates, 2);
    f.demand.destroy();
    assert.equal(f.releases(), f.bindings());
  });
}

test('focus/menu/touch/viewport changes refresh demand without polling; close retires observations', () => {
  const f = fixture(); f.demand.activate();
  assert.deepEqual(f.observations[0].options, { attributes: true, attributeFilter: ['class'], subtree: true });
  f.style(1, 1); f.dispatch(f.zone, 'focusin');
  assert.equal(f.demand.admit(), true);
  f.style(0, 0); f.dispatch(f.zone, 'focusout');
  assert.equal(f.demand.admit(), false);
  f.style(1, 1); f.observer().callback([{ target: { matches: () => true } }]);
  assert.equal(f.changes.at(-1).reason, 'select-state');
  f.style(0, 0); f.dispatch(f.view, 'resize');
  assert.equal(f.demand.admit(), false);
  f.style(1, 1); f.dispatch(f.hover, 'change');
  assert.equal(f.demand.admit(), true, 'touch capability preserves always-visible controls');
  f.style(0, 0); f.dispatch(f.viewport, 'resize');
  assert.equal(f.demand.admit(), false);
  f.style(1, 1); f.dispatch(f.zone, 'pointerenter');
  f.document.hidden = true; f.dispatch(f.document, 'visibilitychange');
  assert.equal(f.demand.admit(), false);
  f.document.hidden = false; f.dispatch(f.document, 'visibilitychange');
  assert.equal(f.demand.admit(), true);
  f.demand.deactivate();
  assert.equal(f.demand.admit(), false); assert.equal(f.observations.length, 0);
  const reads = f.reads();
  f.dispatch(f.zone, 'pointerenter'); assert.equal(f.reads(), reads);
  f.demand.destroy(); f.demand.activate(); assert.equal(f.demand.admit(), false);
});

test('local reveal boundaries measure only their zone; global changes read all states before publication', () => {
  const document = Object.assign(new EventTarget(), { hidden: false, defaultView: new EventTarget() });
  const order = [];
  const zones = ['view-controls', 'transport'].map(name => {
    const reveal = Object.assign(new EventTarget(), { name });
    return Object.assign(new EventTarget(), { reveal, name,
      classList: { contains: () => name === 'transport' }, querySelector: () => reveal,
      contains: target => target.zone === name });
  });
  let target = 0, callback, retireOnPublish = false;
  const demand = createMediaControlsDemand({
    root: { ownerDocument: document, hidden: false, querySelectorAll: () => zones },
    Observer: class { constructor(fn) { callback = fn; } observe() {} disconnect() {} },
    readStyle(reveal) {
      order.push(`read:${reveal.name}`);
      return { opacity: String(target), getPropertyValue: () => String(target) };
    },
    onChange(change) {
      order.push(`publish:${change.zone}`);
      if (retireOnPublish && change.phase !== 'inactive') demand.deactivate();
    }
  });
  demand.activate(); order.length = 0; target = 1;
  zones[1].dispatchEvent(new Event('pointerenter'));
  assert.deepEqual(order, ['read:transport', 'publish:transport']);
  order.length = 0;
  callback([{ target: { zone: 'view-controls', matches: () => true } }]);
  assert.deepEqual(order, ['read:view-controls', 'publish:view-controls']);
  order.length = 0; target = 0;
  document.defaultView.dispatchEvent(new Event('resize'));
  assert.deepEqual(order, ['read:view-controls', 'read:transport', 'publish:view-controls', 'publish:transport']);
  target = 1; retireOnPublish = true;
  document.defaultView.dispatchEvent(new Event('resize'));
  assert.equal(demand.admit('transport'), false, 'retirement during publication invalidates the remaining batch');
  assert.ok(demand.snapshot().every(record => record.phase === 'inactive'));
  demand.destroy();
});

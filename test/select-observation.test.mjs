import assert from 'node:assert/strict';
import test from 'node:test';
import { installSelectController } from '../components/select.js';

class Node extends EventTarget {
  constructor(tagName = 'SPAN') {
    super(); this.tagName = tagName; this.nodeType = 1; this.isConnected = true;
    this.dataset = {}; this.attributes = new Map(); this.classes = new Set();
    this.classList = { contains: value => this.classes.has(value),
      add: value => this.classes.add(value), remove: value => this.classes.delete(value),
      toggle: (value, enabled) => enabled ? this.classes.add(value) : this.classes.delete(value) };
  }
  getAttribute(name) { return this.attributes.get(name) ?? null; }
  setAttribute(name, value) { this.attributes.set(name, value); }
  removeAttribute(name) { this.attributes.delete(name); }
  hasAttribute(name) { return this.attributes.has(name); }
  matches(selector) { return selector === 'select' && this.tagName === 'SELECT'; }
  querySelectorAll() { return []; }
}

test('Select observes its own values/options, discovers additions, and retires queued work on removal', async () => {
  const original = globalThis.MutationObserver;
  const observers = [];
  globalThis.MutationObserver = class {
    constructor(callback) { this.callback = callback; this.targets = []; this.disconnected = false; observers.push(this); }
    observe(target, options) { this.targets.push({ target, options }); }
    disconnect() { this.disconnected = true; }
  };
  const root = new Node(), documentElement = new Node('HTML');
  root.nodeType = 9; root.documentElement = documentElement; root.defaultView = new EventTarget();
  const select = new Node('SELECT'), wrapper = new Node(), trigger = new Node('BUTTON'), value = new Node();
  const option = new Node('OPTION'); option.value = 'first'; option.textContent = 'First';
  Object.assign(select, { ownerDocument: root, options: [option], selectedIndex: 0, value: 'first', id: 'selection' });
  select.closest = () => wrapper; wrapper.querySelector = () => trigger; trigger.querySelector = () => value;
  root.querySelectorAll = () => select.isConnected ? [select] : [];
  let controller;
  try {
    controller = installSelectController(root);
    const discovery = observers.find(observer => observer.targets.some(entry => entry.target === documentElement));
    const local = observers.find(observer => observer.targets.some(entry => entry.target === select));
    assert.deepEqual(discovery.targets[0].options, { childList: true, subtree: true });
    assert.equal(local.targets[0].options.characterData, true);
    assert.equal(local.targets[0].options.attributes, true);
    assert.equal(value.textContent, 'First');
    option.textContent = 'Renamed'; select.disabled = true;
    local.callback([{ type: 'characterData', target: option }]);
    await Promise.resolve();
    assert.equal(value.textContent, 'Renamed'); assert.equal(trigger.disabled, true);
    option.textContent = 'Retired update';
    local.callback([{ type: 'characterData', target: option }]);
    select.isConnected = false;
    discovery.callback([{ type: 'childList', addedNodes: [], removedNodes: [select] }]);
    assert.equal(local.disconnected, true);
    select.isConnected = true;
    await Promise.resolve();
    assert.equal(value.textContent, 'Renamed', 'obsolete record cannot publish after removal/reinsertion');
    discovery.callback([{ type: 'childList', addedNodes: [select], removedNodes: [] }]);
    assert.equal(value.textContent, 'Retired update', 'reinserted Select has a fresh admitted record');
    assert.equal(observers.length, 3);
    controller.destroy(); controller = null;
    assert.ok(observers.every(observer => observer.disconnected));
  } finally { controller?.destroy(); globalThis.MutationObserver = original; }
});

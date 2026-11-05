import assert from 'node:assert/strict';
import test from 'node:test';
import { mediaTransportReadoutMarkup, syncMediaTransportReadout } from '../components/media-preview-controls.js';
import { setRangeControlProgress } from '../components/range-control.js';

function textNode(value) {
  let data = value, writes = 0;
  return { get data() { return data; }, set data(value) { data = value; writes++; },
    get writes() { return writes; } };
}

test('clock reserves its format once while every changing centisecond retains the live Text node', () => {
  const text = textNode('00:00.00'), size = textNode('00:00.00');
  const control = { firstElementChild: { firstChild: text }, lastElementChild: { firstChild: size } };
  for (const value of ['00:00.01', '00:00.03', '00:59.99', '01:00.00', '05:00.00', '00:00.00']) {
    syncMediaTransportReadout(control, value);
    assert.equal(text.data, value);
    assert.equal(control.firstElementChild.firstChild, text);
  }
  assert.equal(size.writes, 0, 'advancing time and seeking do not invalidate intrinsic sizing');
  assert.equal(text.writes, 6);
  syncMediaTransportReadout(control, '00:00.00');
  assert.equal(text.writes, 6, 'unchanged displayed value does not mutate DOM');
  syncMediaTransportReadout(control, '100:00.00');
  assert.equal(size.data, '000:00.00', 'a wider time format reserves its full width');
  assert.equal(size.writes, 1);
});

test('clock sizing text is inaccessible and markup values are escaped', () => {
  const markup = mediaTransportReadoutMarkup({ id: 'clock"', className: 'preview', value: '01:23.45' });
  assert.match(markup, /id="clock&quot;"/);
  assert.match(markup, /time-value">01:23\.45<\/span>/);
  assert.match(markup, /time-size" aria-hidden="true">00:00\.00<\/span>/);
});

function style() {
  const values = new Map();
  let writes = 0;
  return { values, get writes() { return writes; },
    getPropertyValue: key => values.get(key) ?? '',
    setProperty(key, value) { values.set(key, value); writes++; } };
}

test('wrapped ranges invalidate only the rail while native input retains interaction/value ownership', () => {
  const rail = { style: style() }, host = { style: style(),
    classList: { contains: name => name === 'bb-range-control' },
    querySelector: selector => { assert.equal(selector, ':scope > .bb-range-control__rail'); return rail; } };
  const input = { parentElement: host, style: style(), value: '1234', disabled: false };
  for (const [ratio, expected] of [[0, '0'], [0.5005, '0.5005'], [1, '1'], [2, '1'], [-1, '0'], [NaN, '0']]) {
    assert.equal(setRangeControlProgress(input, ratio), input);
    assert.equal(rail.style.values.get('--range-control-position'), expected);
    assert.equal(input.value, '1234');
    assert.equal(input.disabled, false);
  }
  assert.equal(rail.style.writes, 4);
  assert.equal(host.style.writes, 0);
  assert.equal(input.style.writes, 0);
});

test('unwrapped ranges retain their existing progress projection', () => {
  const input = { style: style() };
  setRangeControlProgress(input, 0.25);
  setRangeControlProgress(input, 0.25);
  assert.equal(input.style.values.get('--range-control-progress'), '25%');
  assert.equal(input.style.writes, 1);
});

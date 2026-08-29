import assert from 'node:assert/strict';
import test from 'node:test';

import {
  floatingWindowConfirmationMarkup,
  floatingWindowRangeControlsMarkup
} from '../components/floating-window.js';

test('floating confirmation optionally owns Cancel, destructive secondary, and primary actions', () => {
  const markup = floatingWindowConfirmationMarkup({
    cancelLabel: 'Cancel',
    confirmLabel: 'Save Project',
    description: 'Choose what happens to the current project.',
    id: 'project-replacement',
    secondaryDanger: true,
    secondaryLabel: 'Discard Changes',
    title: 'Save changes?'
  });

  assert.match(markup, /data-bb-confirm-cancel[^>]*>Cancel<\/button>/);
  assert.match(markup, /bb-workspace-control-button--danger[^>]*data-bb-confirm-secondary[^>]*>Discard Changes<\/button>/);
  assert.match(markup, /data-bb-confirm-submit[^>]*>Save Project<\/button>/);
});

test('floating confirmation omits the secondary action when it is not requested', () => {
  const markup = floatingWindowConfirmationMarkup();
  assert.doesNotMatch(markup, /data-bb-confirm-secondary/);
});

test('floating range controls own labeled sliders and visible values', () => {
  const markup = floatingWindowRangeControlsMarkup({
    fields: [{
      id: 'snapRelease',
      label: 'Release',
      max: 80,
      min: 0.5,
      name: 'releaseDistance',
      step: 0.5,
      unit: ' px',
      value: 14
    }]
  });

  assert.match(markup, /class="bb-floating-range-controls"/);
  assert.match(markup, /for="snapRelease"/);
  assert.match(markup, /data-bb-floating-range-output>14 px<\/output>/);
  assert.match(markup, /name="releaseDistance"[^>]*type="range"/);
  assert.match(markup, /min="0\.5" max="80" step="0\.5" value="14"/);
});

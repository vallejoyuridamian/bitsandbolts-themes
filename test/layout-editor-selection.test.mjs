import assert from 'node:assert/strict';
import test from 'node:test';

import {
  layoutEditorRotationIconMarkup,
  layoutEditorSelectionRecipe,
  layoutEditorSelectionRotationStyles
} from '../components/layout-editor-selection.js';

test('layout editor selection owns rotation controls and their semantic vector', () => {
  const icon = layoutEditorRotationIconMarkup();

  assert.match(icon, /data-bb-icon-role="rotate"/);
  assert.match(layoutEditorSelectionRotationStyles, /\.body-rotation-axis \.bb-semantic-icon/);
  assert.match(layoutEditorSelectionRotationStyles, /\.body-rotation-handle \.bb-semantic-icon/);
  assert.match(layoutEditorSelectionRotationStyles, new RegExp(layoutEditorSelectionRecipe.signalColor));
  assert.doesNotMatch(layoutEditorSelectionRotationStyles, /<svg|\.body-rotation-axis svg/);
});

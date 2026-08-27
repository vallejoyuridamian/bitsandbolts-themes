import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  layoutEditorRegionOverlayStyles,
  layoutEditorResizeHandleResetStyles,
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

test('layout editor overlays use compact screen-space metrics across shared recipes', () => {
  const zoomProperty = layoutEditorSelectionRecipe.zoomCompensationProperty;

  assert.equal(zoomProperty, '--bb-layout-editor-overlay-zoom-compensation');
  assert.match(layoutEditorSelectionRecipe.outlineWidth, /calc\(1px/);
  assert.match(layoutEditorSelectionRecipe.resizeHandleSize, /calc\(8px/);
  assert.equal(layoutEditorSelectionRecipe.resizeHandleBorder, '0');
  assert.equal(layoutEditorSelectionRecipe.resizeHandleBorderRadius, '0');
  assert.equal(layoutEditorSelectionRecipe.resizeHandleBackground, layoutEditorSelectionRecipe.signalColor);
  assert.equal(layoutEditorSelectionRecipe.placementPreview.borderWidth, '1px');
  assert.match(layoutEditorSelectionRecipe.outlineWidth, new RegExp(zoomProperty));
  assert.match(layoutEditorSelectionRecipe.resizeHandleSize, new RegExp(zoomProperty));
  assert.match(layoutEditorSelectionRotationStyles, new RegExp(zoomProperty));
  assert.ok(layoutEditorSelectionRotationStyles.includes(
    `border-left:${layoutEditorSelectionRecipe.outlineWidth} ${layoutEditorSelectionRecipe.outlineStyle} currentColor`
  ));
  assert.ok(layoutEditorSelectionRotationStyles.includes(
    `border-top:${layoutEditorSelectionRecipe.outlineWidth} ${layoutEditorSelectionRecipe.outlineStyle} currentColor`
  ));
  assert.match(layoutEditorSelectionRotationStyles, /width:calc\(16px \* var\(--bb-layout-editor-overlay-zoom-compensation, 1\)\);height:calc\(16px \* var\(--bb-layout-editor-overlay-zoom-compensation, 1\)\)/);
  assert.doesNotMatch(layoutEditorSelectionRotationStyles, /drop-shadow/);
  assert.match(layoutEditorRegionOverlayStyles, /\.bb-layout-editor-region-box/);
  assert.match(layoutEditorRegionOverlayStyles, /\.bb-layout-editor-region-handle/);
  assert.match(layoutEditorRegionOverlayStyles, /\.bb-layout-editor-draw-box/);
  assert.match(layoutEditorRegionOverlayStyles, /\.bb-layout-editor-draw-layer--text/);
  assert.match(layoutEditorRegionOverlayStyles, /\.bb-layout-editor-draw-box--text/);
  assert.match(layoutEditorRegionOverlayStyles, /\.bb-layout-editor-draw-handle/);
  assert.match(layoutEditorRegionOverlayStyles, new RegExp(zoomProperty));
  assert.match(layoutEditorResizeHandleResetStyles, /box-sizing:border-box/);
  assert.match(layoutEditorResizeHandleResetStyles, /min-width:0/);
  assert.match(layoutEditorResizeHandleResetStyles, /padding:0/);
  assert.match(layoutEditorResizeHandleResetStyles, /appearance:none/);
  assert.match(layoutEditorRegionOverlayStyles, /layout-editor-region-handle\{display:block;box-sizing:border-box/);
  assert.match(layoutEditorRegionOverlayStyles, /border-radius:0/);
  assert.match(layoutEditorRegionOverlayStyles, /background:var\(--bb-layout-editor-region-accent\)/);
  assert.doesNotMatch(layoutEditorRegionOverlayStyles, /22px|4px dashed/);
});

test('programmatic workspace focus does not paint a surface overlay', async () => {
  const css = await readFile(new URL('../components/interface-primitives.css', import.meta.url), 'utf8');

  assert.match(css, /\.bb-workspace-surface\[tabindex="-1"\]:focus\s*\{[^}]*outline:\s*none;/s);
});

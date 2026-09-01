import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  applyLayoutEditorOverlayZoomCompensation,
  layoutEditorRegionOverlayStyles,
  layoutEditorResizeHandleResetStyles,
  layoutEditorRotationIconMarkup,
  layoutEditorSelectionRecipe,
  layoutEditorSelectionRotationStyles,
  layoutEditorSnapGuideStyles,
  layoutEditorTextCaretRecipe,
  layoutEditorTextCaretStyles
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
  assert.equal(layoutEditorSelectionRecipe.chromeZIndex, '2147483000');
  assert.equal(layoutEditorSelectionRecipe.hoverChromeZIndex, '2147482999');
  assert.equal(layoutEditorSelectionRecipe.snapTargetChromeZIndex, '2147482998');
  assert.equal(layoutEditorSelectionRecipe.guideZIndex, '19');
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
  assert.match(layoutEditorRegionOverlayStyles, /\.bb-layout-editor-chrome\{z-index:2147482999\}/);
  assert.match(layoutEditorRegionOverlayStyles, /\.bb-layout-editor-hull\.spatial-hovered\{z-index:2147482999\}/);
  assert.match(layoutEditorRegionOverlayStyles, /\.bb-layout-editor-hull\.snap-target\{z-index:2147482998\}/);
  assert.match(layoutEditorRegionOverlayStyles, /\.bb-layout-editor-hull\.selected\{z-index:2147483000\}/);
  assert.match(layoutEditorRegionOverlayStyles, /\.bb-layout-editor-hull\.snap-target>\.bb-layout-editor-hull-outline>\.bb-layout-editor-hull-shape\{[^}]*vector-effect:none/);
  assert.doesNotMatch(layoutEditorRegionOverlayStyles, /cursor:none|resize-pointer-active/);
  assert.match(layoutEditorRegionOverlayStyles, /\.bb-layout-editor-hull-outline/);
  assert.match(layoutEditorRegionOverlayStyles, /\.bb-layout-editor-hull-shape/);
  assert.match(layoutEditorRegionOverlayStyles, /\.bb-layout-editor-region-handle/);
  assert.match(layoutEditorRegionOverlayStyles, /\.bb-layout-editor-draw-box/);
  assert.match(layoutEditorRegionOverlayStyles, /\.bb-layout-editor-draw-layer--text/);
  assert.match(layoutEditorRegionOverlayStyles, /\.bb-layout-editor-draw-box--text/);
  assert.match(layoutEditorRegionOverlayStyles, /\.bb-layout-editor-draw-handle/);
  assert.match(layoutEditorRegionOverlayStyles, new RegExp(zoomProperty));
  assert.match(layoutEditorRegionOverlayStyles, /stroke-dasharray:/);
  assert.match(layoutEditorResizeHandleResetStyles, /box-sizing:border-box/);
  assert.match(layoutEditorResizeHandleResetStyles, /min-width:0/);
  assert.match(layoutEditorResizeHandleResetStyles, /padding:0/);
  assert.match(layoutEditorResizeHandleResetStyles, /appearance:none/);
  assert.match(layoutEditorRegionOverlayStyles, /layout-editor-region-handle\{display:block;box-sizing:border-box/);
  assert.match(layoutEditorRegionOverlayStyles, /border-radius:0/);
  assert.match(layoutEditorRegionOverlayStyles, /background:var\(--bb-layout-editor-region-accent\)/);
  assert.match(layoutEditorRegionOverlayStyles, /\.bb-layout-editor-hull\.selected>\.bb-layout-editor-region-handle/);
  assert.doesNotMatch(layoutEditorRegionOverlayStyles, /22px|4px dashed/);
  assert.match(layoutEditorSnapGuideStyles, /\.bb-layout-editor-snap-guide/);
  assert.match(layoutEditorSnapGuideStyles, /\.bb-layout-editor-snap-guide--vertical/);
  assert.match(layoutEditorSnapGuideStyles, /\.bb-layout-editor-snap-guide--horizontal/);
  assert.match(layoutEditorSnapGuideStyles, new RegExp(layoutEditorSelectionRecipe.signalColor));
  assert.match(layoutEditorSnapGuideStyles, new RegExp(layoutEditorSelectionRecipe.guideOpacity.replace('.', '\\.')));
  assert.match(layoutEditorSnapGuideStyles, new RegExp(zoomProperty));
  assert.match(layoutEditorSnapGuideStyles, /repeating-linear-gradient/);
  assert.match(layoutEditorSnapGuideStyles, /transform:translateX\(-50%\)/);
  assert.match(layoutEditorSnapGuideStyles, /transform:translateY\(-50%\)/);
  assert.match(layoutEditorSnapGuideStyles, new RegExp(layoutEditorSelectionRecipe.outlineDashLength.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.doesNotMatch(layoutEditorSnapGuideStyles, /border-left|border-top/);
  assert.doesNotMatch(layoutEditorSnapGuideStyles, /snap-guide-vertical|snap-guide-horizontal/);
});

test('layout editor zoom compensation has one shared presentation helper', () => {
  const assignments = [];
  const element = {
    style: {
      setProperty(name, value) {
        assignments.push([name, value]);
      }
    }
  };

  assert.equal(applyLayoutEditorOverlayZoomCompensation(element, 0.25), 4);
  assert.deepEqual(assignments, [[
    layoutEditorSelectionRecipe.zoomCompensationProperty,
    '4'
  ]]);
  assert.equal(applyLayoutEditorOverlayZoomCompensation(null, 0), 1);
});

test('layout editor Text caret uses the shared screen-space metric owner', () => {
  const zoomProperty = layoutEditorSelectionRecipe.zoomCompensationProperty;

  assert.equal(layoutEditorTextCaretRecipe.hostClass, 'bb-layout-editor-text-caret-host');
  assert.equal(layoutEditorTextCaretRecipe.visibleAttribute, 'data-bb-layout-editor-text-caret-visible');
  assert.match(layoutEditorTextCaretRecipe.width, /calc\(2px/);
  assert.match(layoutEditorTextCaretRecipe.width, new RegExp(zoomProperty));
  assert.doesNotMatch(layoutEditorTextCaretStyles, /caret-color:currentColor/);
  assert.match(layoutEditorTextCaretStyles, /\[contenteditable="true"\] \*\{caret-color:transparent!important\}/);
  assert.match(layoutEditorTextCaretStyles, new RegExp(layoutEditorTextCaretRecipe.colorProperty));
  assert.match(layoutEditorTextCaretStyles, new RegExp(layoutEditorTextCaretRecipe.heightProperty));
  assert.match(layoutEditorTextCaretStyles, new RegExp(layoutEditorTextCaretRecipe.slantProperty));
  assert.match(layoutEditorTextCaretStyles, /skewX\(/);
  assert.match(layoutEditorTextCaretStyles, /steps\(1,end\) infinite/);
  assert.match(layoutEditorTextCaretStyles, /prefers-reduced-motion:reduce/);
});

test('programmatic workspace focus does not paint a surface overlay', async () => {
  const css = await readFile(new URL('../components/interface-primitives.css', import.meta.url), 'utf8');

  assert.match(css, /\.bb-workspace-surface\[tabindex="-1"\]:focus\s*\{[^}]*outline:\s*none;/s);
});

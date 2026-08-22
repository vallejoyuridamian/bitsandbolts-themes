import { semanticIconMarkup } from './semantic-icons.js';

const overlayZoomCompensationProperty = '--bb-layout-editor-overlay-zoom-compensation';
const overlayMetric = (pixels) => `calc(${pixels}px * var(${overlayZoomCompensationProperty}, 1))`;

export const layoutEditorSelectionRecipe = Object.freeze({
  signalColor: '#ff5a5f',
  alternateSignalColor: '#12e6d5',
  mutedSignalColor: 'rgba(255,90,95,.65)',
  zoomCompensationProperty: overlayZoomCompensationProperty,
  outlineWidth: overlayMetric(1),
  outlineStyle: 'dashed',
  outlineOffset: '0',
  selectedTextOutlineOffset: '0',
  guideOpacity: '.92',
  placementPreview: Object.freeze({
    position: 'absolute',
    zIndex: '70',
    pointerEvents: 'none',
    boxSizing: 'border-box',
    borderWidth: '1px',
    borderStyle: 'dashed',
    borderColor: '#ff5a5f',
    border: '1px dashed #ff5a5f',
    contentBorder: `${overlayMetric(1)} solid transparent`,
    background: 'rgba(255, 90, 95, 0.08)',
    outerBackground: 'transparent',
    fallbackColor: '#ffffff',
    fallbackFontFamily: 'var(--bb-font-family-body, sans-serif)',
    fallbackFontWeight: '700'
  }),
  resizeHandleSize: overlayMetric(8),
  resizeHandleOffset: overlayMetric(-4),
  resizeHandleBorder: '0',
  resizeHandleBorderRadius: '0',
  resizeHandleBackground: '#ff5a5f'
});

export const layoutEditorResizeHandleResetStyles = 'display:block;box-sizing:border-box;min-width:0;min-height:0;max-width:none;max-height:none;margin:0;padding:0;overflow:hidden;-webkit-appearance:none;appearance:none;box-shadow:none;font-size:0;line-height:0';

export const layoutEditorSelectionRotationStyles = `
.body-rotation-axis,.body-rotation-handle{position:absolute;border:0;padding:0;color:${layoutEditorSelectionRecipe.signalColor};background:transparent;pointer-events:auto}
.body-rotation-axis::before{content:"";position:absolute;opacity:.36}
.body-rotation-axis[data-axis="x"]{top:0;bottom:0;left:50%;width:${overlayMetric(30)};transform:translateX(-50%);cursor:ns-resize}
.body-rotation-axis[data-axis="x"]::before{top:0;bottom:0;left:50%;border-left:${layoutEditorSelectionRecipe.outlineWidth} ${layoutEditorSelectionRecipe.outlineStyle} currentColor}
.body-rotation-axis[data-axis="y"]{top:50%;right:0;left:0;height:${overlayMetric(30)};transform:translateY(-50%);cursor:ew-resize}
.body-rotation-axis[data-axis="y"]::before{right:0;left:0;top:50%;border-top:${layoutEditorSelectionRecipe.outlineWidth} ${layoutEditorSelectionRecipe.outlineStyle} currentColor}
.body-rotation-axis:hover::before,.body-rotation-axis.active::before,.body-rotation-axis.shared-axis-accent::before{opacity:.95}
.body-rotation-axis .bb-semantic-icon{position:absolute;width:${overlayMetric(16)};height:${overlayMetric(16)};opacity:0}
.body-rotation-axis:hover .bb-semantic-icon,.body-rotation-axis.active .bb-semantic-icon,.body-rotation-axis.shared-axis-accent .bb-semantic-icon{opacity:1}
.body-rotation-axis[data-axis="x"] .bb-semantic-icon{top:${overlayMetric(8)};left:50%;transform:translateX(-50%)}
.body-rotation-axis[data-axis="y"] .bb-semantic-icon{top:50%;right:${overlayMetric(8)};transform:translateY(-50%) rotate(90deg)}
.body-rotation-axis[data-projected-axis="true"]::before{top:50%;right:0;bottom:auto;left:0;border-top:${layoutEditorSelectionRecipe.outlineWidth} ${layoutEditorSelectionRecipe.outlineStyle} currentColor;border-left:0}
.body-rotation-axis[data-projected-axis="true"] .bb-semantic-icon{top:50%;right:${overlayMetric(8)};left:auto;transform:translateY(-50%)}
.body-rotation-handle[data-axis="z"]{top:${overlayMetric(-34)};left:50%;width:${overlayMetric(22)};height:${overlayMetric(22)};transform:translateX(-50%);cursor:grab}
.body-rotation-handle[data-axis="z"]:active{cursor:grabbing}
.body-rotation-handle .bb-semantic-icon{width:${overlayMetric(16)};height:${overlayMetric(16)}}
.device-pose-overlay{position:absolute;z-index:4;overflow:visible;pointer-events:none}
.device-pose-overlay .body-rotation-axis .bb-semantic-icon{width:${overlayMetric(16)};height:${overlayMetric(16)}}
.device-pose-overlay .body-rotation-axis[data-axis="x"][data-projected-axis="true"] .bb-semantic-icon{right:22%}
.device-pose-overlay .body-rotation-axis[data-axis="y"][data-projected-axis="true"] .bb-semantic-icon{right:62%}
.device-pose-overlay .body-rotation-handle[data-axis="z"]{top:var(--device-pose-z-top,${overlayMetric(6)});width:${overlayMetric(22)};height:${overlayMetric(22)}}
.device-pose-overlay .body-rotation-handle .bb-semantic-icon{width:${overlayMetric(16)};height:${overlayMetric(16)}}
.device-pose-overlay[data-device-pose-visibility="hover"] .body-rotation-axis,
.device-pose-overlay[data-device-pose-visibility="hover"] .body-rotation-handle{visibility:hidden;opacity:0;pointer-events:none}
.device-pose-overlay[data-device-pose-visibility="hover"].device-pose-hovered .body-rotation-axis,
.device-pose-overlay[data-device-pose-visibility="hover"].device-pose-hovered .body-rotation-handle,
.device-pose-overlay[data-device-pose-visibility="hover"].device-pose-active .body-rotation-axis,
.device-pose-overlay[data-device-pose-visibility="hover"].device-pose-active .body-rotation-handle{visibility:visible;opacity:1;pointer-events:auto}
`;

export const layoutEditorRegionOverlayStyles = `
.bb-layout-editor-region-box{--bb-layout-editor-region-accent:${layoutEditorSelectionRecipe.signalColor};position:absolute;z-index:175;box-sizing:border-box;outline:${layoutEditorSelectionRecipe.outlineWidth} ${layoutEditorSelectionRecipe.outlineStyle} transparent;outline-offset:0;background:transparent;cursor:default;pointer-events:none}
.bb-layout-editor-region-box.bb-layout-editor-region-box--alternate{--bb-layout-editor-region-accent:${layoutEditorSelectionRecipe.alternateSignalColor}}
.bb-layout-editor-region-box.spatial-hovered,.bb-layout-editor-region-box.selected{outline-color:var(--bb-layout-editor-region-accent)}
.bb-layout-editor-region-box.spatial-interactive{cursor:move;pointer-events:auto}
.bb-layout-editor-region-box[data-layout-region-interactive="false"]{pointer-events:none}
.bb-layout-editor-region-handle{${layoutEditorResizeHandleResetStyles};position:absolute;width:${layoutEditorSelectionRecipe.resizeHandleSize};height:${layoutEditorSelectionRecipe.resizeHandleSize};border:${layoutEditorSelectionRecipe.resizeHandleBorder};border-radius:${layoutEditorSelectionRecipe.resizeHandleBorderRadius};background:var(--bb-layout-editor-region-accent);visibility:hidden;pointer-events:none}
.bb-layout-editor-region-box.selected>.bb-layout-editor-region-handle{visibility:visible;pointer-events:auto}
.bb-layout-editor-region-handle[data-corner="nw"]{top:${layoutEditorSelectionRecipe.resizeHandleOffset};left:${layoutEditorSelectionRecipe.resizeHandleOffset};cursor:nwse-resize}
.bb-layout-editor-region-handle[data-corner="ne"]{top:${layoutEditorSelectionRecipe.resizeHandleOffset};right:${layoutEditorSelectionRecipe.resizeHandleOffset};cursor:nesw-resize}
.bb-layout-editor-region-handle[data-corner="sw"]{bottom:${layoutEditorSelectionRecipe.resizeHandleOffset};left:${layoutEditorSelectionRecipe.resizeHandleOffset};cursor:nesw-resize}
.bb-layout-editor-region-handle[data-corner="se"]{right:${layoutEditorSelectionRecipe.resizeHandleOffset};bottom:${layoutEditorSelectionRecipe.resizeHandleOffset};cursor:nwse-resize}
.bb-layout-editor-draw-layer{position:absolute;inset:0;z-index:180;cursor:crosshair;background:transparent;pointer-events:auto}
.bb-layout-editor-draw-box{position:absolute;box-sizing:border-box;border:0;outline:${layoutEditorSelectionRecipe.outlineWidth} ${layoutEditorSelectionRecipe.outlineStyle} ${layoutEditorSelectionRecipe.alternateSignalColor};outline-offset:0;background:transparent;pointer-events:none}
.bb-layout-editor-draw-box--tinted{background:rgb(18 230 213 / 8%);visibility:hidden}
`;

export function layoutEditorRotationIconMarkup() {
  return semanticIconMarkup('rotate');
}

import { semanticIconMarkup } from './semantic-icons.js';

export const layoutEditorSelectionRecipe = Object.freeze({
  signalColor: '#ff5a5f',
  mutedSignalColor: 'rgba(255,90,95,.65)',
  outlineWidth: '4px',
  outlineStyle: 'dashed',
  outlineOffset: '0',
  selectedTextOutlineOffset: '0',
  guideOpacity: '.92',
  placementPreview: Object.freeze({
    position: 'absolute',
    zIndex: '70',
    pointerEvents: 'none',
    boxSizing: 'border-box',
    borderWidth: '4px',
    borderStyle: 'dashed',
    borderColor: '#ff5a5f',
    border: '4px dashed #ff5a5f',
    contentBorder: '4px solid transparent',
    background: 'rgba(255, 90, 95, 0.08)',
    outerBackground: 'transparent',
    fallbackColor: '#ffffff',
    fallbackFontFamily: 'var(--bb-font-family-body, sans-serif)',
    fallbackFontWeight: '700'
  }),
  resizeHandleBorder: '3px solid #fff',
  resizeHandleBackground: '#ff5a5f'
});

export const layoutEditorSelectionRotationStyles = `
.body-rotation-axis,.body-rotation-handle{position:absolute;border:0;padding:0;color:${layoutEditorSelectionRecipe.signalColor};background:transparent;pointer-events:auto}
.body-rotation-axis::before{content:"";position:absolute;opacity:.36}
.body-rotation-axis[data-axis="x"]{top:0;bottom:0;left:50%;width:34px;transform:translateX(-50%);cursor:ns-resize}
.body-rotation-axis[data-axis="x"]::before{top:0;bottom:0;left:50%;border-left:3px dashed currentColor}
.body-rotation-axis[data-axis="y"]{top:50%;right:0;left:0;height:34px;transform:translateY(-50%);cursor:ew-resize}
.body-rotation-axis[data-axis="y"]::before{right:0;left:0;top:50%;border-top:3px dashed currentColor}
.body-rotation-axis:hover::before,.body-rotation-axis.active::before,.body-rotation-axis.shared-axis-accent::before{opacity:.95}
.body-rotation-axis .bb-semantic-icon{position:absolute;width:36px;height:36px;opacity:0;filter:drop-shadow(0 2px 4px rgba(0,0,0,.4))}
.body-rotation-axis:hover .bb-semantic-icon,.body-rotation-axis.active .bb-semantic-icon,.body-rotation-axis.shared-axis-accent .bb-semantic-icon{opacity:1}
.body-rotation-axis[data-axis="x"] .bb-semantic-icon{top:12px;left:50%;transform:translateX(-50%)}
.body-rotation-axis[data-axis="y"] .bb-semantic-icon{top:50%;right:12px;transform:translateY(-50%) rotate(90deg)}
.body-rotation-axis[data-projected-axis="true"]::before{top:50%;right:0;bottom:auto;left:0;border-top:3px dashed currentColor;border-left:0}
.body-rotation-axis[data-projected-axis="true"] .bb-semantic-icon{top:50%;right:12px;left:auto;transform:translateY(-50%)}
.body-rotation-handle[data-axis="z"]{top:-58px;left:50%;width:42px;height:42px;transform:translateX(-50%);cursor:grab}
.body-rotation-handle[data-axis="z"]:active{cursor:grabbing}
.body-rotation-handle .bb-semantic-icon{width:42px;height:42px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.4))}
.device-pose-overlay{position:absolute;z-index:4;overflow:visible;pointer-events:none}
.device-pose-overlay .body-rotation-axis .bb-semantic-icon{width:24px;height:24px}
.device-pose-overlay .body-rotation-axis[data-axis="x"][data-projected-axis="true"] .bb-semantic-icon{right:22%}
.device-pose-overlay .body-rotation-axis[data-axis="y"][data-projected-axis="true"] .bb-semantic-icon{right:62%}
.device-pose-overlay .body-rotation-handle[data-axis="z"]{top:var(--device-pose-z-top,8px);width:30px;height:30px}
.device-pose-overlay .body-rotation-handle .bb-semantic-icon{width:30px;height:30px}
.device-pose-overlay[data-device-pose-visibility="hover"] .body-rotation-axis,
.device-pose-overlay[data-device-pose-visibility="hover"] .body-rotation-handle{visibility:hidden;opacity:0;pointer-events:none}
.device-pose-overlay[data-device-pose-visibility="hover"].device-pose-hovered .body-rotation-axis,
.device-pose-overlay[data-device-pose-visibility="hover"].device-pose-hovered .body-rotation-handle,
.device-pose-overlay[data-device-pose-visibility="hover"].device-pose-active .body-rotation-axis,
.device-pose-overlay[data-device-pose-visibility="hover"].device-pose-active .body-rotation-handle{visibility:visible;opacity:1;pointer-events:auto}
`;

export function layoutEditorRotationIconMarkup() {
  return semanticIconMarkup('rotate');
}

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

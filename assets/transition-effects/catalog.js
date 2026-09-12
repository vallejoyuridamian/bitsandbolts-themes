// Portable visual definitions; consumers own timing, persistence and rendering.
export const transitionEffects = Object.freeze([
  { id: 'aperture', label: 'Open / close', parameters: [
    { name: 'axis', label: 'Axis', default: 'horizontal', options: [['horizontal', 'Horizontal'], ['vertical', 'Vertical']] },
    { name: 'mode', label: 'Mode', default: 'open', options: [['open', 'Open'], ['close', 'Close']] }
  ] },
  { id: 'burn', label: 'Burn', parameters: [
    { name: 'color', label: 'Burn color', type: 'color', default: '#ff8000' }
  ] },
  { id: 'page-curl', label: 'Page Curl', parameters: [
    { name: 'backColor', label: 'Page back', type: 'color', default: '#ffffff' }
  ] }
]);

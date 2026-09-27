// View-independent lengths for feedback inside a scaled coordinate system.
// Apply the scale at the coordinate owner; descendants inherit the metric.
// Unscaled surfaces consume the same property with its identity default.
export const overlayZoomCompensationProperty = '--bb-layout-editor-overlay-zoom-compensation';

export const overlayMetric = (pixels) => (
  `calc(${pixels}px * var(${overlayZoomCompensationProperty}, 1))`
);

export function applyOverlayZoomCompensation(element, scale = 1) {
  const numericScale = Number(scale);
  const resolvedScale = Number.isFinite(numericScale) && numericScale > 0 ? numericScale : 1;
  const compensation = 1 / resolvedScale;
  element?.style?.setProperty?.(overlayZoomCompensationProperty, String(compensation));
  return compensation;
}

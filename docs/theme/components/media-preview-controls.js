export { createMediaControlsDemand } from './media-controls-demand.js';

function escapeMarkup(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

// Tabular digits have equal advance. Reserve the formatted clock's intrinsic
// size independently of its live value, without measuring DOM during playback.
function timeShape(value) {
  return String(value).replace(/\d/g, '0');
}

export function mediaTransportReadoutMarkup({ id = '', className = '', value = '00:00.00' } = {}) {
  return `<span${id ? ` id="${escapeMarkup(id)}"` : ''} class="bb-media-transport__time bb-media-transport__clock ${escapeMarkup(className)}"><span class="bb-media-transport__time-value">${escapeMarkup(value)}</span><span class="bb-media-transport__time-size" aria-hidden="true">${escapeMarkup(timeShape(value))}</span></span>`;
}

export function syncMediaTransportReadout(control, value) {
  if (!control) return;
  const text = control.firstElementChild.firstChild;
  if (text.data === value) return;
  const size = control.lastElementChild.firstChild;
  const shape = timeShape(value);
  if (size.data !== shape) size.data = shape;
  text.data = value;
}

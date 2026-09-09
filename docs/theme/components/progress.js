function escapeHtml(value = '') {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

export function progressMarkup({ label = 'Preparing', id = 'progress' } = {}) {
  return `<div class="bb-progress" data-bb-progress><div class="bb-progress__heading"><p id="${escapeHtml(id)}Label" class="bb-progress__label" data-bb-progress-label role="status">${escapeHtml(label)}</p><p class="bb-progress__value" data-bb-progress-value></p></div><progress class="bb-progress__track" max="100" aria-labelledby="${escapeHtml(id)}Label" data-bb-progress-track></progress></div>`;
}

export function updateProgressPresentation(root, { label = '', percent = null, active = true } = {}) {
  root.querySelector('[data-bb-progress-label]').textContent = label;
  const measured = typeof percent === 'number' && Number.isFinite(percent);
  root.querySelector('[data-bb-progress-value]').textContent = measured ? `${Math.round(percent)}%` : '';
  const track = root.querySelector('[data-bb-progress-track]');
  track.hidden = !active;
  if (measured) track.value = Math.max(0, Math.min(100, percent));
  else track.removeAttribute('value');
}

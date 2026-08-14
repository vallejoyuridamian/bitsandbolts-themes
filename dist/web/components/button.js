function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function buttonMarkup(model = {}) {
  const appearance = model.appearance === 'neon' ? ' bb-btn-neon' : '';
  const size = model.size === 'compact'
    ? ' bb-btn--compact'
    : model.size === 'medium'
      ? ' bb-btn--medium'
      : '';
  if (model.href) {
    const external = model.external ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${escapeHtml(model.href)}" class="bb-btn${appearance}${size}"${external}>${escapeHtml(model.label)}</a>`;
  }
  const form = model.form ? ` form="${escapeHtml(model.form)}"` : '';
  const disabled = model.disabled ? ' disabled' : '';
  return `<button type="${escapeHtml(model.type ?? 'button')}"${form} class="bb-btn${appearance}${size}"${disabled}>${escapeHtml(model.label)}</button>`;
}

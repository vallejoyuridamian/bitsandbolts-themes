function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function fieldMarkup(field, { appearance: inheritedAppearance, specimen = false } = {}) {
  const appearance = (field.appearance ?? inheritedAppearance) === 'prominent' ? ' bb-field--prominent' : '';
  const error = field.state === 'error' ? ' bb-field--error' : '';
  const state = specimen && field.state ? ` data-specimen-state="${escapeHtml(field.state)}"` : '';
  const autocomplete = field.autocomplete ? ` autocomplete="${escapeHtml(field.autocomplete)}"` : '';
  const placeholder = field.placeholder ? ` placeholder="${escapeHtml(field.placeholder)}"` : '';
  const required = field.required ? ' required' : '';
  const common = `id="${escapeHtml(field.id)}" name="${escapeHtml(field.name)}" class="bb-field__input"${autocomplete}${placeholder}${required}${specimen ? ' tabindex="-1"' : ''}`;
  const control = field.type === 'textarea'
    ? `<textarea ${common} rows="${Number.isInteger(field.rows) ? field.rows : 2}"></textarea>`
    : `<input ${common} type="${escapeHtml(field.type)}" />`;
  const message = field.state === 'error' && field.message
    ? `<p class="bb-field__error">${escapeHtml(field.message)}</p>`
    : field.hint
      ? `<p class="bb-field__hint">${escapeHtml(field.hint)}</p>`
      : '';
  return `<div class="bb-field${appearance}${error}"${state}>
          <label class="bb-field__label" for="${escapeHtml(field.id)}">${escapeHtml(field.label)}</label>
          ${control}${message ? `
          ${message}` : ''}
        </div>`;
}

export function formFieldsMarkup(model = {}, options = {}) {
  const fields = Array.isArray(model.fields) ? model.fields : [];
  const appearance = model.appearance === 'prominent' ? ' bb-form-fields--prominent' : '';
  return `<div class="bb-form-fields${appearance}">
        ${fields.map((field) => fieldMarkup(field, { ...options, appearance: model.appearance })).join('\n        ')}
      </div>`;
}

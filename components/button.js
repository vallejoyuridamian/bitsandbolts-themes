import {
  DEFAULT_SEMANTIC_ICON_FAMILY,
  semanticIconMarkup
} from './semantic-icons.js';

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function attributesMarkup(attributes = {}) {
  return Object.entries(attributes)
    .filter(([name, value]) => (
      /^[A-Za-z_:][A-Za-z0-9:_.-]*$/.test(name)
      && value !== false
      && value !== null
      && value !== undefined
    ))
    .map(([name, value]) => value === true
      ? ` ${name}`
      : ` ${name}="${escapeHtml(value)}"`)
    .join('');
}

const SEMANTIC_ACTION_RECIPES = Object.freeze({
  text: Object.freeze(['bb-btn', 'bb-btn-text']),
  workspace: Object.freeze(['bb-workspace-control-button']),
  workspaceAdd: Object.freeze(['bb-workspace-add-tile'])
});

export function semanticActionButtonMarkup(model = {}) {
  const label = String(model.label || '').trim();
  const iconRole = String(model.iconRole || '').trim();
  const recipe = String(model.recipe || 'workspace');
  const recipeClasses = SEMANTIC_ACTION_RECIPES[recipe];
  if (!label || !iconRole || !recipeClasses) {
    throw new TypeError('A semantic action button requires a label, icon role, and supported recipe.');
  }
  const iconOnly = model.iconOnly !== false;
  const classes = [
    ...recipeClasses,
    ...(recipe === 'workspace' && iconOnly ? ['bb-workspace-control-button--icon'] : []),
    ...(recipe === 'workspace' && model.danger ? ['bb-workspace-control-button--danger'] : []),
    ...String(model.className || '').split(/\s+/).filter(Boolean)
  ];
  const attributes = {
    ...(model.id ? { id: model.id } : {}),
    'aria-label': model.ariaLabel || label,
    title: model.help || model.ariaLabel || label,
    ...(model.disabled ? { disabled: true } : {}),
    ...(model.hidden ? { hidden: true } : {}),
    ...(model.tabIndex !== undefined ? { tabindex: model.tabIndex } : {}),
    ...(model.attributes ?? {})
  };
  const icon = model.iconMarkup || semanticIconMarkup(iconRole, '', {
    family: model.iconFamily || DEFAULT_SEMANTIC_ICON_FAMILY
  });
  const iconWrapper = `<span class="bb-workspace-control-icon" aria-hidden="true">${icon}</span>`;
  const body = `${iconWrapper}${iconOnly ? '' : `<span>${escapeHtml(label)}</span>`}`;
  return `<button type="${escapeHtml(model.type || 'button')}" class="${classes.map(escapeHtml).join(' ')}"${attributesMarkup(attributes)}>${body}</button>`;
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

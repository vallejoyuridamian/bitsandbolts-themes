import { semanticIconMarkup } from './semantic-icons.js';

function escapeHtml(value = '') {
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
      && value !== null
      && value !== undefined
      && value !== ''
    ))
    .map(([name, value]) => `${name}="${escapeHtml(value)}"`)
    .join(' ');
}

export function workspaceSectionSummaryMarkup({ count = null, label = '' } = {}) {
  const hasCount = count !== null
    && count !== undefined
    && count !== ''
    && Number.isFinite(Number(count));
  return `
    ${semanticIconMarkup('submenu', 'bb-workspace-section__icon')}
    <span class="bb-workspace-section__label">${escapeHtml(label)}</span>
    ${hasCount ? `<span class="bb-workspace-section__count">${Math.max(0, Math.round(Number(count)))}</span>` : ''}
  `;
}

export function workspaceSectionMarkup({
  attributes = {},
  className = '',
  compact = false,
  content = '',
  count = null,
  id = '',
  label = '',
  open = false
} = {}) {
  const classes = [
    'bb-workspace-section',
    compact ? 'bb-workspace-section--compact' : '',
    className
  ].filter(Boolean).join(' ');
  const sectionAttributes = attributesMarkup({
    'data-workspace-section': id,
    'data-workspace-section-label': label,
    ...attributes
  });
  return `
    <details class="${escapeHtml(classes)}"${sectionAttributes ? ` ${sectionAttributes}` : ''}${open ? ' open' : ''}>
      <summary>${workspaceSectionSummaryMarkup({ count, label })}</summary>
      ${content}
    </details>
  `;
}

import { semanticActionButtonMarkup } from './button.js';
import { semanticIconMarkup } from './semantic-icons.js';

const ROOT_CLASS = 'bb-layout-text-editor';
const PRESENTATIONS = new Set(['sidebar', 'toolbar']);

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
      && value !== false
      && value !== null
      && value !== undefined
    ))
    .map(([name, value]) => value === true
      ? ` ${name}`
      : ` ${name}="${escapeHtml(value)}"`)
    .join('');
}

export function layoutTextEditorProjectColorAddMarkup({
  attributes = {},
  value = '#000000'
} = {}) {
  return `<label class="bb-color-swatch-add bb-workspace-add-tile bb-cut-corner-swatch" aria-label="Add color to project" title="Add color to project"><input class="bb-color-swatch-add__input" type="color" value="${escapeHtml(value)}" aria-label="Add color to project"${attributesMarkup(attributes)}><span class="bb-workspace-control-icon" aria-hidden="true">${semanticIconMarkup('add')}</span></label>`;
}

export function layoutTextEditorIconButtonMarkup({
  attributes = {},
  disabled = false,
  iconRole = '',
  label = '',
  shortcut = ''
} = {}) {
  return semanticActionButtonMarkup({
    attributes,
    className: `${ROOT_CLASS}__icon-button`,
    disabled,
    help: shortcut ? `${label} (${shortcut})` : label,
    iconRole,
    label,
    recipe: 'workspace'
  });
}

export function applyLayoutTextEditorRecipe({
  node = null,
  presentation = 'sidebar'
} = {}) {
  if (!node?.classList) return false;
  const resolvedPresentation = PRESENTATIONS.has(presentation) ? presentation : 'sidebar';
  node.classList.add(
    ROOT_CLASS,
    'bb-interface-controls',
    `${ROOT_CLASS}--${resolvedPresentation}`
  );
  node.dataset.bbLayoutTextEditor = '';
  const summary = node.querySelector?.(':scope > summary') ?? null;
  summary?.classList?.add(`${ROOT_CLASS}__summary`);
  return true;
}

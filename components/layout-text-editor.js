import { semanticActionButtonMarkup } from './button.js';
import { semanticIconMarkup } from './semantic-icons.js';

const ROOT_CLASS = 'bb-layout-text-editor';
const PRESENTATIONS = new Set(['sidebar', 'toolbar']);

export const LAYOUT_TEXT_EDITOR_MIXED_VALUE = '__bb_layout_text_editor_mixed__';

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

export function layoutTextEditorOriginalColorMarkup({
  attributes = {},
  selected = false
} = {}) {
  return `<button type="button" class="theme-swatch bb-color-swatch-original bb-cut-corner-swatch" aria-label="Use original image colors" title="Original"${selected ? ' aria-pressed="true"' : ''}${attributesMarkup(attributes)}>${semanticIconMarkup('close')}</button>`;
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

export function layoutTextEditorCheckboxMarkup({
  attributes = {},
  checked = false,
  label = ''
} = {}) {
  return `<div class="bb-checkbox-field"><label class="bb-checkbox-field__label bb-layout-text-editor__checkbox"><input class="bb-checkbox-field__control" type="checkbox"${checked ? ' checked' : ''}${attributesMarkup(attributes)}><span class="bb-checkbox-field__text">${escapeHtml(label)}</span></label></div>`;
}

export function layoutTextEditorMixedOptionMarkup({ label = 'Mixed' } = {}) {
  return `<option value="${LAYOUT_TEXT_EDITOR_MIXED_VALUE}" data-bb-layout-text-editor-mixed-option hidden>${escapeHtml(label)}</option>`;
}

export function syncLayoutTextEditorMixedState(control, {
  mixed = false,
  placeholder = 'Mixed'
} = {}) {
  if (!control?.dataset) return false;
  const isMixed = mixed === true;
  if (isMixed) control.dataset.bbLayoutTextEditorMixed = '';
  else delete control.dataset.bbLayoutTextEditorMixed;

  const tagName = String(control.tagName || '').toLowerCase();
  const inputType = String(control.type || '').toLowerCase();
  const resolvedPlaceholder = placeholder === null || placeholder === undefined
    ? 'Mixed'
    : String(placeholder);
  if (tagName === 'input' && inputType === 'checkbox') {
    control.indeterminate = isMixed;
    if (isMixed) control.setAttribute?.('aria-checked', 'mixed');
    else control.removeAttribute?.('aria-checked');
    return true;
  }
  if (tagName === 'button' && control.hasAttribute?.('aria-pressed')) {
    control.setAttribute('aria-pressed', isMixed ? 'mixed' : 'false');
    return true;
  }
  if (tagName === 'select') {
    if (isMixed) control.value = LAYOUT_TEXT_EDITOR_MIXED_VALUE;
    return true;
  }
  if (tagName === 'input' && ['number', 'text'].includes(inputType)) {
    if (isMixed) {
      control.value = '';
      control.placeholder = resolvedPlaceholder;
    } else if (control.placeholder === resolvedPlaceholder) {
      control.removeAttribute?.('placeholder');
    }
    return true;
  }
  return true;
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

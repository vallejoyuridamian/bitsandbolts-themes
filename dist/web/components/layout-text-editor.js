import { semanticActionButtonMarkup } from './button.js';

const ROOT_CLASS = 'bb-layout-text-editor';
const PRESENTATIONS = new Set(['sidebar', 'window']);

export function layoutTextEditorIconButtonMarkup({
  attributes = {},
  disabled = false,
  iconRole = '',
  label = ''
} = {}) {
  return semanticActionButtonMarkup({
    attributes,
    className: `${ROOT_CLASS}__icon-button`,
    disabled,
    help: label,
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

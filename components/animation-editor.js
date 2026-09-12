import { semanticActionButtonMarkup } from './button.js';
import { colorPaletteSectionMarkup, layoutTextEditorSectionMarkup } from './layout-text-editor.js';

function escapeHtml(value) {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}
function attributesMarkup(attributes = {}) {
  return Object.entries(attributes).map(([name, value]) => {
    if (!/^[a-z][a-z0-9-]*$/.test(name)) throw new TypeError('Invalid animation attribute');
    return ` ${name}="${escapeHtml(value)}"`;
  }).join('');
}

export function animationCardMarkup({ summary = '', contentMarkup = '', attributes = {}, removeAttributes = {}, className = '' } = {}) {
  return `<div class="animation-item${className ? ` ${escapeHtml(className)}` : ''}"${attributesMarkup(attributes)}>
    <div class="animation-item-header"><strong>${escapeHtml(summary)}</strong>
      ${semanticActionButtonMarkup({ iconRole: 'delete', label: 'Remove animation', attributes: removeAttributes })}
    </div>${contentMarkup}</div>`;
}

export function animationEditorMarkup({ itemsMarkup = '', addAttributes = {}, canAdd = true, toolbarActions = [], headerMarkup = '', presentation = 'window' } = {}) {
  const content = `${headerMarkup}<div class="animation-toolbar">
    ${canAdd ? semanticActionButtonMarkup({ iconRole: 'add', label: 'Add animation', attributes: addAttributes }) : ''}
    ${toolbarActions.map((action) => semanticActionButtonMarkup(action)).join('')}
    </div><div class="animation-list" data-floating-window-items>${itemsMarkup}</div>`;
  return presentation === 'sidebar'
    ? layoutTextEditorSectionMarkup({ label: 'Animation', attributes: { 'data-animation-editor-root': '' }, contentMarkup: `<div class="animation-tools bb-animation-editor">${content}</div>` })
    : `<div class="bb-animation-editor bb-property-editor bb-interface-controls" data-animation-editor-root>${content}</div>`;
}

export function animationRegionControlMarkup({ label = '', attributes = {} } = {}) {
  return `<div class="bb-animation-editor__region">
    ${semanticActionButtonMarkup({ iconRole: 'safe_area', label: 'Draw zone', iconOnly: false, attributes })}
    <span>${escapeHtml(label)}</span></div>`;
}

export function animationEffectParametersMarkup({ parameters = [], values = {}, attributes = {}, toolAttribute = '', namePrefix = 'effect', renderColorPalette } = {}) {
  return parameters.map((parameter) => parameter.type === 'color'
    ? colorPaletteSectionMarkup({ label: parameter.label, attributes: { ...attributes, 'data-animation-effect-color': parameter.name },
      paletteMarkup: renderColorPalette(parameter, values[parameter.name] ?? parameter.default) })
    : `<label>${escapeHtml(parameter.label)}
    <select name="${escapeHtml(`${namePrefix}-${parameter.name}`)}"${attributesMarkup({ ...attributes, [toolAttribute]: `effect:${parameter.name}` })}>
      ${parameter.options.map(([value, label]) => `<option value="${escapeHtml(value)}"${String(values[parameter.name] ?? parameter.default) === value ? ' selected' : ''}>${escapeHtml(label)}</option>`).join('')}
    </select></label>`).join('');
}

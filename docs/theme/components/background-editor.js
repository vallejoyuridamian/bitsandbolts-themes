import { semanticIconMarkup } from './semantic-icons.js';
import { layoutTextEditorRangeFieldMarkup } from './layout-text-editor.js';

function escapeHtml(value = '') {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function controlId(id = 'backgroundEditor', role = '') {
  return `${String(id || 'backgroundEditor').replace(/[^A-Za-z0-9_-]/g, '')}-${role}`;
}

export function backgroundEditorMarkup({
  id = 'backgroundEditor',
  inheritLabel = 'Use project background',
  itemScopeLabel = 'Screen',
  patterns = [],
  patternFields = [],
  animatedEffects = [],
  presentation = 'embedded',
  showScope = false,
  showInherit = true
} = {}) {
  const modeId = controlId(id, 'mode');
  const orientationId = controlId(id, 'orientation');
  const themeColorsId = controlId(id, 'theme-colors');
  const primaryId = controlId(id, 'primary');
  const secondaryId = controlId(id, 'secondary');
  const imageId = controlId(id, 'image');
  const imageSizeId = controlId(id, 'image-size');
  const opacityId = controlId(id, 'opacity');
  const presentationClass = presentation === 'window'
    ? ' bb-background-editor--window'
    : ' bb-background-editor--embedded';
  const inherit = showInherit
    ? `<button class="bb-background-editor__inherit bb-workspace-control-button" type="button" data-bb-background-editor-role="clear-own">${escapeHtml(inheritLabel)}</button>`
    : '';
  const scope = showScope
    ? `<div class="bb-background-editor__scope bb-segmented-control" role="group" aria-label="Background editing scope">
      <button class="bb-segmented-control__item" type="button" aria-pressed="false" data-bb-background-editor-scope="project">Project</button>
      <button class="bb-segmented-control__item active" type="button" aria-pressed="true" data-bb-background-editor-scope="surface">${escapeHtml(itemScopeLabel)}</button>
    </div>`
    : '';
  return `<div class="bb-background-editor bb-interface-controls${presentationClass}" data-bb-background-editor>
    ${scope}
    <div class="bb-background-editor__theme" data-bb-background-editor-role="theme-control"></div>
    ${inherit}
    <div class="bb-field">
      <label class="bb-field__label" for="${modeId}">Background</label>
      <select id="${modeId}" class="bb-field__input" data-bb-background-editor-role="mode">
        <option value="transparent">Transparent</option>
        <option value="solid">Single color</option>
        <option value="gradient">Gradient</option>
        <option value="image">Image</option>
        ${patterns.length ? '<option value="pattern">Pattern</option>' : ''}
        ${animatedEffects.length ? '<option value="animated">Animated</option>' : ''}
      </select>
    </div>
    ${patterns.length ? `<div class="bb-field" data-bb-background-editor-when="pattern">
      <label class="bb-field__label" for="${controlId(id, 'pattern')}">Pattern</label>
      <select id="${controlId(id, 'pattern')}" class="bb-field__input" data-bb-background-editor-role="pattern">
        ${patterns.map((pattern) => `<option value="${escapeHtml(pattern.id)}">${escapeHtml(pattern.name)}</option>`).join('')}
      </select>
    </div>
    <div class="bb-toolbar-popover__fields" data-bb-background-editor-when="pattern">
      ${patternFields.map(({ key, label, min, max, step, initial, unit, valueLabel }) => layoutTextEditorRangeFieldMarkup({
        label, min, max, step, value: initial, unit, valueLabel,
        attributes: { 'aria-label': label, 'aria-valuetext': valueLabel, 'data-bb-background-pattern-field': key }
      })).join('')}
    </div>` : ''}
    ${animatedEffects.length ? `<div class="bb-field" data-bb-background-editor-when="animated">
      <label class="bb-field__label" for="${controlId(id, 'animation')}">Effect</label>
      <select id="${controlId(id, 'animation')}" class="bb-field__input" data-bb-background-editor-role="animation">
        ${animatedEffects.map((effect) => `<option value="${escapeHtml(effect.id)}">${escapeHtml(effect.name)}</option>`).join('')}
      </select>
    </div>
    <div class="bb-toolbar-popover__fields" data-bb-background-editor-when="animated">
      ${[...new Map(animatedEffects.flatMap((effect) => effect.fields).map((field) => [field.key, field])).values()].map(({ key, label, min, max, step, initial }) => layoutTextEditorRangeFieldMarkup({
        label, min, max, step, value: initial, unit: '', valueLabel: String(initial),
        attributes: { 'aria-label': label, 'data-bb-background-animation-field': key }
      })).join('')}
    </div>` : ''}
    <div class="bb-field" data-bb-background-editor-when="gradient">
      <label class="bb-field__label" for="${orientationId}">Gradient flow</label>
      <select id="${orientationId}" class="bb-field__input" data-bb-background-editor-role="orientation">
        <option value="spotlight">Spotlight</option>
        <option value="vertical">Vertical</option>
        <option value="horizontal">Horizontal</option>
      </select>
    </div>
    <div class="bb-checkbox-field" data-bb-background-editor-when="paint">
      <label class="bb-checkbox-field__label" for="${themeColorsId}">
        <input id="${themeColorsId}" class="bb-checkbox-field__control" type="checkbox" data-bb-background-editor-role="use-theme-colors" checked>
        <span class="bb-checkbox-field__text">Use theme colors</span>
      </label>
    </div>
    <div class="bb-background-editor__color-row" data-bb-background-editor-when="paint">
      <label class="bb-background-editor__color-target" for="${primaryId}" data-bb-background-editor-color-target="primary">
        <span class="bb-background-editor__color-label">Primary</span>
        <input id="${primaryId}" class="bb-toolbar-popover__color-input bb-cut-corner-swatch" type="color" value="#71d2d7" data-bb-background-editor-role="primary-color">
      </label>
      <button class="bb-background-editor__swap bb-workspace-control-button bb-workspace-control-button--icon" type="button" aria-label="Swap background colors" title="Swap background colors" data-bb-background-editor-role="swap" data-bb-background-editor-when="secondary-color">
        <span class="bb-workspace-control-icon" aria-hidden="true">${semanticIconMarkup('swap_horiz')}</span>
      </button>
      <label class="bb-background-editor__color-target" for="${secondaryId}" data-bb-background-editor-color-target="secondary" data-bb-background-editor-when="secondary-color">
        <span class="bb-background-editor__color-label">Secondary</span>
        <input id="${secondaryId}" class="bb-toolbar-popover__color-input bb-cut-corner-swatch" type="color" value="#182122" data-bb-background-editor-role="secondary-color">
      </label>
    </div>
    <div data-bb-background-editor-role="theme-palette" data-bb-background-editor-when="paint"></div>
    <div class="bb-field" data-bb-background-editor-when="opaque">
      <label class="bb-background-editor__range-label" for="${opacityId}"><span>Opacity</span><output for="${opacityId}" data-bb-background-editor-role="opacity-output">100%</output></label>
      <input id="${opacityId}" class="bb-background-editor__range" type="range" min="0" max="100" step="1" value="100" data-bb-background-editor-role="opacity">
    </div>
    <div class="bb-field" data-bb-background-editor-when="image">
      <label class="bb-field__label" for="${imageId}">Image source</label>
      <select id="${imageId}" class="bb-field__input" data-bb-background-editor-role="image-path">
        <option value="">No image</option>
      </select>
    </div>
    <div class="bb-background-editor__asset-actions" data-bb-background-editor-when="image">
      <button class="bb-workspace-control-button" type="button" data-bb-background-editor-role="upload-image">Upload</button>
      <button class="bb-workspace-control-button" type="button" data-bb-background-editor-role="clear-image">Clear image</button>
    </div>
    <div class="bb-field" data-bb-background-editor-when="image">
      <label class="bb-field__label" for="${imageSizeId}">Tile size</label>
      <input id="${imageSizeId}" class="bb-background-editor__range" type="range" min="48" max="1200" step="8" value="320" data-bb-background-editor-role="image-size">
    </div>
    <input type="file" accept=".png,.jpg,.jpeg,.svg,.webp,image/png,image/jpeg,image/svg+xml,image/webp" data-bb-background-editor-role="image-file" hidden>
  </div>`;
}

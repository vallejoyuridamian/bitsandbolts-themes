import { semanticIconMarkup } from './semantic-icons.js';

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

export function backgroundEditorSwatchesMarkup(colors = []) {
  return (Array.isArray(colors) ? colors : []).map((item) => {
    const color = String(item?.color || '').trim();
    if (!color) return '';
    const token = String(item?.token || 'Color').trim();
    const detail = `${token}: ${color}`;
    return `<button class="bb-background-editor__swatch" type="button" aria-label="Use ${escapeHtml(detail)}" title="${escapeHtml(detail)}" data-bb-background-editor-swatch="${escapeHtml(color)}" style="--bb-background-editor-swatch:${escapeHtml(color)}"></button>`;
  }).join('');
}

export function backgroundEditorMarkup({
  id = 'backgroundEditor',
  inheritLabel = 'Use project background',
  itemScopeLabel = 'Screen',
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
        <option value="default">Default spotlight</option>
        <option value="transparent">Transparent</option>
        <option value="solid">Single color</option>
        <option value="gradient">Gradient</option>
        <option value="image">Image</option>
        <option value="gradient-image">Gradient + image</option>
      </select>
    </div>
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
        <input id="${primaryId}" class="bb-background-editor__color-control" type="color" value="#71d2d7" data-bb-background-editor-role="primary-color">
      </label>
      <button class="bb-background-editor__swap bb-workspace-control-button bb-workspace-control-button--icon" type="button" aria-label="Swap background colors" title="Swap background colors" data-bb-background-editor-role="swap" data-bb-background-editor-when="secondary-color">
        <span class="bb-workspace-control-icon" aria-hidden="true">${semanticIconMarkup('swap_horiz')}</span>
      </button>
      <label class="bb-background-editor__color-target" for="${secondaryId}" data-bb-background-editor-color-target="secondary" data-bb-background-editor-when="secondary-color">
        <span class="bb-background-editor__color-label">Secondary</span>
        <input id="${secondaryId}" class="bb-background-editor__color-control" type="color" value="#182122" data-bb-background-editor-role="secondary-color">
      </label>
    </div>
    <div class="bb-background-editor__swatches" role="toolbar" aria-label="Theme colors" data-bb-background-editor-role="theme-palette" data-bb-background-editor-when="paint"></div>
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

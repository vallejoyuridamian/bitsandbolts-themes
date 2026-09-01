import { semanticActionButtonMarkup } from './button.js';
import { semanticIconMarkup } from './semantic-icons.js';

const ROOT_CLASS = 'bb-layout-text-editor';
const PRESENTATIONS = new Set(['sidebar', 'toolbar']);
const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;

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

export function syncLayoutTextEditorProjectColorPreview(control, color = '') {
  const tile = control?.matches?.('.bb-color-swatch-add')
    ? control
    : control?.closest?.('.bb-color-swatch-add');
  if (!tile?.dataset) return false;
  const resolvedColor = String(color || '').trim();
  const baselineColor = String(control?.defaultValue || '').trim();
  if (
    !HEX_COLOR_PATTERN.test(resolvedColor)
    || resolvedColor.toLowerCase() === baselineColor.toLowerCase()
  ) {
    delete tile.dataset.bbColorSwatchPreview;
    tile.style?.removeProperty?.('--bb-color-swatch-add-preview');
    return true;
  }
  tile.dataset.bbColorSwatchPreview = '';
  tile.style?.setProperty?.('--bb-color-swatch-add-preview', resolvedColor);
  return true;
}

export function layoutTextEditorOriginalColorMarkup({
  attributes = {},
  selected = false
} = {}) {
  return `<button type="button" class="theme-swatch bb-color-swatch-original bb-cut-corner-swatch" aria-label="Use original image colors" title="Original"${selected ? ' aria-pressed="true"' : ''}${attributesMarkup(attributes)}>${semanticIconMarkup('close')}</button>`;
}

export function layoutTextEditorColorSwatchMarkup({
  attributes = {},
  color = '',
  help = '',
  selected = false
} = {}) {
  const resolvedColor = String(color || '').trim();
  if (!HEX_COLOR_PATTERN.test(resolvedColor)) {
    throw new TypeError('Layout text editor color swatch requires a six-digit hex color.');
  }
  const resolvedHelp = String(help || '').trim() || resolvedColor;
  return `<button type="button" class="theme-swatch bb-cut-corner-swatch" aria-label="Use ${escapeHtml(resolvedHelp)}" title="${escapeHtml(resolvedHelp)}" style="--swatch:${escapeHtml(resolvedColor)}"${selected ? ' aria-pressed="true"' : ''}${attributesMarkup(attributes)}></button>`;
}

function layoutTextEditorColorPaletteRowMarkup({
  label = '',
  markup = ''
} = {}) {
  const resolvedMarkup = String(markup || '').trim();
  if (!resolvedMarkup) return '';
  return `<div class="bb-color-palette__row" role="group" aria-label="${escapeHtml(label)} colors"><span class="bb-color-palette__label">${escapeHtml(label)}</span><div class="bb-color-palette__swatches">${resolvedMarkup}</div></div>`;
}

export function layoutTextEditorColorPaletteMarkup({
  onTopMarkup = '',
  originalMarkup = '',
  projectMarkup = '',
  themeMarkup = ''
} = {}) {
  const rows = [
    layoutTextEditorColorPaletteRowMarkup({ label: 'Original', markup: originalMarkup }),
    layoutTextEditorColorPaletteRowMarkup({ label: 'Theme', markup: themeMarkup }),
    layoutTextEditorColorPaletteRowMarkup({ label: 'On top', markup: onTopMarkup }),
    layoutTextEditorColorPaletteRowMarkup({ label: 'Project', markup: projectMarkup })
  ].filter(Boolean);
  return `<div class="bb-color-palette">${rows.join('')}</div>`;
}

export function layoutTextEditorIconButtonMarkup({
  attributes = {},
  disabled = false,
  iconFamily = '',
  iconRole = '',
  label = '',
  shortcut = ''
} = {}) {
  return semanticActionButtonMarkup({
    attributes,
    className: `${ROOT_CLASS}__icon-button`,
    disabled,
    help: shortcut ? `${label} (${shortcut})` : label,
    iconFamily,
    iconRole,
    label,
    recipe: 'workspace'
  });
}

function layoutArrangeActionMarkup({ action = '', iconRole = '', label = '' } = {}) {
  return layoutTextEditorIconButtonMarkup({
    attributes: {
      'data-bb-layout-arrange-action': action
    },
    iconRole,
    label
  });
}

function layoutArrangeGroupMarkup({
  actions = [],
  label = '',
  role = ''
} = {}) {
  return `<div class="bb-layout-arrange-popover__group" role="group" aria-label="${escapeHtml(label)}"${role ? ` data-bb-layout-arrange-${escapeHtml(role)}` : ''}><span class="bb-layout-arrange-popover__label">${escapeHtml(label)}</span><div class="bb-layout-arrange-popover__actions">${actions.join('')}</div></div>`;
}

export function layoutTextEditorArrangePopoverMarkup({
  includeSelectionDistribution = false,
  includeViewportDistribution = false,
  layoutLabel = 'Screen'
} = {}) {
  const resolvedLayoutLabel = String(layoutLabel || 'Screen');
  const groups = [layoutArrangeGroupMarkup({
    label: 'Align',
    role: 'alignment',
    actions: [
      layoutArrangeActionMarkup({
        action: 'align-left',
        iconRole: 'align_selection_left',
        label: 'Align left edges'
      }),
      layoutArrangeActionMarkup({
        action: 'align-center-x',
        iconRole: 'align_selection_center_x',
        label: 'Align X centers to first selection'
      }),
      layoutArrangeActionMarkup({
        action: 'align-right',
        iconRole: 'align_selection_right',
        label: 'Align right edges'
      }),
      layoutArrangeActionMarkup({
        action: 'align-top',
        iconRole: 'align_selection_top',
        label: 'Align top edges'
      }),
      layoutArrangeActionMarkup({
        action: 'align-center-y',
        iconRole: 'align_selection_center_y',
        label: 'Align Y centers to first selection'
      }),
      layoutArrangeActionMarkup({
        action: 'align-bottom',
        iconRole: 'align_selection_bottom',
        label: 'Align bottom edges'
      })
    ]
  })];
  if (includeSelectionDistribution) {
    groups.push(layoutArrangeGroupMarkup({
      label: 'Distribute within selection',
      role: 'selection-distribution',
      actions: [
        layoutArrangeActionMarkup({
          action: 'distribute-selection-horizontal',
          iconRole: 'distribute_horizontal',
          label: 'Distribute horizontal gaps within selection'
        }),
        layoutArrangeActionMarkup({
          action: 'distribute-selection-vertical',
          iconRole: 'distribute_vertical',
          label: 'Distribute vertical gaps within selection'
        })
      ]
    }));
  }
  if (includeViewportDistribution) {
    groups.push(layoutArrangeGroupMarkup({
      label: `Distribute within ${resolvedLayoutLabel}`,
      role: 'viewport-distribution',
      actions: [
        layoutArrangeActionMarkup({
          action: 'distribute-viewport-horizontal',
          iconRole: 'distribute_horizontal',
          label: `Distribute horizontally within ${resolvedLayoutLabel}`
        }),
        layoutArrangeActionMarkup({
          action: 'distribute-viewport-vertical',
          iconRole: 'distribute_vertical',
          label: `Distribute vertically within ${resolvedLayoutLabel}`
        })
      ]
    }));
  }
  return `<div class="bb-layout-arrange-popover" data-bb-layout-arrange-popover>${groups.join('')}</div>`;
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

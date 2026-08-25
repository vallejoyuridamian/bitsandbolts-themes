import { semanticIconMarkup } from './semantic-icons.js';

const THEME_MODES = Object.freeze(['light', 'dark']);

function escapeHtml(value = '') {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function attributesMarkup(attributes = {}) {
  return Object.entries(attributes).flatMap(([name, value]) => {
    if (!/^[a-z][a-z0-9-]*$/i.test(name) || value === false || value == null) return [];
    return value === true
      ? [name]
      : [`${name}="${escapeHtml(value)}"`];
  }).join(' ');
}

export function compactThemeMode(mode = '') {
  return THEME_MODES.includes(mode) ? mode : 'dark';
}

export function nextCompactThemeMode(mode = '') {
  return compactThemeMode(mode) === 'dark' ? 'light' : 'dark';
}

function requiredTheme(theme = null) {
  const id = String(theme?.id || '').trim();
  const label = String(theme?.label || '').trim();
  if (!id || !label || !theme?.v2?.modes?.dark || !theme?.v2?.modes?.light) {
    throw new TypeError('Compact Theme presentation requires one complete v2 theme.');
  }
  return theme;
}

function identityMarkup(theme, mode) {
  return theme.v2.modes[compactThemeMode(mode)].identity.map((identity) => `
    <span
      class="bb-compact-theme-card__swatch"
      data-bb-compact-theme-identity="${escapeHtml(identity.id)}"
      aria-hidden="true"
    ></span>
  `).join('');
}

export function themeModeToggleMarkup({
  attributes = {},
  className = '',
  currentMode = 'dark',
  iconClass = '',
  label = '',
  title = ''
} = {}) {
  const mode = compactThemeMode(currentMode);
  const targetMode = nextCompactThemeMode(mode);
  const actionAttributes = attributesMarkup(attributes);
  const accessibleLabel = label || `Use ${targetMode} mode`;
  const tooltip = title || accessibleLabel;
  return `<button
    class="bb-theme-mode-toggle${className ? ` ${escapeHtml(className)}` : ''}"
    type="button"
    data-bb-theme-control
    data-bb-theme-mode-toggle
    data-bb-theme-mode-target="${targetMode}"
    aria-label="${escapeHtml(accessibleLabel)}"
    title="${escapeHtml(tooltip)}"
    ${actionAttributes}
  >
    <span class="bb-theme-mode-toggle__icon${iconClass ? ` ${escapeHtml(iconClass)}` : ''}" data-bb-theme-mode-icon="light" aria-hidden="true">
      ${semanticIconMarkup('light_mode', 'bb-theme-mode-toggle__glyph', { family: 'bitsandbolts-theme' })}
    </span>
    <span class="bb-theme-mode-toggle__icon${iconClass ? ` ${escapeHtml(iconClass)}` : ''}" data-bb-theme-mode-icon="dark" aria-hidden="true">
      ${semanticIconMarkup('dark_mode', 'bb-theme-mode-toggle__glyph', { family: 'bitsandbolts-theme' })}
    </span>
  </button>`;
}

function compactThemeCardMarkup(themeInput, modeInput, {
  action = 'select',
  modeToggle = true,
  selected = false
} = {}) {
  const theme = requiredTheme(themeInput);
  const mode = compactThemeMode(modeInput);
  const selectAttribute = action === 'open'
    ? 'data-bb-compact-theme-open'
    : `data-bb-compact-theme-select="${escapeHtml(theme.id)}"`;
  const selectLabel = action === 'open'
    ? `Change Theme. ${theme.label} selected.`
    : `Use ${theme.label} theme`;
  const toggle = modeToggle
    ? themeModeToggleMarkup({
        attributes: action === 'open'
          ? { 'data-bb-compact-theme-mode-toggle': true }
          : { 'data-bb-compact-theme-card-mode': theme.id },
        className: 'bb-compact-theme-card__mode-toggle',
        currentMode: mode,
        label: action === 'open'
          ? `Use ${nextCompactThemeMode(mode)} mode`
          : `Preview ${theme.label} in ${nextCompactThemeMode(mode)} mode`
      })
    : '';
  return `<article
    class="bb-compact-theme-card${selected ? ' is-selected' : ''}"
    data-bb-compact-theme-preview
    data-bb-compact-theme-id="${escapeHtml(theme.id)}"
    data-bb-compact-theme-mode="${mode}"
  >
    <button
      class="bb-compact-theme-card__select"
      type="button"
      data-bb-theme-control
      data-floating-window-grid-measure-content
      ${selectAttribute}
      aria-label="${escapeHtml(selectLabel)}"
      ${action === 'select' ? `role="option" aria-selected="${selected ? 'true' : 'false'}"` : ''}
    >
      <span class="bb-compact-theme-card__name">${escapeHtml(theme.label)}</span>
      <span class="bb-compact-theme-card__swatches">${identityMarkup(theme, mode)}</span>
    </button>
    ${toggle}
  </article>`;
}

export function compactThemeSelectionMarkup(theme, mode = 'dark', {
  fieldLabel = 'Theme'
} = {}) {
  return `<div class="bb-compact-theme-field" data-bb-compact-theme-field>
    <span class="bb-field__label">${escapeHtml(fieldLabel)}</span>
    ${compactThemeCardMarkup(theme, mode, {
      action: 'open',
      modeToggle: true,
      selected: true
    })}
  </div>`;
}

export function compactThemePickerMarkup(catalog = {}, {
  cardModes = {},
  mode = 'dark',
  selectedThemeId = '',
  title = 'Choose Theme'
} = {}) {
  const themes = Array.isArray(catalog?.themes) ? catalog.themes.map(requiredTheme) : [];
  if (!themes.length) throw new TypeError('Compact Theme picker requires a complete v2 catalog.');
  const cards = themes.map((theme) => compactThemeCardMarkup(
    theme,
    cardModes[theme.id] || mode,
    {
      action: 'select',
      selected: selectedThemeId === theme.id
    }
  )).join('');
  return `<div
    class="bb-floating-window-content bb-compact-theme-picker"
    data-bb-compact-theme-picker
    data-floating-window-preferred-columns="2"
  >
    <header class="bb-floating-window-content__head bb-compact-theme-picker__head">
      <button
        class="bb-compact-theme-picker__back bb-workspace-control-button bb-workspace-control-button--plain-icon"
        type="button"
        aria-label="Back"
        title="Back"
        data-bb-compact-theme-back
      ><span class="bb-workspace-control-icon" aria-hidden="true">${semanticIconMarkup('arrow_back')}</span></button>
      <h2 class="bb-floating-window-content__title">${escapeHtml(title)}</h2>
    </header>
    <div class="bb-compact-theme-picker__body">
      <div
        class="bb-compact-theme-picker__grid"
        role="listbox"
        aria-label="Themes"
        data-floating-window-responsive-grid
      >
        ${cards}
      </div>
    </div>
  </div>`;
}

export function applyCompactThemeVariables(root, catalog = {}) {
  const themes = Array.isArray(catalog?.themes) ? catalog.themes : [];
  root?.querySelectorAll?.('[data-bb-compact-theme-preview]').forEach((preview) => {
    const themeId = String(preview.dataset.bbCompactThemeId || '');
    const mode = compactThemeMode(preview.dataset.bbCompactThemeMode);
    const theme = themes.find((candidate) => candidate.id === themeId);
    const presentation = theme?.v2?.modes?.[mode];
    if (!presentation?.variables || !Array.isArray(presentation.identity)) {
      throw new TypeError(`Compact Theme presentation is unavailable for ${themeId || 'unknown'} ${mode}.`);
    }
    Object.entries(presentation.variables).forEach(([name, value]) => {
      preview.style.setProperty(name, value);
    });
    const neutral = presentation.identity.find((identity) => identity.id === 'neutral');
    const accent = presentation.identity.find((identity) => identity.id === 'accent');
    if (!neutral || !accent) {
      throw new TypeError(`Compact Theme identities are incomplete for ${themeId} ${mode}.`);
    }
    preview.style.setProperty('--bb-compact-theme-neutral', neutral.value);
    preview.style.setProperty('--bb-theme-summary-card-accent', accent.value);
    preview.style.setProperty('--bb-theme-summary-card-on-accent', accent.foreground);
    preview.querySelectorAll('[data-bb-theme-mode-toggle]').forEach((toggle) => {
      toggle.style.setProperty('--bb-theme-mode-toggle-background', accent.value);
      toggle.style.setProperty('--bb-theme-mode-toggle-foreground', accent.foreground);
    });
    preview.querySelectorAll('[data-bb-compact-theme-identity]').forEach((swatch) => {
      const identity = presentation.identity.find((entry) => (
        entry.id === swatch.dataset.bbCompactThemeIdentity
      ));
      if (!identity) return;
      swatch.style.setProperty('--bb-compact-theme-swatch', identity.value);
    });
  });
}

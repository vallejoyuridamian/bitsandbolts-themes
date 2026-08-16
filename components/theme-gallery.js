import { contentCardsMarkup } from './content-card.js';
import { spotlightMediaMarkup, storeBadgesMarkup } from './content-media.js';
import { semanticActionButtonMarkup } from './button.js';
import {
  mediaCopyListMarkup,
  milestoneTimelineMarkup,
  proseMarkup,
  questionListMarkup
} from './content-section.js';
import { footerMarkup, synchronizeFooterYear } from './footer.js';
import { floatingWindowConfirmationMarkup } from './floating-window.js';
import { floatingWindowShellMarkup } from './floating-window-shell.js';
import { formFieldsMarkup } from './form-field.js';
import { navbarMarkup } from './navbar.js';
import { selectionControlsMarkup } from './select.js';
import {
  DEFAULT_SEMANTIC_ICON_FAMILY,
  semanticIconMarkup
} from './semantic-icons.js';

const ICON_FAMILY_LABELS = Object.freeze({
  'font-awesome-solid': 'Font Awesome Solid',
  'material-symbols': 'Material Symbols'
});

const THEME_GALLERY_SCROLLBAR_VARIABLES = Object.freeze([
  '--bb-interface-scrollbar-thumb',
  '--bb-interface-scrollbar-track',
  '--bb-interface-scrollbar-border',
  '--bb-interface-scrollbar-highlight'
]);

const NAVBAR_SPECIMEN = Object.freeze({
  label: 'Example navigation',
  brand: Object.freeze({
    href: '/',
    ariaLabel: 'Product home',
    name: 'PRODUCT',
    tagline: 'SHORT TAGLINE'
  }),
  links: Object.freeze([
    Object.freeze({ label: 'Overview', href: '/overview' }),
    Object.freeze({ label: 'Features', href: '/features' }),
    Object.freeze({ label: 'Support', href: '/support' })
  ]),
  action: Object.freeze({ label: 'START', href: '/start' })
});

const FOOTER_SPECIMEN = Object.freeze({
  label: 'Footer navigation',
  brand: NAVBAR_SPECIMEN.brand,
  links: Object.freeze([
    Object.freeze({ label: 'Privacy policy', href: '/privacy' }),
    Object.freeze({ label: 'Terms', href: '/terms' }),
    Object.freeze({ label: 'Delete account', href: '/delete-account' })
  ]),
  copyright: 'PRODUCT',
  note: 'All rights reserved'
});

const CATALOG_SCHEMA_VERSION = 1;
const REQUIRED_MODES = Object.freeze(['light', 'dark']);
const THEME_ID_PATTERN = /^[a-z0-9-]+$/;
const V2_ID_PATTERN = /^[a-z][a-zA-Z0-9-]*$/;
const CSS_VARIABLE_PATTERN = /^--bb-[a-z0-9-]+$/;
const V2_CSS_VARIABLE_PATTERN = /^--bb-v2-[a-z0-9-]+$/;
const V2_CONTRACT_VERSION = '2.0.0';
const ICON_NAME_PATTERN = /^[a-z0-9_]+$/;
const GENERIC_FONT_FAMILIES = new Set(['cursive', 'fantasy', 'monospace', 'sans-serif', 'serif', 'system-ui']);

function escapeHtml(value = '') {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function safeCssVariableValue(value) {
  const normalized = String(value ?? '').trim();
  if (!normalized || normalized.length > 512 || /[;{}]/.test(normalized) || /url\s*\(/i.test(normalized)) {
    throw new TypeError('Theme catalog contains an unsafe CSS variable value.');
  }
  return normalized;
}

function normalizeVariables(value = {}) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError('Theme catalog mode variables are invalid.');
  }
  const variables = {};
  for (const [name, rawValue] of Object.entries(value)) {
    if (!CSS_VARIABLE_PATTERN.test(name)) {
      throw new TypeError(`Theme catalog variable is invalid: ${name}`);
    }
    const normalizedValue = safeCssVariableValue(rawValue);
    const unquotedFontFamily = normalizedValue.replace(/^(['"])(.*)\1$/, '$2').toLowerCase();
    if (name.startsWith('--bb-font-family-') && (
      normalizedValue.includes(',')
      || GENERIC_FONT_FAMILIES.has(unquotedFontFamily)
    )) {
      throw new TypeError(`Theme catalog font role must name one primary family: ${name}`);
    }
    variables[name] = normalizedValue;
  }
  if (!variables['--bb-color-background'] || !variables['--bb-color-on-background']) {
    throw new TypeError('Theme catalog mode is missing required surface colors.');
  }
  return Object.freeze(variables);
}

function normalizeMode(value = {}, mode = '') {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`Theme catalog ${mode} mode is invalid.`);
  }
  return Object.freeze({
    cssPath: String(value.cssPath || ''),
    variables: normalizeVariables(value.variables)
  });
}

function normalizeIcons(value = {}) {
  const family = String(value.family || '').trim().toLowerCase();
  const style = String(value.style || '').trim().toLowerCase();
  const previewFamily = String(value.previewFamily || '').trim().toLowerCase();
  const previewNames = Array.isArray(value.previewNames)
    ? value.previewNames.map((name) => String(name || '').trim()).filter((name) => ICON_NAME_PATTERN.test(name))
    : [];
  if (!THEME_ID_PATTERN.test(family) || !THEME_ID_PATTERN.test(style) || !THEME_ID_PATTERN.test(previewFamily)) {
    throw new TypeError('Theme catalog icon configuration is invalid.');
  }
  return Object.freeze({
    exactPreview: value.exactPreview === true,
    family,
    previewFamily,
    previewNames: Object.freeze([...new Set(previewNames)]),
    style
  });
}

function normalizeSingleFontFamily(value, role) {
  const normalized = String(value || '').trim();
  if (!normalized || normalized.includes(',') || GENERIC_FONT_FAMILIES.has(normalized.toLowerCase())) {
    throw new TypeError(`Theme catalog font role must name one primary family: ${role}`);
  }
  return normalized;
}

function normalizeV2Variables(value = {}) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError('Theme catalog v2 mode variables are invalid.');
  }
  const variables = {};
  for (const [name, rawValue] of Object.entries(value)) {
    if (!V2_CSS_VARIABLE_PATTERN.test(name)) throw new TypeError(`Theme catalog v2 variable is invalid: ${name}`);
    variables[name] = safeCssVariableValue(rawValue);
  }
  if (!variables['--bb-v2-color-surface-canvas'] || !variables['--bb-v2-color-content-primary']) {
    throw new TypeError('Theme catalog v2 mode is missing required semantic colors.');
  }
  return Object.freeze(variables);
}

function normalizeV2Mode(value = {}, mode = '') {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`Theme catalog v2 ${mode} mode is invalid.`);
  }
  const identity = Array.isArray(value.identity) ? value.identity.map((entry) => {
    const id = String(entry?.id || '').trim();
    if (!THEME_ID_PATTERN.test(id) || !entry?.label || !entry?.token) throw new TypeError('Theme catalog v2 identity role is invalid.');
    return Object.freeze({
      id,
      label: String(entry.label),
      token: String(entry.token),
      value: safeCssVariableValue(entry.value)
    });
  }) : [];
  const semanticColors = Array.isArray(value.semanticColors) ? value.semanticColors.map((entry) => {
    const role = String(entry?.role || '').trim();
    if (!/^color\.[a-zA-Z0-9.]+$/.test(role)) throw new TypeError('Theme catalog v2 semantic color role is invalid.');
    return Object.freeze({ role, value: safeCssVariableValue(entry.value) });
  }) : [];
  if (
    identity.length !== 4
    || new Set(identity.map(({ id }) => id)).size !== 4
    || semanticColors.length !== 48
    || new Set(semanticColors.map(({ role }) => role)).size !== 48
  ) {
    throw new TypeError('Theme catalog v2 mode must contain four identity colors and 48 semantic color roles.');
  }
  return Object.freeze({
    identity: Object.freeze(identity),
    semanticColors: Object.freeze(semanticColors),
    variables: normalizeV2Variables(value.variables)
  });
}

function normalizeV2(value) {
  if (value == null) return null;
  if (!value || typeof value !== 'object' || Array.isArray(value) || value.contractVersion !== V2_CONTRACT_VERSION) {
    throw new TypeError('Theme catalog v2 contract is unsupported.');
  }
  const families = Object.fromEntries(Object.entries(value.typography?.families || {}).map(([role, family]) => [
    role,
    normalizeSingleFontFamily(family, `v2.${role}`)
  ]));
  if (!families.primary || !families.mono) throw new TypeError('Theme catalog v2 typography is missing required families.');
  const specimens = Array.isArray(value.typography?.specimens) ? value.typography.specimens.map((specimen) => {
    const id = String(specimen?.id || '').trim();
    const familyRole = String(specimen?.familyRole || '').trim();
    if (!V2_ID_PATTERN.test(id) || !families[familyRole]) throw new TypeError('Theme catalog v2 typography specimen is invalid.');
    return Object.freeze({
      familyRole,
      fontSize: safeCssVariableValue(specimen.fontSize),
      fontWeight: safeCssVariableValue(specimen.fontWeight),
      id,
      label: String(specimen.label || id),
      letterSpacing: safeCssVariableValue(specimen.letterSpacing),
      lineHeight: safeCssVariableValue(specimen.lineHeight),
      sample: String(specimen.sample || '')
    });
  }) : [];
  const buttonCases = Array.isArray(value.button?.specimenCases) ? value.button.specimenCases.map((entry) => {
    const variant = String(entry?.variant || '').trim();
    const state = String(entry?.state || '').trim();
    if (!THEME_ID_PATTERN.test(variant) || !/^[a-zA-Z]+$/.test(state)) throw new TypeError('Theme catalog v2 Button specimen is invalid.');
    return Object.freeze({ label: String(entry.label || ''), state, variant });
  }) : [];
  if (!buttonCases.length) throw new TypeError('Theme catalog v2 Button recipe has no specimen cases.');
  return Object.freeze({
    artDirection: Object.freeze({
      label: String(value.artDirection?.label || ''),
      summary: String(value.artDirection?.summary || ''),
      traits: Object.freeze(Object.fromEntries(Object.entries(value.artDirection?.traits || {}).map(([key, trait]) => [key, String(trait)])))
    }),
    button: Object.freeze({ specimenCases: Object.freeze(buttonCases) }),
    contractVersion: V2_CONTRACT_VERSION,
    modes: Object.freeze(Object.fromEntries(REQUIRED_MODES.map((mode) => [mode, normalizeV2Mode(value.modes?.[mode], mode)]))),
    themeVersion: String(value.themeVersion || ''),
    typography: Object.freeze({ families: Object.freeze(families), specimens: Object.freeze(specimens) })
  });
}

function normalizeTheme(value = {}) {
  const id = String(value.id || '').trim().toLowerCase();
  const label = String(value.label || '').trim();
  if (!THEME_ID_PATTERN.test(id) || !label) throw new TypeError('Theme catalog entry is invalid.');
  return Object.freeze({
    icons: normalizeIcons(value.icons),
    id,
    label,
    modes: Object.freeze(Object.fromEntries(REQUIRED_MODES.map((mode) => [
      mode,
      normalizeMode(value.modes?.[mode], mode)
    ]))),
    source: String(value.source || 'first-party'),
    v2: normalizeV2(value.v2)
  });
}

export function normalizeThemeCatalog(value = {}) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError('Theme catalog is invalid.');
  }
  if (value.schemaVersion !== CATALOG_SCHEMA_VERSION) {
    throw new TypeError(`Unsupported theme catalog schema: ${value.schemaVersion}`);
  }
  const themes = Array.isArray(value.themes) ? value.themes.map(normalizeTheme) : [];
  if (!themes.length || new Set(themes.map((theme) => theme.id)).size !== themes.length) {
    throw new TypeError('Theme catalog must contain unique first-party themes.');
  }
  return Object.freeze({
    packageVersion: String(value.packageVersion || 'unversioned'),
    schemaVersion: CATALOG_SCHEMA_VERSION,
    themes: Object.freeze(themes)
  });
}

function tokenLabel(variableName = '', prefix = '') {
  return String(variableName).replace(prefix, '').replaceAll('-', ' ');
}

function selectedTheme(catalog, themeId = '') {
  return catalog.themes.find((theme) => theme.id === themeId)
    || catalog.themes.find((theme) => theme.id === 'bitsandbolts')
    || catalog.themes[0];
}

function selectedMode(mode = '') {
  return REQUIRED_MODES.includes(mode) ? mode : 'dark';
}

function selectedCardModes(catalog, value = {}) {
  return Object.freeze(Object.fromEntries(catalog.themes
    .filter((theme) => Object.hasOwn(value, theme.id))
    .map((theme) => [theme.id, selectedMode(value[theme.id])])));
}

function nextThemeMode(mode = '') {
  return selectedMode(mode) === 'dark' ? 'light' : 'dark';
}

function themeSummaryIdentityMarkup(mode) {
  return mode.identity.map((entry) => `
    <span class="bb-theme-summary-card__identity" data-theme-v2-identity="${escapeHtml(entry.id)}">
      <span aria-hidden="true"></span>
      <small>${escapeHtml(entry.label)}</small>
    </span>
  `).join('');
}

function themeSummaryActionsMarkup() {
  return `
    <span class="bb-theme-summary-card__actions" aria-hidden="true">
      <span class="bb-v2-button">Primary</span>
      <span class="bb-v2-button bb-v2-button--secondary">Secondary</span>
    </span>
  `;
}

function themeSummaryCardMarkup(theme, mode) {
  if (!theme.v2) return '';
  const nextMode = nextThemeMode(mode);
  return `
    <article
      class="bb-theme-summary-card"
      data-theme-preview-id="${escapeHtml(theme.id)}"
      data-theme-preview-mode="${escapeHtml(mode)}"
    >
      <button
        class="bb-theme-summary-card__open"
        type="button"
        data-theme-gallery-open="${escapeHtml(theme.id)}"
        aria-label="Open ${escapeHtml(theme.label)} theme"
      >
        <span class="bb-theme-summary-card__header">
          <span>
            <small>${escapeHtml(theme.v2.artDirection.label)}</small>
            <strong>${escapeHtml(theme.label)}</strong>
          </span>
        </span>
        <span class="bb-theme-summary-card__hero">
          <span class="bb-theme-summary-card__headline">
            Place the<br>
            <em>accent</em><br>
            where it<br>
            <span>matters.</span>
          </span>
          <span class="bb-theme-summary-card__summary">${escapeHtml(theme.v2.artDirection.summary)}</span>
          ${themeSummaryActionsMarkup()}
        </span>
        <span class="bb-theme-summary-card__identities" aria-hidden="true">
          ${themeSummaryIdentityMarkup(theme.v2.modes[mode])}
        </span>
      </button>
      <button
        class="bb-theme-summary-card__mode-toggle"
        type="button"
        data-theme-gallery-card-mode="${escapeHtml(theme.id)}"
        aria-label="Switch ${escapeHtml(theme.label)} card to ${escapeHtml(nextMode)} preview"
        title="Switch to ${escapeHtml(nextMode)} preview"
      >
        ${semanticIconMarkup(`${nextMode}_mode`, 'bb-theme-summary-card__mode-icon', {
          family: 'bitsandbolts-theme'
        })}
      </button>
    </article>
  `;
}

function themeSummaryGridMarkup(catalog, mode, cardModes = {}) {
  return `
    <section class="bb-theme-summary" aria-label="Theme families">
      <div class="bb-theme-summary__grid">
        ${catalog.themes.map((theme) => themeSummaryCardMarkup(
          theme,
          selectedMode(cardModes[theme.id] ?? mode)
        )).join('')}
      </div>
    </section>
  `;
}

function colorMarkup(variables = {}) {
  return Object.keys(variables)
    .filter((name) => name.startsWith('--bb-color-'))
    .map((name) => `
      <div class="bb-theme-color" data-theme-color-variable="${escapeHtml(name)}">
        <span class="bb-theme-color__swatch" aria-hidden="true"></span>
        <span class="bb-theme-color__copy">
          <span class="bb-theme-color__name">${escapeHtml(tokenLabel(name, '--bb-color-'))}</span>
          <span class="bb-theme-color__value">${escapeHtml(variables[name])}</span>
        </span>
      </div>
    `).join('');
}

function typographyMarkup(variables = {}) {
  const families = Object.keys(variables).filter((name) => name.startsWith('--bb-font-family-'));
  return families.map((name) => `
    <div class="bb-theme-type" data-theme-font-variable="${escapeHtml(name)}">
      <span class="bb-theme-type__copy">
        <span class="bb-theme-type__role">${escapeHtml(tokenLabel(name, '--bb-font-family-'))}</span>
        <span class="bb-theme-type__value">${escapeHtml(variables[name])}</span>
      </span>
      <span class="bb-theme-type__sample">AppScreen Studio · Aa 0123</span>
    </div>
  `).join('');
}

function iconPreviewGlyphMarkup(theme, name, className = '') {
  if (theme.icons.previewFamily === DEFAULT_SEMANTIC_ICON_FAMILY) {
    return semanticIconMarkup(name, className);
  }
  return `<span class="ms${className ? ` ${escapeHtml(className)}` : ''}" aria-hidden="true">${escapeHtml(name)}</span>`;
}

function iconFamilyLabel(theme) {
  return ICON_FAMILY_LABELS[theme.icons.family] ?? theme.icons.family;
}

function iconsMarkup(theme) {
  const fallback = theme.icons.exactPreview
    ? ''
    : `<p class="bb-theme-icon-config__warning">Configured family is not bundled on web yet. These samples use ${escapeHtml(theme.icons.previewFamily)} as the explicit fallback.</p>`;
  return `
    <div class="bb-theme-icon-config">
      <p class="bb-theme-mode__meta">${escapeHtml(theme.icons.family)} · ${escapeHtml(theme.icons.style)}</p>
      ${fallback}
    </div>
    <div class="bb-theme-icons">
      ${theme.icons.previewNames.map((name) => `
        <div class="bb-theme-icon">
          ${iconPreviewGlyphMarkup(theme, name)}
          <span class="bb-theme-icon__name">${escapeHtml(name)}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function v2IdentityMarkup(mode, { editable = false, identityColorOverrides = [] } = {}) {
  const overrides = new Set(identityColorOverrides.map((value) => String(value || '')));
  return mode.identity.map((entry) => {
    const hasOverride = !editable || overrides.has(entry.id);
    const sample = editable
      ? `
        <label class="bb-theme-v2-identity__sample${hasOverride ? ' is-selected' : ' bb-workspace-add-tile'}">
          <input
            class="bb-theme-v2-identity__input"
            type="color"
            value="${escapeHtml(entry.value)}"
            aria-label="${escapeHtml(entry.label)} color"
            title="Edit ${escapeHtml(entry.label.toLowerCase())} color"
            data-theme-project-color="${escapeHtml(entry.id)}"
          >
          <span class="bb-theme-v2-identity__sample-visual" aria-hidden="true">
            ${hasOverride ? '' : `<span class="bb-workspace-control-icon" data-theme-project-color-add>${semanticIconMarkup('add')}</span>`}
          </span>
        </label>
      `
      : '<span class="bb-theme-v2-identity__swatch" aria-hidden="true"></span>';
    return `
      <div class="bb-theme-v2-identity" data-theme-v2-identity="${escapeHtml(entry.id)}">
        ${sample}
        <span class="bb-theme-v2-identity__label">${escapeHtml(entry.label)}</span>
        <span class="bb-theme-v2-identity__value"${hasOverride ? '' : ' hidden'}>${escapeHtml(entry.value)}</span>
      </div>
    `;
  }).join('');
}

function fontFamilyOptionsMarkup(fontOptions = [], selected = '') {
  return [...new Set([...fontOptions, selected].map((value) => String(value || '').trim()).filter(Boolean))]
    .sort((left, right) => left.localeCompare(right))
    .map((family) => `<option value="${escapeHtml(family)}"${family === selected ? ' selected' : ''}>${escapeHtml(family)}</option>`)
    .join('');
}

function v2FontEditorsMarkup(v2, fontOptions = []) {
  return `
    <div class="bb-theme-v2-font-editors">
      ${Object.entries(v2.typography.families).map(([role, family]) => `
        <div class="bb-field bb-theme-v2-font-editor">
          <label class="bb-field__label" for="themeFont-${escapeHtml(role)}">${escapeHtml(tokenLabel(role))} font</label>
          <select
            id="themeFont-${escapeHtml(role)}"
            class="bb-field__input"
            aria-label="${escapeHtml(tokenLabel(role))} font"
            data-theme-project-font="${escapeHtml(role)}"
          >
            ${fontFamilyOptionsMarkup(fontOptions, family)}
          </select>
        </div>
      `).join('')}
    </div>
  `;
}

function v2TypographyMarkup(v2, { editable = false, fontOptions = [] } = {}) {
  return v2.typography.specimens.map((specimen) => `
    <div class="bb-theme-v2-type" data-theme-v2-font-specimen="${escapeHtml(specimen.id)}">
      <span class="bb-theme-v2-type__meta">
        <strong>${escapeHtml(specimen.label)}</strong>
        <span>${escapeHtml(v2.typography.families[specimen.familyRole])}</span>
      </span>
      <span class="bb-theme-v2-type__sample">${escapeHtml(specimen.sample)}</span>
    </div>
  `).join('') + (editable ? v2FontEditorsMarkup(v2, fontOptions) : '');
}

function v2ButtonMarkup(v2) {
  return v2.button.specimenCases.map((specimen) => {
    const variantClass = specimen.variant === 'primary' ? '' : ` bb-v2-button--${escapeHtml(specimen.variant)}`;
    const disabled = specimen.state === 'disabled' ? ' disabled' : '';
    return `
      <button class="bb-v2-button${variantClass}" type="button" tabindex="-1" data-specimen-state="${escapeHtml(specimen.state)}"${disabled}>
        <span class="bb-v2-button__progress" aria-hidden="true"></span>
        <span>${escapeHtml(specimen.label)}</span>
      </button>
    `;
  }).join('');
}

function showcaseSectionMarkup(title, bodyMarkup, className = '') {
  return `
    <section class="bb-theme-v2-section${className ? ` ${escapeHtml(className)}` : ''}">
      <h3>${escapeHtml(title)}</h3>
      ${bodyMarkup}
    </section>
  `;
}

function workspaceChromeMarkup(theme) {
  const iconButton = (role, label, { danger = false, disabled = false } = {}) => (
    semanticActionButtonMarkup({
      danger,
      disabled,
      iconMarkup: iconPreviewGlyphMarkup(theme, role),
      iconRole: role,
      label,
      recipe: 'workspace',
      tabIndex: -1
    })
  );

  return `
    <div class="bb-workspace-specimen__viewport bb-workspace-chrome">
        <header class="bb-workspace-topbar">
          <strong class="bb-workspace-topbar__identity">Workspace</strong>
          <div class="bb-workspace-tabs" role="tablist" aria-label="Workspace views">
            <button class="bb-workspace-tab" type="button" tabindex="-1" role="tab" aria-selected="true">Primary view</button>
            <button class="bb-workspace-tab" type="button" tabindex="-1" role="tab" aria-selected="false">Secondary view</button>
            <button class="bb-workspace-tab" type="button" tabindex="-1" role="tab" aria-selected="false">Assets</button>
          </div>
        </header>
        <div class="bb-workspace-control-bar">
          <span class="bb-workspace-control-bar__status">Zoom 20%</span>
          <div class="bb-workspace-control-bar__actions" aria-label="Stage controls">
            ${iconButton('save', 'Save', { disabled: true })}
            ${iconButton('undo', 'Undo')}
            ${iconButton('redo', 'Redo')}
            ${iconButton('content_copy', 'Duplicate')}
            ${iconButton('delete', 'Delete', { danger: true })}
            ${iconButton('zoom_out', 'Zoom out')}
            ${iconButton('fit_screen', 'Fit to view')}
            ${iconButton('zoom_in', 'Zoom in')}
            <button class="bb-workspace-control-button" type="button" tabindex="-1">Export PNG</button>
            <button class="bb-workspace-control-button" type="button" tabindex="-1">Export PDF</button>
          </div>
        </div>
        <div class="bb-workspace-specimen__stage bb-workspace-stage-surface">
          <article class="bb-workspace-preview-frame bb-workspace-specimen__preview" data-selected="true">
            <span>Output 01</span>
            <strong>Primary content</strong>
          </article>
          <article class="bb-workspace-preview-frame bb-workspace-specimen__preview bb-workspace-specimen__preview--secondary">
            <span>Output 02</span>
            <strong>Supporting content</strong>
          </article>
          ${semanticActionButtonMarkup({
            attributes: { 'aria-label': 'Add output' },
            className: 'bb-workspace-specimen__preview',
            iconMarkup: iconPreviewGlyphMarkup(theme, 'add'),
            iconRole: 'add',
            label: 'Add output',
            recipe: 'workspaceAdd',
            tabIndex: -1
          })}
        </div>
    </div>
  `;
}

function interfacePrimitiveMarkup(theme) {
  const selectSpecimen = (label, state = '', disabled = false) => `
    <div class="bb-interface-select-state">
      <small>${escapeHtml(label)}</small>
      <div class="bb-select"${state === 'open' ? ' data-specimen-state="open"' : ''}>
        <button
          class="bb-select__trigger bb-interface-action"
          type="button"
          tabindex="-1"
          ${state && state !== 'open' ? `data-specimen-state="${escapeHtml(state)}"` : ''}
          ${disabled ? 'disabled' : ''}
        >
          <span class="bb-select__value">Standard density</span>
          ${semanticIconMarkup('expand_more', 'bb-select__caret')}
        </button>
      </div>
    </div>
  `;

  return `
    <div class="bb-interface-specimen__canvas bb-workspace-surface">
        <div class="bb-interface-select-states" aria-label="Select interaction states">
          ${selectSpecimen('Rest')}
          ${selectSpecimen('Hover', 'hover')}
          ${selectSpecimen('Focus', 'focusVisible')}
          ${selectSpecimen('Open', 'open')}
          ${selectSpecimen('Disabled', 'disabled', true)}
        </div>
        <div class="bb-menu bb-interface-menu-specimen" aria-label="Menu recipe specimen">
          <div class="bb-menu__info">Selection</div>
          <button class="bb-menu__item bb-interface-action" type="button" tabindex="-1">
            <span class="bb-menu__label">Select layer</span>
            <span class="bb-menu__meta"><span class="bb-menu__shortcut">V</span></span>
          </button>
          <button class="bb-menu__item bb-interface-action" type="button" tabindex="-1" data-specimen-state="hover">
            <span class="bb-menu__label">Add media</span>
            <span class="bb-menu__meta">${semanticIconMarkup('submenu', 'bb-menu__arrow')}</span>
          </button>
          <button class="bb-menu__item bb-interface-action" type="button" tabindex="-1" data-specimen-state="pressed">
            <span class="bb-menu__label">Open submenu</span>
            <span class="bb-menu__meta">${semanticIconMarkup('submenu', 'bb-menu__arrow')}</span>
          </button>
          <div class="bb-menu__separator" role="separator"></div>
          <button class="bb-menu__item bb-interface-action" type="button" tabindex="-1" disabled>
            <span class="bb-menu__label">Unavailable action</span>
            <span class="bb-menu__meta"><span class="bb-menu__shortcut">Backspace</span></span>
          </button>
        </div>
    </div>
  `;
}

function floatingWindowSpecimenMarkup(theme) {
  return `
    <div class="bb-floating-window-specimen__canvas">
      ${floatingWindowShellMarkup({
        ariaLabel: 'Handled confirmation window specimen',
        bodyMarkup: floatingWindowConfirmationMarkup({
          cancelLabel: 'Keep item',
          confirmDanger: true,
          confirmLabel: 'Remove',
          description: 'This action cannot be undone.',
          id: `handled-window-${theme.id}`,
          specimen: true,
          title: 'Remove item?'
        }),
        closeIconMarkup: iconPreviewGlyphMarkup(theme, 'close'),
        specimen: true
      })}
    </div>
  `;
}

function contentAndFieldRecipeMarkup() {
  const fields = formFieldsMarkup({
    fields: [
      { id: 'specimen-field-rest', label: 'Short response', name: 'short-response', type: 'text' },
      { id: 'specimen-field-focus', label: 'Focused response', name: 'focused-response', state: 'focus', type: 'text' },
      { id: 'specimen-field-error', label: 'Long response', message: 'Explain what needs attention.', name: 'long-response', state: 'error', type: 'textarea' }
    ],
    appearance: 'prominent'
  }, { specimen: true });
  const railCards = contentCardsMarkup({
    label: 'Card rail specimen',
    layout: 'rail',
    items: [
      { title: 'Card title', body: ['Compact supporting content.'] },
      { title: 'Second card', body: ['Repeated content keeps one shared recipe.'] },
      { title: 'Third card', body: ['The rail remains horizontally reachable.'] }
    ]
  }, { specimen: true });
  const alternatingCards = contentCardsMarkup({
    layout: 'stack',
    mediaFlow: 'alternate-end-first',
    items: [
      {
        title: 'Horizontal card',
        body: ['The shared surface accepts horizontal media and copy.'],
        media: { src: '/theme/icons/android.svg', alt: 'Abstract media specimen' }
      },
      {
        title: 'Alternating card',
        body: ['A collection can alternate the same card without a new component.'],
        media: { src: '/theme/icons/linux.svg', alt: 'Second abstract media specimen' }
      }
    ]
  }, { specimen: true });
  const mediaCopy = mediaCopyListMarkup({
    appearance: 'panel',
    label: 'Media and copy specimen',
    mediaFlow: 'alternate-start-first',
    groups: [{
      items: [{
        title: 'Media and copy',
        body: ['A reusable row keeps illustration and supporting content in one responsive recipe.'],
        media: { src: '/theme/icons/android.svg', alt: 'Abstract media specimen' }
      }]
    }]
  });
  const portraitCopy = mediaCopyListMarkup({
    appearance: 'portrait',
    label: 'Portrait and copy specimen',
    mediaFlow: 'start',
    groups: [{
      items: [{
        body: ['Portrait-led editorial content uses the same abstract media and copy owner.'],
        media: { src: '/theme/icons/linux.svg', alt: 'Abstract portrait specimen' },
        mediaPosition: 'end'
      }]
    }]
  });
  const prose = proseMarkup({
    flow: 'compact',
    paragraphs: [
      ['Long-form content can include a ', { kind: 'link', text: 'text link', href: '#shared-web-recipes' }, '.'],
      ['A second line preserves one typography and spacing recipe.']
    ]
  });
  const questions = questionListMarkup({
    label: 'Question and answer specimen',
    items: [{
      question: 'How does this reusable section work?',
      answer: ['Each question and answer uses one semantic text stack.'],
      steps: [
        { icon: 'idea', content: ['First supporting step'] },
        { icon: 'call', content: ['Second supporting step'] },
        { icon: 'agreement', content: ['Third supporting step'] }
      ]
    }]
  });
  const timeline = milestoneTimelineMarkup({
    label: 'Milestone timeline specimen',
    items: [
      { iconRoles: ['idea', 'call', 'agreement'], title: 'First milestone', body: ['Supporting milestone copy.'] },
      { iconRoles: ['analysis', 'settings', 'design'], title: 'Second milestone', body: ['Alternating milestone copy.'] }
    ]
  });

  return [
    showcaseSectionMarkup('Text layout and fields', `
      <div class="bb-theme-text-form-specimen">
        <header class="bb-centered-heading">
          <h3 class="bb-centered-heading__title bb-text-effect--neon-glow">Primary headline</h3>
          <p class="bb-centered-heading__subtitle">Supporting headline</p>
        </header>
        <div class="bb-text-form-layout">
          <div class="bb-reading-copy">
            <p>Long-form supporting copy uses the canonical reading width, rhythm, link, and emphasis roles.</p>
          </div>
          <div class="bb-form-region">${fields}</div>
        </div>
      </div>
    `),
    showcaseSectionMarkup('Information panel and card rail', `
      <div class="bb-theme-content-surfaces-specimen">
        <article class="bb-information-panel">
          <h3>Information panel</h3>
          <p>Grouped information uses the shared panel surface and type roles.</p>
        </article>
        <div class="bb-theme-card-rail">${railCards}</div>
      </div>
      <div class="bb-theme-alternating-cards">${alternatingCards}</div>
    `),
    showcaseSectionMarkup('Editorial sections', `
      <div class="bb-theme-editorial-specimen">
        <div>${mediaCopy}${portraitCopy}${prose}</div>
        <div>${questions}${timeline}</div>
      </div>
    `)
  ].join('');
}

function selectionControlSpecimenMarkup() {
  return `
    <div class="bb-selection-controls-specimen" inert>
      ${selectionControlsMarkup({
        ariaLabel: 'Selection controls specimen',
        controls: [
          {
            dataAttribute: 'data-theme-specimen-family',
            id: 'theme-specimen-family',
            label: 'Family',
            name: 'theme-specimen-family',
            options: [
              { label: 'Current theme', value: 'current' },
              { label: 'Alternate theme', value: 'alternate' }
            ],
            value: 'current'
          },
          {
            dataAttribute: 'data-theme-specimen-density',
            id: 'theme-specimen-density',
            label: 'Density',
            name: 'theme-specimen-density',
            options: [
              { label: 'Comfortable', value: 'comfortable' },
              { label: 'Compact', value: 'compact' }
            ],
            value: 'comfortable'
          }
        ]
      })}
    </div>
  `;
}

function compactControlSpecimenMarkup() {
  return `
    <div class="bb-compact-controls-specimen" inert>
      <div>
        <small>Segmented control</small>
        <div class="bb-segmented-control" aria-label="Theme mode specimen">
          <button class="bb-segmented-control__item active" type="button" tabindex="-1">System</button>
          <button class="bb-segmented-control__item" type="button" tabindex="-1">Light</button>
          <button class="bb-segmented-control__item" type="button" tabindex="-1">Dark</button>
        </div>
      </div>
      <div>
        <small>Toggle</small>
        <span class="bb-toggle-specimen__states">
          <label><span>Off</span><span class="bb-toggle"><input type="checkbox" tabindex="-1"><span class="bb-toggle__slider"></span></span></label>
          <label><span>On</span><span class="bb-toggle"><input type="checkbox" checked tabindex="-1"><span class="bb-toggle__slider"></span></span></label>
        </span>
      </div>
    </div>
  `;
}

function dialogSpecimenMarkup(theme) {
  return `
    <div class="bb-dialog-specimen" inert>
      <dialog class="bb-dialog" open aria-labelledby="theme-dialog-title">
        <div class="bb-dialog__body">
          <span class="bb-dialog__kicker">Confirmation</span>
          <h4 id="theme-dialog-title" class="bb-dialog__title">Continue with this action?</h4>
          <p class="bb-dialog__description">A shared dialog keeps its hierarchy, message, note, and actions consistent.</p>
          <div class="bb-dialog__note">
            ${iconPreviewGlyphMarkup(theme, 'info')}
            <span>Supporting context belongs in the canonical note treatment.</span>
          </div>
          <div class="bb-dialog__actions">
            <button class="bb-btn bb-btn-filled" type="button" tabindex="-1">Continue</button>
            <button class="bb-btn bb-btn-text" type="button" tabindex="-1">Cancel</button>
          </div>
        </div>
      </dialog>
    </div>
  `;
}

function loadingSpecimenMarkup() {
  return `
    <div class="bb-skeleton-list bb-loading-specimen" aria-label="Loading skeleton specimen">
      <div class="bb-skeleton-row">
        <span class="bb-skeleton bb-skeleton-thumb" aria-hidden="true"></span>
        <span class="bb-skeleton-stack bb-skeleton-stack-grow" aria-hidden="true">
          <span class="bb-skeleton bb-skeleton-line bb-skeleton-line-lg"></span>
          <span class="bb-skeleton bb-skeleton-line bb-skeleton-line-md"></span>
        </span>
        <span class="bb-skeleton-actions" aria-hidden="true">
          <span class="bb-skeleton bb-skeleton-action"></span>
          <span class="bb-skeleton bb-skeleton-action"></span>
        </span>
      </div>
      <div class="bb-skeleton-row">
        <span class="bb-skeleton bb-skeleton-thumb" aria-hidden="true"></span>
        <span class="bb-skeleton-stack bb-skeleton-stack-grow" aria-hidden="true">
          <span class="bb-skeleton bb-skeleton-line bb-skeleton-line-md"></span>
          <span class="bb-skeleton bb-skeleton-line bb-skeleton-line-sm"></span>
        </span>
      </div>
    </div>
  `;
}

function mediaRecipeSpecimenMarkup() {
  return `
    <div class="bb-media-recipe-specimen" inert>
      ${spotlightMediaMarkup({
        label: 'Spotlight media specimen',
        media: { alt: 'Abstract spotlight media specimen', src: '/theme/icons/android.svg' }
      })}
      ${storeBadgesMarkup({
        label: 'Store badges specimen',
        items: [
          { href: '#', image: { alt: 'Download on the App Store', src: '/theme/brand/store/app-store-badge.svg' } },
          { href: '#', image: { alt: 'Get it on Google Play', src: '/theme/brand/store/google-play-badge.png' } }
        ]
      })}
    </div>
  `;
}

function horseshoeMeterSpecimenMarkup() {
  return `
    <div class="bb-horseshoe-specimen">
      <div class="bb-horseshoe" style="--bb-horseshoe-value: 68">
        <svg viewBox="0 0 128 88" aria-hidden="true">
          <path class="bb-horseshoe-track" pathLength="100" d="M20 72a44 44 0 0 1 88 0"></path>
          <path class="bb-horseshoe-fill" pathLength="100" d="M20 72a44 44 0 0 1 88 0"></path>
        </svg>
        <span class="bb-horseshoe-label">68%</span>
      </div>
    </div>
  `;
}

function inlineIconTextSpecimenMarkup(theme) {
  return `
    <p class="bb-icon-text bb-inline-icon-specimen">
      ${iconPreviewGlyphMarkup(theme, 'info', 'bb-icon-text__icon')}
      Semantic icons align with supporting text through one shared recipe.
    </p>
  `;
}

function authenticationSpecimenMarkup(theme) {
  return `
    <div class="bb-auth-page bb-auth-specimen" inert>
      <div class="bb-auth-card">
        <div class="bb-auth-logo">${iconPreviewGlyphMarkup(theme, 'lock')}</div>
        <strong class="bb-auth-title">Product account</strong>
        <p class="bb-auth-subtitle">Continue through the shared authentication surface.</p>
        <button class="bb-google-btn" type="button" tabindex="-1">
          <img class="bb-google-btn__icon" src="/theme/icons/google-logo.svg" alt="">
          <span class="bb-google-btn__label">Continue with Google</span>
        </button>
      </div>
    </div>
  `;
}

function pageGallerySpecimenMarkup() {
  return `
    <div class="bb-page-gallery bb-page-gallery--specimen" inert>
      <div class="bb-inspection-toolbar bb-page-gallery__management">
        <div class="bb-page-gallery__publish">
          <p role="status">Draft preview is ready.</p>
          <button class="bb-v2-button bb-v2-button--secondary" type="button" tabindex="-1">Publish online</button>
        </div>
      </div>
      <div class="bb-page-gallery__viewport">
        <div class="bb-page-preview bb-page-preview--specimen">
          <span>Managed page preview</span>
        </div>
      </div>
    </div>
  `;
}

function sharedWebRecipeMarkup(theme) {
  return [
    showcaseSectionMarkup('Hero', `
      <section class="bb-hero bb-hero--split bb-hero-specimen__viewport" aria-label="Hero specimen">
        <div class="bb-hero__copy">
          <span class="bb-hero__eyebrow">Eyebrow</span>
          <h3 class="bb-hero__heading">Primary headline</h3>
          <p class="bb-hero__support">Supporting copy clarifies the promise, audience, and immediate outcome.</p>
          <div class="bb-hero__actions">
            <button class="bb-btn bb-btn-neon" type="button" tabindex="-1">Primary CTA</button>
            <button class="bb-btn bb-btn-text" type="button" tabindex="-1">Secondary CTA</button>
          </div>
        </div>
        <div class="bb-hero__visual bb-hero-specimen__visual">
          <small>Product proof rail</small>
          <strong>Product visual or output</strong>
          <span>Product evidence occupies the second rail.</span>
        </div>
      </section>
    `),
    showcaseSectionMarkup('Navbar', `
      <div class="bb-navbar-specimen__surface bb-scrollbar">
        <div class="bb-navbar-specimen__rail">
          <div class="bb-navbar-specimen__state">
            <small>Desktop</small>
            <div class="bb-navbar-specimen__viewport">
              ${navbarMarkup(NAVBAR_SPECIMEN, { placement: 'static', layout: 'desktop', specimen: true })}
            </div>
          </div>
          <div class="bb-navbar-specimen__state bb-navbar-specimen__state--compact">
            <small>Compact menu</small>
            <div class="bb-navbar-specimen__viewport">
              ${navbarMarkup(NAVBAR_SPECIMEN, {
                placement: 'static',
                layout: 'compact',
                specimen: true,
                specimenMenuVisible: true
              })}
            </div>
          </div>
        </div>
      </div>
    `, 'bb-navbar-specimen'),
    showcaseSectionMarkup('Footer', `
      <div class="bb-footer-specimen__viewport">
        ${footerMarkup(FOOTER_SPECIMEN, { specimen: true })}
      </div>
    `, 'bb-footer-specimen'),
    showcaseSectionMarkup('Button variants', `
      <div class="bb-actions">
        <button class="bb-btn bb-btn-filled" type="button" tabindex="-1">Filled</button>
        <button class="bb-btn bb-btn-tonal" type="button" tabindex="-1">Tonal</button>
        <button class="bb-btn bb-btn-outline" type="button" tabindex="-1">Outline</button>
        <button class="bb-btn bb-btn-text" type="button" tabindex="-1">Text</button>
        <button class="bb-btn bb-btn-neon" type="button" tabindex="-1">Neon</button>
      </div>
    `),
    showcaseSectionMarkup('Information surfaces', `
      <div class="bb-grid-3">
        <article class="bb-card">
          <span class="bb-card__eyebrow">Information</span>
          <h3>Shared card</h3>
          <p>Surface, content, outline, shape, and type come from this theme.</p>
        </article>
        <article class="bb-download-card">
          <div class="bb-download-card__head"><h3>Platform card</h3></div>
          <p>Actions reuse the same Button recipe.</p>
          <div class="bb-download-actions"><button class="bb-btn bb-btn-filled" type="button" tabindex="-1">Primary action</button></div>
        </article>
        <article class="bb-faq-item">
          <h3>Answer card</h3>
          <p>Editorial information uses the shared information-surface roles.</p>
        </article>
      </div>
    `),
    showcaseSectionMarkup('Status and plan tones', `
      <div class="bb-banner is-visible" role="status">Information status</div>
      <div class="bb-pricing-grid">
        <article class="bb-price-card bb-price-card--coal"><span class="bb-price-card__eyebrow">Free</span><h3>Neutral</h3></article>
        <article class="bb-price-card bb-price-card--silver"><span class="bb-price-card__eyebrow">Monthly</span><h3>Silver</h3></article>
        <article class="bb-price-card bb-price-card--gold"><span class="bb-price-card__eyebrow">Yearly</span><h3>Gold</h3></article>
      </div>
    `),
    contentAndFieldRecipeMarkup(),
    showcaseSectionMarkup('Select and Menu states', interfacePrimitiveMarkup(theme)),
    showcaseSectionMarkup('Selection control groups', selectionControlSpecimenMarkup()),
    showcaseSectionMarkup('Segmented control and toggle', compactControlSpecimenMarkup()),
    showcaseSectionMarkup('Handled confirmation window', floatingWindowSpecimenMarkup(theme)),
    showcaseSectionMarkup('Dialog', dialogSpecimenMarkup(theme)),
    showcaseSectionMarkup('Workspace chrome, toolbar and stage', workspaceChromeMarkup(theme)),
    showcaseSectionMarkup('Loading states', loadingSpecimenMarkup()),
    showcaseSectionMarkup('Spotlight media and store badges', mediaRecipeSpecimenMarkup()),
    showcaseSectionMarkup('Horseshoe meter', horseshoeMeterSpecimenMarkup()),
    showcaseSectionMarkup('Inline icon and text', inlineIconTextSpecimenMarkup(theme)),
    showcaseSectionMarkup('Authentication', authenticationSpecimenMarkup(theme)),
    showcaseSectionMarkup('Page gallery', pageGallerySpecimenMarkup())
  ].join('');
}

function v2SemanticColorMarkup(mode, { editable = false } = {}) {
  return mode.semanticColors.map((entry) => `
    <div class="bb-theme-v2-semantic" data-theme-v2-color-role="${escapeHtml(entry.role)}">
      ${editable ? `
        <input
          type="color"
          value="${escapeHtml(entry.value)}"
          aria-label="${escapeHtml(entry.role.replace('color.', ''))} color"
          title="Edit ${escapeHtml(entry.role.replace('color.', ''))} color"
          data-theme-project-semantic-color="${escapeHtml(entry.role)}"
        >
      ` : '<span aria-hidden="true"></span>'}
      <small>${escapeHtml(entry.role.replace('color.', ''))}</small>
    </div>
  `).join('');
}

function v2ModeMarkup(theme, mode, {
  editable = false,
  fontOptions = [],
  includeShowcase = true,
  identityColorOverrides = []
} = {}) {
  const v2 = theme.v2;
  const resolvedMode = v2.modes[mode];
  const extendedShowcase = includeShowcase ? `
        <section class="bb-theme-v2-section">
          <h3>Button</h3>
          <div class="bb-theme-v2-buttons">${v2ButtonMarkup(v2)}</div>
        </section>
        ${sharedWebRecipeMarkup(theme)}
        <section class="bb-theme-v2-section">
          <h3>Icons</h3>
          <p class="bb-theme-v2-section__meta">${escapeHtml(iconFamilyLabel(theme))}</p>
          <div class="bb-theme-v2-icons" data-bb-icon-family="${escapeHtml(theme.icons.previewFamily)}">
            ${theme.icons.previewNames.map((name) => `
              <span class="bb-theme-v2-icon" role="img" aria-label="${escapeHtml(name)}">
                ${iconPreviewGlyphMarkup(theme, name)}
              </span>
            `).join('')}
          </div>
        </section>
        <section class="bb-theme-v2-section bb-theme-v2-semantics">
          <h3>Semantic color roles</h3>
          <p class="bb-theme-v2-section__meta">48 roles</p>
          <div>${v2SemanticColorMarkup(resolvedMode)}</div>
        </section>` : '';
  return `
    <section
      class="bb-theme-mode bb-theme-v2"
      data-theme-preview-id="${escapeHtml(theme.id)}"
      data-theme-preview-mode="${escapeHtml(mode)}"
      aria-label="${escapeHtml(`${theme.label} ${mode} theme`)}"
    >
      <div class="bb-theme-v2__body">
        <section class="bb-theme-v2-section">
          <h3>Colors</h3>
          <div class="bb-theme-v2-identities">${v2IdentityMarkup(resolvedMode, { editable, identityColorOverrides })}</div>
        </section>
        <section class="bb-theme-v2-section">
          <h3>Typography</h3>
          <div class="bb-theme-v2-types">${v2TypographyMarkup(v2, { editable, fontOptions })}</div>
        </section>
        ${extendedShowcase}
      </div>
    </section>
  `;
}

function modeMarkup(theme, mode) {
  const variables = theme.modes[mode].variables;
  return `
    <section
      class="bb-theme-mode"
      data-theme-preview-id="${escapeHtml(theme.id)}"
      data-theme-preview-mode="${escapeHtml(mode)}"
      aria-label="${escapeHtml(`${theme.label} ${mode} theme`)}"
    >
      <div class="bb-theme-mode__body">
        <div class="bb-theme-scene" aria-label="Semantic surface preview">
          <div class="bb-theme-scene__primary">
            <span class="bb-theme-scene__kicker">Theme preview</span>
            <strong class="bb-theme-scene__title">Build the visual system once.</strong>
            <p class="bb-theme-scene__copy">Surface, text, border, type, and status roles rendered from this exact mode.</p>
          </div>
          <div class="bb-theme-scene__secondary">
            <strong>Ready</strong>
            <span class="bb-theme-scene__status"><span class="ms" aria-hidden="true">check_circle</span>Valid source</span>
          </div>
        </div>
        ${sharedWebRecipeMarkup(theme)}
        <section class="bb-theme-inspection">
          <p class="bb-theme-inspection__label">Fonts</p>
          <div class="bb-theme-type-grid">${typographyMarkup(variables)}</div>
        </section>
        <section class="bb-theme-inspection">
          <p class="bb-theme-inspection__label">Icon treatment</p>
          ${iconsMarkup(theme)}
        </section>
        <section class="bb-theme-inspection">
          <p class="bb-theme-inspection__label">All color roles</p>
          <div class="bb-theme-colors">${colorMarkup(variables)}</div>
        </section>
      </div>
    </section>
  `;
}

export function themeGalleryControlsMarkup() {
  return '';
}

export function themeDetailMarkup(theme, mode = 'dark', {
  editable = false,
  fontOptions = [],
  includeShowcase = true,
  identityColorOverrides = []
} = {}) {
  const selected = selectedMode(mode);
  return `
    <div class="bb-theme-detail" data-theme-detail-mode="${editable ? 'edit' : 'view'}">
      <div class="bb-theme-gallery__catalog">
        ${theme.v2
          ? v2ModeMarkup(theme, selected, {
            editable,
            fontOptions,
            includeShowcase,
            identityColorOverrides
          })
          : modeMarkup(theme, selected)}
      </div>
    </div>
  `;
}

export function themeGalleryMarkup(catalog, selection = {}) {
  const theme = catalog.themes.find((candidate) => candidate.id === selection.themeId);
  const mode = selectedMode(theme ? selection.cardModes?.[theme.id] ?? selection.mode : selection.mode);
  if (!theme) return themeSummaryGridMarkup(catalog, mode, selection.cardModes);
  return themeDetailMarkup(theme, mode, {
    includeShowcase: selection.includeShowcase
  });
}

export function applyThemeGalleryVariables(host, catalog, selection = {}) {
  const selected = selectedTheme(catalog, selection.themeId);
  const selectedVariables = selected.modes[selectedMode(selection.cardModes?.[selected.id] ?? selection.mode)].variables;
  const identityColorOverrides = new Set(
    (Array.isArray(selection.identityColorOverrides) ? selection.identityColorOverrides : [])
      .map((value) => String(value || ''))
  );
  const neutralFallback = String(selection.neutralFallback || '').trim();
  for (const name of THEME_GALLERY_SCROLLBAR_VARIABLES) {
    const value = selectedVariables[name];
    if (value) host?.style?.setProperty?.(name, value);
  }
  host?.querySelectorAll?.('[data-theme-preview-id][data-theme-preview-mode]').forEach((preview) => {
    const theme = catalog.themes.find((candidate) => candidate.id === preview.dataset.themePreviewId);
    const mode = theme?.modes?.[preview.dataset.themePreviewMode];
    if (!theme || !mode) return;
    for (const [name, value] of Object.entries(mode.variables)) preview.style.setProperty(name, value);
    const v2Mode = theme.v2?.modes?.[preview.dataset.themePreviewMode];
    if (v2Mode) {
      for (const [name, value] of Object.entries(v2Mode.variables)) preview.style.setProperty(name, value);
      const identityAccent = v2Mode.identity.find((entry) => entry.id === 'accent');
      const identityNeutral = v2Mode.identity.find((entry) => entry.id === 'neutral');
      if (identityAccent) {
        preview.style.setProperty('--bb-theme-summary-card-accent', identityAccent.value);
        const onAccent = mode.variables['--bb-color-on-tertiary'];
        if (onAccent) preview.style.setProperty('--bb-theme-summary-card-on-accent', onAccent);
      }
      if (identityNeutral) {
        const neutral = neutralFallback && !identityColorOverrides.has('neutral')
          ? neutralFallback
          : identityNeutral.value;
        preview.style.setProperty('--bb-theme-v2-neutral', neutral);
      }
      preview.querySelectorAll('[data-theme-v2-identity]').forEach((swatch) => {
        const identity = v2Mode.identity.find((entry) => entry.id === swatch.dataset.themeV2Identity);
        if (identity) swatch.style.setProperty('--bb-theme-v2-swatch', identity.value);
      });
      preview.querySelectorAll('[data-theme-v2-color-role]').forEach((swatch) => {
        const color = v2Mode.semanticColors.find((entry) => entry.role === swatch.dataset.themeV2ColorRole);
        if (color) swatch.style.setProperty('--bb-theme-v2-swatch', color.value);
      });
      preview.querySelectorAll('[data-theme-v2-font-specimen]').forEach((sample) => {
        const specimen = theme.v2.typography.specimens.find((entry) => entry.id === sample.dataset.themeV2FontSpecimen);
        if (!specimen) return;
        sample.style.setProperty('--bb-theme-v2-specimen-family', theme.v2.typography.families[specimen.familyRole]);
        sample.style.setProperty('--bb-theme-v2-specimen-size', specimen.fontSize);
        sample.style.setProperty('--bb-theme-v2-specimen-weight', specimen.fontWeight);
        sample.style.setProperty('--bb-theme-v2-specimen-leading', specimen.lineHeight);
        sample.style.setProperty('--bb-theme-v2-specimen-tracking', specimen.letterSpacing);
      });
    }
    preview.style.setProperty('--bb-theme-icon-fill', theme.icons.style === 'filled' ? '1' : '0');
    preview.style.setProperty('--bb-theme-icon-weight', theme.icons.style === 'filled' ? '400' : '300');
    preview.querySelectorAll('[data-theme-color-variable]').forEach((color) => {
      color.style.setProperty('--bb-theme-swatch-color', mode.variables[color.dataset.themeColorVariable]);
    });
    preview.querySelectorAll('[data-theme-font-variable]').forEach((font) => {
      font.style.setProperty('--bb-theme-font-preview-family', mode.variables[font.dataset.themeFontVariable]);
    });
  });
}

export function createThemeGalleryController({
  catalogUrl = '/theme/catalog.json',
  controlsHost,
  fetchImpl = (...args) => globalThis.fetch(...args),
  host,
  includeShowcase = true,
  onViewChange
} = {}) {
  let catalogPromise = null;
  let renderedCatalog = null;
  let selection = Object.freeze({ cardModes: Object.freeze({}), mode: 'dark', themeId: '' });
  let navigationListenerInstalled = false;

  async function loadCatalog() {
    const response = await fetchImpl(catalogUrl, { credentials: 'same-origin' });
    if (!response?.ok) throw new Error(`Theme catalog could not be loaded (${response?.status || 0}).`);
    return normalizeThemeCatalog(await response.json());
  }

  function renderCatalog(catalog) {
    const themeId = catalog.themes.some((theme) => theme.id === selection.themeId) ? selection.themeId : '';
    selection = Object.freeze({
      cardModes: selectedCardModes(catalog, selection.cardModes),
      mode: selectedMode(selection.mode),
      themeId
    });
    if (controlsHost) controlsHost.innerHTML = '';
    host.innerHTML = themeGalleryMarkup(catalog, { ...selection, includeShowcase });
    applyThemeGalleryVariables(host, catalog, selection);
    synchronizeFooterYear(host);
    const currentMode = selectedMode(themeId ? selection.cardModes[themeId] ?? selection.mode : selection.mode);
    onViewChange?.(Object.freeze({
      mode: currentMode,
      themeId,
      view: themeId ? 'detail' : 'gallery'
    }));
  }

  function toggleModeForTheme(themeId, { restoreFocus = false } = {}) {
    if (!renderedCatalog?.themes.some((theme) => theme.id === themeId)) return false;
    const nextMode = nextThemeMode(selection.cardModes[themeId] ?? selection.mode);
    selection = Object.freeze({
      ...selection,
      cardModes: Object.freeze({ ...selection.cardModes, [themeId]: nextMode })
    });
    renderCatalog(renderedCatalog);
    if (restoreFocus) host.querySelector?.(`[data-theme-gallery-card-mode="${themeId}"]`)?.focus?.();
    return true;
  }

  function installNavigationListener() {
    if (navigationListenerInstalled || !host?.addEventListener) return;
    host.addEventListener('click', (event) => {
      const cardMode = event.target?.closest?.('[data-theme-gallery-card-mode]');
      const open = event.target?.closest?.('[data-theme-gallery-open]');
      if (!renderedCatalog || (!cardMode && !open)) return;
      event.preventDefault();
      if (cardMode) {
        const themeId = String(cardMode.dataset.themeGalleryCardMode || '');
        toggleModeForTheme(themeId, { restoreFocus: true });
      } else if (open) {
        selection = Object.freeze({ ...selection, themeId: String(open.dataset.themeGalleryOpen || '') });
        renderCatalog(renderedCatalog);
      }
    });
    navigationListenerInstalled = true;
  }

  async function render() {
    if (!host) return null;
    if (renderedCatalog) return renderedCatalog;
    if (!catalogPromise) catalogPromise = loadCatalog().catch((error) => {
      catalogPromise = null;
      throw error;
    });
    host.innerHTML = '<div class="bb-theme-gallery__loading" role="status">Loading first-party themes…</div>';
    if (controlsHost) controlsHost.innerHTML = '';
    try {
      const catalog = await catalogPromise;
      renderedCatalog = catalog;
      installNavigationListener();
      renderCatalog(catalog);
      return catalog;
    } catch (error) {
      if (controlsHost) controlsHost.innerHTML = '';
      host.innerHTML = `<div class="bb-theme-gallery__error" role="alert">${escapeHtml(error?.message || 'Theme catalog could not be loaded.')}</div>`;
      throw error;
    }
  }

  async function showGallery() {
    const catalog = renderedCatalog ?? await render();
    selection = Object.freeze({ ...selection, themeId: '' });
    renderCatalog(catalog);
    return catalog;
  }

  function toggleMode() {
    if (!selection.themeId) return false;
    return toggleModeForTheme(selection.themeId);
  }

  return Object.freeze({ render, showGallery, toggleMode });
}

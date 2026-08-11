import { navbarMarkup } from './navbar.js';

const DATA_ATTRIBUTE_PATTERN = /^data-[a-z0-9-]+$/;
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

function selectionControlsMarkup({ ariaLabel = '', controls = [] } = {}) {
  const controlMarkup = controls.map((control) => {
    const dataAttribute = String(control?.dataAttribute || '');
    if (!DATA_ATTRIBUTE_PATTERN.test(dataAttribute)) {
      throw new TypeError(`Selection control data attribute is invalid: ${dataAttribute}`);
    }
    const selectedValue = String(control?.value ?? '');
    const selectedOption = (control?.options || []).find((option) => String(option?.value ?? '') === selectedValue)
      ?? control?.options?.[0]
      ?? { label: 'Select', value: '' };
    const controlId = String(control?.id || '');
    const labelId = `${controlId}Label`;
    return `
      <div class="bb-selection-control">
        <span id="${escapeHtml(labelId)}">${escapeHtml(control?.label)}</span>
        <div class="bb-select bb-theme-gallery-select" data-theme-gallery-select>
          <select
            id="${escapeHtml(controlId)}"
            class="bb-select__native"
            name="${escapeHtml(control?.name)}"
            aria-labelledby="${escapeHtml(labelId)}"
            data-native-select="true"
            ${dataAttribute}
          >
          ${(control?.options || []).map((option) => {
            const value = String(option?.value ?? '');
            return `<option value="${escapeHtml(value)}"${value === selectedValue ? ' selected' : ''}>${escapeHtml(option?.label)}</option>`;
          }).join('')}
          </select>
          <button
            class="bb-select__trigger bb-interface-action"
            type="button"
            aria-expanded="false"
            aria-haspopup="listbox"
            aria-labelledby="${escapeHtml(labelId)} ${escapeHtml(controlId)}Value"
            data-theme-gallery-select-trigger="${escapeHtml(controlId)}"
          >
            <span id="${escapeHtml(controlId)}Value" class="bb-select__value">${escapeHtml(selectedOption?.label)}</span>
            <span class="bb-select__caret" aria-hidden="true"></span>
          </button>
        </div>
      </div>
    `;
  }).join('');

  return `<div class="bb-selection-controls" aria-label="${escapeHtml(ariaLabel)}">${controlMarkup}</div>`;
}

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
  const normalizeSpecimens = (entries, type) => Object.freeze((Array.isArray(entries) ? entries : []).map((entry) => {
    const id = String(entry?.id || '').trim();
    if (!THEME_ID_PATTERN.test(id)) throw new TypeError(`Theme catalog v2 ${type} specimen is invalid.`);
    return Object.freeze(Object.fromEntries(Object.entries(entry).map(([key, raw]) => [
      key,
      key === 'label' || key === 'kind' || key === 'depth' ? String(raw) : safeCssVariableValue(raw)
    ])));
  }));
  const buttonCases = Array.isArray(value.button?.specimenCases) ? value.button.specimenCases.map((entry) => {
    const variant = String(entry?.variant || '').trim();
    const state = String(entry?.state || '').trim();
    if (!THEME_ID_PATTERN.test(variant) || !/^[a-zA-Z]+$/.test(state)) throw new TypeError('Theme catalog v2 Button specimen is invalid.');
    return Object.freeze({ label: String(entry.label || ''), state, variant });
  }) : [];
  if (!buttonCases.length) throw new TypeError('Theme catalog v2 Button recipe has no specimen cases.');
  const motion = Object.freeze(Object.fromEntries(Object.entries(value.motion || {}).map(([id, entry]) => [id, Object.freeze({
    duration: safeCssVariableValue(entry?.duration),
    easing: safeCssVariableValue(entry?.easing)
  })])));
  return Object.freeze({
    artDirection: Object.freeze({
      label: String(value.artDirection?.label || ''),
      summary: String(value.artDirection?.summary || ''),
      traits: Object.freeze(Object.fromEntries(Object.entries(value.artDirection?.traits || {}).map(([key, trait]) => [key, String(trait)])))
    }),
    button: Object.freeze({ specimenCases: Object.freeze(buttonCases) }),
    contractVersion: V2_CONTRACT_VERSION,
    materials: normalizeSpecimens(value.materials, 'material'),
    modes: Object.freeze(Object.fromEntries(REQUIRED_MODES.map((mode) => [mode, normalizeV2Mode(value.modes?.[mode], mode)]))),
    motion,
    shapes: normalizeSpecimens(value.shapes, 'shape'),
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
          <span class="ms" aria-hidden="true">${escapeHtml(name)}</span>
          <span class="bb-theme-icon__name">${escapeHtml(name)}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function v2IdentityMarkup(mode) {
  return mode.identity.map((entry) => `
    <div class="bb-theme-v2-identity" data-theme-v2-identity="${escapeHtml(entry.id)}">
      <span class="bb-theme-v2-identity__swatch" aria-hidden="true"></span>
      <span class="bb-theme-v2-identity__label">${escapeHtml(entry.label)}</span>
      <span class="bb-theme-v2-identity__value">${escapeHtml(entry.value)}</span>
    </div>
  `).join('');
}

function v2TypographyMarkup(v2) {
  return v2.typography.specimens.map((specimen) => `
    <div class="bb-theme-v2-type" data-theme-v2-font-specimen="${escapeHtml(specimen.id)}">
      <span class="bb-theme-v2-type__meta">
        <strong>${escapeHtml(specimen.label)}</strong>
        <span>${escapeHtml(v2.typography.families[specimen.familyRole])}</span>
      </span>
      <span class="bb-theme-v2-type__sample">${escapeHtml(specimen.sample)}</span>
    </div>
  `).join('');
}

function v2ShapeMarkup(v2) {
  const shapes = v2.shapes.map((shape) => `
    <div class="bb-theme-v2-shape bb-theme-v2-shape--${escapeHtml(shape.kind)}" data-theme-v2-shape="${escapeHtml(shape.id)}">
      <span>${escapeHtml(shape.label)}</span>
      <small>${escapeHtml(shape.kind)}</small>
    </div>
  `).join('');
  const materials = v2.materials.map((material) => `
    <div class="bb-theme-v2-material bb-theme-v2-material--${escapeHtml(material.depth)}">
      <span>${escapeHtml(material.label)}</span>
      <small>${escapeHtml(material.depth)}</small>
    </div>
  `).join('');
  return `<div class="bb-theme-v2-grammar">${shapes}${materials}</div>`;
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

function interfacePrimitiveMarkup() {
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
          <span class="bb-select__caret" aria-hidden="true"></span>
        </button>
      </div>
    </div>
  `;

  return `
    <div class="bb-interface-specimen">
      <h4>Workspace, Select &amp; Menu</h4>
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
            <span class="bb-menu__meta"><span class="bb-menu__arrow" aria-hidden="true">›</span></span>
          </button>
          <button class="bb-menu__item bb-interface-action" type="button" tabindex="-1" data-specimen-state="pressed">
            <span class="bb-menu__label">Open submenu</span>
            <span class="bb-menu__meta"><span class="bb-menu__arrow" aria-hidden="true">›</span></span>
          </button>
          <div class="bb-menu__separator" role="separator"></div>
          <button class="bb-menu__item bb-interface-action" type="button" tabindex="-1" disabled>
            <span class="bb-menu__label">Unavailable action</span>
            <span class="bb-menu__meta"><span class="bb-menu__shortcut">⌫</span></span>
          </button>
        </div>
      </div>
    </div>
  `;
}

function sharedWebRecipeMarkup() {
  return `
    <section class="bb-theme-inspection" aria-label="Current shared web recipe specimens">
      <p class="bb-theme-inspection__label">Current shared web recipes</p>
      <div class="bb-theme-recipe-battery">
        <div class="bb-navbar-specimen">
          <h4>Navbar</h4>
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
        </div>
        <div>
          <h4>Button variants</h4>
          <div class="bb-actions">
            <button class="bb-btn bb-btn-filled" type="button" tabindex="-1">Filled</button>
            <button class="bb-btn bb-btn-tonal" type="button" tabindex="-1">Tonal</button>
            <button class="bb-btn bb-btn-outline" type="button" tabindex="-1">Outline</button>
            <button class="bb-btn bb-btn-text" type="button" tabindex="-1">Text</button>
          </div>
        </div>
        <div>
          <h4>Information surfaces</h4>
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
        </div>
        <div>
          <h4>Status and plan tones</h4>
          <div class="bb-banner is-visible" role="status">Information status</div>
          <div class="bb-pricing-grid">
            <article class="bb-price-card bb-price-card--coal"><span class="bb-price-card__eyebrow">Free</span><h3>Neutral</h3></article>
            <article class="bb-price-card bb-price-card--silver"><span class="bb-price-card__eyebrow">Monthly</span><h3>Silver</h3></article>
            <article class="bb-price-card bb-price-card--gold"><span class="bb-price-card__eyebrow">Yearly</span><h3>Gold</h3></article>
          </div>
        </div>
        ${interfacePrimitiveMarkup()}
      </div>
    </section>
  `;
}

function v2SemanticColorMarkup(mode) {
  return mode.semanticColors.map((entry) => `
    <div class="bb-theme-v2-semantic" data-theme-v2-color-role="${escapeHtml(entry.role)}">
      <span aria-hidden="true"></span>
      <small>${escapeHtml(entry.role.replace('color.', ''))}</small>
    </div>
  `).join('');
}

function v2ModeMarkup(theme, mode) {
  const v2 = theme.v2;
  const resolvedMode = v2.modes[mode];
  return `
    <section
      class="bb-theme-mode bb-theme-v2"
      data-theme-preview-id="${escapeHtml(theme.id)}"
      data-theme-preview-mode="${escapeHtml(mode)}"
      aria-label="${escapeHtml(`${theme.label} ${mode} theme`)}"
    >
      <div class="bb-theme-v2__body">
        <section class="bb-theme-v2-section">
          <h3>Identity</h3>
          <div class="bb-theme-v2-identities">${v2IdentityMarkup(resolvedMode)}</div>
        </section>
        <section class="bb-theme-v2-section">
          <h3>Typography</h3>
          <div class="bb-theme-v2-types">${v2TypographyMarkup(v2)}</div>
        </section>
        <section class="bb-theme-v2-section">
          <h3>Shape, material &amp; depth</h3>
          ${v2ShapeMarkup(v2)}
          <div class="bb-theme-v2-motion">
            ${Object.entries(v2.motion).filter(([id]) => id !== 'reduced').map(([id, motion]) => `
              <span data-theme-v2-motion="${escapeHtml(id)}"><strong>${escapeHtml(id)}</strong><i aria-hidden="true"></i><small>${escapeHtml(motion.duration)}</small></span>
            `).join('')}
          </div>
        </section>
        <section class="bb-theme-v2-section">
          <h3>Button</h3>
          <div class="bb-theme-v2-buttons">${v2ButtonMarkup(v2)}</div>
        </section>
        ${sharedWebRecipeMarkup()}
        <section class="bb-theme-v2-section">
          <h3>Icons</h3>
          <div class="bb-theme-v2-icons">
            ${theme.icons.previewNames.map((name) => `<span class="ms" aria-label="${escapeHtml(name)}">${escapeHtml(name)}</span>`).join('')}
          </div>
        </section>
        <details class="bb-theme-v2-semantics">
          <summary>Semantic color roles · 48</summary>
          <div>${v2SemanticColorMarkup(resolvedMode)}</div>
        </details>
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
        ${sharedWebRecipeMarkup()}
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

function themeSelectorMarkup(catalog, theme, mode) {
  return selectionControlsMarkup({
    ariaLabel: 'Theme preview selection',
    controls: [{
      dataAttribute: 'data-theme-gallery-theme',
      id: 'themeGalleryThemeSelector',
      label: 'Theme',
      name: 'themeGalleryTheme',
      options: catalog.themes.map((candidate) => ({ label: candidate.label, value: candidate.id })),
      value: theme.id
    }, {
      dataAttribute: 'data-theme-gallery-mode',
      id: 'themeGalleryModeSelector',
      label: 'Variant',
      name: 'themeGalleryMode',
      options: REQUIRED_MODES.map((candidate) => ({
        label: candidate[0].toUpperCase() + candidate.slice(1),
        value: candidate
      })),
      value: mode
    }]
  });
}

export function themeGalleryControlsMarkup(catalog, selection = {}) {
  const theme = selectedTheme(catalog, selection.themeId);
  const mode = selectedMode(selection.mode);
  return `<div class="bb-inspection-toolbar">${themeSelectorMarkup(catalog, theme, mode)}</div>`;
}

export function themeGalleryMarkup(catalog, selection = {}) {
  const theme = selectedTheme(catalog, selection.themeId);
  const mode = selectedMode(selection.mode);
  return `
    <div class="bb-theme-gallery__catalog">
      ${theme.v2 ? v2ModeMarkup(theme, mode) : modeMarkup(theme, mode)}
    </div>
  `;
}

export function applyThemeGalleryVariables(host, catalog, selection = {}) {
  const selected = selectedTheme(catalog, selection.themeId);
  const selectedVariables = selected.modes[selectedMode(selection.mode)].variables;
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
  host
} = {}) {
  let catalogPromise = null;
  let renderedCatalog = null;
  let selection = Object.freeze({ mode: 'dark', themeId: '' });
  let selectionListenerInstalled = false;
  let activeGallerySelect = null;

  async function loadCatalog() {
    const response = await fetchImpl(catalogUrl, { credentials: 'same-origin' });
    if (!response?.ok) throw new Error(`Theme catalog could not be loaded (${response?.status || 0}).`);
    return normalizeThemeCatalog(await response.json());
  }

  function closeGallerySelect({ restoreFocus = false } = {}) {
    if (!activeGallerySelect) return;
    const { document: rootDocument, menu, trigger, view, wrapper, handleOutside, handleViewport } = activeGallerySelect;
    rootDocument?.removeEventListener?.('pointerdown', handleOutside, true);
    rootDocument?.removeEventListener?.('scroll', handleViewport, true);
    view?.removeEventListener?.('resize', handleViewport);
    menu?.remove?.();
    wrapper?.classList?.remove?.('is-open');
    trigger?.setAttribute?.('aria-expanded', 'false');
    trigger?.removeAttribute?.('aria-controls');
    activeGallerySelect = null;
    if (restoreFocus) trigger?.focus?.();
  }

  function enabledMenuItems(menu) {
    return [...(menu?.querySelectorAll?.('[data-theme-gallery-select-option-index]:not(:disabled)') ?? [])];
  }

  function focusMenuItem(menu, current, offset) {
    const items = enabledMenuItems(menu);
    if (!items.length) return;
    const currentIndex = Math.max(0, items.indexOf(current));
    items[(currentIndex + offset + items.length) % items.length]?.focus?.();
  }

  function openGallerySelect(trigger, { focus = 'selected' } = {}) {
    const wrapper = trigger?.closest?.('[data-theme-gallery-select]');
    const select = wrapper?.querySelector?.('select');
    const rootDocument = controlsHost?.ownerDocument ?? globalThis.document;
    if (!wrapper || !select || !rootDocument?.body || select.disabled) return false;
    if (activeGallerySelect?.trigger === trigger) return true;
    closeGallerySelect();

    const menu = rootDocument.createElement('div');
    const menuId = `${select.id}Menu`;
    menu.id = menuId;
    menu.className = 'bb-menu bb-theme-gallery-select__menu';
    menu.setAttribute('role', 'listbox');
    menu.setAttribute('aria-labelledby', select.getAttribute('aria-labelledby') || '');
    const items = Array.from(select.options).map((option, optionIndex) => {
      const item = rootDocument.createElement('button');
      const selected = optionIndex === select.selectedIndex;
      item.type = 'button';
      item.className = 'bb-menu__item bb-interface-action';
      item.disabled = Boolean(option.disabled);
      item.dataset.themeGallerySelectOptionIndex = String(optionIndex);
      item.setAttribute('role', 'option');
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      const label = rootDocument.createElement('span');
      label.className = 'bb-menu__label';
      label.textContent = option.label || option.textContent || option.value;
      item.appendChild(label);
      return item;
    });
    menu.replaceChildren(...items);
    menu.style.visibility = 'hidden';
    rootDocument.body.appendChild(menu);

    const triggerRect = trigger.getBoundingClientRect();
    const view = rootDocument.defaultView ?? globalThis.window;
    const viewportWidth = Number(view?.innerWidth) || rootDocument.documentElement?.clientWidth || 0;
    const viewportHeight = Number(view?.innerHeight) || rootDocument.documentElement?.clientHeight || 0;
    const menuWidth = Math.max(triggerRect.width, menu.offsetWidth, 180);
    const menuHeight = menu.offsetHeight;
    const left = Math.max(8, Math.min(triggerRect.left, Math.max(8, viewportWidth - menuWidth - 8)));
    const below = triggerRect.bottom + 4;
    const top = below + menuHeight <= viewportHeight - 8
      ? below
      : Math.max(8, triggerRect.top - menuHeight - 4);
    menu.style.left = `${Math.round(left)}px`;
    menu.style.top = `${Math.round(top)}px`;
    menu.style.minWidth = `${Math.round(menuWidth)}px`;
    menu.style.visibility = '';

    const handleOutside = (event) => {
      if (!menu.contains(event.target) && !trigger.contains(event.target)) closeGallerySelect();
    };
    const handleViewport = (event) => {
      if (event?.type === 'scroll' && menu.contains(event.target)) return;
      closeGallerySelect();
    };
    activeGallerySelect = { document: rootDocument, handleOutside, handleViewport, menu, select, trigger, view, wrapper };
    wrapper.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    trigger.setAttribute('aria-controls', menuId);
    rootDocument.addEventListener('pointerdown', handleOutside, true);
    rootDocument.addEventListener('scroll', handleViewport, true);
    view?.addEventListener?.('resize', handleViewport);

    menu.addEventListener('click', (event) => {
      const item = event.target?.closest?.('[data-theme-gallery-select-option-index]');
      if (!item || item.disabled) return;
      select.selectedIndex = Number(item.dataset.themeGallerySelectOptionIndex);
      const EventConstructor = rootDocument.defaultView?.Event ?? globalThis.Event;
      select.dispatchEvent(new EventConstructor('change', { bubbles: true }));
    });
    menu.addEventListener('keydown', (event) => {
      const item = event.target?.closest?.('[data-theme-gallery-select-option-index]');
      if (event.key === 'Escape') {
        event.preventDefault();
        closeGallerySelect({ restoreFocus: true });
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        focusMenuItem(menu, item, event.key === 'ArrowDown' ? 1 : -1);
      } else if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        const enabled = enabledMenuItems(menu);
        enabled[event.key === 'Home' ? 0 : enabled.length - 1]?.focus?.();
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        item?.click?.();
      } else if (event.key === 'Tab') {
        closeGallerySelect();
      }
    });

    const enabled = enabledMenuItems(menu);
    const selectedItem = menu.querySelector('[aria-selected="true"]:not(:disabled)');
    (focus === 'last' ? enabled.at(-1) : selectedItem ?? enabled[0])?.focus?.();
    return true;
  }

  function renderCatalog(catalog) {
    closeGallerySelect();
    const theme = selectedTheme(catalog, selection.themeId);
    selection = Object.freeze({ mode: selectedMode(selection.mode), themeId: theme.id });
    controlsHost.innerHTML = themeGalleryControlsMarkup(catalog, selection);
    host.innerHTML = themeGalleryMarkup(catalog, selection);
    applyThemeGalleryVariables(host, catalog, selection);
  }

  function installSelectionListener() {
    if (selectionListenerInstalled || !controlsHost?.addEventListener) return;
    controlsHost.addEventListener('click', (event) => {
      const trigger = event.target?.closest?.('[data-theme-gallery-select-trigger]');
      if (!trigger) return;
      event.preventDefault?.();
      if (activeGallerySelect?.trigger === trigger) closeGallerySelect({ restoreFocus: true });
      else openGallerySelect(trigger);
    });
    controlsHost.addEventListener('keydown', (event) => {
      const trigger = event.target?.closest?.('[data-theme-gallery-select-trigger]');
      if (!trigger) return;
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault?.();
        openGallerySelect(trigger, { focus: event.key === 'ArrowUp' ? 'last' : 'selected' });
      } else if (event.key === 'Escape' && activeGallerySelect?.trigger === trigger) {
        event.preventDefault?.();
        closeGallerySelect({ restoreFocus: true });
      }
    });
    controlsHost.addEventListener('change', (event) => {
      const control = event.target;
      let focusSelector = '';
      if (control?.matches?.('[data-theme-gallery-theme]')) {
        selection = Object.freeze({ ...selection, themeId: String(control.value || '') });
        focusSelector = '[data-theme-gallery-select-trigger="themeGalleryThemeSelector"]';
      } else if (control?.matches?.('[data-theme-gallery-mode]')) {
        selection = Object.freeze({ ...selection, mode: String(control.value || '') });
        focusSelector = '[data-theme-gallery-select-trigger="themeGalleryModeSelector"]';
      } else {
        return;
      }
      if (renderedCatalog) {
        renderCatalog(renderedCatalog);
        controlsHost.querySelector?.(focusSelector)?.focus?.();
      }
    });
    selectionListenerInstalled = true;
  }

  async function render() {
    if (!host || !controlsHost) return null;
    if (renderedCatalog) return renderedCatalog;
    if (!catalogPromise) catalogPromise = loadCatalog().catch((error) => {
      catalogPromise = null;
      throw error;
    });
    host.innerHTML = '<div class="bb-theme-gallery__loading" role="status">Loading first-party themes…</div>';
    controlsHost.innerHTML = '';
    try {
      const catalog = await catalogPromise;
      renderedCatalog = catalog;
      installSelectionListener();
      renderCatalog(catalog);
      return catalog;
    } catch (error) {
      controlsHost.innerHTML = '';
      host.innerHTML = `<div class="bb-theme-gallery__error" role="alert">${escapeHtml(error?.message || 'Theme catalog could not be loaded.')}</div>`;
      throw error;
    }
  }

  return Object.freeze({ render });
}

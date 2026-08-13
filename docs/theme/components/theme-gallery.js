import { footerMarkup, synchronizeFooterYear } from './footer.js';
import { navbarMarkup } from './navbar.js';
import { installSelectController, selectionControlsMarkup } from './select.js';

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
        <div>
          <h4>Hero</h4>
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
        </div>
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
        <div class="bb-footer-specimen">
          <h4>Footer</h4>
          <div class="bb-footer-specimen__viewport">
            ${footerMarkup(FOOTER_SPECIMEN, { specimen: true })}
          </div>
        </div>
        <div>
          <h4>Button variants</h4>
          <div class="bb-actions">
            <button class="bb-btn bb-btn-filled" type="button" tabindex="-1">Filled</button>
            <button class="bb-btn bb-btn-tonal" type="button" tabindex="-1">Tonal</button>
            <button class="bb-btn bb-btn-outline" type="button" tabindex="-1">Outline</button>
            <button class="bb-btn bb-btn-text" type="button" tabindex="-1">Text</button>
            <button class="bb-btn bb-btn-neon" type="button" tabindex="-1">Neon</button>
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
  let selectController = null;

  async function loadCatalog() {
    const response = await fetchImpl(catalogUrl, { credentials: 'same-origin' });
    if (!response?.ok) throw new Error(`Theme catalog could not be loaded (${response?.status || 0}).`);
    return normalizeThemeCatalog(await response.json());
  }

  function renderCatalog(catalog) {
    selectController?.close();
    const theme = selectedTheme(catalog, selection.themeId);
    selection = Object.freeze({ mode: selectedMode(selection.mode), themeId: theme.id });
    controlsHost.innerHTML = themeGalleryControlsMarkup(catalog, selection);
    host.innerHTML = themeGalleryMarkup(catalog, selection);
    applyThemeGalleryVariables(host, catalog, selection);
    synchronizeFooterYear(host);
  }

  function installSelectionListener() {
    if (selectionListenerInstalled || !controlsHost?.addEventListener) return;
    selectController = installSelectController(controlsHost);
    controlsHost.addEventListener('change', (event) => {
      const control = event.target;
      let focusSelector = '';
      if (control?.matches?.('[data-theme-gallery-theme]')) {
        selection = Object.freeze({ ...selection, themeId: String(control.value || '') });
        focusSelector = '[data-bb-select-trigger="themeGalleryThemeSelector"]';
      } else if (control?.matches?.('[data-theme-gallery-mode]')) {
        selection = Object.freeze({ ...selection, mode: String(control.value || '') });
        focusSelector = '[data-bb-select-trigger="themeGalleryModeSelector"]';
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

export const THEME_TYPOGRAPHY_ROLES = Object.freeze(['signature', 'interface', 'technical']);
export const THEME_TYPOGRAPHY_VARIANT_NAMES = Object.freeze(['bold', 'italic', 'underline']);
export const THEME_TEXT_STYLE_PRESET_REFERENCE_WIDTH = 1080;
export const THEME_TEXT_STYLE_PRESET_REFERENCE_HEIGHT = 1920;
export const THEME_TEXT_STYLE_PRESET_WIDTH_FACTOR = 0.126;
export const THEME_TEXT_STYLE_PRESET_HEIGHT_FACTOR = 0.180;
export const THEME_TEXT_STYLE_PRESET_RATIO = 1.20;
export const THEME_TEXT_STYLE_PRESETS = Object.freeze([
  Object.freeze({ id: 'display', label: 'Display', fontRole: 'signature', lineHeight: 0.98, referenceSize: 136, step: 0 }),
  Object.freeze({ id: 'title', label: 'Title', fontRole: 'signature', lineHeight: 1.02, referenceSize: 113, step: 1 }),
  Object.freeze({ id: 'heading', label: 'Heading', fontRole: 'interface', lineHeight: 1.08, referenceSize: 94, step: 2 }),
  Object.freeze({ id: 'body', label: 'Body', fontRole: 'interface', lineHeight: 1.20, referenceSize: 79, step: 3 }),
  Object.freeze({ id: 'caption', label: 'Caption', fontRole: 'interface', lineHeight: 1.20, referenceSize: 66, step: 4 })
]);

const themeTextStylePresetIds = new Set(THEME_TEXT_STYLE_PRESETS.map(({ id }) => id));

export function normalizeThemeTextStylePresetId(value = '') {
  const id = String(value || '').trim().toLowerCase();
  return themeTextStylePresetIds.has(id) ? id : '';
}

function themeTextStylePresetOverride(typography = {}, id = '') {
  const candidate = typography?.textStylePresets?.[id];
  return candidate && typeof candidate === 'object' && !Array.isArray(candidate)
    ? candidate
    : {};
}

export function resolveThemeTextStylePreset(presetId = '', {
  width = THEME_TEXT_STYLE_PRESET_REFERENCE_WIDTH,
  height = THEME_TEXT_STYLE_PRESET_REFERENCE_HEIGHT,
  typography = {}
} = {}) {
  const id = normalizeThemeTextStylePresetId(presetId);
  const definition = THEME_TEXT_STYLE_PRESETS.find((preset) => preset.id === id);
  if (!definition) return null;
  const override = themeTextStylePresetOverride(typography, id);
  const fontRole = THEME_TYPOGRAPHY_ROLES.includes(override.fontRole)
    ? override.fontRole
    : definition.fontRole;
  const overrideReferenceSize = Number(override.referenceSize);
  const hasReferenceOverride = Number.isFinite(overrideReferenceSize) && overrideReferenceSize > 0;
  const referenceSize = hasReferenceOverride ? overrideReferenceSize : definition.referenceSize;
  const overrideLineHeight = Number(override.lineHeight);
  const lineHeight = Number.isFinite(overrideLineHeight) && overrideLineHeight > 0
    ? overrideLineHeight
    : definition.lineHeight;
  const resolvedWidth = Math.max(1, Number(width) || THEME_TEXT_STYLE_PRESET_REFERENCE_WIDTH);
  const resolvedHeight = Math.max(1, Number(height) || THEME_TEXT_STYLE_PRESET_REFERENCE_HEIGHT);
  const baseSize = Math.max(1, Math.round(Math.min(
    THEME_TEXT_STYLE_PRESET_WIDTH_FACTOR * resolvedWidth,
    THEME_TEXT_STYLE_PRESET_HEIGHT_FACTOR * resolvedHeight
  )));
  const normalizedSize = hasReferenceOverride
    ? referenceSize * baseSize / THEME_TEXT_STYLE_PRESETS[0].referenceSize
    : baseSize / (THEME_TEXT_STYLE_PRESET_RATIO ** definition.step);
  return Object.freeze({
    baseSize,
    fontRole,
    height: resolvedHeight,
    id,
    label: definition.label,
    lineHeight,
    normalizedSize,
    referenceHeight: THEME_TEXT_STYLE_PRESET_REFERENCE_HEIGHT,
    referenceSize,
    referenceWidth: THEME_TEXT_STYLE_PRESET_REFERENCE_WIDTH,
    size: Math.max(1, Math.round(normalizedSize)),
    width: resolvedWidth
  });
}

export function themeTypographyRole(specimen = {}) {
  const role = String(specimen?.label || '').trim().toLowerCase();
  return THEME_TYPOGRAPHY_ROLES.includes(role) ? role : '';
}

export function normalizeThemeTypographyVariants(value = {}, specimens = []) {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const specimenByRole = new Map((Array.isArray(specimens) ? specimens : [])
    .map((specimen) => [themeTypographyRole(specimen), specimen])
    .filter(([role]) => role));
  return Object.fromEntries(THEME_TYPOGRAPHY_ROLES.map((role) => {
    const candidate = source[role] && typeof source[role] === 'object' && !Array.isArray(source[role])
      ? source[role]
      : {};
    const specimen = specimenByRole.get(role);
    const defaultBold = Number.parseInt(specimen?.fontWeight, 10) >= 600;
    return [role, {
      bold: typeof candidate.bold === 'boolean' ? candidate.bold : defaultBold,
      italic: candidate.italic === true,
      underline: candidate.underline === true
    }];
  }));
}

export function themeTypographyVariantPresentation(value = {}) {
  return Object.freeze({
    fontStyle: value?.italic === true ? 'italic' : 'normal',
    fontWeight: value?.bold === true ? '700' : '400',
    textDecoration: value?.underline === true ? 'underline' : 'none'
  });
}

export function themeTypographyVariantVariables(value = {}, specimens = []) {
  const variants = normalizeThemeTypographyVariants(value, specimens);
  return Object.fromEntries(THEME_TYPOGRAPHY_ROLES.flatMap((role) => {
    const presentation = themeTypographyVariantPresentation(variants[role]);
    return [
      [`--bb-theme-typography-${role}-font-weight`, presentation.fontWeight],
      [`--bb-theme-typography-${role}-font-style`, presentation.fontStyle],
      [`--bb-theme-typography-${role}-text-decoration`, presentation.textDecoration]
    ];
  }));
}

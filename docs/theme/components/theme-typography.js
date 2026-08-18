export const THEME_TYPOGRAPHY_ROLES = Object.freeze(['signature', 'interface', 'technical']);
export const THEME_TYPOGRAPHY_VARIANT_NAMES = Object.freeze(['bold', 'italic', 'underline']);

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

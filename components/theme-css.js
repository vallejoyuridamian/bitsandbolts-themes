import { THEME_FONT_ROLE_OPTIONS } from './theme-roles.js';
import { themeTypographyVariantVariables } from './theme-typography.js';

// The same resolved Theme model feeds cards and compiled project resources.
export function themeModeCss(theme, mode) {
  const presentation = theme?.v2?.modes?.[mode];
  if (!presentation?.variables) throw new TypeError('Resolved Theme mode is unavailable.');
  const variables = {
    ...presentation.variables,
    ...themeTypographyVariantVariables(theme.v2.typography.variants, theme.v2.typography.specimens),
    ...Object.fromEntries(THEME_FONT_ROLE_OPTIONS.map(({ familyRole, value }) => [
      value.slice(4, -1), theme.v2.typography.families[familyRole]
    ]))
  };
  const declarations = Object.entries(variables).map(([name, value]) => {
    if (!/^--[a-z0-9-]+$/.test(name) || /[;{}<>]/.test(String(value))) {
      throw new TypeError('Resolved Theme CSS variable is invalid.');
    }
    return `  ${name}: ${value};`;
  });
  return `:root, [data-theme="${mode}"] {\n${declarations.join('\n')}\n}`;
}

// Authored roles and their transient presentation share this contract.
export const THEME_COLOR_ROLES = Object.freeze(['primary', 'secondary', 'accent', 'neutral']);
export const THEME_FONT_ROLE_OPTIONS = Object.freeze([
  Object.freeze({ familyRole: 'accent', label: 'Signature', role: 'signature', value: 'var(--bb-font-family-display)' }),
  Object.freeze({ familyRole: 'primary', label: 'Interface', role: 'interface', value: 'var(--bb-font-family-body)' }),
  Object.freeze({ familyRole: 'mono', label: 'Technical', role: 'technical', value: 'var(--bb-font-family-mono)' })
]);
export const THEME_FONT_ROLES = Object.freeze(THEME_FONT_ROLE_OPTIONS.map(({ role }) => role));
export const THEME_FONT_FAMILY_ROLES = Object.freeze(Object.fromEntries(THEME_FONT_ROLE_OPTIONS.map(({ role, familyRole }) => [role, familyRole])));

const contracts = Object.freeze({
  color: Object.freeze({ roles: THEME_COLOR_ROLES, defaultOnly: 'neutral' }),
  font: Object.freeze({ roles: THEME_FONT_ROLES, defaultOnly: null })
});

function contract(kind) {
  const result = contracts[kind];
  if (!result) throw new TypeError(`Unknown Theme role category: ${kind}`);
  return result;
}

function assigned(value) {
  return value != null && value !== '';
}

export function resolveThemeRoles(kind, assignments = {}, defaults = {}) {
  const { roles, defaultOnly } = contract(kind);
  const donor = roles.find((role) => assigned(assignments[role]));
  return Object.fromEntries(roles.map((role) => [role,
    assigned(assignments[role]) ? assignments[role]
      : role !== defaultOnly && donor ? assignments[donor]
        : defaults[role] ?? null
  ]));
}

// Only authored values enter option lists. Deduplication never alters assignments.
export function themeRoleOptions(kind, assignments = {}, key = (value) => value) {
  const seen = new Set();
  return contract(kind).roles.flatMap((role) => {
    const value = assignments[role];
    if (!assigned(value)) return [];
    const identity = key(value);
    if (!identity || seen.has(identity)) return [];
    seen.add(identity);
    return [{ role, value }];
  });
}

export function themeColorAssignmentVariable(role) {
  if (!THEME_COLOR_ROLES.includes(role)) throw new TypeError(`Invalid Theme color role: ${role}`);
  return `--bb-v2-identity-${role}-assigned`;
}

const directIdentitySemantics = Object.freeze({
  primary: ['color.interaction.action', 'color.interaction.onAction'],
  secondary: ['color.interaction.selected', 'color.interaction.onSelected'],
  neutral: ['color.surface.surface', 'color.content.primary']
});

export function themeSemanticColorVariable(role) {
  return `--bb-v2-${String(role)
    .replaceAll('.', '-')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()}`;
}

export function themeIdentityForegroundToken(role) {
  return role === 'accent' ? 'palette.identityAccentForeground'
    : directIdentitySemantics[role]?.[1] ?? '';
}

// Identity variables and their direct semantic pairs do not require palette generation.
export function themeIdentityColorVariables(identity = [], { directSemantics = false } = {}) {
  const variables = {};
  for (const entry of identity) {
    const assignmentVariable = themeColorAssignmentVariable(entry.id);
    variables[`--bb-v2-identity-${entry.id}`] = entry.value;
    variables[`--bb-v2-identity-${entry.id}-foreground`] = entry.foreground;
    variables[assignmentVariable] = entry.assigned === false ? '0' : '1';
    if (directSemantics && directIdentitySemantics[entry.id]) {
      directIdentitySemantics[entry.id].forEach((role, index) => {
        variables[themeSemanticColorVariable(role)] = index === 0 ? entry.value : entry.foreground;
      });
    }
  }
  return variables;
}

export function themeIdentityOptions(identity = []) {
  const authored = Object.fromEntries(identity.map((entry) => [entry.id, entry.assigned === false ? null : entry]));
  return themeRoleOptions('color', authored, (entry) => String(entry.value || '').trim().toLowerCase())
    .map(({ value }) => value);
}

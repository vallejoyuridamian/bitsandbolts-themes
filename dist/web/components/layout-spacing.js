export const LAYOUT_GAP_UNIT_WIDTH_FACTOR = 0.022;
export const LAYOUT_GAP_UNIT_HEIGHT_FACTOR = 0.030;

export const LAYOUT_GAP_PRESETS = Object.freeze([
  Object.freeze({ id: 'related', label: 'Related', multiplier: 1 }),
  Object.freeze({ id: 'group', label: 'Group', multiplier: 2 }),
  Object.freeze({ id: 'section', label: 'Section', multiplier: 3 }),
  Object.freeze({ id: 'major', label: 'Major', multiplier: 4 })
]);

const layoutGapPresetIds = new Set(LAYOUT_GAP_PRESETS.map(({ id }) => id));

export function normalizeLayoutGapPresetId(value = '') {
  const id = String(value || '').trim().toLowerCase();
  return layoutGapPresetIds.has(id) ? id : '';
}

export function resolveLayoutGapPreset(presetId = '', {
  height = 1920,
  width = 1080
} = {}) {
  const id = normalizeLayoutGapPresetId(presetId);
  const definition = LAYOUT_GAP_PRESETS.find((preset) => preset.id === id);
  if (!definition) return null;
  const resolvedWidth = Math.max(1, Number(width) || 1080);
  const resolvedHeight = Math.max(1, Number(height) || 1920);
  const unit = Math.min(
    LAYOUT_GAP_UNIT_WIDTH_FACTOR * resolvedWidth,
    LAYOUT_GAP_UNIT_HEIGHT_FACTOR * resolvedHeight
  );
  return Object.freeze({
    gap: unit * definition.multiplier,
    height: resolvedHeight,
    id,
    label: definition.label,
    multiplier: definition.multiplier,
    unit,
    width: resolvedWidth
  });
}

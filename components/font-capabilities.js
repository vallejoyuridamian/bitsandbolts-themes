export function fontFamilyKey(value = '') {
  return String(value).split(',')[0].trim().replace(/^['"]|['"]$/g, '').toLowerCase();
}

export function fontFaceSupportsWeight(face = {}, weight = 700) {
  const declaration = String(face.weight || 'normal').replace(/^normal$/, '400').replace(/^bold$/, '700');
  const values = declaration.trim().split(/\s+/).map(Number);
  const [minimum, maximum = minimum] = values;
  return values.length <= 2 && Number.isFinite(minimum) && Number.isFinite(maximum)
    && minimum <= weight && weight <= maximum;
}

// Aliases retain every registered face of their family, including variable ranges.
export function fontCapabilities(families = [], faces = [], familyAliases = new Map()) {
  const familyKey = (value) => {
    const key = fontFamilyKey(value);
    return fontFamilyKey(familyAliases.get(key) || key);
  };
  const names = (Array.isArray(families) ? families : [families]).map(familyKey);
  const availableFaces = Array.from(faces);
  return Object.freeze({
    bold: names.length > 0 && names.every((family) => family && availableFaces.some((face) => (
      familyKey(face.family) === family && fontFaceSupportsWeight(face, 700)
    )))
  });
}

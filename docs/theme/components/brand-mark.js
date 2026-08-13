const LOGO_TREATMENTS = new Set(['original', 'monochrome']);

function escapeHtml(value = '') {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function cssUrl(value = '') {
  return String(value)
    .replace(/[\n\r\f]/g, '')
    .replaceAll('\\', '\\\\')
    .replaceAll('"', '\\"');
}

export function brandMarkMarkup(brand = {}, {
  className,
  imageProperty
} = {}) {
  const treatment = String(brand.logoTreatment || 'original');
  if (!LOGO_TREATMENTS.has(treatment)) {
    throw new TypeError(`Unsupported brand logo treatment: ${treatment}`);
  }
  if (brand.logo && treatment === 'monochrome') {
    const style = `${imageProperty}:url("${cssUrl(brand.logo)}")`;
    return `<span class="${className} ${className}--monochrome" style="${escapeHtml(style)}" aria-hidden="true"></span>`;
  }
  if (brand.logo) return `<img src="${escapeHtml(brand.logo)}" alt="" />`;
  return `<svg class="${className}" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
            <path fill="currentColor" d="M16 2 30 16 16 30 2 16 16 2Zm0 6.2L8.2 16l7.8 7.8 7.8-7.8L16 8.2Z" />
          </svg>`;
}

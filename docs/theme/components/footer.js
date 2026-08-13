import { brandMarkMarkup } from './brand-mark.js';

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function externalAttributes(model = {}) {
  return model.external ? ' target="_blank" rel="noopener noreferrer"' : '';
}

function themeAttributes(theme) {
  if (theme === undefined) return '';
  const familyId = String(theme?.familyId ?? '').trim();
  const variant = String(theme?.variant ?? '').trim();
  if (!familyId || !variant) {
    throw new TypeError('A Footer theme requires both familyId and variant.');
  }
  return ` data-bb-theme-family="${escapeHtml(familyId)}" data-bb-theme-mode="${escapeHtml(variant)}"`;
}

function footerLink(model, { specimen = false } = {}) {
  if (specimen) return `<span class="bb-footer__link">${escapeHtml(model.label)}</span>`;
  return `<a class="bb-footer__link" href="${escapeHtml(model.href)}"${externalAttributes(model)}>${escapeHtml(model.label)}</a>`;
}

export function footerMarkup(model = {}, { specimen = false, theme } = {}) {
  const brand = model.brand || {};
  const links = Array.isArray(model.links) ? model.links : [];
  const brandMark = brandMarkMarkup(brand, {
    className: 'bb-footer__brand-mark',
    imageProperty: '--bb-footer-brand-mark-image'
  });
  const brandLabel = brand.ariaLabel
    ? ` aria-label="${escapeHtml(brand.ariaLabel)}"`
    : '';
  const brandStart = specimen
    ? '<span class="bb-footer__brand">'
    : `<a class="bb-footer__brand" href="${escapeHtml(brand.href)}"${brandLabel}${externalAttributes(brand)}>`;
  const brandEnd = specimen ? '</span>' : '</a>';
  const navigation = links.length > 0
    ? `<nav class="bb-footer__links" aria-label="${escapeHtml(model.label)}">
          ${links.map((link) => footerLink(link, { specimen })).join('\n          ')}
        </nav>`
    : '';

  return `<footer class="bb-footer" data-bb-footer${themeAttributes(theme)}>
      <div class="bb-footer__inner">
        ${brandStart}
          ${brandMark}
          <span><strong>${escapeHtml(brand.name)}</strong><small>${escapeHtml(brand.tagline)}</small></span>
        ${brandEnd}
        ${navigation}
        <div class="bb-footer__meta"><span>© <span data-current-year>2026</span> ${escapeHtml(model.copyright)}</span><span>${escapeHtml(model.note)}</span></div>
      </div>
    </footer>`;
}

export function synchronizeFooterYear(root = globalThis.document) {
  if (!root?.querySelectorAll) return;
  const year = String(new Date().getFullYear());
  root.querySelectorAll('[data-current-year]').forEach((node) => {
    node.textContent = year;
  });
}

if (typeof document !== 'undefined') synchronizeFooterYear(document);

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

export function spotlightMediaMarkup(model = {}) {
  return `<figure class="bb-spotlight-media" aria-label="${escapeHtml(model.label ?? model.media?.alt ?? 'Featured media')}">
        <img src="${escapeHtml(model.media?.src)}" alt="${escapeHtml(model.media?.alt)}" loading="lazy" />
      </figure>`;
}

export function storeBadgesMarkup(model = {}) {
  const items = (model.items ?? []).map((item) => `<a class="bb-store-badge" href="${escapeHtml(item.href)}"${externalAttributes(item)}>
          <img src="${escapeHtml(item.image?.src)}" alt="${escapeHtml(item.image?.alt)}" loading="lazy" />
        </a>`).join('\n        ');
  return `<div class="bb-store-badge-list" aria-label="${escapeHtml(model.label ?? 'Store downloads')}">
        ${items}
      </div>`;
}

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

function richMarkup(segments = []) {
  return segments.map((segment) => {
    if (typeof segment === 'string') return escapeHtml(segment);
    if (segment?.kind === 'strong') return `<strong>${escapeHtml(segment.text)}</strong>`;
    if (segment?.kind === 'icon') {
      const label = segment.label ? ` role="img" aria-label="${escapeHtml(segment.label)}"` : ' aria-hidden="true"';
      return `<span class="bb-vector-icon bb-content-card__inline-icon" data-bb-icon="${escapeHtml(segment.icon)}"${label}></span>`;
    }
    return '';
  }).join('');
}

function mediaPosition(model, item, index) {
  if (item.mediaPosition === 'start' || item.mediaPosition === 'end') return item.mediaPosition;
  if (model.mediaFlow === 'alternate-end-first') return index % 2 === 0 ? 'end' : 'start';
  if (model.mediaFlow === 'alternate-start-first') return index % 2 === 0 ? 'start' : 'end';
  return 'start';
}

function cardMarkup(model, item, index, { specimen = false } = {}) {
  const layout = model.layout === 'rail' ? 'vertical' : 'horizontal';
  const position = mediaPosition(model, item, index);
  const mediaEnd = layout === 'horizontal' && position === 'end' ? ' bb-content-card--media-end' : '';
  const media = item.media
    ? `<div class="bb-content-card__media${item.media.appearance === 'contained' ? ' bb-content-card__media--contained' : ''}">
          <img src="${escapeHtml(item.media.src)}" alt="${escapeHtml(item.media.alt)}" loading="lazy" />
        </div>`
    : '';
  const card = `<article class="bb-content-card bb-content-card--${layout}${mediaEnd}${model.layout === 'rail' ? ' bb-card-rail__item' : ''}">
        ${media}
        <div class="bb-content-card__copy">
          <h3>${escapeHtml(item.title)}</h3>
          <p>${richMarkup(item.body)}</p>
        </div>
      </article>`;
  if (specimen || !item.href) return card;
  return `<a class="bb-content-card-link" href="${escapeHtml(item.href)}"${externalAttributes(item)}>${card}</a>`;
}

export function contentCardsMarkup(model = {}, options = {}) {
  const items = Array.isArray(model.items) ? model.items : [];
  const cards = items.map((item, index) => cardMarkup(model, item, index, options));
  if (model.layout === 'rail') {
    return `<div class="bb-card-rail" aria-label="${escapeHtml(model.label ?? 'Cards')}">
        <div class="bb-card-rail__track">
          ${cards.join('\n          ')}
        </div>
      </div>`;
  }
  return `<div class="bb-content-card-list">
        ${cards.join('\n        ')}
      </div>`;
}

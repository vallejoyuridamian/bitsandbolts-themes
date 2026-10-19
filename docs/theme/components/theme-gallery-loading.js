// Placeholder geometry composes the real gallery grid/card and shared shimmer.
export function themeGalleryLoadingMarkup({ count = 4 } = {}) {
  if (!Number.isInteger(count) || count < 1 || count > 64) {
    throw new TypeError('Theme placeholder count must be between 1 and 64.');
  }
  return `<div class="bb-theme-summary__grid" role="status" aria-label="Loading themes" aria-busy="true" inert>${
    Array.from({ length: count }, () => '<article class="bb-theme-summary-card bb-skeleton" aria-hidden="true"><div class="bb-theme-summary-card__open"><div></div><div></div><div></div></div></article>').join('')
  }</div>`;
}

function positiveWidth(value) {
  const width = Number.parseFloat(value);
  return Number.isFinite(width) && width > 0 ? width : 0;
}

// Prepared specimens can supply their width without measuring rendered labels.
export function syncPreviewCardGridWidths(root, { selector, onMeasured = null } = {}) {
  const startedAt = performance.now();
  const grids = root?.matches?.(selector)
    ? [root]
    : [...(root?.querySelectorAll?.(selector) ?? [])];
  if (!grids.length) return 0;
  const view = grids[0].ownerDocument?.defaultView;
  const width = positiveWidth(view?.getComputedStyle?.(grids[0])?.getPropertyValue('--bb-preview-card-width'));
  if (!width) throw new Error('Preview cards require the shared Themes width recipe.');
  grids.forEach((grid) => {
    if (grid.hasAttribute?.('data-floating-window-responsive-grid')) {
      grid.dataset.floatingWindowGridItemWidth = String(width);
    }
  });
  onMeasured?.({
    phase: 'sync', mode: 'fixed-recipe', gridCount: grids.length,
    measuredCount: 0, width, durationMs: Math.round((performance.now() - startedAt) * 10) / 10
  });
  return grids.length;
}

// Measure the complete browse collection, including every category, in one pass.
// Search reuses the resulting width through its containing picker.
export function measurePreviewCardGridWidth(grids = []) {
  const measurements = grids.map((grid) => ({
    grid,
    width: positiveWidth(grid.dataset?.floatingWindowGridItemWidth),
    columns: grid.style.gridTemplateColumns || '',
    inlineSize: grid.style.width || '',
    items: [...(grid.children ?? [])].map((item) => {
      const content = item.querySelector?.('[data-floating-window-grid-measure-content]');
      return { item, content, inlineSize: content?.style?.width || '' };
    })
  }));
  const intrinsic = measurements.filter(({ width }) => !width);
  intrinsic.forEach(({ grid, items }) => {
    grid.style.gridTemplateColumns = 'max-content';
    grid.style.width = 'max-content';
    items.forEach(({ content }) => { if (content?.style) content.style.width = 'max-content'; });
  });
  try {
    intrinsic.forEach((measurement) => {
      measurement.width = Math.max(0, ...measurement.items.map(({ item }) => Math.ceil(Math.max(
        positiveWidth(item.getBoundingClientRect?.().width),
        positiveWidth(item.scrollWidth),
        positiveWidth(item.offsetWidth)
      ))));
    });
    return Math.max(0, ...measurements.map(({ width }) => width));
  } finally {
    intrinsic.forEach(({ grid, columns, inlineSize, items }) => {
      grid.style.gridTemplateColumns = columns;
      grid.style.width = inlineSize;
      items.forEach(({ content, inlineSize: previous }) => {
        if (content?.style) content.style.width = previous;
      });
    });
  }
}

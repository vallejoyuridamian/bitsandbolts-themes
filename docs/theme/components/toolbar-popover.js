function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function attributesMarkup(attributes = {}) {
  return Object.entries(attributes)
    .filter(([name, value]) => (
      /^[A-Za-z_:][A-Za-z0-9:_.-]*$/.test(name)
      && value !== false
      && value !== null
      && value !== undefined
    ))
    .map(([name, value]) => value === true
      ? ` ${name}`
      : ` ${name}="${escapeHtml(value)}"`)
    .join('');
}

export function toolbarPopoverTriggerMarkup({
  attributes = {},
  help = '',
  label = 'Open toolbar options'
} = {}) {
  const resolvedLabel = String(label || 'Open toolbar options');
  const resolvedAttributes = {
    'aria-expanded': 'false',
    'aria-haspopup': 'dialog',
    'aria-label': resolvedLabel,
    title: String(help || resolvedLabel),
    'data-bb-toolbar-popover-trigger': '',
    ...attributes
  };
  return `<button type="button" class="bb-toolbar-popover__trigger bb-workspace-control-button bb-workspace-control-button--icon"${attributesMarkup(resolvedAttributes)}><span class="bb-toolbar-popover__trigger-value bb-cut-corner-swatch" aria-hidden="true"></span></button>`;
}

export function applyToolbarPopoverRecipe({
  ariaLabel = 'Toolbar options',
  node = null
} = {}) {
  if (!node?.classList) return false;
  node.classList.add('bb-toolbar-popover', 'bb-interface-controls');
  node.dataset.bbToolbarPopover = '';
  node.setAttribute?.('role', 'dialog');
  node.setAttribute?.('aria-label', String(ariaLabel || 'Toolbar options'));
  return true;
}

function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function resolveToolbarPopoverPosition({
  anchorRect = {},
  gap = 6,
  panelRect = {},
  viewportGap = 8,
  viewportHeight = 0,
  viewportWidth = 0
} = {}) {
  const safeViewportWidth = Math.max(0, finite(viewportWidth));
  const safeViewportHeight = Math.max(0, finite(viewportHeight));
  const safeViewportGap = Math.max(0, finite(viewportGap, 8));
  const safeGap = Math.max(0, finite(gap, 6));
  const panelWidth = Math.max(0, finite(panelRect.width));
  const panelHeight = Math.max(0, finite(panelRect.height));
  const anchorLeft = finite(anchorRect.left);
  const anchorTop = finite(anchorRect.top);
  const anchorBottom = finite(anchorRect.bottom, anchorTop + finite(anchorRect.height));
  const maximumLeft = Math.max(safeViewportGap, safeViewportWidth - safeViewportGap - panelWidth);
  const left = Math.min(Math.max(safeViewportGap, anchorLeft), maximumLeft);
  const belowTop = anchorBottom + safeGap;
  const aboveTop = anchorTop - safeGap - panelHeight;
  const belowFits = belowTop + panelHeight <= safeViewportHeight - safeViewportGap;
  const placement = belowFits || belowTop <= Math.max(safeViewportGap, aboveTop) ? 'below' : 'above';
  const preferredTop = placement === 'below' ? belowTop : aboveTop;
  const maximumTop = Math.max(safeViewportGap, safeViewportHeight - safeViewportGap - panelHeight);
  const top = Math.min(Math.max(safeViewportGap, preferredTop), maximumTop);
  return { left: Math.round(left), placement, top: Math.round(top) };
}

let popoverSequence = 0;

export function createToolbarPopoverController({
  rootDocument = globalThis.document
} = {}) {
  const view = rootDocument?.defaultView ?? globalThis.window;
  let active = null;

  function position() {
    if (!active) return false;
    if (!active.anchor?.isConnected || !active.panel?.isConnected) {
      close('anchor-disconnected');
      return false;
    }
    const positionValue = resolveToolbarPopoverPosition({
      anchorRect: active.anchor.getBoundingClientRect?.() ?? {},
      panelRect: active.panel.getBoundingClientRect?.() ?? {},
      viewportHeight: view?.innerHeight ?? rootDocument?.documentElement?.clientHeight ?? 0,
      viewportWidth: view?.innerWidth ?? rootDocument?.documentElement?.clientWidth ?? 0
    });
    active.panel.style.left = `${positionValue.left}px`;
    active.panel.style.top = `${positionValue.top}px`;
    active.panel.dataset.bbToolbarPopoverPlacement = positionValue.placement;
    return true;
  }

  function close(reason = 'unspecified', { restoreFocus = false } = {}) {
    if (!active) return false;
    const record = active;
    active = null;
    record.anchor?.setAttribute?.('aria-expanded', 'false');
    record.anchor?.removeAttribute?.('aria-controls');
    record.panel?.remove?.();
    record.onClose?.({ reason });
    if (restoreFocus && record.anchor?.isConnected) record.anchor.focus?.();
    return true;
  }

  function open({
    anchor = null,
    ariaLabel = 'Toolbar options',
    onClose = null,
    renderContent = null
  } = {}) {
    if (!anchor?.isConnected || !rootDocument?.body) return false;
    close('replaced');
    const panel = rootDocument.createElement('div');
    panel.id = `bbToolbarPopover${popoverSequence += 1}`;
    applyToolbarPopoverRecipe({ ariaLabel, node: panel });
    renderContent?.(panel);
    rootDocument.body.appendChild(panel);
    active = { anchor, onClose, panel };
    anchor.setAttribute?.('aria-controls', panel.id);
    anchor.setAttribute?.('aria-expanded', 'true');
    return position();
  }

  function handlePointerDown(event) {
    if (!active) return;
    if (active.anchor?.contains?.(event.target) || active.panel?.contains?.(event.target)) return;
    close('outside-pointer');
  }

  function handleKeyDown(event) {
    if (!active || event.key !== 'Escape') return;
    event.preventDefault?.();
    event.stopPropagation?.();
    close('escape', { restoreFocus: true });
  }

  function handleViewportChange() {
    position();
  }

  rootDocument?.addEventListener?.('pointerdown', handlePointerDown, true);
  rootDocument?.addEventListener?.('keydown', handleKeyDown, true);
  rootDocument?.addEventListener?.('scroll', handleViewportChange, true);
  view?.addEventListener?.('resize', handleViewportChange);

  function destroy() {
    close('toolbar-popover-controller-destroyed');
    rootDocument?.removeEventListener?.('pointerdown', handlePointerDown, true);
    rootDocument?.removeEventListener?.('keydown', handleKeyDown, true);
    rootDocument?.removeEventListener?.('scroll', handleViewportChange, true);
    view?.removeEventListener?.('resize', handleViewportChange);
  }

  return {
    close,
    destroy,
    isOpenFor: (anchor) => Boolean(active?.anchor === anchor),
    open,
    position
  };
}

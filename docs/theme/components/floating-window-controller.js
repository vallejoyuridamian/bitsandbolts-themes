import { createComponentEvents } from './component-events.js';
import { floatingWindowStack } from './floating-window-stack.js';
import {
  FLOATING_WINDOW_CONTENT_CHANGE_EVENT,
  measurePreviewCardGridWidth
} from './floating-window.js';

const DEFAULT_WIDTH = 360;
const DEFAULT_HEIGHT = 260;
const VIEWPORT_MARGIN = 12;
const MIN_RECOVERABLE_WIDTH = 96;
const DRAG_BAR_HEIGHT = 26;
const SIZE_EPSILON = 1;

function finiteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), Math.max(minimum, maximum));
}

function elementSummary(element = null) {
  if (!element) return null;
  return {
    id: String(element.id || ''),
    className: String(element.className?.baseVal ?? element.className ?? ''),
    tagName: String(element.tagName || '').toLowerCase()
  };
}

function stylePixels(style = null, property = '') {
  return Math.max(0, finiteNumber(Number.parseFloat(style?.[property]), 0));
}

export function createFloatingWindowController({
  applyRecipe,
  bindEvent = null,
  beforeContentReplace = () => {},
  onPresent = null,
  closeOnOutsidePointer = true,
  closeOnEscape = true,
  cancelFrame = (frameId) => globalThis.cancelAnimationFrame?.(frameId),
  createScrollbar = null,
  logInteraction = null,
  onError = null,
  requestFrame = (callback) => globalThis.requestAnimationFrame?.(callback) ?? setTimeout(callback, 0),
  rootDocument = globalThis.document
} = {}) {
  const records = new Map();
  let activeWindowId = '';
  let windowStack = null;

  function raiseWindow(record, reason) {
    windowStack.raise(record.node);
    log('floating-window-stack-admitted', {
      windowId: record.id, reason, paintStack: windowStack.describe(record.node)
    });
  }

  function log(event, payload = {}) {
    logInteraction?.(event, {
      category: 'ui',
      level: payload.level ?? 'detailed',
      source: 'floating-window-controller',
      listenerFile: 'components/floating-window-controller.js',
      listenerName: 'createFloatingWindowController',
      ...payload
    });
  }

  function reportError(error, meta = {}) {
    log('floating-window-router-error', {
      level: 'error',
      eventName: String(meta.eventName || ''),
      routerLabel: String(meta.label || ''),
      message: String(error?.message || error || 'unknown error')
    });
    onError?.(error, meta);
  }

  function viewportSize() {
    const rootWindow = rootDocument?.defaultView;
    return {
      height: finiteNumber(rootWindow?.innerHeight, rootDocument?.documentElement?.clientHeight ?? 0),
      width: finiteNumber(rootWindow?.innerWidth, rootDocument?.documentElement?.clientWidth ?? 0)
    };
  }

  function measuredGeometry(record) {
    const rect = record?.node?.getBoundingClientRect?.() ?? {};
    return {
      height: finiteNumber(rect.height, record?.node?.offsetHeight ?? DEFAULT_HEIGHT),
      left: finiteNumber(rect.left, finiteNumber(record?.node?.style?.left)),
      top: finiteNumber(rect.top, finiteNumber(record?.node?.style?.top)),
      width: finiteNumber(rect.width, record?.node?.offsetWidth ?? DEFAULT_WIDTH)
    };
  }

  function preferredGridMeasurement(record, availableWidth) {
    const content = record?.body?.firstElementChild ?? null;
    const preferredColumns = Math.floor(finiteNumber(
      content?.dataset?.floatingWindowPreferredColumns,
      0
    ));
    if (preferredColumns < 1) return null;
    const grids = [...content.querySelectorAll('[data-floating-window-responsive-grid]')]
      .filter((grid) => grid.children.length);
    const grid = grids[0];
    if (!grid) return null;
    const itemWidth = measurePreviewCardGridWidth(grids);
    if (!itemWidth) return null;
    const view = rootDocument?.defaultView;
    const computedGrid = view?.getComputedStyle?.(grid) ?? null;
    const columnGap = stylePixels(computedGrid, 'columnGap') || stylePixels(computedGrid, 'gap');
    let inlinePadding = 0;
    for (let parent = grid.parentElement; parent; parent = parent.parentElement) {
      const computed = view?.getComputedStyle?.(parent) ?? null;
      inlinePadding += stylePixels(computed, 'paddingLeft') + stylePixels(computed, 'paddingRight');
      if (parent === record.body) break;
    }
    const columns = Math.max(1, Math.min(preferredColumns, Math.floor(
      (availableWidth - inlinePadding + columnGap) / (itemWidth + columnGap)
    )));
    const width = Math.min(availableWidth, Math.ceil(
      (itemWidth * columns) + (columnGap * (columns - 1)) + inlinePadding
    ));
    content.style?.setProperty?.(
      '--bb-floating-window-grid-item-min-inline-size',
      `${itemWidth}px`
    );
    return {
      columnGap,
      inlinePadding,
      itemWidth,
      preferredColumns,
      columns,
      width
    };
  }

  function fitRenderedWindow(record) {
    const viewport = viewportSize();
    const maximumWidth = Math.max(1, viewport.width - (VIEWPORT_MARGIN * 2));
    const maximumHeight = Math.max(1, viewport.height - (VIEWPORT_MARGIN * 2));
    const initial = measuredGeometry(record);
    const bodyClientWidth = finiteNumber(record?.body?.clientWidth, initial.width);
    const horizontalShell = Math.max(0, initial.width - bodyClientWidth);
    const preferredGrid = preferredGridMeasurement(record, maximumWidth - horizontalShell);
    const bodyScrollWidth = Math.max(
      bodyClientWidth,
      finiteNumber(record?.body?.scrollWidth, bodyClientWidth),
      finiteNumber(preferredGrid?.width)
    );
    const width = preferredGrid
      ? Math.min(maximumWidth, Math.ceil(preferredGrid.width + horizontalShell))
      : Math.min(maximumWidth, Math.ceil(Math.max(initial.width, bodyScrollWidth + horizontalShell)));
    if (Math.abs(width - initial.width) > SIZE_EPSILON) {
      record.node.style.width = `${width}px`;
    }
    if (preferredGrid) {
      log('floating-window-preferred-grid-measured', {
        windowId: record.id,
        ...preferredGrid,
        outcome: 'preferred-columns-fitted'
      });
    }

    const widthAdjusted = measuredGeometry(record);
    const bodyClientHeight = finiteNumber(record?.body?.clientHeight, widthAdjusted.height);
    const bodyScrollHeight = Math.max(
      bodyClientHeight,
      finiteNumber(record?.body?.scrollHeight, bodyClientHeight)
    );
    const verticalShell = Math.max(0, widthAdjusted.height - bodyClientHeight);
    const fillHeight = record.body.firstElementChild?.dataset?.floatingWindowFillHeight === 'true';
    const height = fillHeight ? maximumHeight : Math.min(
      maximumHeight,
      Math.ceil(Math.max(widthAdjusted.height, bodyScrollHeight + verticalShell))
    );
    if (Math.abs(height - widthAdjusted.height) > SIZE_EPSILON
      || record.body.firstElementChild?.dataset?.floatingWindowFitFirstItem === 'true' || fillHeight) {
      record.node.style.height = `${height}px`;
    }
  }

  function refitPreferredGridAfterFonts(record) {
    const content = record?.body?.firstElementChild ?? null;
    const fontsReady = rootDocument?.fonts?.ready;
    const grid = content?.querySelector?.('[data-floating-window-responsive-grid]');
    if (!content?.dataset?.floatingWindowPreferredColumns || typeof fontsReady?.then !== 'function'
      || rootDocument?.fonts?.status !== 'loading' || finiteNumber(grid?.dataset?.floatingWindowGridItemWidth)) {
      return;
    }
    Promise.resolve(fontsReady).then(() => {
      requestFrame(() => {
        if (record.node.hidden || record.body.firstElementChild !== content) return;
        fitRenderedWindow(record);
        positionRenderedWindow(record, { recenter: !record.userPositioned });
        record.overflow?.updateSoon?.();
      });
    }).catch(() => {});
  }

  function centeredPosition(record) {
    const viewport = viewportSize();
    const geometry = measuredGeometry(record);
    return {
      left: clamp(
        Math.round((viewport.width - geometry.width) / 2),
        VIEWPORT_MARGIN,
        viewport.width - geometry.width - VIEWPORT_MARGIN
      ),
      top: clamp(
        Math.round((viewport.height - geometry.height) / 2),
        VIEWPORT_MARGIN,
        viewport.height - geometry.height - VIEWPORT_MARGIN
      )
    };
  }

  function initialPosition(record) {
    if (record?.initialPlacement !== 'top-right') return centeredPosition(record);
    const viewport = viewportSize();
    const geometry = measuredGeometry(record);
    return {
      left: clamp(
        viewport.width - geometry.width - VIEWPORT_MARGIN,
        VIEWPORT_MARGIN,
        viewport.width - geometry.width - VIEWPORT_MARGIN
      ),
      top: VIEWPORT_MARGIN
    };
  }

  function recoverableDragBounds(record) {
    const viewport = viewportSize();
    const geometry = measuredGeometry(record);
    const visibleWidth = Math.min(geometry.width, MIN_RECOVERABLE_WIDTH);
    const visibleHeight = Math.min(geometry.height, DRAG_BAR_HEIGHT);
    return {
      geometry,
      maximumLeft: Math.max(VIEWPORT_MARGIN, viewport.width - visibleWidth - VIEWPORT_MARGIN),
      maximumTop: Math.max(VIEWPORT_MARGIN, viewport.height - visibleHeight - VIEWPORT_MARGIN),
      minimumLeft: Math.min(VIEWPORT_MARGIN, VIEWPORT_MARGIN - geometry.width + visibleWidth),
      minimumTop: VIEWPORT_MARGIN
    };
  }

  function positionRenderedWindow(record, { recenter = false } = {}) {
    const position = recenter || !record.userPositioned
      ? initialPosition(record)
      : (() => {
          const bounds = recoverableDragBounds(record);
          return {
            left: clamp(bounds.geometry.left, bounds.minimumLeft, bounds.maximumLeft),
            top: clamp(bounds.geometry.top, bounds.minimumTop, bounds.maximumTop)
          };
        })();
    record.node.style.left = `${Math.round(position.left)}px`;
    record.node.style.top = `${Math.round(position.top)}px`;
    record.node.style.transform = '';
  }

  function commitDrag(record) {
    const drag = record?.drag;
    if (!drag) return false;
    const bounds = recoverableDragBounds(record);
    const nextLeft = clamp(
      finiteNumber(drag.rect.left) + drag.deltaX,
      bounds.minimumLeft,
      bounds.maximumLeft
    );
    const nextTop = clamp(
      finiteNumber(drag.rect.top) + drag.deltaY,
      bounds.minimumTop,
      bounds.maximumTop
    );
    record.node.style.left = `${Math.round(nextLeft)}px`;
    record.node.style.top = `${Math.round(nextTop)}px`;
    record.node.style.transform = '';
    return true;
  }

  function paintDrag(record) {
    const drag = record?.drag;
    if (!drag) return;
    drag.frameId = null;
    const bounds = recoverableDragBounds(record);
    const requestedLeft = finiteNumber(drag.rect.left) + drag.latestX - drag.startX;
    const requestedTop = finiteNumber(drag.rect.top) + drag.latestY - drag.startY;
    const nextLeft = clamp(requestedLeft, bounds.minimumLeft, bounds.maximumLeft);
    const nextTop = clamp(requestedTop, bounds.minimumTop, bounds.maximumTop);
    drag.deltaX = nextLeft - finiteNumber(drag.rect.left);
    drag.deltaY = nextTop - finiteNumber(drag.rect.top);
    record.node.style.transform = `translate3d(${Math.round(drag.deltaX)}px, ${Math.round(drag.deltaY)}px, 0)`;
  }

  function scheduleDragPaint(record) {
    if (!record?.drag || record.drag.frameId !== null) return;
    record.drag.frameId = requestFrame(() => paintDrag(record));
  }

  function finishDrag(record, event, outcome = 'committed') {
    const drag = record?.drag;
    if (!drag) return false;
    if (drag.frameId !== null) {
      cancelFrame?.(drag.frameId);
      drag.frameId = null;
    }
    paintDrag(record);
    commitDrag(record);
    record.userPositioned = true;
    try {
      record.dragHandle.releasePointerCapture?.(drag.pointerId);
    } catch {}
    record.drag = null;
    log('floating-window-drag-finished', {
      windowId: record.id,
      outcome,
      pointerId: finiteNumber(event?.pointerId, drag.pointerId),
      left: record.node.style.left,
      top: record.node.style.top
    });
    return true;
  }

  function createRecord(id, ariaLabel) {
    if (!rootDocument?.body || typeof rootDocument.createElement !== 'function') {
      log('floating-window-create-failed', {
        level: 'error',
        windowId: id,
        reason: 'root-document-unavailable'
      });
      return null;
    }

    const node = rootDocument.createElement('section');
    node.dataset.floatingWindowId = id;
    node.setAttribute('role', 'dialog');
    node.setAttribute('aria-modal', 'false');
    node.setAttribute('aria-label', ariaLabel);
    node.hidden = true;

    const dragBar = rootDocument.createElement('div');
    dragBar.dataset.floatingWindowRole = 'drag-bar';
    const grip = rootDocument.createElement('span');
    grip.setAttribute('aria-hidden', 'true');

    const closeButton = rootDocument.createElement('button');
    closeButton.dataset.floatingWindowRole = 'close';
    closeButton.type = 'button';

    const body = rootDocument.createElement('div');
    body.dataset.floatingWindowRole = 'body';

    if (typeof applyRecipe !== 'function') {
      log('floating-window-create-failed', {
        level: 'error',
        windowId: id,
        reason: 'themes-floating-window-recipe-unavailable'
      });
      return null;
    }
    applyRecipe({
      body,
      closeButton,
      closeLabel: `Close ${ariaLabel}`,
      dragBar,
      grip,
      node
    });

    dragBar.append(grip, closeButton);
    node.append(dragBar, body);
    windowStack ??= floatingWindowStack(rootDocument);
    windowStack.mount(node);

    node.style.left = `${VIEWPORT_MARGIN}px`;
    node.style.top = `${VIEWPORT_MARGIN}px`;

    const overflow = createScrollbar?.({
      target: body,
      axis: 'y',
      presentation: 'workspace',
      trackEndInset: 16
    }) ?? null;
    const router = createComponentEvents(bindEvent, {
      label: `floating-window:${id}`,
      onError: reportError
    });
    const record = {
      ariaLabel,
      body,
      closeButton,
      drag: null,
      dragBar,
      dragHandle: grip,
      fitFrameId: null,
      fitResetHeight: false,
      id,
      initialPlacement: 'center',
      node,
      onClose: null,
      onRequestClose: null,
      overflow,
      router,
      userPositioned: false
    };

    router.bind(body, FLOATING_WINDOW_CONTENT_CHANGE_EVENT, (event) => {
      requestContentFit(id, {
        resetHeight: event.detail?.resetHeight === true
      });
    });

    if (closeOnOutsidePointer) router.bind(rootDocument, 'pointerdown', event => {
      if (!node.hidden && !node.contains(event.target)) close(id, { reason: 'outside-pointer' });
    }, true);
    if (closeOnEscape) router.bind(rootDocument, 'keydown', event => {
      if (!node.hidden && event.key === 'Escape' && activeWindowId === id) {
        event.preventDefault?.(); close(id, { reason: 'escape' });
      }
    }, true);
    router.bind(closeButton, 'click', (event) => {
      event.preventDefault?.();
      close(id, { reason: 'close-button' });
    });
    router.bind(grip, 'pointerdown', (event) => {
      if (event.button !== 0) return;
      const rect = node.getBoundingClientRect?.();
      if (!rect) {
        log('floating-window-drag-failed', {
          level: 'error',
          windowId: id,
          reason: 'geometry-unavailable'
        });
        return;
      }
      event.preventDefault?.();
      activeWindowId = id;
      raiseWindow(record, 'drag');
      record.drag = {
        deltaX: 0,
        deltaY: 0,
        frameId: null,
        latestX: finiteNumber(event.clientX),
        latestY: finiteNumber(event.clientY),
        pointerId: event.pointerId,
        rect,
        startX: finiteNumber(event.clientX),
        startY: finiteNumber(event.clientY)
      };
      try {
        grip.setPointerCapture?.(event.pointerId);
      } catch {}
      log('floating-window-drag-started', {
        windowId: id,
        pointerId: finiteNumber(event.pointerId, null),
        left: Math.round(finiteNumber(rect.left)),
        top: Math.round(finiteNumber(rect.top))
      });
    });
    router.bind(grip, 'pointermove', (event) => {
      if (!record.drag || event.pointerId !== record.drag.pointerId) return;
      record.drag.latestX = finiteNumber(event.clientX, record.drag.latestX);
      record.drag.latestY = finiteNumber(event.clientY, record.drag.latestY);
      scheduleDragPaint(record);
    });
    router.bind(grip, 'pointerup', (event) => {
      if (!record.drag || event.pointerId !== record.drag.pointerId) return;
      record.drag.latestX = finiteNumber(event.clientX, record.drag.latestX);
      record.drag.latestY = finiteNumber(event.clientY, record.drag.latestY);
      finishDrag(record, event);
    });
    router.bind(grip, 'pointercancel', (event) => {
      if (!record.drag || event.pointerId !== record.drag.pointerId) return;
      finishDrag(record, event, 'pointer-cancelled');
    });
    router.bind(node, 'pointerdown', () => {
      activeWindowId = id;
      raiseWindow(record, 'pointer');
    });

    records.set(id, record);
    log('floating-window-created', {
      windowId: id,
      ariaLabel
    });
    return record;
  }

  function open({
    ariaLabel = 'Tools',
    context = {},
    id = '',
    initialPlacement = 'center',
    onClose = null,
    onRequestClose = null,
    renderContent = null,
    source = 'unknown'
  } = {}) {
    const windowId = String(id || '').trim();
    if (!windowId) {
      log('floating-window-open-failed', {
        level: 'error',
        reason: 'window-id-required',
        source
      });
      return false;
    }
    const focusBefore = rootDocument?.activeElement ?? null;
    let record = records.get(windowId) ?? null;
    const resolution = record ? 'reused' : 'created';
    const wasOpen = Boolean(record && !record.node.hidden);
    log('floating-window-open-started', {
      windowId,
      source,
      resolution,
      context
    });
    record ??= createRecord(windowId, ariaLabel);
    if (!record) return false;

    record.ariaLabel = ariaLabel;
    record.initialPlacement = initialPlacement === 'top-right' ? 'top-right' : 'center';
    record.onClose = typeof onClose === 'function' ? onClose : null;
    record.onRequestClose = onRequestClose;
    record.node.setAttribute('aria-label', ariaLabel);
    record.closeButton.setAttribute('aria-label', `Close ${ariaLabel}`);
    record.closeButton.setAttribute('title', `Close ${ariaLabel}`);
    if (typeof renderContent === 'function') {
      beforeContentReplace(record.body);
      record.body.replaceChildren();
      renderContent(record.body);
    }
    const requestedSize = String(
      record.body.firstElementChild?.dataset?.floatingWindowSize || 'default'
    );
    record.node.dataset.floatingWindowSize = requestedSize === 'content'
      ? 'content'
      : 'default';
    record.node.style.width = '';
    record.node.style.height = '';
    record.node.dataset.floatingWindowMeasuring = 'true';
    record.node.hidden = false;
    if (!wasOpen) record.userPositioned = false;
    fitRenderedWindow(record);
    positionRenderedWindow(record, { recenter: !wasOpen });
    delete record.node.dataset.floatingWindowMeasuring;
    record.overflow?.updateSoon?.();
    raiseWindow(record, 'open');
    activeWindowId = windowId;
    refitPreferredGridAfterFonts(record);
    record.presentationCleanup ??= onPresent?.({ id: record.id, node: record.node, body: record.body }) ?? null;
    const initialFocus = record.body.querySelector?.('[data-floating-window-initial-focus]');
    if (initialFocus) {
      initialFocus.focus({ preventScroll: true });
      if (initialFocus.getAttribute('data-floating-window-initial-focus') === 'select') initialFocus.select?.();
    }
    const focusAfter = rootDocument?.activeElement ?? null;
    log('floating-window-open-finished', {
      windowId,
      source,
      resolution,
      context,
      focusBefore: elementSummary(focusBefore),
      focusAfter: elementSummary(focusAfter),
      focusPreserved: focusBefore === focusAfter,
      paintStack: windowStack.describe(record.node),
      outcome: 'presented'
    });
    return true;
  }

  function close(id = activeWindowId, { reason = 'programmatic' } = {}) {
    const windowId = String(id || '');
    const record = records.get(windowId);
    if (!record || record.node.hidden) return false;
    if (reason !== 'parent-closed' && reason !== 'destroy' && record.onRequestClose?.({ reason, windowId }) === false) return false;
    if (record.fitFrameId !== null) {
      cancelFrame?.(record.fitFrameId);
      record.fitFrameId = null;
      record.fitResetHeight = false;
    }
    record.presentationCleanup?.(reason);
    record.presentationCleanup = null;
    if (record.drag) finishDrag(record, null, 'window-closed');
    record.node.hidden = true;
    windowStack.close(record.node);
    const onClose = record.onClose;
    record.onClose = null;
    if (activeWindowId === windowId) {
      activeWindowId = [...records.values()]
        .filter((candidate) => !candidate.node.hidden && candidate.id !== windowId)
        .sort((left, right) => windowStack.rank(left.node) - windowStack.rank(right.node))
        .at(-1)?.id ?? '';
    }
    log('floating-window-closed', {
      windowId,
      reason,
      outcome: 'closed'
    });
    try {
      onClose?.({ reason, windowId });
    } catch (error) {
      log('floating-window-close-owner-failed', {
        level: 'error',
        windowId,
        reason,
        message: String(error?.message || error),
        outcome: 'close-owner-threw'
      });
    }
    return true;
  }

  function closeActive(options = {}) {
    return close(activeWindowId, options);
  }

  function fitContent(id, { resetHeight = false } = {}) {
    const record = records.get(String(id || ''));
    if (!record || record.node.hidden) return false;
    // Only initial presentation measures a hidden single item. Mounted refits
    // retain focus, hit testing and the complete content scroll range.
    if (resetHeight && record.node.dataset.floatingWindowSize === 'content') {
      record.node.style.height = '';
    }
    fitRenderedWindow(record);
    const geometry = measuredGeometry(record);
    const viewport = viewportSize();
    record.node.style.left = `${Math.round(clamp(geometry.left, VIEWPORT_MARGIN, viewport.width - geometry.width - VIEWPORT_MARGIN))}px`;
    record.node.style.top = `${Math.round(clamp(geometry.top, VIEWPORT_MARGIN, viewport.height - geometry.height - VIEWPORT_MARGIN))}px`;
    record.overflow?.updateSoon?.();
    return true;
  }

  function requestContentFit(id, { resetHeight = false } = {}) {
    const record = records.get(String(id || ''));
    if (!record || record.node.hidden) return false;
    record.fitResetHeight ||= resetHeight === true;
    if (record.fitFrameId !== null) return true;
    record.fitFrameId = requestFrame(() => {
      record.fitFrameId = null;
      const shouldResetHeight = record.fitResetHeight;
      record.fitResetHeight = false;
      fitContent(record.id, { resetHeight: shouldResetHeight });
    });
    return true;
  }

  function closeAll({ reason = 'programmatic' } = {}) {
    let closedCount = 0;
    [...records.values()].sort((a, b) => windowStack.rank(b.node) - windowStack.rank(a.node)).forEach((record) => {
      if (!record.node.hidden && close(record.id, { reason })) closedCount += 1;
    });
    return closedCount;
  }


  function isOpen(id) {
    const record = records.get(String(id || ''));
    return Boolean(record && !record.node.hidden);
  }

  function updateOverflow(id = activeWindowId) {
    const record = records.get(String(id || ''));
    if (!record) return false;
    record.overflow?.updateSoon?.();
    return true;
  }

  function revealContent(id, target = null) {
    const record = records.get(String(id || ''));
    if (!record || record.node.hidden || (target && !record.body.contains(target))) return false;
    const body = record.body;
    if (!target) {
      body.scrollTop = 0;
      return true;
    }
    const header = body.querySelector('.bb-floating-window-content__head');
    const headerHeight = header?.getBoundingClientRect().height ?? 0;
    body.scrollTop = Math.max(0, body.scrollTop + target.getBoundingClientRect().top
      - body.getBoundingClientRect().top - headerHeight);
    return true;
  }

  function destroy() {
    closeAll({ reason: 'destroy' });
    records.forEach((record) => {
      record.overflow?.destroy?.();
      record.router.destroy();
      windowStack.unmount(record.node);
    });
    records.clear();
    activeWindowId = '';
    windowStack = null;
  }

  return {
    close,
    closeActive,
    closeAll,
    destroy,
    element: (id) => records.get(String(id || ''))?.node ?? null,
    fitContent,
    isOpen,
    open,
    requestContentFit,
    revealContent,
    updateOverflow
  };
}

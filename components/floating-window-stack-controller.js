export function createFloatingWindowStackController({
  floatingWindowController,
  logInteraction = null
} = {}) {
  const records = new Map();

  function log(event, payload = {}) {
    logInteraction?.(event, {
      category: 'ui',
      level: payload.level ?? 'detailed',
      source: 'floating-window-stack-controller',
      listenerFile: 'components/floating-window-stack-controller.js',
      listenerName: 'createFloatingWindowStackController',
      ...payload
    });
  }

  function disposeView(record) {
    try {
      record.cleanup?.();
    } catch (error) {
      log('floating-window-stack-cleanup-failed', {
        level: 'error',
        windowId: record.id,
        message: String(error?.message || error),
        outcome: 'view-cleanup-threw'
      });
    }
    record.cleanup = null;
  }

  function notifyClosed(record, reason) {
    const callback = record.onClose;
    disposeView(record);
    record.views = [];
    record.body = null;
    record.onClose = null;
    try {
      callback?.({ reason, windowId: record.id });
    } catch (error) {
      log('floating-window-stack-close-owner-failed', {
        level: 'error',
        windowId: record.id,
        reason,
        message: String(error?.message || error),
        outcome: 'close-owner-threw'
      });
    }
    log('floating-window-stack-closed', {
      windowId: record.id,
      reason,
      outcome: 'stack-cleared'
    });
  }

  function render(record, reason = 'rendered') {
    const view = record.views.at(-1);
    if (!view) return false;
    disposeView(record);
    const opened = floatingWindowController?.open?.({
      id: record.id,
      ariaLabel: view.ariaLabel || record.ariaLabel,
      context: {
        ...record.context,
        ...view.context,
        stackDepth: record.views.length,
        stackViewId: view.id
      },
      source: view.source || record.source,
      onRequestClose: record.onRequestClose,
      onClose: ({ reason: closeReason = 'floating-window-closed' } = {}) => {
        notifyClosed(record, closeReason);
      },
      renderContent: (body) => {
        record.body = body;
        const cleanup = view.renderContent?.(body, {
          depth: record.views.length,
          viewId: view.id,
          windowId: record.id
        });
        record.cleanup = typeof cleanup === 'function' ? cleanup : null;
      }
    }) === true;
    log('floating-window-stack-rendered', {
      windowId: record.id,
      viewId: view.id,
      depth: record.views.length,
      reason,
      outcome: opened ? 'presented' : 'floating-window-rejected'
    });
    return opened;
  }

  function open({
    ariaLabel = 'Tools',
    context = {},
    id = '',
    onClose = null,
    onRequestClose = null,
    renderContent = null,
    source = 'unknown',
    viewId = 'root'
  } = {}) {
    const windowId = String(id || '').trim();
    if (!windowId || typeof renderContent !== 'function') {
      log('floating-window-stack-open-failed', {
        level: 'error',
        windowId,
        outcome: !windowId ? 'window-id-required' : 'root-renderer-required'
      });
      return false;
    }
    let record = records.get(windowId);
    if (!record) {
      record = {
        ariaLabel,
        body: null,
        cleanup: null,
        context,
        id: windowId,
        onClose,
        onRequestClose,
        source,
        views: []
      };
      records.set(windowId, record);
    } else if (record.views.length) {
      notifyClosed(record, 'replaced');
    }
    record.ariaLabel = ariaLabel;
    record.context = context;
    record.onClose = onClose;
    record.onRequestClose = onRequestClose;
    record.source = source;
    record.views = [{
      ariaLabel,
      context,
      id: String(viewId || 'root'),
      renderContent,
      source
    }];
    return render(record, 'stack-opened');
  }

  function push(id, {
    ariaLabel = '',
    context = {},
    renderContent = null,
    source = 'floating-window-stack',
    viewId = ''
  } = {}) {
    const record = records.get(String(id || ''));
    if (!record?.views.length || typeof renderContent !== 'function') {
      log('floating-window-stack-push-failed', {
        level: 'error',
        windowId: String(id || ''),
        outcome: !record?.views.length ? 'stack-not-open' : 'view-renderer-required'
      });
      return false;
    }
    const nextId = String(viewId || `view-${record.views.length + 1}`);
    record.views.push({
      ariaLabel: ariaLabel || record.ariaLabel,
      context,
      id: nextId,
      renderContent,
      source
    });
    return render(record, 'view-pushed');
  }

  function back(id, { reason = 'back' } = {}) {
    const record = records.get(String(id || ''));
    if (!record || record.views.length <= 1) return false;
    const removed = record.views.pop();
    const rendered = render(record, reason);
    log('floating-window-stack-popped', {
      windowId: record.id,
      removedViewId: removed.id,
      activeViewId: record.views.at(-1)?.id || '',
      depth: record.views.length,
      reason,
      outcome: rendered ? 'previous-view-presented' : 'render-rejected'
    });
    return rendered;
  }

  function backToRoot(id, { reason = 'back-to-root' } = {}) {
    const record = records.get(String(id || ''));
    if (!record?.views.length) return false;
    const removedCount = Math.max(0, record.views.length - 1);
    record.views.splice(1);
    const rendered = render(record, reason);
    log('floating-window-stack-reset', {
      windowId: record.id,
      removedCount,
      reason,
      outcome: rendered ? 'root-view-presented' : 'render-rejected'
    });
    return rendered;
  }

  function close(id, options = {}) {
    return floatingWindowController?.close?.(id, options) === true;
  }

  function destroy() {
    records.forEach((record) => {
      if (floatingWindowController?.isOpen?.(record.id)) {
        floatingWindowController.close(record.id, { reason: 'stack-controller-destroyed' });
      } else {
        notifyClosed(record, 'stack-controller-destroyed');
      }
    });
    records.clear();
  }

  return {
    back,
    backToRoot,
    close,
    depth: (id) => records.get(String(id || ''))?.views.length ?? 0,
    destroy,
    isOpen: (id) => Boolean(records.get(String(id || ''))?.views.length),
    open,
    push
  };
}

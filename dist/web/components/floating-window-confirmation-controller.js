import { createComponentEvents } from './component-events.js';
import { floatingWindowConfirmationMarkup } from './floating-window.js';

export function createFloatingWindowConfirmationController({
  bindEvent = null,
  floatingWindowController,
  logInteraction = null
} = {}) {
  let activeClose = null;
  let activeRequestId = 0;

  function log(event, payload = {}) {
    logInteraction?.(event, {
      category: 'ui',
      level: payload.level ?? 'detailed',
      source: 'floating-window-confirmation-controller',
      listenerFile: 'components/floating-window-confirmation-controller.js',
      listenerName: 'createFloatingWindowConfirmationController',
      ...payload
    });
  }

  function open({
    backLabel = 'Back',
    parentWindow = null,
    cancelLabel = 'Cancel',
    showCancel = true,
    onClose = null,
    confirmDanger = false,
    confirmLabel = 'Confirm',
    context = {},
    description = '',
    helpLink = null,
    downstreamOwner = 'unknown',
    id = 'confirmation',
    onConfirm = null,
    onSecondary = null,
    secondaryDanger = false,
    secondaryLabel = '',
    source = 'unknown',
    title = 'Confirm action'
  } = {}) {
    if (parentWindow && (typeof parentWindow.stack?.push !== 'function'
      || typeof parentWindow.stack?.back !== 'function' || !parentWindow.stack.isOpen(parentWindow.id))) return false;
    activeClose?.('confirmation-replaced');
    const requestId = activeRequestId += 1;
    let backButton = null;
    let closeReason = '';
    let cancelButton = null;
    let confirmButton = null;
    let secondaryButton = null;
    let confirmed = false;
    let decision = 'cancelled';
    let finished = false;
    let router = null;

    function finish(reason = 'confirmation-cancelled') {
      if (finished) return false;
      finished = true;
      router?.destroy?.();
      if (activeClose === close) activeClose = null;
      log('floating-window-confirmation-closed', {
        confirmed,
        decision,
        context,
        downstreamOwner,
        outcome: confirmed ? 'confirmed' : 'cancelled',
        reason,
        requestId,
        source,
        windowId: id
      });
      onClose?.({ reason, confirmed, decision });
      return true;
    }

    function close(reason = 'confirmation-cancelled') {
      if (finished) return false;
      closeReason = reason;
      if (parentWindow) return parentWindow.stack.back(parentWindow.id, { reason }) === true;
      return floatingWindowController?.close?.(id, { reason }) === true;
    }

    const presentation = {
      ariaLabel: title,
      context,
      id,
      onClose: ({ reason = 'floating-window-closed' } = {}) => finish(reason),
      renderContent: (body) => {
        body.innerHTML = floatingWindowConfirmationMarkup({
          backLabel, showBack: Boolean(parentWindow),
          cancelLabel, showCancel,
          confirmDanger,
          confirmLabel,
          description,
          helpLink,
          id,
          secondaryDanger,
          secondaryLabel,
          title
        });
        const form = body.querySelector('[data-bb-confirm]');
        backButton = body.querySelector('[data-bb-confirm-back]');
        cancelButton = body.querySelector('[data-bb-confirm-cancel]');
        secondaryButton = body.querySelector('[data-bb-confirm-secondary]');
        confirmButton = body.querySelector('[data-bb-confirm-submit]');
        if (!form || (parentWindow && !backButton) || (showCancel && !cancelButton) || !confirmButton || (secondaryLabel && !secondaryButton)) return;

        router = createComponentEvents(bindEvent, {
          label: `floating-window-confirmation:${id}`,
          onError: (error, meta = {}) => {
            log('floating-window-confirmation-router-error', {
              level: 'error',
              downstreamOwner,
              eventName: String(meta.eventName || ''),
              message: String(error?.message || error),
              requestId,
              windowId: id
            });
          }
        });
        if (backButton) router.bind(backButton, 'click', (event) => {
          event.preventDefault?.();
          if (!backButton.disabled) close('confirmation-back');
        });
        router.bind(cancelButton, 'click', (event) => {
          event.preventDefault?.();
          close('confirmation-cancelled');
        });
        if (helpLink) router.bind(body.querySelector('[data-bb-confirm-help]'), 'click', () => {
          log('floating-window-confirmation-help-requested', {
            downstreamOwner, requestId, source, windowId: id, outcome: 'navigation-requested'
          });
        });
        async function dispatchDecision({ button, callback, name }) {
          if (!button || button.disabled) return;
          confirmButton.disabled = true;
          if (backButton) backButton.disabled = true;
          if (cancelButton) cancelButton.disabled = true;
          if (secondaryButton) secondaryButton.disabled = true;
          log('floating-window-confirmation-decision', {
            context,
            downstreamOwner,
            decision: name,
            outcome: 'decision-dispatched',
            requestId,
            source,
            windowId: id
          });
          try {
            const accepted = await callback?.();
            if (finished || activeRequestId !== requestId) return;
            if (accepted === false || accepted?.accepted === false) {
              confirmButton.disabled = false;
              if (backButton) backButton.disabled = false;
              if (cancelButton) cancelButton.disabled = false;
              if (secondaryButton) secondaryButton.disabled = false;
              log('floating-window-confirmation-decision', {
                context,
                decision: name,
                downstreamOwner,
                outcome: String(accepted?.outcome || 'downstream-owner-rejected'),
                requestId,
                source,
                windowId: id
              });
              return;
            }
            const afterClose = typeof accepted?.afterClose === 'function'
              ? accepted.afterClose
              : null;
            confirmed = true;
            decision = name;
            const closed = close(`confirmation-${name}-accepted`);
            if (!closed || !afterClose) return;
            try {
              const transitioned = await afterClose();
              log('floating-window-confirmation-transition', {
                context,
                decision: name,
                downstreamOwner,
                outcome: transitioned === false ? 'downstream-transition-rejected' : 'downstream-transition-completed',
                requestId,
                source,
                windowId: id
              });
            } catch (error) {
              log('floating-window-confirmation-transition', {
                level: 'error',
                context,
                decision: name,
                downstreamOwner,
                message: String(error?.message || error),
                outcome: 'downstream-transition-threw',
                requestId,
                source,
                windowId: id
              });
            }
          } catch (error) {
            if (finished || activeRequestId !== requestId) return;
            confirmButton.disabled = false;
            if (backButton) backButton.disabled = false;
            if (cancelButton) cancelButton.disabled = false;
            if (secondaryButton) secondaryButton.disabled = false;
            log('floating-window-confirmation-decision', {
              level: 'error',
              context,
              decision: name,
              downstreamOwner,
              message: String(error?.message || error),
              outcome: 'downstream-owner-threw',
              requestId,
              source,
              windowId: id
            });
          }
        }
        if (secondaryButton) {
          router.bind(secondaryButton, 'click', (event) => {
            event.preventDefault?.();
            dispatchDecision({
              button: secondaryButton,
              callback: onSecondary,
              name: 'secondary'
            });
          });
        }
        router.bind(form, 'submit', async (event) => {
          event.preventDefault?.();
          await dispatchDecision({
            button: confirmButton,
            callback: onConfirm,
            name: 'confirm'
          });
        });
        return parentWindow ? () => finish(closeReason || 'parent-view-retired') : undefined;
      },
      source
    };
    const opened = (parentWindow
      ? parentWindow.stack.push(parentWindow.id, { ...presentation, viewId: id })
      : floatingWindowController?.open?.(presentation)) === true;

    if (!opened || !router || (parentWindow && !backButton) || (showCancel && !cancelButton) || !confirmButton || (secondaryLabel && !secondaryButton)) {
      router?.destroy?.();
      if (opened) close('confirmation-render-rejected');
      log('floating-window-confirmation-presentation', {
        context,
        downstreamOwner,
        outcome: 'rejected',
        reason: opened ? 'themes-floating-window-content-unavailable' : 'floating-window-unavailable',
        requestId,
        source,
        windowId: id
      });
      return false;
    }

    activeClose = close;
    (cancelButton || confirmButton).focus?.({ preventScroll: true });
    log('floating-window-confirmation-presentation', {
      context,
      downstreamOwner,
      outcome: 'presented',
      requestId,
      source,
      windowId: id
    });
    return true;
  }

  function destroy() {
    activeClose?.('destroy');
  }

  return { destroy, open };
}

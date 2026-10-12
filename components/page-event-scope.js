import { createFocusVisibilityPolicy } from './focus-visibility.js';
import { createInteractionFocusStack } from './interaction-focus-stack.js';

const focusStacks = new WeakMap();
function ownerDocument(target) {
  return target?.ownerDocument ?? target?.document ?? (target?.createElement ? target : globalThis.document);
}

export function interactionFocusStack(target, log = null) {
  const document = ownerDocument(target);
  if (!document) return null;
  let stack = focusStacks.get(document);
  if (!stack) {
    stack = createInteractionFocusStack({ log }); focusStacks.set(document, stack);
    const focusVisibility = document.documentElement
      ? createFocusVisibilityPolicy({ root: document.documentElement }) : null;
    // Capture and routed handlers consult the same receipt. This also covers
    // window capture handlers that run before document capture.
    for (const type of ['keydown', 'keyup', 'keypress', 'pointerdown', 'pointerup', 'click', 'contextmenu']) {
      document.addEventListener?.(type, (event) => {
        if (focusVisibility?.handleEvent(event)) {
          stack.recordInputOrigin(event, focusVisibility.origin);
        }
        stack.capture(event);
      }, true);
    }
  }
  stack.setLog(log);
  return stack;
}

// Move focus to the retained container before replacing its focused contents.
// A background render must never take focus away from a higher layer.
export function retainInteractionFocus(root) {
  const active = root?.ownerDocument?.activeElement;
  const owner = interactionFocusStack(root)?.top();
  if (owner && root?.contains?.(active) && (owner.root === root || owner.root?.contains?.(root))) {
    root.tabIndex = -1;
    root.focus?.({ preventScroll: true });
  }
}

export function createInteractionRouter({
  label = 'interaction-router',
  onError = null,
  eventScope = null
} = {}) {
  let destroyed = false;
  const disposers = [];
  const focusLeases = new Set();

  function bind(target, eventName, handler, options) {
    if (destroyed || !target?.addEventListener || !eventName || typeof handler !== 'function') {
      return () => {};
    }
    interactionFocusStack(target);
    const wrapped = (event) => {
      if (destroyed) return;
      try {
        const stack = interactionFocusStack(target);
        const ownLayer = [...focusLeases].find((lease) => lease.layer === stack?.top());
        if (stack?.allows(event, ownLayer?.layer.root ?? eventScope?.(event, target) ?? target) === false) return;
        handler(event);
      } catch (error) {
        if (!onError) throw error;
        onError(error, {
          label,
          eventName,
          target
        });
      }
    };
    target.addEventListener(eventName, wrapped, options);
    const dispose = () => {
      try {
        target.removeEventListener(eventName, wrapped, options);
      } catch {}
    };
    disposers.push(dispose);
    return dispose;
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    [...focusLeases].reverse().forEach((lease) => lease.release('router-destroyed'));
    while (disposers.length) {
      const dispose = disposers.pop();
      try {
        dispose?.();
      } catch {}
    }
  }

  return {
    bind,
    destroy,
    focus({ root, log, ...options }) {
      const lease = interactionFocusStack(root, log)?.enter({ ...options, root });
      if (!lease) return null;
      const release = lease.release;
      lease.release = (reason) => { focusLeases.delete(lease); release(reason); };
      focusLeases.add(lease);
      return lease;
    },
    label
  };
}

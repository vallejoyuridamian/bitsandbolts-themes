// One input owner across presentation kinds. A receipt keeps the owner stable
// throughout dispatch, even when handling the event removes that owner.
export const OUTSIDE_POINTER_DISPOSITION = Object.freeze({
  consume: 'consume',
  continue: 'continue',
  dismissAndConsume: 'dismiss-and-consume',
  dismissAndContinue: 'dismiss-and-continue'
});
const outsidePointerDispositions = new Set(Object.values(OUTSIDE_POINTER_DISPOSITION));

export function createInteractionFocusStack({ log = null } = {}) {
  const layers = [], receipts = new WeakMap();
  let blockedPointer = false;
  const top = () => layers.at(-1) ?? null;
  const contains = (layer, target) => {
    if (!layer || !target) return false;
    if (layer.root === target) return true;
    // Global handler targets such as Window are EventTargets, not DOM Nodes.
    // Reject them before asking any layer's DOM containment capability.
    if (typeof target.nodeType !== 'number') return false;
    return Boolean(layer.contains?.(target) || layer.root?.contains?.(target));
  };
  function record(event, detail) {
    const key = String(event?.key || '');
    const safeKey = key.length > 1 || event?.ctrlKey || event?.metaKey ? key : key ? 'printable' : '';
    log?.('interaction-focus-decision', { category: 'ui', level: 'normal', source: 'interaction-focus-stack',
      input: event?.type ?? '', key: event?.type?.startsWith('key') ? safeKey : '',
      stack: layers.map(({ id }) => id), ...detail });
  }
  function consume(event, receipt, reason) {
    receipt.consumed = true;
    event.preventDefault?.(); event.stopImmediatePropagation?.(); event.stopPropagation?.();
    record(event, { owner: receipt.owner?.id ?? '', outcome: 'consumed', reason });
    return true;
  }
  function enter({ id, root, contains: ownsTarget, dismiss, history, outsidePointerDisposition = null } = {}) {
    if (!id || !root) throw new TypeError('An interaction layer requires an id and root.');
    const layer = { id: String(id), root, contains: ownsTarget, dismiss, history, outsidePointerDisposition,
      focusBefore: root.ownerDocument?.activeElement ?? null };
    layers.push(layer);
    record(null, { owner: layer.id, outcome: 'entered' });
    if (!contains(layer, root.ownerDocument?.activeElement)) {
      root.tabIndex = -1; root.focus?.({ preventScroll: true });
    }
    let released = false;
    return {
      release(reason = 'closed') {
        if (released) return;
        released = true;
        // Children belong to the parent's lifetime. Close them before removing
        // the parent, so no picker can survive an editor that no longer exists.
        const index = layers.indexOf(layer);
        if (index < 0) return;
        for (const child of layers.slice(index + 1).reverse()) {
          child.dismiss?.('parent-closed');
          const childIndex = layers.indexOf(child);
          if (childIndex >= 0) layers.splice(childIndex, 1);
        }
        layers.splice(layers.indexOf(layer), 1);
        const restore = layer.focusBefore;
        if (restore?.isConnected !== false && (!top() || contains(top(), restore))) restore?.focus?.({ preventScroll: true });
        else top()?.root?.focus?.({ preventScroll: true });
        record(null, { owner: layer.id, outcome: 'released', reason });
      },
      layer, id: layer.id
    };
  }
  function history(direction, event = null, owner = top()) {
    if (!owner) return false;
    record(event, { owner: owner.id, outcome: 'consumed', reason: owner.history ? 'focused-history' : 'focused-history-unavailable', direction });
    owner.history?.(direction, event);
    return true;
  }
  function capture(event) {
    if (receipts.has(event)) return receipts.get(event);
    const receipt = { owner: top(), consumed: false }; receipts.set(event, receipt);
    if (event.type === 'pointerdown') {
      blockedPointer = false;
      const owner = receipt.owner;
      if (owner && !contains(owner, event.target)) {
        const disposition = owner.outsidePointerDisposition?.(event)
          ?? OUTSIDE_POINTER_DISPOSITION.consume;
        if (!outsidePointerDispositions.has(disposition)) {
          throw new TypeError(`Unknown outside pointer disposition: ${disposition}`);
        }
        if (disposition === OUTSIDE_POINTER_DISPOSITION.dismissAndConsume
          || disposition === OUTSIDE_POINTER_DISPOSITION.dismissAndContinue) owner.dismiss?.('outside-pointer');
        if (disposition === OUTSIDE_POINTER_DISPOSITION.continue
          || disposition === OUTSIDE_POINTER_DISPOSITION.dismissAndContinue) {
          receipt.backgroundPointer = true;
          record(event, { owner: owner.id, outcome: 'continued', reason: disposition });
        } else {
          blockedPointer = true;
          consume(event, receipt, disposition === OUTSIDE_POINTER_DISPOSITION.dismissAndConsume
            ? 'outside-dismissal'
            : 'focused-layer-boundary');
        }
      }
      return receipt;
    }
    if (blockedPointer && ['pointerup', 'click', 'contextmenu'].includes(event.type)) {
      consume(event, receipt, 'outside-dismissal-sequence');
      if (event.type === 'click' || event.type === 'contextmenu') blockedPointer = false;
      return receipt;
    }
    if (!receipt.owner || !['keydown', 'keyup', 'keypress'].includes(event.type)) return receipt;
    const owner = receipt.owner;
    if (event.type === 'keydown' && !event.isComposing) {
      const key = String(event.key || '').toLowerCase(), mod = event.ctrlKey || event.metaKey;
      if (event.key === 'Escape') {
        // Consume before invoking a callback that changes the stack.
        consume(event, receipt, 'dismiss-focused-layer');
        if (!event.repeat) owner.dismiss?.('escape');
        return receipt;
      }
      if (mod && !event.altKey && (key === 'z' || key === 'y')) {
        const action = key === 'y' || event.shiftKey ? 'redo' : 'undo';
        consume(event, receipt, owner.history ? 'focused-history' : 'focused-history-unavailable');
        history(action, event, owner); return receipt;
      }
    }
    if (!contains(owner, event.target)) consume(event, receipt, 'key-outside-focused-layer');
    return receipt;
  }
  function allows(event, handlerRoot) {
    const receipt = capture(event);
    if (receipt.consumed) return false;
    if (!receipt.owner || !event.type?.startsWith('key')) return true;
    const allowed = contains(receipt.owner, handlerRoot);
    if (!allowed) record(event, { owner: receipt.owner.id, outcome: 'blocked-lower-handler', reason: 'focused-layer-boundary' });
    return allowed;
  }
  return {
    enter, capture, allows, history, top,
    recordInputOrigin(event, origin) {
      record(event, { owner: 'focus-visibility', outcome: origin, reason: 'input-origin-transition' });
    },
    setLog(value) { if (value) log = value; },
    snapshot: () => layers.map(({ id }) => id)
  };
}

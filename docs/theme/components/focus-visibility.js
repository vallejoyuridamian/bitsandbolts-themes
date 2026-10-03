// Tab navigation alone admits focus hulls. DOM focus and native actions remain native.
// Other keys preserve existing admission; pointer activation clears it.

export function createFocusVisibilityPolicy({ root } = {}) {
  if (!root?.setAttribute) throw new TypeError('Focus visibility requires a document root.');
  let origin = 'pointer';
  root.setAttribute('data-bb-focus-origin', origin);
  return Object.freeze({
    get origin() { return origin; },
    handleEvent(event) {
      const next = event?.type === 'pointerdown' ? 'pointer'
        : event?.type === 'keydown' && event.key === 'Tab' && !event.isComposing
          && !(event.ctrlKey || event.metaKey || event.altKey)
          ? 'keyboard' : origin;
      if (next === origin) return false;
      origin = next;
      root.setAttribute('data-bb-focus-origin', origin);
      return true;
    }
  });
}

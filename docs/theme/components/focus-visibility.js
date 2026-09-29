// Input origin owns focus presentation. DOM focus and native actions remain native.
// Modifier keys do not express keyboard navigation, including Shift+wheel.
const MODIFIER_KEYS = new Set(['Shift', 'Control', 'Alt', 'Meta', 'AltGraph', 'CapsLock', 'NumLock', 'ScrollLock']);

export function createFocusVisibilityPolicy({ root } = {}) {
  if (!root?.setAttribute) throw new TypeError('Focus visibility requires a document root.');
  let origin = 'pointer';
  root.setAttribute('data-bb-focus-origin', origin);
  return Object.freeze({
    get origin() { return origin; },
    handleEvent(event) {
      const next = event?.type === 'pointerdown' ? 'pointer'
        : event?.type === 'keydown' && event.key && !MODIFIER_KEYS.has(event.key)
          ? 'keyboard' : origin;
      if (next === origin) return false;
      origin = next;
      root.setAttribute('data-bb-focus-origin', origin);
      return true;
    }
  });
}

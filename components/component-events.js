// Optional web binding adapter. The callback has DOM listener semantics and
// returns an unbind function; no event manager or app policy is required.
export function createComponentEvents(bindEvent = null, { onError = null, label = 'component' } = {}) {
  const disposers = new Set();
  let disposed = false;
  function bind(target, type, handler, options) {
    if (disposed || (!bindEvent && !target?.addEventListener)) return () => {};
    const invoke = event => {
      try { handler(event); }
      catch (error) { if (onError) onError(error, { eventName: type, label, target }); else throw error; }
    };
    const unbind = bindEvent ? bindEvent(target, type, invoke, options) : (() => {
      target.addEventListener(type, invoke, options);
      return () => target.removeEventListener(type, invoke, options);
    })();
    if (typeof unbind !== 'function') throw new TypeError('A component binding callback must return an unbind function.');
    let released = false;
    const release = () => { if (released) return; released = true; disposers.delete(release); unbind(); };
    disposers.add(release); return release;
  }
  return { bind, destroy() { disposed = true; for (const release of [...disposers]) release(); } };
}

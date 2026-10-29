// All controllers in one document share a paint layer and current window order.
const documentStacks = new WeakMap();

export function floatingWindowStack(rootDocument) {
  if (documentStacks.has(rootDocument)) return documentStacks.get(rootDocument);
  const mounted = new Set();
  const order = [];
  let layer = null;

  function syncRanks() {
    order.forEach((node, index) => { node.style.zIndex = String(index + 1); });
  }

  function close(node) {
    const index = order.indexOf(node);
    if (index < 0) return;
    order.splice(index, 1);
    node.style.zIndex = '';
    syncRanks();
  }

  const stack = {
    mount(node) {
      if (mounted.has(node)) return;
      if (!layer) {
        layer = rootDocument.createElement('div');
        layer.className = 'bb-floating-window-layer';
        rootDocument.body.append(layer);
      }
      layer.append(node);
      mounted.add(node);
    },
    raise(node) {
      if (!mounted.has(node) || node.hidden) return;
      const index = order.indexOf(node);
      if (index >= 0) order.splice(index, 1);
      order.push(node);
      syncRanks();
    },
    close,
    rank: node => order.indexOf(node) + 1,
    describe: node => ({ layer: 'floating-window', rank: order.indexOf(node) + 1,
      openWindowCount: order.length }),
    unmount(node) {
      close(node);
      mounted.delete(node);
      node.remove();
      if (!mounted.size) {
        layer?.remove();
        layer = null;
        documentStacks.delete(rootDocument);
      }
    }
  };
  documentStacks.set(rootDocument, stack);
  return stack;
}

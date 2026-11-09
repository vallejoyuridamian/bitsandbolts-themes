import { createComponentEvents } from './component-events.js';

// CSS owns reveal policy (hover, focus, open Select and touch). Read that policy
// only at lifecycle/interaction boundaries, never from the playback tick.
export function createMediaControlsDemand({ root, bindEvent, onChange,
  now = () => performance.now(),
  readStyle = element => root.ownerDocument.defaultView.getComputedStyle(element),
  Observer = globalThis.MutationObserver
} = {}) {
  const events = createComponentEvents(bindEvent);
  const records = [...(root?.querySelectorAll?.('.bb-media-controls-zone') ?? [])].map(zone => ({
    zone, reveal: zone.querySelector('.bb-media-controls-reveal'),
    name: zone.classList.contains('bb-media-transport-zone') ? 'transport' : 'view-controls',
    phase: 'inactive', accountedAt: now(), phaseMs: {}, reads: 0,
    admitted: 0, skipped: 0
  })).filter(record => record.reveal);
  let active = false;
  let disposed = false;
  let refreshRevision = 0;
  const observer = Observer ? new Observer(recordsChanged => {
    const changed = recordsChanged.filter(record => record.target.matches?.('.bb-select'));
    if (changed.length) refresh('select-state', records.filter(record =>
      changed.some(change => record.zone.contains(change.target))));
  }) : null;

  function account(record) {
    const at = now();
    record.phaseMs[record.phase] = (record.phaseMs[record.phase] ?? 0) + Math.max(0, at - record.accountedAt);
    record.accountedAt = at;
  }
  function publish(record, phase, reason) {
    if (record.phase === phase) return;
    account(record);
    record.phase = phase;
    onChange?.({ zone: record.name, phase, reason,
      visibleWork: !['hidden', 'inactive'].includes(phase) });
  }
  function refresh(reason = 'boundary', affected = records) {
    if (disposed) return;
    const revision = ++refreshRevision;
    // Read the affected CSS states together before consumer callbacks can write
    // presentation. A local boundary never measures an unrelated control zone.
    const states = affected.map(record => {
      if (!active || root.hidden || root.ownerDocument.hidden) {
        return [record, 'inactive'];
      }
      const style = readStyle(record.reveal);
      record.reads++;
      const target = Number(style.getPropertyValue('--bb-media-controls-opacity')) > 0;
      const opacity = Number(style.opacity);
      return [record, target ? (opacity < 1 ? 'revealing' : 'visible')
        : opacity > 0 ? 'hiding' : 'hidden'];
    });
    for (const [record, phase] of states) {
      if (disposed || revision !== refreshRevision) return;
      publish(record, phase, reason);
    }
  }
  for (const record of records) {
    for (const type of ['pointerenter', 'pointerleave', 'focusin', 'focusout']) {
      events.bind(record.zone, type, () => refresh(type, [record]));
    }
    for (const type of ['transitionrun', 'transitionend', 'transitioncancel']) {
      events.bind(record.reveal, type, event => {
        if (event.target === record.reveal && event.propertyName === 'opacity') refresh(type, [record]);
      });
    }
  }
  const view = root?.ownerDocument?.defaultView;
  events.bind(view, 'resize', () => refresh('viewport'));
  if (view?.visualViewport) events.bind(view.visualViewport, 'resize', () => refresh('visual-viewport'));
  events.bind(root?.ownerDocument, 'visibilitychange', () => refresh('document-visibility'));
  const hover = view?.matchMedia?.('(hover: none)');
  if (hover) events.bind(hover, 'change', () => refresh('input-capability'));

  function deactivate(reason = 'deactivate') {
    active = false;
    observer?.disconnect();
    refresh(reason);
  }
  return {
    activate() {
      if (disposed) return;
      active = true;
      for (const record of records) {
        record.accountedAt = now(); record.phaseMs = {};
        record.reads = record.admitted = record.skipped = 0;
      }
      for (const record of records) observer?.observe(record.zone, {
        attributes: true, attributeFilter: ['class'], subtree: true
      });
      refresh('activate');
    },
    deactivate,
    refresh,
    isActive: () => active && !disposed && !root.hidden && !root.ownerDocument.hidden,
    admit(name = 'transport') {
      const record = records.find(record => record.name === name);
      if (!record) return false;
      const admitted = !['inactive', 'hidden'].includes(record.phase);
      record[admitted ? 'admitted' : 'skipped']++;
      return admitted;
    },
    snapshot({ reset = true } = {}) {
      return records.map(record => {
        account(record);
        const result = { zone: record.name, phase: record.phase,
          phaseMs: Object.fromEntries(Object.entries(record.phaseMs).map(([key, value]) => [key, Math.round(value * 10) / 10])),
          styleBoundaryReads: record.reads, admittedUpdates: record.admitted, skippedUpdates: record.skipped };
        if (reset) { record.phaseMs = {}; record.reads = record.admitted = record.skipped = 0; }
        return result;
      });
    },
    destroy() { deactivate('destroy'); disposed = true; events.destroy(); }
  };
}

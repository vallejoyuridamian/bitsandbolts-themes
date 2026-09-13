// Presentation order only. Consumers project any reserved edge priority;
// ordinary entries share start-time order and retain input order on ties.
export function orderedAnimationEntries(entries = [], { priority = (entry) => entry.priority ?? 0, startMs = (entry) => entry.startMs ?? 0 } = {}) {
  return [...entries].sort((left, right) => priority(left) - priority(right) || startMs(left) - startMs(right));
}

export function indexedAnimationLabel(label, id, entries = []) {
  if (entries.length < 2) return label;
  const index = orderedAnimationEntries(entries).findIndex((entry) => entry.id === id);
  return index < 0 ? label : `${label} ${index + 1}`;
}

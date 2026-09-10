function escapeHtml(value = '') {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

export function timelineClock(msValue = 0) {
  const totalSeconds = Math.round(Math.max(0, Number(msValue) || 0) / 1000);
  return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, '0')}`;
}

export class TimelineRuler {
  constructor({ durationMs = 1, targetTicks = 8, classNames = [], contentClassNames = [], data = {} } = {}) {
    this.durationMs = Math.max(1, Number(durationMs) || 1);
    this.targetTicks = Math.max(2, Number(targetTicks) || 8);
    this.classNames = classNames.filter(Boolean);
    this.contentClassNames = contentClassNames.filter(Boolean);
    this.data = data && typeof data === 'object' ? data : {};
  }

  ticksMarkup() {
    const roughStepSeconds = Math.max(1, this.durationMs / this.targetTicks / 1000);
    const steps = [1, 2, 5, 10, 15, 30, 60, 120, 300];
    const stepSeconds = steps.find((candidate) => candidate >= roughStepSeconds)
      ?? Math.ceil(roughStepSeconds / 300) * 300;
    const stepMs = stepSeconds * 1000;
    const ticks = [0];
    // Reserve the terminal label's interval when the duration is off the tick grid.
    for (let value = stepMs; value <= this.durationMs - stepMs / 2; value += stepMs) {
      if (timelineClock(value) !== timelineClock(this.durationMs)) ticks.push(value);
    }
    ticks.push(this.durationMs);
    return ticks.map((value) => `
      <span class="bb-timeline-ruler-tick timeline-ruler-tick" data-ruler-edge="${value === 0 ? 'start' : value === this.durationMs ? 'end' : ''}" data-timeline-mark-ms="${value}" style="left:${(value / this.durationMs * 100).toFixed(4)}%">
        ${escapeHtml(timelineClock(value))}
      </span>
    `).join('');
  }

  markup({ attributes = '' } = {}) {
    const dataAttributes = Object.entries(this.data)
      .filter(([, value]) => value !== null && value !== undefined && value !== '')
      .map(([key, value]) => `data-${key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}="${escapeHtml(value)}"`)
      .join(' ');
    return `
      <div class="bb-timeline-ruler timeline-ruler ${this.classNames.join(' ')}" ${attributes}>
        <div class="bb-timeline-ruler-content timeline-ruler-content ${this.contentClassNames.join(' ')}" data-timeline-total-ms="${this.durationMs}" ${dataAttributes}>
          ${this.ticksMarkup()}
        </div>
      </div>
    `;
  }
}

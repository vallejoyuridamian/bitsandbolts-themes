// Keep the native input as the interaction owner. The separate rail paint can
// be masked beneath its translucent thumb without masking the thumb itself.
export function rangeControlMarkup(inputMarkup) {
  return `<span class="bb-range-control"><span class="bb-range-control__rail" aria-hidden="true"></span>${inputMarkup}</span>`;
}

export function setRangeControlProgress(input, ratio) {
  const position = Math.max(0, Math.min(1, Number(ratio) || 0));
  const host = input?.parentElement;
  if (host?.classList?.contains('bb-range-control')) {
    // Only the rail paints progress. Keep the changing inherited property off
    // the wrapper and native input, which owns its thumb through input.value.
    const rail = host.querySelector(':scope > .bb-range-control__rail');
    const value = String(position);
    if (rail.style.getPropertyValue('--range-control-position') !== value) {
      rail.style.setProperty('--range-control-position', value);
    }
    return input;
  }
  const progress = `${position * 100}%`;
  if (input?.style?.getPropertyValue('--range-control-progress') !== progress) {
    input?.style?.setProperty('--range-control-progress', progress);
  }
  return input;
}

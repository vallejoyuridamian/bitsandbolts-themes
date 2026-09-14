// Keep the native input as the interaction owner. The separate rail paint can
// be masked beneath its translucent thumb without masking the thumb itself.
export function rangeControlMarkup(inputMarkup) {
  return `<span class="bb-range-control"><span class="bb-range-control__rail" aria-hidden="true"></span>${inputMarkup}</span>`;
}

export function setRangeControlProgress(input, ratio) {
  const position = Math.max(0, Math.min(1, Number(ratio) || 0));
  const host = input?.parentElement;
  const progress = `${position * 100}%`;
  if (input?.style?.getPropertyValue('--range-control-progress') !== progress) {
    input?.style?.setProperty('--range-control-progress', progress);
  }
  if (host?.classList?.contains('bb-range-control')) {
    const value = String(position);
    if (host.style.getPropertyValue('--range-control-position') !== value) {
      host.style.setProperty('--range-control-position', value);
    }
  }
  return input;
}

export const ATTENTION_PULSE_ANIMATION = 'bb-attention-pulse';
export const ATTENTION_PULSE_CLASS = 'bb-attention-pulse';
const attentionTimers = new WeakMap();

export function navigateToAttention(element, {
  focus = true,
  scroll = { behavior: 'smooth', block: 'center', inline: 'nearest' },
  scheduleClear = (callback, delay) => setTimeout(callback, delay)
} = {}) {
  if (!element) return false;
  element.scrollIntoView?.(scroll);
  if (focus) element.focus?.({ preventScroll: true });
  presentAttentionPulse(element);
  const previous = attentionTimers.get(element);
  if (previous) clearTimeout(previous);
  const timer = scheduleClear(() => {
    clearAttentionPulse(element);
    attentionTimers.delete(element);
  }, 1000);
  attentionTimers.set(element, timer);
  return true;
}

export function presentAttentionPulse(element) {
  if (!element?.classList) return false;
  element.classList.add(ATTENTION_PULSE_CLASS);
  const pulse = element.getAnimations?.()
    .find((animation) => animation.animationName === ATTENTION_PULSE_ANIMATION);
  if (pulse) pulse.currentTime = 0;
  return true;
}

export function clearAttentionPulse(element) {
  if (!element?.classList) return false;
  element.classList.remove(ATTENTION_PULSE_CLASS);
  return true;
}

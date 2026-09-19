export const ATTENTION_PULSE_ANIMATION = 'bb-attention-pulse';
export const ATTENTION_PULSE_CLASS = 'bb-attention-pulse';

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

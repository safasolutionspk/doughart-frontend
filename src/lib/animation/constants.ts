/** Shared motion tokens for scroll and mount reveals */
export const MOTION_DURATION_MS = 1000;
export const MOTION_DURATION_CSS = "1s";
export const MOTION_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
export const MOTION_STAGGER_DEFAULT = 0.1;
export const MOTION_STAGGER_MAX_DELAY = 0.8;
export const MOTION_TEXT_OFFSET = 45;
export const MOTION_CARD_OFFSET = 70;
export const WORD_STAGGER_DEFAULT = 0.1;

export const REVEAL_OBSERVER_OPTIONS: IntersectionObserverInit = {
  threshold: 0.15,
  rootMargin: "0px 0px -5% 0px",
};

/** Cap stagger so large grids do not delay too long */
export function capStaggerDelay(
  index: number,
  stagger = MOTION_STAGGER_DEFAULT,
  max = MOTION_STAGGER_MAX_DELAY,
): number {
  return Math.min(index * stagger, max);
}

// Helper Vibration API : pattern par evenement.
// Auto no-op si l'API n'est pas dispo ou si l'utilisateur a desactive.

let enabled = true;

export function setVibrationEnabled(v: boolean) {
  enabled = v;
}

export function isVibrationEnabled(): boolean {
  return enabled;
}

function vibrate(pattern: number | number[]) {
  if (!enabled) return;
  if (typeof navigator === 'undefined') return;
  if (!('vibrate' in navigator)) return;
  try {
    (navigator as Navigator).vibrate(pattern);
  } catch {
    /* ignore */
  }
}

export const haptic = {
  tap: () => vibrate(8),
  buy: () => vibrate(20),
  levelUp: () => vibrate([50, 30, 50]),
  rankUp: () => vibrate([60, 40, 60, 40, 120]),
  bossKill: () => vibrate([100, 50, 100, 50, 200]),
  error: () => vibrate([20, 30, 20]),
  rare: () => vibrate([40, 40, 40, 40, 40]),
};

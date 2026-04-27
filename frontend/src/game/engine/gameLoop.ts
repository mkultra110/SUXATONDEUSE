// Boucle de jeu fixed-step (cf. GDD section 8.2).
// La logique tourne a 10 Hz pour le determinisme et la testabilite,
// le rendering reste libre via PixiJS Ticker.

import { TICK_INTERVAL_MS } from '@robomow/shared';
import { useGameStore } from '../../stores/gameStore.js';

let rafId: number | null = null;
let lastTime = 0;
let accumulator = 0;
let running = false;

export function startGameLoop(): void {
  if (running) return;
  running = true;
  lastTime = performance.now();
  accumulator = 0;
  rafId = requestAnimationFrame(loop);
}

export function stopGameLoop(): void {
  running = false;
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

function loop(now: number): void {
  if (!running) return;
  // Cap du delta pour eviter les spirales lors des changements d'onglet
  // (rAF est throttle a 1Hz quand l'onglet est inactif).
  const dt = Math.min(now - lastTime, 1000);
  lastTime = now;
  accumulator += dt;

  // Pas fixe pour la logique
  while (accumulator >= TICK_INTERVAL_MS) {
    useGameStore.getState().tick(TICK_INTERVAL_MS / 1000);
    accumulator -= TICK_INTERVAL_MS;
  }

  rafId = requestAnimationFrame(loop);
}

/**
 * Catch-up offline : applique en un tick agrege la production
 * accumulee pendant l'absence (cap par offline_multiplier).
 */
export function catchUpOffline(elapsedSeconds: number): void {
  if (elapsedSeconds <= 0) return;
  // En PHASE 1 on utilise 100 % cap 12h (cf. lecons.md). On ne calcule
  // pas via offlineGain ici car le store gere directement la production
  // en fonction du state present.
  const capSeconds = 12 * 3600;
  const cappedDt = Math.min(elapsedSeconds, capSeconds);
  useGameStore.getState().tick(cappedDt);
}

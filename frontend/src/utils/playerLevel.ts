// Calcul du niveau joueur a partir du cash total gagne (lifetime).
// Progression logarithmique : chaque niveau coute 1.6x le precedent.
// Niveau 1 a 0 cash, niveau 10 a ~100K, niveau 100 a ~1e22.
//
// Bonus visuel : a chaque palier de 10 (10/20/30/...) la palette du jardin
// gagne en richesse (plus de fleurs, papillons, lanternes, etc.).

import type Decimal from 'break_infinity.js';

const BASE = 50; // cout du niveau 2
const GROWTH = 1.6;

export function computePlayerLevel(totalCash: Decimal): number {
  const n = Number(totalCash.toString());
  if (!Number.isFinite(n) || n < BASE) return 1;
  // Inverse de la formule somme geometrique : level = log(n*(g-1)/B + 1) / log(g)
  const level = Math.log((n * (GROWTH - 1)) / BASE + 1) / Math.log(GROWTH);
  return Math.max(1, Math.floor(level) + 1);
}

export function nextLevelCost(currentLevel: number): number {
  return Math.floor(BASE * Math.pow(GROWTH, currentLevel - 1));
}

export function xpRatioInLevel(totalCash: Decimal, currentLevel: number): number {
  const n = Number(totalCash.toString());
  if (!Number.isFinite(n)) return 0;
  // Cumul cash necessaire pour atteindre currentLevel.
  const sumPrev =
    currentLevel <= 1
      ? 0
      : (BASE * (Math.pow(GROWTH, currentLevel - 1) - 1)) / (GROWTH - 1);
  const nextCost = nextLevelCost(currentLevel);
  if (nextCost === 0) return 0;
  return Math.min(1, Math.max(0, (n - sumPrev) / nextCost));
}

// Tier visuel base sur le niveau (utilise par AnimatedGarden pour scale les
// decors : plus de fleurs / papillons / lanternes a chaque palier).
export type ProgressionTier = 'starter' | 'cozy' | 'bountiful' | 'lush' | 'legendary';

export function progressionTier(level: number): ProgressionTier {
  if (level >= 50) return 'legendary';
  if (level >= 25) return 'lush';
  if (level >= 10) return 'bountiful';
  if (level >= 5) return 'cozy';
  return 'starter';
}

export const TIER_FLOWERS_COUNT: Record<ProgressionTier, number> = {
  starter: 0,
  cozy: 4,
  bountiful: 10,
  lush: 18,
  legendary: 28,
};

export const TIER_BUTTERFLIES: Record<ProgressionTier, number> = {
  starter: 1,
  cozy: 3,
  bountiful: 5,
  lush: 8,
  legendary: 12,
};

export const TIER_LANTERNS: Record<ProgressionTier, number> = {
  starter: 1,
  cozy: 2,
  bountiful: 3,
  lush: 4,
  legendary: 6,
};

export const TIER_LABEL: Record<ProgressionTier, string> = {
  starter: 'Débutant',
  cozy: 'Cozy',
  bountiful: 'Florissant',
  lush: 'Luxuriant',
  legendary: 'Légendaire',
};

export const TIER_GLOW: Record<ProgressionTier, string> = {
  starter: 'transparent',
  cozy: 'rgba(143, 191, 79, 0.15)',
  bountiful: 'rgba(245, 196, 67, 0.2)',
  lush: 'rgba(245, 196, 67, 0.35)',
  legendary: 'rgba(245, 196, 67, 0.55)',
};

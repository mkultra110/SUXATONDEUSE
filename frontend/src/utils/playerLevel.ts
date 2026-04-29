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

// Rangs cottagecore visibles dans la TopBar (signature progression).
export interface RankInfo {
  title: string;
  color: string;
  minLevel: number;
}

export const RANKS: ReadonlyArray<RankInfo> = [
  { title: 'Débutant', color: '#A37C4F', minLevel: 1 },
  { title: 'Apprenti', color: '#8FBF4F', minLevel: 5 },
  { title: 'Fermier', color: '#6BA53A', minLevel: 10 },
  { title: 'Vétéran', color: '#4A8A2E', minLevel: 25 },
  { title: 'Maître', color: '#FFD921', minLevel: 50 },
  { title: 'Légendaire', color: '#F5C443', minLevel: 75 },
  { title: 'Mythique', color: '#A855F7', minLevel: 100 },
  { title: 'Divin', color: '#FFFFFF', minLevel: 150 },
];

export function rankForLevel(level: number): RankInfo {
  let current = RANKS[0]!;
  for (const r of RANKS) {
    if (level >= r.minLevel) current = r;
    else break;
  }
  return current;
}

export function nextRankAt(level: number): RankInfo | null {
  for (const r of RANKS) {
    if (level < r.minLevel) return r;
  }
  return null;
}

// Bordure shine pour les shop cards selon le count owned d'un robot.
export type RobotShine = 'none' | 'bronze' | 'silver' | 'gold' | 'diamond';

export function shineForCount(count: number): RobotShine {
  if (count >= 50) return 'diamond';
  if (count >= 25) return 'gold';
  if (count >= 10) return 'silver';
  if (count >= 5) return 'bronze';
  return 'none';
}

export const SHINE_COLOR: Record<RobotShine, string> = {
  none: 'transparent',
  bronze: '#A57144',
  silver: '#B8C4D0',
  gold: '#FFD921',
  diamond: '#A8D8EE',
};

export const SHINE_GLOW: Record<RobotShine, string> = {
  none: 'transparent',
  bronze: 'rgba(165, 113, 68, 0.5)',
  silver: 'rgba(184, 196, 208, 0.6)',
  gold: 'rgba(255, 217, 33, 0.7)',
  diamond: 'rgba(168, 216, 238, 0.8)',
};

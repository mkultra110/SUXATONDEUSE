// Tests de la progression joueur (niveau, XP, rangs, paliers visuels).
import { describe, expect, it } from 'vitest';
import Decimal from 'break_infinity.js';
import {
  computePlayerLevel,
  nextLevelCost,
  xpRatioInLevel,
  progressionTier,
  rankForLevel,
  nextRankAt,
  shineForCount,
} from '../utils/playerLevel.js';

describe('computePlayerLevel', () => {
  it('reste au niveau 1 en dessous du cout du niveau 2', () => {
    expect(computePlayerLevel(new Decimal(0))).toBe(1);
    expect(computePlayerLevel(new Decimal(49))).toBe(1);
  });

  it('passe niveau 2 au seuil de 50 cash', () => {
    expect(computePlayerLevel(new Decimal(50))).toBe(2);
  });

  it('croit de maniere monotone avec le cash', () => {
    const l1 = computePlayerLevel(new Decimal(1_000));
    const l2 = computePlayerLevel(new Decimal(1_000_000));
    const l3 = computePlayerLevel(new Decimal(1e12));
    expect(l1).toBeLessThan(l2);
    expect(l2).toBeLessThan(l3);
  });

  it('renvoie 1 pour une valeur non finie', () => {
    expect(computePlayerLevel(new Decimal(Infinity))).toBe(1);
  });
});

describe('nextLevelCost', () => {
  it('suit la croissance geometrique x1.6', () => {
    expect(nextLevelCost(1)).toBe(50);
    expect(nextLevelCost(2)).toBe(80);
    expect(nextLevelCost(3)).toBe(128);
  });
});

describe('xpRatioInLevel', () => {
  it('reste borne entre 0 et 1', () => {
    for (const cash of [0, 50, 500, 1e6, 1e12]) {
      const lvl = computePlayerLevel(new Decimal(cash));
      const ratio = xpRatioInLevel(new Decimal(cash), lvl);
      expect(ratio).toBeGreaterThanOrEqual(0);
      expect(ratio).toBeLessThanOrEqual(1);
    }
  });
});

describe('progressionTier', () => {
  it('mappe le niveau vers le bon palier visuel', () => {
    expect(progressionTier(1)).toBe('starter');
    expect(progressionTier(4)).toBe('starter');
    expect(progressionTier(5)).toBe('cozy');
    expect(progressionTier(10)).toBe('bountiful');
    expect(progressionTier(25)).toBe('lush');
    expect(progressionTier(50)).toBe('legendary');
  });
});

describe('rankForLevel / nextRankAt', () => {
  it('renvoie le rang courant selon les seuils', () => {
    expect(rankForLevel(1).title).toBe('Débutant');
    expect(rankForLevel(5).title).toBe('Apprenti');
    expect(rankForLevel(100).title).toBe('Mythique');
    expect(rankForLevel(200).title).toBe('Divin');
  });

  it('renvoie le prochain rang a atteindre, ou null au sommet', () => {
    expect(nextRankAt(1)?.title).toBe('Apprenti');
    expect(nextRankAt(200)).toBeNull();
  });
});

describe('shineForCount', () => {
  it('mappe le nombre de robots possedes vers la brillance', () => {
    expect(shineForCount(4)).toBe('none');
    expect(shineForCount(5)).toBe('bronze');
    expect(shineForCount(10)).toBe('silver');
    expect(shineForCount(25)).toBe('gold');
    expect(shineForCount(50)).toBe('diamond');
  });
});

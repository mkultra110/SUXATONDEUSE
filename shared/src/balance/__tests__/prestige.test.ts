import { describe, expect, it } from 'vitest';
import {
  calculatePrestigeSeeds,
  nodeCost,
  prestigeMultiplier,
  shouldRecommendPrestige,
} from '../prestige.js';

describe('calculatePrestigeSeeds', () => {
  it('retourne 0 sous le seuil de 1G', () => {
    expect(calculatePrestigeSeeds(999_999_999n, 0n)).toBe(0n);
  });

  it('retourne 150 a exactement 1G earnings', () => {
    expect(calculatePrestigeSeeds(1_000_000_000n, 0n)).toBe(150n);
  });

  it('retourne ~300 a 4G earnings (sqrt(4) * 150)', () => {
    expect(calculatePrestigeSeeds(4_000_000_000n, 0n)).toBe(300n);
  });

  it('soustrait les graines deja depensees', () => {
    expect(calculatePrestigeSeeds(4_000_000_000n, 100n)).toBe(200n);
  });

  it('ne retourne jamais une valeur negative', () => {
    expect(calculatePrestigeSeeds(1_000_000_000n, 1000n)).toBe(0n);
  });
});

describe('prestigeMultiplier', () => {
  it('retourne 1 si aucun bonus', () => {
    expect(
      prestigeMultiplier({ seedsInMultiplierTree: 0, achievementsUnlocked: 0, petsCount: 0 }),
    ).toBe(1);
  });

  it('applique +2 % par graine en multiplier tree', () => {
    expect(
      prestigeMultiplier({ seedsInMultiplierTree: 10, achievementsUnlocked: 0, petsCount: 0 }),
    ).toBeCloseTo(1.2);
  });

  it('cumule les bonus', () => {
    expect(
      prestigeMultiplier({ seedsInMultiplierTree: 10, achievementsUnlocked: 5, petsCount: 2 }),
    ).toBeCloseTo(1 + 0.2 + 0.05 + 0.2);
  });
});

describe('nodeCost', () => {
  it('cout 1 pour le 1er node', () => {
    expect(nodeCost(0)).toBe(1n);
  });

  it('cout escalade x5', () => {
    expect(nodeCost(1)).toBe(5n);
    expect(nodeCost(2)).toBe(25n);
    expect(nodeCost(3)).toBe(125n);
    expect(nodeCost(4)).toBe(625n);
  });

  it('rejette les indices negatifs', () => {
    expect(() => nodeCost(-1)).toThrow();
  });
});

describe('shouldRecommendPrestige', () => {
  it('recommande si aucune graine actuelle et projection > 0', () => {
    expect(shouldRecommendPrestige(0n, 1n)).toBe(true);
  });

  it('ne recommande pas si projection < 2x current', () => {
    expect(shouldRecommendPrestige(100n, 150n)).toBe(false);
  });

  it('recommande si projection >= 2x current', () => {
    expect(shouldRecommendPrestige(100n, 200n)).toBe(true);
  });
});

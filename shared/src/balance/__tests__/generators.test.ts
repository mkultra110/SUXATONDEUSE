// Tests des formules de cout des generateurs.
// Coverage cible : 100 % (cf. GDD section 13.1).

import { describe, expect, it } from 'vitest';
import {
  bulkCost,
  generatorCost,
  maxAffordable,
  scaleBigInt,
  sellValue,
} from '../generators.js';

describe('generatorCost', () => {
  it('retourne le cout de base pour 0 unite possedee', () => {
    expect(generatorCost(60n, 1.15, 0)).toBe(60n);
  });

  it('applique r^N pour 1 unite possedee', () => {
    // 60 * 1.15 = 69
    expect(generatorCost(60n, 1.15, 1)).toBe(69n);
  });

  it('applique r^N pour 5 unites possedees', () => {
    // 60 * 1.15^5 ~= 120.68 -> 120
    const result = generatorCost(60n, 1.15, 5);
    expect(result).toBeGreaterThanOrEqual(120n);
    expect(result).toBeLessThanOrEqual(121n);
  });

  it('rejette ownedCount negatif', () => {
    expect(() => generatorCost(60n, 1.15, -1)).toThrow();
  });

  it('gere les baseCost en BigInt large', () => {
    const result = generatorCost(1_000_000_000_000n, 1.07, 10);
    expect(result).toBeGreaterThan(1_000_000_000_000n);
  });
});

describe('bulkCost', () => {
  it('retourne 0 pour bulkSize = 0', () => {
    expect(bulkCost(60n, 1.15, 0, 0)).toBe(0n);
  });

  it('correspond a generatorCost pour bulkSize = 1', () => {
    const single = generatorCost(60n, 1.15, 0);
    const bulk = bulkCost(60n, 1.15, 0, 1);
    expect(bulk).toBe(single);
  });

  it('approxime la somme manuelle pour bulkSize = 3', () => {
    // c0 + c1 + c2 = 60 + 69 + 79 = 208
    const result = bulkCost(60n, 1.15, 0, 3);
    expect(result).toBeGreaterThanOrEqual(207n);
    expect(result).toBeLessThanOrEqual(209n);
  });

  it('gere growthRate = 1 (lineaire)', () => {
    expect(bulkCost(100n, 1, 5, 10)).toBe(1000n);
  });
});

describe('maxAffordable', () => {
  it('retourne 0 si budget = 0', () => {
    expect(maxAffordable(60n, 1.15, 0, 0n)).toBe(0);
  });

  it('retourne 0 si baseCost = 0', () => {
    expect(maxAffordable(0n, 1.15, 0, 1000n)).toBe(0);
  });

  it('peut acheter au moins 1 si budget = baseCost', () => {
    expect(maxAffordable(60n, 1.15, 0, 60n)).toBeGreaterThanOrEqual(1);
  });

  it('cas growthRate = 1 : division simple', () => {
    expect(maxAffordable(100n, 1, 0, 1000n)).toBe(10);
  });
});

describe('sellValue', () => {
  it('renvoie 25 % du cout par defaut', () => {
    expect(sellValue(100n)).toBe(25n);
  });

  it('accepte un ratio custom', () => {
    expect(sellValue(100n, 0.5)).toBe(50n);
  });
});

describe('scaleBigInt', () => {
  it('retourne 0 pour facteur 0', () => {
    expect(scaleBigInt(1000n, 0)).toBe(0n);
  });

  it('retourne la valeur identique pour facteur 1', () => {
    expect(scaleBigInt(1000n, 1)).toBe(1000n);
  });

  it('preserve la precision a 6 decimales', () => {
    expect(scaleBigInt(1_000_000n, 1.5)).toBe(1_500_000n);
  });
});

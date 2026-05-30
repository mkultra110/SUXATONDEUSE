// Tests du formatage ETA (temps avant d'atteindre un objectif de cash).
import { describe, expect, it } from 'vitest';
import Decimal from 'break_infinity.js';
import { formatEta } from '../utils/eta.js';

const eta = (remaining: number, cps: number) => formatEta(new Decimal(remaining), new Decimal(cps));

describe('formatEta', () => {
  it('renvoie un tiret quand le revenu par seconde est nul ou negatif', () => {
    expect(eta(1000, 0)).toBe('—');
    expect(eta(1000, -5)).toBe('—');
  });

  it('renvoie "maintenant" quand l objectif est deja atteint', () => {
    expect(eta(0, 10)).toBe('maintenant');
    expect(eta(-50, 10)).toBe('maintenant');
  });

  it('formate les secondes, minutes, heures et jours', () => {
    expect(eta(5, 10)).toBe('< 1s'); // 0,5s
    expect(eta(120, 10)).toBe('12s'); // 12s
    expect(eta(600, 10)).toBe('1 min'); // 60s -> 1 min
    expect(eta(36_000, 10)).toBe('1 h'); // 3600s -> 1 h
    expect(eta(864_000, 10)).toBe('1 j'); // 86 400s -> 1 j
  });

  it('renvoie l infini au-dela de 30 jours', () => {
    expect(eta(1e9, 10)).toBe('∞');
  });
});

import { describe, expect, it } from 'vitest';
import { offlineGain, offlineMultiplier } from '../offline.js';

describe('offlineMultiplier', () => {
  it('retourne 1 pour duree nulle', () => {
    expect(offlineMultiplier(0)).toBe(1);
  });

  it('retourne 1 pendant les 12 premieres heures (cap par defaut)', () => {
    expect(offlineMultiplier(3600 * 6)).toBe(1);
    expect(offlineMultiplier(3600 * 12)).toBe(1);
  });

  it('descend lineairement vers 0.5 entre 12 et 72 heures', () => {
    const m = offlineMultiplier(3600 * 42);
    expect(m).toBeGreaterThan(0.5);
    expect(m).toBeLessThan(1);
  });

  it('retourne 0.25 au-dela du seuil degrade', () => {
    expect(offlineMultiplier(3600 * 1000)).toBe(0.25);
  });

  it('honore un cap personnalise', () => {
    expect(offlineMultiplier(3600 * 24, 24)).toBe(1);
  });
});

describe('offlineGain', () => {
  it('retourne 0 pour duree nulle', () => {
    expect(offlineGain(100n, 0)).toBe(0n);
  });

  it('retourne 0 pour rate nul', () => {
    expect(offlineGain(0n, 1000)).toBe(0n);
  });

  it('multiplie rate * temps a plein regime', () => {
    expect(offlineGain(10n, 60)).toBe(600n);
  });

  it('plafonne le temps a degradedLimit (cap*6 = 72h par defaut)', () => {
    // 100 jours d'absence sont plafonnes a 72h. A 72h pile, le multiplier
    // est de 0.5 (dernier point de la pente lineaire 12h..72h).
    const result = offlineGain(100n, 3600 * 24 * 100, 12);
    const cappedSeconds = 3600 * 12 * 6;
    // gain = rate * 72h * 0.5
    expect(result).toBe((BigInt(cappedSeconds) * 100n) / 2n);
  });

  it('applique 0.25 si on simule au-dela du cap via offlineMultiplier direct', () => {
    // Verifie que le palier 0.25 reste atteignable en consultant directement
    // le multiplier au-dela du seuil degrade.
    expect(offlineMultiplier(3600 * 24 * 30)).toBe(0.25);
  });
});

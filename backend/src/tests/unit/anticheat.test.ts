// Tests anti-cheat : coverage 95 % cible (cf. GDD section 13.1).

import { describe, expect, it } from 'vitest';
import type { GameSave } from '@prisma/client';
import { buildInitialSave } from '@robomow/shared';
import { validateSave } from '../../services/anticheat.service.js';

function makePrev(overrides: Partial<GameSave> = {}): GameSave {
  return {
    id: 'g1',
    userId: 'u1',
    cash: 0n,
    gems: 0,
    prestigePoints: 0n,
    payload: {} as never,
    payloadVersion: 1,
    payloadHmac: 'hmac',
    compressed: false,
    lastSavedAt: new Date('2026-01-01T00:00:00Z'),
    lastTickAt: new Date('2026-01-01T00:00:00Z'),
    saveCount: 1,
    suspicionScore: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as GameSave;
}

describe('validateSave - premier save (prev = null)', () => {
  it('accepte un save initial coherent', () => {
    const incoming = buildInitialSave();
    const result = validateSave(null, incoming, new Date());
    expect(result.ok).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it('flag un premier save avec cash exorbitant', () => {
    const incoming = buildInitialSave();
    incoming.cash = '999999999';
    const result = validateSave(null, incoming, new Date());
    expect(result.ok).toBe(true); // medium severity, ok reste true
    expect(result.issues.some((i) => i.reason === 'first_save_high_cash')).toBe(true);
    expect(result.suspicionDelta).toBeGreaterThan(0);
  });
});

describe('validateSave - voyage temporel', () => {
  it('flag un voyage en arriere', () => {
    const prev = makePrev({ lastTickAt: new Date('2026-01-02T00:00:00Z') });
    const incoming = buildInitialSave();
    const result = validateSave(prev, incoming, new Date('2026-01-01T00:00:00Z'));
    expect(result.issues.some((i) => i.reason === 'time_travel_backward')).toBe(true);
    expect(result.ok).toBe(false); // high severity bloque
  });

  it('flag une absence absurdement longue', () => {
    const prev = makePrev({ lastTickAt: new Date('2026-01-01T00:00:00Z') });
    const incoming = buildInitialSave();
    const result = validateSave(prev, incoming, new Date('2026-02-15T00:00:00Z'));
    expect(result.issues.some((i) => i.reason === 'time_travel_forward')).toBe(true);
  });

  it('accepte une absence legitime de 6 heures', () => {
    const prev = makePrev();
    const incoming = buildInitialSave();
    incoming.lastTickAt = Date.now();
    const result = validateSave(
      prev,
      incoming,
      new Date(prev.lastTickAt.getTime() + 6 * 3600_000),
    );
    expect(
      result.issues.find((i) => i.reason === 'time_travel_forward'),
    ).toBeUndefined();
  });
});

describe('validateSave - gain impossible', () => {
  it('accepte un gain raisonnable', () => {
    const prev = makePrev({ cash: 1000n });
    const incoming = buildInitialSave();
    incoming.cash = '5000';
    const result = validateSave(
      prev,
      incoming,
      new Date(prev.lastTickAt.getTime() + 60_000),
    );
    expect(result.issues.find((i) => i.reason === 'impossible_gain')).toBeUndefined();
  });

  it('flag un gain manifestement triche', () => {
    const prev = makePrev({ cash: 0n });
    const incoming = buildInitialSave();
    // 1e30 cash en 1 seconde : largement au-dessus du plafond 1e15/s
    incoming.cash = '1000000000000000000000000000000';
    const result = validateSave(
      prev,
      incoming,
      new Date(prev.lastTickAt.getTime() + 1000),
    );
    expect(result.issues.some((i) => i.reason === 'impossible_gain')).toBe(true);
    expect(result.ok).toBe(false);
  });
});

describe('validateSave - gemmes injustifiees', () => {
  it('flag un gain de gemmes sans preuve', () => {
    const prev = makePrev({ gems: 0 });
    const incoming = buildInitialSave();
    incoming.gems = 50;
    const result = validateSave(
      prev,
      incoming,
      new Date(prev.lastTickAt.getTime() + 1000),
    );
    expect(result.issues.some((i) => i.reason === 'unjustified_gems')).toBe(true);
  });

  it('accepte un gain de gemmes avec preuve', () => {
    const prev = makePrev({ gems: 0 });
    const incoming = buildInitialSave();
    incoming.gems = 50;
    incoming.gemSourceProof = 'achievement-welcome';
    const result = validateSave(
      prev,
      incoming,
      new Date(prev.lastTickAt.getTime() + 1000),
    );
    expect(result.issues.find((i) => i.reason === 'unjustified_gems')).toBeUndefined();
  });
});

describe('validateSave - coherence interne', () => {
  it('flag un cash negatif', () => {
    const incoming = buildInitialSave();
    incoming.cash = '-100';
    const result = validateSave(null, incoming, new Date());
    expect(result.issues.some((i) => i.reason === 'negative_cash')).toBe(true);
  });

  it('flag des gemmes negatives', () => {
    const incoming = buildInitialSave();
    incoming.gems = -1;
    const result = validateSave(null, incoming, new Date());
    expect(result.issues.some((i) => i.reason === 'negative_gems')).toBe(true);
  });
});

describe('validateSave - severites', () => {
  it('cumule les suspicionDelta', () => {
    const incoming = buildInitialSave();
    incoming.cash = '-100';
    incoming.gems = -5;
    const result = validateSave(null, incoming, new Date());
    expect(result.suspicionDelta).toBeGreaterThanOrEqual(40); // 2 medium = 2*20
  });
});

// Tests unitaires de persistSave : orchestration anti-cheat + persistance.
// validateSave est utilise pour de vrai ; seul Prisma est mocke (pas de DB).
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { GameSave } from '@prisma/client';
import { buildInitialSave } from '@robomow/shared';

const { gameSaveFindUnique, gameSaveUpsert, auditCreate, lbUpsert } = vi.hoisted(() => ({
  gameSaveFindUnique: vi.fn(),
  gameSaveUpsert: vi.fn(),
  auditCreate: vi.fn(),
  lbUpsert: vi.fn(),
}));

vi.mock('../../config/prisma.js', () => ({
  prisma: {
    gameSave: { findUnique: gameSaveFindUnique, upsert: gameSaveUpsert },
    saveAuditLog: { create: auditCreate },
    leaderboardEntry: { upsert: lbUpsert },
  },
}));

import { persistSave } from '../../services/save.service.js';
import { AppError } from '../../utils/api.js';

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
    lastSavedAt: new Date(Date.now() - 10_000),
    lastTickAt: new Date(Date.now() - 10_000),
    saveCount: 1,
    suspicionScore: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as GameSave;
}

beforeEach(() => {
  vi.clearAllMocks();
  gameSaveFindUnique.mockResolvedValue(null);
  gameSaveUpsert.mockResolvedValue({});
  auditCreate.mockResolvedValue({});
  lbUpsert.mockResolvedValue(undefined);
});

describe('persistSave - cas nominal', () => {
  it('persiste un premier save valide sans audit log', async () => {
    const incoming = buildInitialSave();
    const res = await persistSave('u1', incoming, incoming.payloadVersion, '');

    expect(res.saved).toBe(true);
    expect(typeof res.serverTime).toBe('string');
    expect(gameSaveUpsert).toHaveBeenCalledTimes(1);
    expect(auditCreate).not.toHaveBeenCalled();
    // 4 categories de leaderboard mises a jour.
    expect(lbUpsert).toHaveBeenCalledTimes(4);
  });

  it('calcule un HMAC serveur quand le client n en fournit pas', async () => {
    const incoming = buildInitialSave();
    await persistSave('u1', incoming, incoming.payloadVersion, '');
    const arg = gameSaveUpsert.mock.calls[0]![0] as {
      create: { payloadHmac: string };
    };
    expect(arg.create.payloadHmac).toMatch(/^[a-f0-9]{64}$/);
  });
});

describe('persistSave - rejet anti-cheat', () => {
  it('rejette un gain impossible et journalise sans persister', async () => {
    const prev = makePrev({ cash: 0n });
    gameSaveFindUnique.mockResolvedValue(prev);

    const incoming = buildInitialSave();
    incoming.cash = '1000000000000000000000000000000'; // 1e30 en ~10s

    await expect(persistSave('u1', incoming, incoming.payloadVersion, '')).rejects.toBeInstanceOf(
      AppError,
    );

    expect(auditCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ rejected: true }),
      }),
    );
    expect(gameSaveUpsert).not.toHaveBeenCalled();
  });
});

describe('persistSave - resilience leaderboard', () => {
  it('ne fait pas echouer la save si la mise a jour leaderboard plante', async () => {
    lbUpsert.mockRejectedValue(new Error('db down'));
    const incoming = buildInitialSave();

    const res = await persistSave('u1', incoming, incoming.payloadVersion, '');

    expect(res.saved).toBe(true);
    expect(gameSaveUpsert).toHaveBeenCalledTimes(1);
  });
});

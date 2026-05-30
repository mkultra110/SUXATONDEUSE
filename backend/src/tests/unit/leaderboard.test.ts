// Tests unitaires du service leaderboard avec Prisma mocke (pas de DB requise).
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { findMany, findUnique, count, upsert } = vi.hoisted(() => ({
  findMany: vi.fn(),
  findUnique: vi.fn(),
  count: vi.fn(),
  upsert: vi.fn(),
}));

vi.mock('../../config/prisma.js', () => ({
  prisma: {
    leaderboardEntry: { findMany, findUnique, count, upsert },
  },
}));

import {
  getTopLeaderboard,
  getMyRank,
  upsertLeaderboardScore,
} from '../../services/leaderboard.service.js';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getTopLeaderboard', () => {
  it('mappe les lignes en rang/username/score serialise', async () => {
    findMany.mockResolvedValue([
      { score: 5000n, user: { username: 'alice' } },
      { score: 3000n, user: { username: 'bob' } },
    ]);
    const top = await getTopLeaderboard('TOTAL_CASH');
    expect(top).toEqual([
      { rank: 1, username: 'alice', score: '5000' },
      { rank: 2, username: 'bob', score: '3000' },
    ]);
  });

  it('plafonne le take a 100 meme si une limite plus grande est demandee', async () => {
    findMany.mockResolvedValue([]);
    await getTopLeaderboard('TOTAL_GRASS', 500);
    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 100 }));
  });
});

describe('getMyRank', () => {
  it('renvoie rank null et score 0 si le joueur n a pas d entree', async () => {
    findUnique.mockResolvedValue(null);
    const res = await getMyRank('user-1', 'TOTAL_CASH');
    expect(res).toEqual({ rank: null, score: '0' });
    expect(count).not.toHaveBeenCalled();
  });

  it('calcule le rang a partir du nombre de scores superieurs', async () => {
    findUnique.mockResolvedValue({ score: 4200n });
    count.mockResolvedValue(2); // 2 joueurs au-dessus
    const res = await getMyRank('user-1', 'TOTAL_CASH');
    expect(res).toEqual({ rank: 3, score: '4200' });
  });
});

describe('upsertLeaderboardScore', () => {
  it('upsert avec la cle composite et le score', async () => {
    upsert.mockResolvedValue(undefined);
    await upsertLeaderboardScore('user-1', 'PRESTIGE_LEVEL', 7n);
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          userId: 'user-1',
          category: 'PRESTIGE_LEVEL',
          score: 7n,
        }),
        update: { score: { set: 7n } },
      }),
    );
  });
});

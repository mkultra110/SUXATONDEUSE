// Service leaderboard : top 100 par categorie + position du joueur courant.

import type { LeaderboardCategory } from '@robomow/shared';
import { prisma } from '../config/prisma.js';

const SEASON = '2026-S1'; // Saison courante (PHASE 2 : statique, PHASE 3 : auto)

export interface LeaderboardEntry {
  rank: number;
  username: string;
  score: string; // BigInt sérialisé en string
}

/** Top N joueurs pour une categorie. */
export async function getTopLeaderboard(
  category: LeaderboardCategory,
  limit = 100,
): Promise<LeaderboardEntry[]> {
  const rows = await prisma.leaderboardEntry.findMany({
    where: { category, season: SEASON },
    orderBy: { score: 'desc' },
    take: Math.min(limit, 100),
    include: { user: { select: { username: true } } },
  });
  return rows.map((row, idx) => ({
    rank: idx + 1,
    username: row.user.username,
    score: row.score.toString(),
  }));
}

/** Position d'un joueur dans le leaderboard (rank + score). */
export async function getMyRank(
  userId: string,
  category: LeaderboardCategory,
): Promise<{ rank: number | null; score: string }> {
  const entry = await prisma.leaderboardEntry.findUnique({
    where: {
      userId_category_season: { userId, category, season: SEASON },
    },
  });
  if (!entry) return { rank: null, score: '0' };

  // Compte combien d'entrees ont un score plus eleve
  const above = await prisma.leaderboardEntry.count({
    where: {
      category,
      season: SEASON,
      score: { gt: entry.score },
    },
  });
  return { rank: above + 1, score: entry.score.toString() };
}

/** Met a jour le score d'un joueur (upsert). */
export async function upsertLeaderboardScore(
  userId: string,
  category: LeaderboardCategory,
  score: bigint,
): Promise<void> {
  await prisma.leaderboardEntry.upsert({
    where: {
      userId_category_season: { userId, category, season: SEASON },
    },
    create: { userId, category, score, season: SEASON },
    update: { score: { set: score } },
  });
}

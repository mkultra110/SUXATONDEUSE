// Daily quests (cf. GDD section 7.1).
// Pool de quetes simples avec progression auto a partir des stats du joueur.

export type QuestProgressKey =
  | 'cashEarned'
  | 'grassMowed'
  | 'robotsBought'
  | 'upgradesBought'
  | 'manualTaps'
  | 'plotsUnlocked';

export interface DailyQuestDefinition {
  key: string;
  name: string;
  description: string;
  progressKey: QuestProgressKey;
  /** Cible a atteindre (BigInt pour les gros). */
  target: bigint;
  rewardCash: bigint;
  rewardGems: number;
}

export const DAILY_QUESTS_POOL: readonly DailyQuestDefinition[] = [
  {
    key: 'mow_5k',
    name: 'Tondre 5K',
    description: 'Couper 5 000 unites d\'herbe aujourd\'hui.',
    progressKey: 'grassMowed',
    target: 5_000n,
    rewardCash: 500n,
    rewardGems: 0,
  },
  {
    key: 'earn_100k',
    name: 'Petit revenu',
    description: 'Gagner 100K de cash aujourd\'hui.',
    progressKey: 'cashEarned',
    target: 100_000n,
    rewardCash: 0n,
    rewardGems: 1,
  },
  {
    key: 'earn_1m',
    name: 'Magnat du jour',
    description: 'Gagner 1M de cash aujourd\'hui.',
    progressKey: 'cashEarned',
    target: 1_000_000n,
    rewardCash: 0n,
    rewardGems: 3,
  },
  {
    key: 'buy_3_robots',
    name: 'Tondeuses neuves',
    description: 'Acheter 3 robots aujourd\'hui.',
    progressKey: 'robotsBought',
    target: 3n,
    rewardCash: 1_000n,
    rewardGems: 0,
  },
  {
    key: 'buy_10_robots',
    name: 'Flotte renforcee',
    description: 'Acheter 10 robots aujourd\'hui.',
    progressKey: 'robotsBought',
    target: 10n,
    rewardCash: 0n,
    rewardGems: 2,
  },
  {
    key: 'buy_5_upgrades',
    name: 'Equipement amelioré',
    description: 'Acheter 5 niveaux d\'upgrades aujourd\'hui.',
    progressKey: 'upgradesBought',
    target: 5n,
    rewardCash: 750n,
    rewardGems: 0,
  },
  {
    key: 'tap_50',
    name: 'Coup de main',
    description: 'Tondre manuellement 50 fois.',
    progressKey: 'manualTaps',
    target: 50n,
    rewardCash: 250n,
    rewardGems: 0,
  },
  {
    key: 'tap_200',
    name: 'Cisaille en folie',
    description: 'Tondre manuellement 200 fois.',
    progressKey: 'manualTaps',
    target: 200n,
    rewardCash: 0n,
    rewardGems: 1,
  },
  {
    key: 'unlock_plot',
    name: 'Conqueteur',
    description: 'Debloquer une nouvelle parcelle.',
    progressKey: 'plotsUnlocked',
    target: 1n,
    rewardCash: 0n,
    rewardGems: 5,
  },
];

/** Selectionne 3 quetes deterministes en fonction d'une seed (date jour). */
export function selectDailyQuests(seed: string): DailyQuestDefinition[] {
  // Hash simple base sur la seed
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  const indices = new Set<number>();
  let cursor = Math.abs(hash);
  while (indices.size < Math.min(3, DAILY_QUESTS_POOL.length)) {
    indices.add(cursor % DAILY_QUESTS_POOL.length);
    cursor = (cursor * 1103515245 + 12345) & 0x7fffffff;
  }
  return Array.from(indices)
    .map((i) => DAILY_QUESTS_POOL[i])
    .filter((q): q is DailyQuestDefinition => Boolean(q));
}

/** Recompenses de login streak (cf. GDD section 7.3). */
export interface DailyLoginReward {
  day: number;
  rewardCash: bigint;
  rewardGems: number;
  description: string;
}

export const DAILY_LOGIN_REWARDS: readonly DailyLoginReward[] = [
  { day: 1, rewardCash: 200n, rewardGems: 0, description: '+200 🪙' },
  { day: 2, rewardCash: 500n, rewardGems: 0, description: '+500 🪙' },
  { day: 3, rewardCash: 0n, rewardGems: 2, description: '+2 ⛽' },
  { day: 4, rewardCash: 0n, rewardGems: 2, description: '+2 ⛽' },
  { day: 5, rewardCash: 5_000n, rewardGems: 0, description: '+5K 🪙' },
  { day: 6, rewardCash: 0n, rewardGems: 3, description: '+3 ⛽' },
  { day: 7, rewardCash: 0n, rewardGems: 10, description: 'JACKPOT : +10 ⛽' },
];

/** Recompense pour le jour de streak donne (boucle sur 7 jours). */
export function loginRewardForDay(streak: number): DailyLoginReward {
  if (streak < 1) {
    return { day: 0, rewardCash: 0n, rewardGems: 0, description: '' };
  }
  const idx = ((streak - 1) % 7);
  const reward = DAILY_LOGIN_REWARDS[idx];
  return reward ?? DAILY_LOGIN_REWARDS[0]!;
}

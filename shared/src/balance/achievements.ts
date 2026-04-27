// Definitions des achievements (cf. GDD section 6).
// 30 achievements en PHASE 2 (subset des 50 du GDD final).

export type AchievementCategory =
  | 'distance'
  | 'cash'
  | 'robots'
  | 'plots'
  | 'prestige'
  | 'login'
  | 'secret';

export interface AchievementDefinition {
  key: string;
  name: string;
  description: string;
  category: AchievementCategory;
  /** Critere : type de stat tracker. */
  trigger:
    | { type: 'totalGrass'; threshold: bigint }
    | { type: 'totalCash'; threshold: bigint }
    | { type: 'robotsOwned'; threshold: number }
    | { type: 'plotsUnlocked'; threshold: number }
    | { type: 'prestigeCount'; threshold: number }
    | { type: 'loginStreak'; threshold: number }
    | { type: 'tierOwned'; tierIndex: number; count: number };
  rewardCash: bigint;
  rewardGems: number;
  hidden: boolean;
}

export const ACHIEVEMENTS: readonly AchievementDefinition[] = [
  // Distance / herbe coupee (8)
  {
    key: 'first_blade',
    name: 'Premier coup de lame',
    description: 'Tondre 10 unites d\'herbe.',
    category: 'distance',
    trigger: { type: 'totalGrass', threshold: 10n },
    rewardCash: 100n,
    rewardGems: 0,
    hidden: false,
  },
  {
    key: 'tidy_lawn',
    name: 'Pelouse soignee',
    description: '1 000 unites d\'herbe coupees.',
    category: 'distance',
    trigger: { type: 'totalGrass', threshold: 1_000n },
    rewardCash: 500n,
    rewardGems: 0,
    hidden: false,
  },
  {
    key: 'meadow_marathon',
    name: 'Marathonien des pres',
    description: '100 000 unites coupees.',
    category: 'distance',
    trigger: { type: 'totalGrass', threshold: 100_000n },
    rewardCash: 10_000n,
    rewardGems: 5,
    hidden: false,
  },
  {
    key: 'elite_mower',
    name: 'Tondeur d\'elite',
    description: '10 millions d\'unites.',
    category: 'distance',
    trigger: { type: 'totalGrass', threshold: 10_000_000n },
    rewardCash: 1_000_000n,
    rewardGems: 10,
    hidden: false,
  },
  {
    key: 'green_legend',
    name: 'Legende verte',
    description: '1 milliard d\'unites.',
    category: 'distance',
    trigger: { type: 'totalGrass', threshold: 1_000_000_000n },
    rewardCash: 0n,
    rewardGems: 25,
    hidden: false,
  },

  // Argent gagne (5)
  {
    key: 'first_bill',
    name: 'Premier billet',
    description: '100 cash gagnes.',
    category: 'cash',
    trigger: { type: 'totalCash', threshold: 100n },
    rewardCash: 50n,
    rewardGems: 0,
    hidden: false,
  },
  {
    key: 'small_business',
    name: 'Petit business',
    description: '10 000 cash cumules.',
    category: 'cash',
    trigger: { type: 'totalCash', threshold: 10_000n },
    rewardCash: 0n,
    rewardGems: 1,
    hidden: false,
  },
  {
    key: 'entrepreneur',
    name: 'Entrepreneur',
    description: '1 million de cash cumule.',
    category: 'cash',
    trigger: { type: 'totalCash', threshold: 1_000_000n },
    rewardCash: 0n,
    rewardGems: 5,
    hidden: false,
  },
  {
    key: 'lawn_magnate',
    name: 'Magnat du gazon',
    description: '1 milliard cumule.',
    category: 'cash',
    trigger: { type: 'totalCash', threshold: 1_000_000_000n },
    rewardCash: 0n,
    rewardGems: 15,
    hidden: false,
  },
  {
    key: 'green_billionaire',
    name: 'Milliardaire vert',
    description: '1 trillion cumule.',
    category: 'cash',
    trigger: { type: 'totalCash', threshold: 1_000_000_000_000n },
    rewardCash: 0n,
    rewardGems: 30,
    hidden: false,
  },

  // Robots possedes (8)
  {
    key: 'first_purchase',
    name: 'Premier achat',
    description: 'Acheter un premier robot tier 2+.',
    category: 'robots',
    trigger: { type: 'tierOwned', tierIndex: 1, count: 1 },
    rewardCash: 200n,
    rewardGems: 0,
    hidden: false,
  },
  {
    key: 'small_fleet',
    name: 'Petite flotte',
    description: '5 robots possedes au total.',
    category: 'robots',
    trigger: { type: 'robotsOwned', threshold: 5 },
    rewardCash: 1000n,
    rewardGems: 0,
    hidden: false,
  },
  {
    key: 'full_garage',
    name: 'Garage rempli',
    description: '10 robots au total.',
    category: 'robots',
    trigger: { type: 'robotsOwned', threshold: 10 },
    rewardCash: 5000n,
    rewardGems: 0,
    hidden: false,
  },
  {
    key: 'mowing_company',
    name: 'Societe de tonte',
    description: '25 robots.',
    category: 'robots',
    trigger: { type: 'robotsOwned', threshold: 25 },
    rewardCash: 25_000n,
    rewardGems: 5,
    hidden: false,
  },
  {
    key: 'green_army',
    name: 'Armee verte',
    description: '100 robots.',
    category: 'robots',
    trigger: { type: 'robotsOwned', threshold: 100 },
    rewardCash: 1_000_000n,
    rewardGems: 15,
    hidden: false,
  },

  // Parcelles debloquees (4)
  {
    key: 'beyond_garden',
    name: 'Hors du jardin',
    description: 'Debloquer la 2eme parcelle.',
    category: 'plots',
    trigger: { type: 'plotsUnlocked', threshold: 2 },
    rewardCash: 1000n,
    rewardGems: 0,
    hidden: false,
  },
  {
    key: 'subdivision_lord',
    name: 'Roi du lotissement',
    description: 'Debloquer la 3eme parcelle.',
    category: 'plots',
    trigger: { type: 'plotsUnlocked', threshold: 3 },
    rewardCash: 25_000n,
    rewardGems: 2,
    hidden: false,
  },
  {
    key: 'park_master',
    name: 'Maitre du parc',
    description: 'Debloquer la 4eme parcelle.',
    category: 'plots',
    trigger: { type: 'plotsUnlocked', threshold: 4 },
    rewardCash: 500_000n,
    rewardGems: 5,
    hidden: false,
  },
  {
    key: 'fairway_champ',
    name: 'Champion de fairway',
    description: 'Debloquer la 5eme parcelle.',
    category: 'plots',
    trigger: { type: 'plotsUnlocked', threshold: 5 },
    rewardCash: 0n,
    rewardGems: 15,
    hidden: false,
  },

  // Prestige (3)
  {
    key: 'first_season',
    name: 'Premiere saison',
    description: 'Premier prestige.',
    category: 'prestige',
    trigger: { type: 'prestigeCount', threshold: 1 },
    rewardCash: 0n,
    rewardGems: 5,
    hidden: false,
  },
  {
    key: 'cycle_seasons',
    name: 'Cycle des saisons',
    description: '5 prestiges.',
    category: 'prestige',
    trigger: { type: 'prestigeCount', threshold: 5 },
    rewardCash: 0n,
    rewardGems: 20,
    hidden: false,
  },
  {
    key: 'compost_master',
    name: 'Maitre du compost',
    description: '25 prestiges.',
    category: 'prestige',
    trigger: { type: 'prestigeCount', threshold: 25 },
    rewardCash: 0n,
    rewardGems: 50,
    hidden: false,
  },

  // Connexion (3)
  {
    key: 'hello_gardener',
    name: 'Bonjour jardinier !',
    description: 'Premiere connexion.',
    category: 'login',
    trigger: { type: 'loginStreak', threshold: 1 },
    rewardCash: 50n,
    rewardGems: 0,
    hidden: false,
  },
  {
    key: 'regular',
    name: 'Habitue',
    description: '7 jours consecutifs.',
    category: 'login',
    trigger: { type: 'loginStreak', threshold: 7 },
    rewardCash: 0n,
    rewardGems: 5,
    hidden: false,
  },
  {
    key: 'faithful',
    name: 'Fidele',
    description: '30 jours consecutifs.',
    category: 'login',
    trigger: { type: 'loginStreak', threshold: 30 },
    rewardCash: 0n,
    rewardGems: 25,
    hidden: false,
  },
];

export interface AchievementSnapshot {
  totalGrass: bigint;
  totalCash: bigint;
  robotsOwned: number;
  plotsUnlocked: number;
  prestigeCount: number;
  loginStreak: number;
  tierCounts: number[];
}

/** Filtre les achievements deverrouilles par un snapshot du joueur. */
export function unlockedAchievements(
  snapshot: AchievementSnapshot,
  alreadyUnlocked: ReadonlySet<string>,
): AchievementDefinition[] {
  return ACHIEVEMENTS.filter((ach) => {
    if (alreadyUnlocked.has(ach.key)) return false;
    const t = ach.trigger;
    switch (t.type) {
      case 'totalGrass':
        return snapshot.totalGrass >= t.threshold;
      case 'totalCash':
        return snapshot.totalCash >= t.threshold;
      case 'robotsOwned':
        return snapshot.robotsOwned >= t.threshold;
      case 'plotsUnlocked':
        return snapshot.plotsUnlocked >= t.threshold;
      case 'prestigeCount':
        return snapshot.prestigeCount >= t.threshold;
      case 'loginStreak':
        return snapshot.loginStreak >= t.threshold;
      case 'tierOwned':
        return (snapshot.tierCounts[t.tierIndex] ?? 0) >= t.count;
    }
  });
}

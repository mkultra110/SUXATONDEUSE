// Store Zustand du jeu (PHASE 2).
// Etat runtime + actions : tick / tap / achat robot / upgrade /
// deblocage parcelle / prestige / achievements.

import Decimal from 'break_infinity.js';
import { enableMapSet } from 'immer';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// Active le support des Map/Set dans immer (utilise pour achievementsUnlocked).
enableMapSet();

import {
  ACHIEVEMENTS,
  calculatePrestigeSeeds,
  combinedMultiplier,
  type DailyQuestDefinition,
  generatorCost,
  getPlot,
  getTier,
  getUpgrade,
  loginRewardForDay,
  milestoneMultiplier,
  PLOT_DEFINITIONS,
  prestigeMultiplier,
  type PlotType,
  rollRandomPet,
  type RobotType,
  ROBOT_TIERS,
  SAVE_PAYLOAD_VERSION,
  type SavePayload,
  selectDailyQuests,
  totalPetBonus,
  totalProductionMultiplier,
  type UpgradeKey,
  unlockedAchievements,
  UPGRADE_DEFINITIONS,
} from '@robomow/shared';
import { big, bigToString } from '../game/engine/bigNumber.js';

export interface RobotHolding {
  type: RobotType;
  owned: number;
}

interface GameState {
  // Currencies en runtime (Decimal pour break_infinity).
  cash: Decimal;
  grass: Decimal;
  gems: number;
  prestigePoints: Decimal;
  // Cache de la production passive.
  cashPerSecond: Decimal;
  // Pets possedes et equipes (max 3 equipes pour le bonus)
  petsOwned: Set<string>;
  petsEquipped: Set<string>;
  // Skins possedees et equipée
  skinsOwned: Set<string>;
  activeSkin: string;
  // Holdings par tier.
  holdings: Record<RobotType, RobotHolding>;
  // Niveau de chaque categorie d'upgrade.
  upgrades: Record<UpgradeKey, number>;
  // Etat des parcelles : true si debloquee.
  plotsUnlocked: Record<PlotType, boolean>;
  // Prestige
  prestigeLevel: number;
  totalPrestiges: number;
  prestigeMultiplierCache: number;
  // Achievements deverrouilles
  achievementsUnlocked: Set<string>;
  // Statistiques cumulees.
  totalCashEarned: Decimal;
  totalGrassMowed: Decimal;
  totalRobotsBought: number;
  totalUpgrades: number;
  playTimeSeconds: number;
  // Login streak (PHASE 2 : simple, ne distingue pas multi-jours en local)
  loginStreak: number;
  lastLoginISODate: string | null;
  // Daily login rewards : derniere date claim et claim disponible aujourd'hui
  lastLoginRewardDate: string | null;
  // Daily quests : seed du jour + progres + claim
  dailyQuestSeed: string | null;
  dailyQuestProgress: Record<string, string>; // bigint serialise
  dailyQuestsClaimed: Set<string>;
  // Compteurs intra-journee (resets a la registration de login)
  dailyTaps: number;
  dailyRobotsBought: number;
  dailyUpgradesBought: number;
  dailyCashEarned: Decimal;
  dailyGrassMowed: Decimal;
  dailyPlotsUnlocked: number;
  // Timestamp epoch ms du dernier tick.
  lastTickAt: number;
  isReady: boolean;
}

interface GameActions {
  hydrate: (payload: SavePayload) => void;
  tick: (dtSeconds: number) => void;
  manualTap: () => void;
  buyRobot: (type: RobotType) => boolean;
  buyUpgrade: (key: UpgradeKey) => boolean;
  unlockPlot: (type: PlotType) => boolean;
  triggerPrestige: () => bigint;
  claimAchievement: (key: string) => boolean;
  serialize: () => SavePayload;
  registerLogin: () => void;
  /** Reclame la recompense de login du jour si non deja claim. */
  claimLoginReward: () => boolean;
  /** Reclame une quete dailyterminee. */
  claimDailyQuest: (key: string) => boolean;
  /** Recupere les definitions des 3 quetes du jour. */
  getDailyQuests: () => DailyQuestDefinition[];
  /** Tirage aleatoire d'un pet (recompense d'event ou login J6). */
  rollPet: () => string | null;
  /** Equipe / desequipe un pet (max 3). */
  togglePetEquip: (key: string) => boolean;
  /** Equipe un skin. */
  setActiveSkin: (key: string) => boolean;
}

type GameStore = GameState & GameActions;

const ALL_ROBOT_TYPES: RobotType[] = ROBOT_TIERS.map((t) => t.type);

function emptyHoldings(): Record<RobotType, RobotHolding> {
  const result = {} as Record<RobotType, RobotHolding>;
  for (const t of ALL_ROBOT_TYPES) {
    result[t] = { type: t, owned: 0 };
  }
  return result;
}

function emptyUpgrades(): Record<UpgradeKey, number> {
  const result = {} as Record<UpgradeKey, number>;
  for (const u of UPGRADE_DEFINITIONS) {
    result[u.key] = 0;
  }
  return result;
}

function emptyPlots(): Record<PlotType, boolean> {
  const result = {} as Record<PlotType, boolean>;
  for (const p of PLOT_DEFINITIONS) {
    result[p.type] = p.index === 0;
  }
  return result;
}

/** En test, on neutralise les multiplicateurs aleatoires meteo/saison. */
const IS_TEST =
  typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';

/** Calcule la production totale (cash/sec) en fonction du state. */
function computeProduction(state: GameState): Decimal {
  let total = new Decimal(0);
  const upgradeMult = totalProductionMultiplier(state.upgrades);
  const prestigeMult = state.prestigeMultiplierCache;
  const petsMult = 1 + totalPetBonus(state.petsEquipped).productionBonus;
  // Meteo + saison (deterministe, change a chaque heure).
  // En test, on force a 1 pour avoir des valeurs predictibles.
  const weatherMult = IS_TEST ? 1 : combinedMultiplier(new Date());

  // Multiplicateur global de toutes les parcelles debloquees (somme).
  let plotsMult = 0;
  for (const plot of PLOT_DEFINITIONS) {
    if (state.plotsUnlocked[plot.type]) {
      plotsMult += plot.globalMultiplier;
    }
  }
  if (plotsMult === 0) plotsMult = 1;

  for (const holding of Object.values(state.holdings)) {
    if (holding.owned <= 0) continue;
    const tier = getTier(holding.type);
    const milestone = milestoneMultiplier(holding.owned);
    const tierProd =
      tier.baseGrassPerSecond *
      holding.owned *
      milestone *
      upgradeMult *
      prestigeMult *
      plotsMult *
      petsMult *
      weatherMult;
    total = total.add(new Decimal(tierProd));
  }
  return total;
}

export function nextRobotCost(holdings: Record<RobotType, RobotHolding>, type: RobotType): Decimal {
  const tier = getTier(type);
  const owned = holdings[type].owned;
  const cost = generatorCost(tier.baseCost, tier.costGrowth, owned);
  return new Decimal(cost.toString());
}

export function nextUpgradeCost(key: UpgradeKey, level: number): Decimal {
  const def = getUpgrade(key);
  const cost = generatorCost(def.baseCost, def.costGrowth, level);
  return new Decimal(cost.toString());
}

export function plotUnlockCost(type: PlotType): Decimal {
  return new Decimal(getPlot(type).unlockCost.toString());
}

/** Lit la progression actuelle d'une quete a partir des compteurs daily. */
function readQuestProgress(state: GameState, def: DailyQuestDefinition): bigint {
  switch (def.progressKey) {
    case 'cashEarned':
      return BigInt(state.dailyCashEarned.floor().toString());
    case 'grassMowed':
      return BigInt(state.dailyGrassMowed.floor().toString());
    case 'robotsBought':
      return BigInt(state.dailyRobotsBought);
    case 'upgradesBought':
      return BigInt(state.dailyUpgradesBought);
    case 'manualTaps':
      return BigInt(state.dailyTaps);
    case 'plotsUnlocked':
      return BigInt(state.dailyPlotsUnlocked);
  }
}

function recomputeAndAutoUnlockAchievements(draft: GameState): string[] {
  const tierCounts = ROBOT_TIERS.map((tier) => draft.holdings[tier.type].owned);
  const robotsOwned = tierCounts.reduce((acc, n) => acc + n, 0);
  const plotsUnlockedCount = Object.values(draft.plotsUnlocked).filter(Boolean).length;
  const newly = unlockedAchievements(
    {
      totalGrass: BigInt(draft.totalGrassMowed.floor().toString()),
      totalCash: BigInt(draft.totalCashEarned.floor().toString()),
      robotsOwned,
      plotsUnlocked: plotsUnlockedCount,
      prestigeCount: draft.totalPrestiges,
      loginStreak: draft.loginStreak,
      tierCounts,
    },
    draft.achievementsUnlocked,
  );
  for (const ach of newly) {
    draft.achievementsUnlocked.add(ach.key);
  }
  return newly.map((a) => a.key);
}

export const useGameStore = create<GameStore>()(
  immer((set, get) => ({
    cash: new Decimal(0),
    grass: new Decimal(0),
    gems: 0,
    prestigePoints: new Decimal(0),
    cashPerSecond: new Decimal(0),
    petsOwned: new Set<string>(),
    petsEquipped: new Set<string>(),
    skinsOwned: new Set<string>(['classic']),
    activeSkin: 'classic',
    holdings: emptyHoldings(),
    upgrades: emptyUpgrades(),
    plotsUnlocked: emptyPlots(),
    prestigeLevel: 0,
    totalPrestiges: 0,
    prestigeMultiplierCache: 1,
    achievementsUnlocked: new Set<string>(),
    totalCashEarned: new Decimal(0),
    totalGrassMowed: new Decimal(0),
    totalRobotsBought: 0,
    totalUpgrades: 0,
    playTimeSeconds: 0,
    loginStreak: 0,
    lastLoginISODate: null,
    lastLoginRewardDate: null,
    dailyQuestSeed: null,
    dailyQuestProgress: {},
    dailyQuestsClaimed: new Set<string>(),
    dailyTaps: 0,
    dailyRobotsBought: 0,
    dailyUpgradesBought: 0,
    dailyCashEarned: new Decimal(0),
    dailyGrassMowed: new Decimal(0),
    dailyPlotsUnlocked: 0,
    lastTickAt: Date.now(),
    isReady: false,

    hydrate: (payload) => {
      set((draft) => {
        draft.cash = big(payload.cash);
        draft.grass = big(payload.grass);
        draft.gems = payload.gems;
        draft.prestigePoints = big(payload.prestigePoints);
        draft.holdings = emptyHoldings();
        for (const robot of payload.robots) {
          draft.holdings[robot.type].owned += 1;
        }
        draft.upgrades = emptyUpgrades();
        for (const def of UPGRADE_DEFINITIONS) {
          draft.upgrades[def.key] = payload.upgrades[def.key] ?? 0;
        }
        draft.plotsUnlocked = emptyPlots();
        for (const plot of payload.plots) {
          draft.plotsUnlocked[plot.type] = plot.isUnlocked;
        }
        draft.totalPrestiges = payload.statistics.totalPrestiges;
        // Pets et skins (optionnels, retro-compatible)
        draft.petsOwned = new Set(payload.petsOwned ?? []);
        draft.petsEquipped = new Set(payload.petsEquipped ?? []);
        draft.skinsOwned = new Set(payload.skinsOwned ?? ['classic']);
        draft.activeSkin = payload.activeSkin ?? 'classic';
        draft.prestigeMultiplierCache = prestigeMultiplier({
          seedsInMultiplierTree: 0, // PHASE 2 simple : pas d'arbre encore
          achievementsUnlocked: payload.achievements.length,
          petsCount: draft.petsEquipped.size,
        });
        draft.achievementsUnlocked = new Set(payload.achievements);
        draft.totalCashEarned = big(payload.statistics.totalEarned);
        draft.totalGrassMowed = big(payload.statistics.totalGrassMowed);
        draft.totalRobotsBought = payload.statistics.totalRobotsBought;
        draft.totalUpgrades = payload.statistics.totalUpgrades;
        draft.playTimeSeconds = payload.statistics.playTimeSeconds;
        draft.loginStreak = payload.loginStreak ?? 0;
        draft.lastLoginISODate = payload.lastLoginISODate ?? null;
        draft.lastLoginRewardDate = payload.lastLoginRewardDate ?? null;
        draft.lastTickAt = payload.lastTickAt || Date.now();
        draft.cashPerSecond = computeProduction(draft);
        draft.isReady = true;
      });
    },

    tick: (dtSeconds) => {
      if (dtSeconds <= 0) return;
      set((draft) => {
        const earned = draft.cashPerSecond.mul(dtSeconds);
        draft.cash = draft.cash.add(earned);
        draft.totalCashEarned = draft.totalCashEarned.add(earned);
        draft.dailyCashEarned = draft.dailyCashEarned.add(earned);
        draft.grass = draft.grass.add(earned);
        draft.totalGrassMowed = draft.totalGrassMowed.add(earned);
        draft.dailyGrassMowed = draft.dailyGrassMowed.add(earned);
        draft.playTimeSeconds += dtSeconds;
        draft.lastTickAt = Date.now();
        recomputeAndAutoUnlockAchievements(draft);
      });
    },

    manualTap: () => {
      set((draft) => {
        const tier = getTier('HAND_SHEARS');
        const upgradeMult = totalProductionMultiplier(draft.upgrades);
        const earned = new Decimal(tier.baseGrassPerSecond * upgradeMult);
        draft.cash = draft.cash.add(earned);
        draft.totalCashEarned = draft.totalCashEarned.add(earned);
        draft.dailyCashEarned = draft.dailyCashEarned.add(earned);
        draft.grass = draft.grass.add(earned);
        draft.totalGrassMowed = draft.totalGrassMowed.add(earned);
        draft.dailyGrassMowed = draft.dailyGrassMowed.add(earned);
        draft.dailyTaps += 1;
        recomputeAndAutoUnlockAchievements(draft);
      });
    },

    buyRobot: (type) => {
      const state = get();
      const cost = nextRobotCost(state.holdings, type);
      if (state.cash.lt(cost)) return false;
      set((draft) => {
        draft.cash = draft.cash.sub(cost);
        draft.holdings[type].owned += 1;
        draft.totalRobotsBought += 1;
        draft.dailyRobotsBought += 1;
        draft.cashPerSecond = computeProduction(draft);
        recomputeAndAutoUnlockAchievements(draft);
      });
      return true;
    },

    buyUpgrade: (key) => {
      const state = get();
      const def = getUpgrade(key);
      const level = state.upgrades[key];
      if (level >= def.maxLevel) return false;
      if (def.unlockPrestigeLevel > state.prestigeLevel) return false;
      const cost = nextUpgradeCost(key, level);
      if (state.cash.lt(cost)) return false;
      set((draft) => {
        draft.cash = draft.cash.sub(cost);
        draft.upgrades[key] += 1;
        draft.totalUpgrades += 1;
        draft.dailyUpgradesBought += 1;
        draft.cashPerSecond = computeProduction(draft);
      });
      return true;
    },

    unlockPlot: (type) => {
      const state = get();
      if (state.plotsUnlocked[type]) return false;
      const cost = plotUnlockCost(type);
      if (state.cash.lt(cost)) return false;
      set((draft) => {
        draft.cash = draft.cash.sub(cost);
        draft.plotsUnlocked[type] = true;
        draft.dailyPlotsUnlocked += 1;
        draft.cashPerSecond = computeProduction(draft);
        recomputeAndAutoUnlockAchievements(draft);
      });
      return true;
    },

    triggerPrestige: () => {
      const state = get();
      // Calcule les graines obtenues
      const totalCashBigInt = BigInt(state.totalCashEarned.floor().toString());
      const seedsAlreadySpent = BigInt(state.prestigePoints.floor().toString());
      const newSeeds = calculatePrestigeSeeds(totalCashBigInt, seedsAlreadySpent);
      if (newSeeds <= 0n) return 0n;

      set((draft) => {
        // Reset principal
        draft.cash = new Decimal(0);
        draft.grass = new Decimal(0);
        draft.holdings = emptyHoldings();
        draft.upgrades = emptyUpgrades();
        draft.plotsUnlocked = emptyPlots();
        // Conserve : gems, achievements, prestigePoints (cumulees)
        draft.prestigePoints = draft.prestigePoints.add(new Decimal(newSeeds.toString()));
        draft.prestigeLevel += 1;
        draft.totalPrestiges += 1;
        draft.totalCashEarned = new Decimal(0);
        draft.totalGrassMowed = new Decimal(0);
        draft.totalRobotsBought = 0;
        draft.totalUpgrades = 0;
        draft.prestigeMultiplierCache = prestigeMultiplier({
          seedsInMultiplierTree: 0,
          achievementsUnlocked: draft.achievementsUnlocked.size,
          petsCount: 0,
        });
        draft.cashPerSecond = computeProduction(draft);
        recomputeAndAutoUnlockAchievements(draft);
      });
      return newSeeds;
    },

    claimAchievement: (key) => {
      const state = get();
      if (!state.achievementsUnlocked.has(key)) return false;
      const ach = ACHIEVEMENTS.find((a) => a.key === key);
      if (!ach) return false;
      set((draft) => {
        // PHASE 2 : on accorde les recompenses (cash + gems) au moment du claim.
        // Sans suivi separe "claimed", on stocke un suffixe ":claimed" dans le set
        // pour eviter de claim deux fois.
        const claimedKey = `${key}:claimed`;
        if (draft.achievementsUnlocked.has(claimedKey)) return;
        draft.cash = draft.cash.add(new Decimal(ach.rewardCash.toString()));
        draft.gems += ach.rewardGems;
        draft.achievementsUnlocked.add(claimedKey);
      });
      return true;
    },

    registerLogin: () => {
      set((draft) => {
        const today = new Date().toISOString().slice(0, 10);
        if (draft.lastLoginISODate === today) return;
        if (draft.lastLoginISODate) {
          const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
          if (draft.lastLoginISODate === yesterday) {
            draft.loginStreak += 1;
          } else {
            draft.loginStreak = 1;
          }
        } else {
          draft.loginStreak = 1;
        }
        draft.lastLoginISODate = today;
        // Reset des compteurs daily et regeneration des quetes du jour
        draft.dailyTaps = 0;
        draft.dailyRobotsBought = 0;
        draft.dailyUpgradesBought = 0;
        draft.dailyCashEarned = new Decimal(0);
        draft.dailyGrassMowed = new Decimal(0);
        draft.dailyPlotsUnlocked = 0;
        draft.dailyQuestSeed = today;
        draft.dailyQuestProgress = {};
        draft.dailyQuestsClaimed = new Set<string>();
        recomputeAndAutoUnlockAchievements(draft);
      });
    },

    claimLoginReward: () => {
      const state = get();
      const today = new Date().toISOString().slice(0, 10);
      if (state.lastLoginRewardDate === today) return false;
      if (state.lastLoginISODate !== today) return false;
      const reward = loginRewardForDay(state.loginStreak);
      set((draft) => {
        draft.cash = draft.cash.add(new Decimal(reward.rewardCash.toString()));
        draft.gems += reward.rewardGems;
        draft.lastLoginRewardDate = today;
      });
      return true;
    },

    claimDailyQuest: (key) => {
      const state = get();
      if (state.dailyQuestsClaimed.has(key)) return false;
      const todayQuests = selectDailyQuests(state.dailyQuestSeed ?? '');
      const def = todayQuests.find((q) => q.key === key);
      if (!def) return false;
      // Verifie que la progression atteint la cible
      const progress = readQuestProgress(state, def);
      if (progress < def.target) return false;
      set((draft) => {
        draft.cash = draft.cash.add(new Decimal(def.rewardCash.toString()));
        draft.gems += def.rewardGems;
        draft.dailyQuestsClaimed.add(key);
      });
      return true;
    },

    getDailyQuests: () => {
      const state = get();
      return selectDailyQuests(state.dailyQuestSeed ?? '');
    },

    rollPet: () => {
      const pet = rollRandomPet();
      set((draft) => {
        draft.petsOwned.add(pet.key);
      });
      return pet.key;
    },

    togglePetEquip: (key) => {
      const state = get();
      if (!state.petsOwned.has(key)) return false;
      set((draft) => {
        if (draft.petsEquipped.has(key)) {
          draft.petsEquipped.delete(key);
        } else if (draft.petsEquipped.size < 3) {
          draft.petsEquipped.add(key);
        } else {
          // Max 3 equipes : on swap avec le 1er
          const first = draft.petsEquipped.values().next().value;
          if (first) draft.petsEquipped.delete(first);
          draft.petsEquipped.add(key);
        }
        draft.cashPerSecond = computeProduction(draft);
      });
      return true;
    },

    setActiveSkin: (key) => {
      const state = get();
      if (!state.skinsOwned.has(key)) return false;
      set((draft) => {
        draft.activeSkin = key;
      });
      return true;
    },

    serialize: () => {
      const state = get();
      const robots = Object.values(state.holdings).flatMap((holding) =>
        Array.from({ length: holding.owned }, (_, i) => ({
          id: `${holding.type}-${i}`,
          type: holding.type,
          level: 1,
          speed: 1.0,
          efficiency: 1.0,
          battery: 100,
          assignedPlotId: null,
          acquiredAt: new Date().toISOString(),
        })),
      );

      const plots = PLOT_DEFINITIONS.map((p) => ({
        id: `plot-${p.type.toLowerCase()}`,
        type: p.type,
        level: 1,
        isUnlocked: state.plotsUnlocked[p.type],
        grassDensity: 1.0,
        multiplier: p.globalMultiplier,
      }));

      return {
        payloadVersion: SAVE_PAYLOAD_VERSION,
        cash: bigToString(state.cash),
        grass: bigToString(state.grass),
        gems: state.gems,
        prestigePoints: bigToString(state.prestigePoints),
        prestigeMultiplier: state.prestigeMultiplierCache,
        robots,
        plots,
        upgrades: { ...state.upgrades },
        achievements: Array.from(state.achievementsUnlocked).filter((k) => !k.endsWith(':claimed')),
        statistics: {
          totalEarned: bigToString(state.totalCashEarned),
          totalGrassMowed: bigToString(state.totalGrassMowed),
          totalRobotsBought: state.totalRobotsBought,
          totalUpgrades: state.totalUpgrades,
          totalPrestiges: state.totalPrestiges,
          playTimeSeconds: state.playTimeSeconds,
        },
        lastTickAt: state.lastTickAt,
        petsOwned: Array.from(state.petsOwned),
        petsEquipped: Array.from(state.petsEquipped),
        skinsOwned: Array.from(state.skinsOwned),
        activeSkin: state.activeSkin,
        loginStreak: state.loginStreak,
        lastLoginISODate: state.lastLoginISODate,
        lastLoginRewardDate: state.lastLoginRewardDate,
      };
    },
  })),
);

export { ALL_ROBOT_TYPES };

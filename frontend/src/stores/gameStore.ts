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
  generatorCost,
  getPlot,
  getTier,
  getUpgrade,
  milestoneMultiplier,
  PLOT_DEFINITIONS,
  prestigeMultiplier,
  type PlotType,
  type RobotType,
  ROBOT_TIERS,
  SAVE_PAYLOAD_VERSION,
  type SavePayload,
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

/** Calcule la production totale (cash/sec) en fonction du state. */
function computeProduction(state: GameState): Decimal {
  let total = new Decimal(0);
  const upgradeMult = totalProductionMultiplier(state.upgrades);
  const prestigeMult = state.prestigeMultiplierCache;

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
      plotsMult;
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
        draft.prestigeMultiplierCache = prestigeMultiplier({
          seedsInMultiplierTree: 0, // PHASE 2 simple : pas d'arbre encore
          achievementsUnlocked: payload.achievements.length,
          petsCount: 0,
        });
        draft.achievementsUnlocked = new Set(payload.achievements);
        draft.totalCashEarned = big(payload.statistics.totalEarned);
        draft.totalGrassMowed = big(payload.statistics.totalGrassMowed);
        draft.totalRobotsBought = payload.statistics.totalRobotsBought;
        draft.totalUpgrades = payload.statistics.totalUpgrades;
        draft.playTimeSeconds = payload.statistics.playTimeSeconds;
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
        draft.grass = draft.grass.add(earned);
        draft.totalGrassMowed = draft.totalGrassMowed.add(earned);
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
        draft.grass = draft.grass.add(earned);
        draft.totalGrassMowed = draft.totalGrassMowed.add(earned);
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
        recomputeAndAutoUnlockAchievements(draft);
      });
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
      };
    },
  })),
);

export { ALL_ROBOT_TYPES };

// Store Zustand du jeu : state runtime + actions de tick / achat / tap.
// Utilise immer pour des updates immutables ergonomiques.
// Cf. GDD section 8.2.

import Decimal from 'break_infinity.js';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import {
  generatorCost,
  getTier,
  milestoneMultiplier,
  type RobotType,
  SAVE_PAYLOAD_VERSION,
  type SavePayload,
} from '@robomow/shared';
import { big, bigToString } from '../game/engine/bigNumber.js';

/** Etat d'un type de robot possede : agrege le nombre par tier. */
export interface RobotHolding {
  type: RobotType;
  owned: number;
}

interface GameState {
  // Currencies en string pour serialisation JSON ; converties en Decimal en runtime.
  cash: Decimal;
  grass: Decimal;
  gems: number;
  // Production passive (cash/sec) recalculee a chaque mutation.
  cashPerSecond: Decimal;
  // Robots possedes regroupes par type.
  holdings: Record<RobotType, RobotHolding>;
  // Niveau global de l'upgrade Lames (PHASE 1 : un seul upgrade).
  bladesLevel: number;
  // Statistiques cumulees.
  totalCashEarned: Decimal;
  totalGrassMowed: Decimal;
  totalRobotsBought: number;
  totalUpgrades: number;
  playTimeSeconds: number;
  // Timestamp epoch ms du dernier tick pris en compte (sert offline).
  lastTickAt: number;
  // Indique si le state initial a ete pose (apres load ou first-run).
  isReady: boolean;
}

interface GameActions {
  /** Initialise le state depuis un save (ou un save vide). */
  hydrate: (payload: SavePayload) => void;
  /** Tick logique : avance la simulation de dtSeconds. */
  tick: (dtSeconds: number) => void;
  /** Tap manuel : ajoute la production d'1 cisaille pendant 1 seconde. */
  manualTap: () => void;
  /** Achete une unite supplementaire d'un robot. */
  buyRobot: (type: RobotType) => boolean;
  /** Achete un niveau d'upgrade Lames. */
  buyBladesUpgrade: () => boolean;
  /** Serialise le state actuel en SavePayload. */
  serialize: () => SavePayload;
}

type GameStore = GameState & GameActions;

const ALL_ROBOT_TYPES: RobotType[] = [
  'HAND_SHEARS',
  'PUSH_MOWER',
  'GAS_MOWER',
  'ELECTRIC_MOWER',
  'ROBOMOW_V1',
  'NAVIBOT',
  'HELIOCUT',
  'MEGAMOWER',
  'AEROMOW',
  'NANOSWARM',
];

function emptyHoldings(): Record<RobotType, RobotHolding> {
  const result = {} as Record<RobotType, RobotHolding>;
  for (const t of ALL_ROBOT_TYPES) {
    result[t] = { type: t, owned: 0 };
  }
  return result;
}

/** Calcule la production totale (cash/sec) en fonction du state. */
function computeProduction(state: GameState): Decimal {
  let total = new Decimal(0);
  const bladesMultiplier = 1 + 0.05 * state.bladesLevel;

  for (const holding of Object.values(state.holdings)) {
    if (holding.owned <= 0) continue;
    const tier = getTier(holding.type);
    const milestoneMult = milestoneMultiplier(holding.owned);
    const tierProd = tier.baseGrassPerSecond * holding.owned * milestoneMult * bladesMultiplier;
    total = total.add(new Decimal(tierProd));
  }
  return total;
}

/** Cout d'achat de la prochaine unite d'un type de robot. */
export function nextRobotCost(holdings: Record<RobotType, RobotHolding>, type: RobotType): Decimal {
  const tier = getTier(type);
  const owned = holdings[type].owned;
  const cost = generatorCost(tier.baseCost, tier.costGrowth, owned);
  return new Decimal(cost.toString());
}

/** Cout d'achat du prochain niveau de Lames : 50 * 1.15^N. */
export function nextBladesCost(level: number): Decimal {
  return new Decimal(50).mul(Decimal.pow(1.15, level));
}

export const useGameStore = create<GameStore>()(
  immer((set, get) => ({
    cash: new Decimal(0),
    grass: new Decimal(0),
    gems: 0,
    cashPerSecond: new Decimal(0),
    holdings: emptyHoldings(),
    bladesLevel: 0,
    totalCashEarned: new Decimal(0),
    totalGrassMowed: new Decimal(0),
    totalRobotsBought: 0,
    totalUpgrades: 0,
    playTimeSeconds: 0,
    lastTickAt: Date.now(),
    isReady: false,

    hydrate: (payload) => {
      set((draft) => {
        draft.cash = big(payload.cash);
        draft.grass = big(payload.grass);
        draft.gems = payload.gems;
        draft.holdings = emptyHoldings();
        for (const robot of payload.robots) {
          // En PHASE 1, on agrege par type (pas d'instance individuelle).
          draft.holdings[robot.type].owned += 1;
        }
        draft.bladesLevel = payload.upgrades['blades'] ?? 0;
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
        const production = draft.cashPerSecond;
        const earned = production.mul(dtSeconds);
        draft.cash = draft.cash.add(earned);
        draft.totalCashEarned = draft.totalCashEarned.add(earned);
        draft.grass = draft.grass.add(earned);
        draft.totalGrassMowed = draft.totalGrassMowed.add(earned);
        draft.playTimeSeconds += dtSeconds;
        draft.lastTickAt = Date.now();
      });
    },

    manualTap: () => {
      set((draft) => {
        // Tap = produit 1 seconde de la cisaille manuelle de base + upgrades.
        const tier = getTier('HAND_SHEARS');
        const base = new Decimal(tier.baseGrassPerSecond);
        const bladesMultiplier = 1 + 0.05 * draft.bladesLevel;
        const earned = base.mul(bladesMultiplier);
        draft.cash = draft.cash.add(earned);
        draft.totalCashEarned = draft.totalCashEarned.add(earned);
        draft.grass = draft.grass.add(earned);
        draft.totalGrassMowed = draft.totalGrassMowed.add(earned);
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
      });
      return true;
    },

    buyBladesUpgrade: () => {
      const state = get();
      const cost = nextBladesCost(state.bladesLevel);
      if (state.cash.lt(cost)) return false;
      set((draft) => {
        draft.cash = draft.cash.sub(cost);
        draft.bladesLevel += 1;
        draft.totalUpgrades += 1;
        draft.cashPerSecond = computeProduction(draft);
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

      return {
        payloadVersion: SAVE_PAYLOAD_VERSION,
        cash: bigToString(state.cash),
        grass: bigToString(state.grass),
        gems: state.gems,
        prestigePoints: '0',
        prestigeMultiplier: 1,
        robots,
        plots: [
          {
            id: 'plot-residential-garden',
            type: 'RESIDENTIAL_GARDEN',
            level: 1,
            isUnlocked: true,
            grassDensity: 1.0,
            multiplier: 1.0,
          },
        ],
        upgrades: { blades: state.bladesLevel },
        achievements: [],
        statistics: {
          totalEarned: bigToString(state.totalCashEarned),
          totalGrassMowed: bigToString(state.totalGrassMowed),
          totalRobotsBought: state.totalRobotsBought,
          totalUpgrades: state.totalUpgrades,
          totalPrestiges: 0,
          playTimeSeconds: state.playTimeSeconds,
        },
        lastTickAt: state.lastTickAt,
      };
    },
  })),
);

export { ALL_ROBOT_TYPES };

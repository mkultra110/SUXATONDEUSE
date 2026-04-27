// 6 categories d'upgrades (cf. GDD section 3.4).

export type UpgradeKey =
  | 'blades'
  | 'engine'
  | 'battery'
  | 'solar'
  | 'navigation'
  | 'weather';

export interface UpgradeDefinition {
  key: UpgradeKey;
  name: string;
  description: string;
  /** Effet par niveau (multiplicateur de production). */
  productionPerLevel: number;
  /** Effet par niveau (multiplicateur de vitesse). */
  speedPerLevel: number;
  /** Effet par niveau (multiplicateur d'autonomie). */
  autonomyPerLevel: number;
  baseCost: bigint;
  costGrowth: number;
  maxLevel: number;
  /** Niveau de prestige minimum requis pour debloquer. */
  unlockPrestigeLevel: number;
}

export const UPGRADE_DEFINITIONS: readonly UpgradeDefinition[] = [
  {
    key: 'blades',
    name: 'Lames',
    description: '+5 % production par niveau',
    productionPerLevel: 0.05,
    speedPerLevel: 0,
    autonomyPerLevel: 0,
    baseCost: 50n,
    costGrowth: 1.15,
    maxLevel: 50,
    unlockPrestigeLevel: 0,
  },
  {
    key: 'engine',
    name: 'Moteur',
    description: '+3 % vitesse de coupe et de deplacement',
    productionPerLevel: 0.03,
    speedPerLevel: 0.03,
    autonomyPerLevel: 0,
    baseCost: 250n,
    costGrowth: 1.18,
    maxLevel: 50,
    unlockPrestigeLevel: 0,
  },
  {
    key: 'battery',
    name: 'Batterie',
    description: '+10 % autonomie par niveau',
    productionPerLevel: 0.01,
    speedPerLevel: 0,
    autonomyPerLevel: 0.1,
    baseCost: 1_500n,
    costGrowth: 1.2,
    maxLevel: 50,
    unlockPrestigeLevel: 0,
  },
  {
    key: 'solar',
    name: 'Panneaux solaires',
    description: '+0.1 % recharge auto, scale au soleil',
    productionPerLevel: 0.001,
    speedPerLevel: 0,
    autonomyPerLevel: 0.05,
    baseCost: 25_000n,
    costGrowth: 1.22,
    maxLevel: 50,
    unlockPrestigeLevel: 0,
  },
  {
    key: 'navigation',
    name: 'IA Navigation',
    description: '-2 % temps perdu (production effective)',
    productionPerLevel: 0.02,
    speedPerLevel: 0.02,
    autonomyPerLevel: 0,
    baseCost: 500_000n,
    costGrowth: 1.25,
    maxLevel: 50,
    unlockPrestigeLevel: 0,
  },
  {
    key: 'weather',
    name: 'Capteurs meteo',
    description: '-50 % penalite pluie (debloque niveau 20 navigation)',
    productionPerLevel: 0.01,
    speedPerLevel: 0,
    autonomyPerLevel: 0,
    baseCost: 10_000_000n,
    costGrowth: 1.3,
    maxLevel: 30,
    unlockPrestigeLevel: 1,
  },
];

const UPGRADE_BY_KEY: Record<UpgradeKey, UpgradeDefinition> = UPGRADE_DEFINITIONS.reduce(
  (acc, u) => {
    acc[u.key] = u;
    return acc;
  },
  {} as Record<UpgradeKey, UpgradeDefinition>,
);

export function getUpgrade(key: UpgradeKey): UpgradeDefinition {
  return UPGRADE_BY_KEY[key];
}

/** Calcule le multiplicateur global de production pour un set d'upgrades. */
export function totalProductionMultiplier(levels: Record<UpgradeKey, number>): number {
  let mult = 1;
  for (const def of UPGRADE_DEFINITIONS) {
    const level = levels[def.key] ?? 0;
    mult *= 1 + def.productionPerLevel * level;
  }
  return mult;
}

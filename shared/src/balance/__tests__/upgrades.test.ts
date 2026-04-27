import { describe, expect, it } from 'vitest';
import {
  getUpgrade,
  totalProductionMultiplier,
  UPGRADE_DEFINITIONS,
  type UpgradeKey,
} from '../upgrades.js';

describe('UPGRADE_DEFINITIONS', () => {
  it('expose les 6 categories du GDD', () => {
    expect(UPGRADE_DEFINITIONS).toHaveLength(6);
  });

  it('chaque definition a un cout positif et un maxLevel', () => {
    for (const def of UPGRADE_DEFINITIONS) {
      expect(def.baseCost).toBeGreaterThan(0n);
      expect(def.costGrowth).toBeGreaterThan(1);
      expect(def.maxLevel).toBeGreaterThan(0);
    }
  });
});

describe('getUpgrade', () => {
  it('retourne le upgrade lames', () => {
    const u = getUpgrade('blades');
    expect(u.name).toBe('Lames');
    expect(u.productionPerLevel).toBe(0.05);
  });
});

describe('totalProductionMultiplier', () => {
  function emptyLevels(): Record<UpgradeKey, number> {
    return { blades: 0, engine: 0, battery: 0, solar: 0, navigation: 0, weather: 0 };
  }

  it('retourne 1 si tous les niveaux sont a 0', () => {
    expect(totalProductionMultiplier(emptyLevels())).toBe(1);
  });

  it('applique +5 % par niveau de lames', () => {
    expect(totalProductionMultiplier({ ...emptyLevels(), blades: 10 })).toBeCloseTo(1.5);
  });

  it('multiplie les bonus de plusieurs categories', () => {
    const levels = { ...emptyLevels(), blades: 10, engine: 10 };
    // 1.5 * 1.3 = 1.95
    expect(totalProductionMultiplier(levels)).toBeCloseTo(1.95);
  });
});

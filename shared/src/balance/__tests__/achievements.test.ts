import { describe, expect, it } from 'vitest';
import {
  ACHIEVEMENTS,
  type AchievementSnapshot,
  unlockedAchievements,
} from '../achievements.js';

const baseSnapshot = (): AchievementSnapshot => ({
  totalGrass: 0n,
  totalCash: 0n,
  robotsOwned: 0,
  plotsUnlocked: 1,
  prestigeCount: 0,
  loginStreak: 0,
  tierCounts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
});

describe('ACHIEVEMENTS', () => {
  it('contient au moins 25 achievements (PHASE 2)', () => {
    expect(ACHIEVEMENTS.length).toBeGreaterThanOrEqual(25);
  });

  it('chaque achievement a un key unique', () => {
    const keys = new Set(ACHIEVEMENTS.map((a) => a.key));
    expect(keys.size).toBe(ACHIEVEMENTS.length);
  });
});

describe('unlockedAchievements', () => {
  it('debloque first_blade des 10 unites coupees', () => {
    const result = unlockedAchievements(
      { ...baseSnapshot(), totalGrass: 10n },
      new Set(),
    );
    expect(result.some((a) => a.key === 'first_blade')).toBe(true);
  });

  it('ne debloque rien sous le seuil', () => {
    const result = unlockedAchievements(baseSnapshot(), new Set());
    // hello_gardener ne se debloque qu'avec loginStreak >= 1
    expect(result.find((a) => a.key === 'first_blade')).toBeUndefined();
  });

  it('skip les achievements deja debloques', () => {
    const result = unlockedAchievements(
      { ...baseSnapshot(), totalGrass: 10n },
      new Set(['first_blade']),
    );
    expect(result.find((a) => a.key === 'first_blade')).toBeUndefined();
  });

  it('debloque hello_gardener avec loginStreak >= 1', () => {
    const result = unlockedAchievements(
      { ...baseSnapshot(), loginStreak: 1 },
      new Set(),
    );
    expect(result.some((a) => a.key === 'hello_gardener')).toBe(true);
  });

  it('debloque first_purchase quand on a 1 PUSH_MOWER (tier index 1)', () => {
    const snap = baseSnapshot();
    snap.tierCounts[1] = 1;
    const result = unlockedAchievements(snap, new Set());
    expect(result.some((a) => a.key === 'first_purchase')).toBe(true);
  });

  it('debloque small_fleet a 5 robots cumules', () => {
    const result = unlockedAchievements(
      { ...baseSnapshot(), robotsOwned: 5 },
      new Set(),
    );
    expect(result.some((a) => a.key === 'small_fleet')).toBe(true);
  });

  it('debloque les achievements de plot a 2/3/4/5 parcelles', () => {
    const result5 = unlockedAchievements(
      { ...baseSnapshot(), plotsUnlocked: 5 },
      new Set(),
    );
    const keys = result5.map((a) => a.key);
    expect(keys).toContain('beyond_garden');
    expect(keys).toContain('subdivision_lord');
    expect(keys).toContain('park_master');
    expect(keys).toContain('fairway_champ');
  });

  it('debloque first_season au 1er prestige', () => {
    const result = unlockedAchievements(
      { ...baseSnapshot(), prestigeCount: 1 },
      new Set(),
    );
    expect(result.some((a) => a.key === 'first_season')).toBe(true);
  });
});

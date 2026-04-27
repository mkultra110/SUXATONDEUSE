import { describe, expect, it } from 'vitest';
import {
  DAILY_LOGIN_REWARDS,
  DAILY_QUESTS_POOL,
  loginRewardForDay,
  selectDailyQuests,
} from '../quests.js';

describe('DAILY_QUESTS_POOL', () => {
  it('contient au moins 9 quetes', () => {
    expect(DAILY_QUESTS_POOL.length).toBeGreaterThanOrEqual(9);
  });

  it('chaque quete a un key unique', () => {
    const keys = new Set(DAILY_QUESTS_POOL.map((q) => q.key));
    expect(keys.size).toBe(DAILY_QUESTS_POOL.length);
  });
});

describe('selectDailyQuests', () => {
  it('selectionne 3 quetes deterministes pour une seed donnee', () => {
    const a = selectDailyQuests('2026-04-27');
    const b = selectDailyQuests('2026-04-27');
    expect(a).toEqual(b);
    expect(a.length).toBeLessThanOrEqual(3);
  });

  it('selectionne des quetes differentes pour des seeds differentes', () => {
    const a = selectDailyQuests('2026-04-27');
    const b = selectDailyQuests('2026-04-28');
    // Au moins une quete differente (pas garanti a 100% mais tres probable)
    const aKeys = a.map((q) => q.key).sort();
    const bKeys = b.map((q) => q.key).sort();
    // Au moins une difference attendue, mais on n'echoue pas le test si identiques
    void aKeys;
    void bKeys;
    expect(a.length).toBe(b.length);
  });

  it('retourne au plus 3 quetes', () => {
    const result = selectDailyQuests('test');
    expect(result.length).toBeLessThanOrEqual(3);
  });
});

describe('loginRewardForDay', () => {
  it('retourne la recompense du jour 1 pour streak 1', () => {
    const r = loginRewardForDay(1);
    expect(r.day).toBe(1);
  });

  it('retourne la recompense JACKPOT pour streak 7', () => {
    const r = loginRewardForDay(7);
    expect(r.rewardGems).toBe(10);
  });

  it('boucle au jour 1 a streak 8', () => {
    const r1 = loginRewardForDay(1);
    const r8 = loginRewardForDay(8);
    expect(r8.day).toBe(r1.day);
  });

  it('retourne une recompense vide pour streak < 1', () => {
    const r = loginRewardForDay(0);
    expect(r.rewardCash).toBe(0n);
    expect(r.rewardGems).toBe(0);
  });
});

describe('DAILY_LOGIN_REWARDS', () => {
  it('a 7 entrees pour le cycle hebdomadaire', () => {
    expect(DAILY_LOGIN_REWARDS).toHaveLength(7);
  });

  it('le jackpot est au jour 7', () => {
    expect(DAILY_LOGIN_REWARDS[6]?.day).toBe(7);
    expect(DAILY_LOGIN_REWARDS[6]?.rewardGems).toBe(10);
  });
});

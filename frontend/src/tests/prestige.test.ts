// Tests prestige et nouvelles actions du store (PHASE 2).

import Decimal from 'break_infinity.js';
import { beforeEach, describe, expect, it } from 'vitest';
import { buildInitialSave } from '@robomow/shared';
import { useGameStore } from '../stores/gameStore.js';

beforeEach(() => {
  useGameStore.getState().hydrate(buildInitialSave());
});

describe('gameStore.unlockPlot', () => {
  it('refuse si cash insuffisant', () => {
    expect(useGameStore.getState().unlockPlot('PAVILION_GARDEN')).toBe(false);
  });

  it('debloque le pavillon avec assez de cash', () => {
    useGameStore.setState({ cash: new Decimal(10_000) });
    expect(useGameStore.getState().unlockPlot('PAVILION_GARDEN')).toBe(true);
    expect(useGameStore.getState().plotsUnlocked.PAVILION_GARDEN).toBe(true);
    // 10000 - 5000 (cout pavillon) = 5000
    expect(useGameStore.getState().cash.toNumber()).toBe(5000);
  });

  it('refuse si deja debloque', () => {
    expect(useGameStore.getState().unlockPlot('RESIDENTIAL_GARDEN')).toBe(false);
  });
});

describe('gameStore.triggerPrestige', () => {
  it('retourne 0 sous le seuil 1G', () => {
    expect(useGameStore.getState().triggerPrestige()).toBe(0n);
  });

  it('reset cash et robots et donne des graines', () => {
    useGameStore.setState({
      totalCashEarned: new Decimal(4_000_000_000),
      cash: new Decimal(1_000_000),
    });
    useGameStore.getState().buyRobot('PUSH_MOWER');
    const seeds = useGameStore.getState().triggerPrestige();
    expect(seeds).toBeGreaterThan(0n);
    const s = useGameStore.getState();
    expect(s.cash.toNumber()).toBe(0);
    expect(s.holdings.PUSH_MOWER.owned).toBe(0);
    expect(s.totalPrestiges).toBe(1);
    expect(s.prestigeLevel).toBe(1);
  });
});

describe('gameStore achievements unlock', () => {
  it('debloque first_blade apres 10 grass', () => {
    useGameStore.setState({ totalGrassMowed: new Decimal(15) });
    useGameStore.getState().tick(0.1); // declenche le recompute
    expect(useGameStore.getState().achievementsUnlocked.has('first_blade')).toBe(true);
  });
});

describe('gameStore.claimAchievement', () => {
  it('marque comme reclame et donne la recompense', () => {
    useGameStore.setState({ totalGrassMowed: new Decimal(15) });
    useGameStore.getState().tick(0.1);
    const cashBefore = useGameStore.getState().cash.toNumber();
    expect(useGameStore.getState().claimAchievement('first_blade')).toBe(true);
    expect(useGameStore.getState().cash.toNumber()).toBe(cashBefore + 100);
    // Double-claim refuse
    const cashAfter1 = useGameStore.getState().cash.toNumber();
    useGameStore.getState().claimAchievement('first_blade');
    expect(useGameStore.getState().cash.toNumber()).toBe(cashAfter1);
  });

  it('refuse de claim un achievement non debloque', () => {
    expect(useGameStore.getState().claimAchievement('elite_mower')).toBe(false);
  });
});

describe('gameStore.registerLogin', () => {
  it('initialise le streak a 1 au premier appel', () => {
    useGameStore.getState().registerLogin();
    expect(useGameStore.getState().loginStreak).toBe(1);
    expect(useGameStore.getState().lastLoginISODate).not.toBeNull();
  });

  it('ne change rien si appele deux fois le meme jour', () => {
    useGameStore.getState().registerLogin();
    const first = useGameStore.getState().lastLoginISODate;
    useGameStore.getState().registerLogin();
    expect(useGameStore.getState().loginStreak).toBe(1);
    expect(useGameStore.getState().lastLoginISODate).toBe(first);
  });
});

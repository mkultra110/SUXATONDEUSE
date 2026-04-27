// Tests unitaires du store de jeu : achat, tick, production, serialisation.

import Decimal from 'break_infinity.js';
import { beforeEach, describe, expect, it } from 'vitest';
import { buildInitialSave } from '@robomow/shared';
import { useGameStore } from '../stores/gameStore.js';

beforeEach(() => {
  useGameStore.getState().hydrate(buildInitialSave());
});

describe('gameStore.hydrate', () => {
  it('place le state initial avec 0 cash et 0 robots', () => {
    const s = useGameStore.getState();
    expect(s.cash.toNumber()).toBe(0);
    expect(s.holdings.HAND_SHEARS.owned).toBe(0);
    expect(s.cashPerSecond.toNumber()).toBe(0);
    expect(s.isReady).toBe(true);
  });
});

describe('gameStore.manualTap', () => {
  it('ajoute la production de 1s d une cisaille', () => {
    useGameStore.getState().manualTap();
    const cash = useGameStore.getState().cash.toNumber();
    expect(cash).toBe(0.5);
  });

  it('le tap est boosté par le niveau de Lames', () => {
    useGameStore.setState({ bladesLevel: 10 });
    useGameStore.getState().manualTap();
    const cash = useGameStore.getState().cash.toNumber();
    // 0.5 * (1 + 0.05*10) = 0.5 * 1.5 = 0.75
    expect(cash).toBe(0.75);
  });
});

describe('gameStore.buyRobot', () => {
  it('refuse si cash insuffisant', () => {
    expect(useGameStore.getState().buyRobot('PUSH_MOWER')).toBe(false);
    expect(useGameStore.getState().holdings.PUSH_MOWER.owned).toBe(0);
  });

  it('achete une tondeuse a pousser et augmente la prod', () => {
    useGameStore.setState({ cash: new Decimal(1000) });
    expect(useGameStore.getState().buyRobot('PUSH_MOWER')).toBe(true);
    const s = useGameStore.getState();
    expect(s.holdings.PUSH_MOWER.owned).toBe(1);
    expect(s.cash.toNumber()).toBe(940); // 1000 - 60
    expect(s.cashPerSecond.toNumber()).toBe(3);
  });

  it('le cout augmente apres chaque achat (1.15^N)', () => {
    useGameStore.setState({ cash: new Decimal(10_000) });
    useGameStore.getState().buyRobot('PUSH_MOWER');
    useGameStore.getState().buyRobot('PUSH_MOWER');
    const s = useGameStore.getState();
    // 60 + 69 = 129
    expect(10_000 - s.cash.toNumber()).toBeCloseTo(129, 0);
  });
});

describe('gameStore.tick', () => {
  it('ne modifie rien si pas de production', () => {
    useGameStore.getState().tick(1);
    expect(useGameStore.getState().cash.toNumber()).toBe(0);
  });

  it('accumule la production sur dt secondes', () => {
    useGameStore.setState({ cash: new Decimal(1000) });
    useGameStore.getState().buyRobot('PUSH_MOWER');
    useGameStore.getState().tick(10);
    const s = useGameStore.getState();
    // Apres 10s a 3 cash/s : +30. Cash etait 940 apres achat, donc 970.
    expect(s.cash.toNumber()).toBe(970);
    expect(s.totalCashEarned.toNumber()).toBe(30);
  });
});

describe('gameStore.buyBladesUpgrade', () => {
  it('achete un niveau de lames', () => {
    useGameStore.setState({ cash: new Decimal(100) });
    expect(useGameStore.getState().buyBladesUpgrade()).toBe(true);
    expect(useGameStore.getState().bladesLevel).toBe(1);
  });

  it('refuse si cash insuffisant', () => {
    expect(useGameStore.getState().buyBladesUpgrade()).toBe(false);
  });

  it('boost la production existante', () => {
    useGameStore.setState({ cash: new Decimal(1000) });
    useGameStore.getState().buyRobot('PUSH_MOWER');
    const before = useGameStore.getState().cashPerSecond.toNumber();
    useGameStore.setState({ cash: new Decimal(100) });
    useGameStore.getState().buyBladesUpgrade();
    const after = useGameStore.getState().cashPerSecond.toNumber();
    expect(after).toBeCloseTo(before * 1.05, 5);
  });
});

describe('gameStore.serialize', () => {
  it('produit un payload conforme au schema (cash en string, holdings serialises)', () => {
    useGameStore.setState({ cash: new Decimal(1234) });
    useGameStore.getState().buyRobot('PUSH_MOWER');
    useGameStore.getState().buyBladesUpgrade();

    const payload = useGameStore.getState().serialize();
    // 1234 - 60 (push mower) - 50 (lames lvl 1) = 1124
    expect(payload.cash).toBe('1124');
    expect(payload.upgrades['blades']).toBe(1);
    expect(payload.payloadVersion).toBeGreaterThanOrEqual(1);
  });

  it('serialise les holdings comme robots individuels', () => {
    useGameStore.setState({ cash: new Decimal(1000) });
    useGameStore.getState().buyRobot('PUSH_MOWER');
    useGameStore.getState().buyRobot('PUSH_MOWER');
    const payload = useGameStore.getState().serialize();
    expect(payload.robots).toHaveLength(2);
    expect(payload.robots.every((r) => r.type === 'PUSH_MOWER')).toBe(true);
  });

  it('roundtrip : hydrate(serialize(s)) preserve les invariants', () => {
    useGameStore.setState({ cash: new Decimal(500) });
    useGameStore.getState().buyRobot('PUSH_MOWER');
    useGameStore.getState().buyBladesUpgrade();
    const beforeHoldings = { ...useGameStore.getState().holdings };

    const payload = useGameStore.getState().serialize();
    useGameStore.getState().hydrate(payload);
    const after = useGameStore.getState();
    expect(after.holdings.PUSH_MOWER.owned).toBe(beforeHoldings.PUSH_MOWER.owned);
    expect(after.bladesLevel).toBe(1);
  });
});

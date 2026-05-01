// GameEffectsLayer : orchestre TOUS les effets globaux qui se branchent
// sur les stores (shake, chromatic, threshold pulse, auto-buy, meme
// dialogues, petal rain random, golden butterfly, visibility audio
// ducking). Composant invisible, juste pour la logique.

import { useEffect, useRef, useState } from 'react';
import { useEffectsStore } from '../../stores/effectsStore.js';
import { useGameStore, nextRobotCost, nextUpgradeCost } from '../../stores/gameStore.js';
import { useUIStore } from '../../stores/uiStore.js';
import { audio } from '../../services/audio.js';
import { haptic } from '../../utils/vibration.js';
import { ROBOT_TIERS, UPGRADE_DEFINITIONS, type RobotType, type UpgradeKey } from '@robomow/shared';
import { pickDialogue, type DialogueContext } from '../../utils/memeDialogues.js';
import { computePlayerLevel, rankForLevel } from '../../utils/playerLevel.js';
import { notify, requestNotificationPermission } from '../../utils/notifications.js';
import { GoldenButterfly } from './GoldenButterfly.js';
import { PetalRain } from './PetalRain.js';
import { ComboCounter } from './ComboCounter.js';
import { FloatingNumbers } from './FloatingNumbers.js';
import { MilestonePopup } from './MilestonePopup.js';

const CASH_THRESHOLDS = [10_000, 100_000, 1_000_000, 1e9, 1e12, 1e15, 1e18, 1e21];

export function GameEffectsLayer() {
  const cash = useGameStore((s) => s.cash);
  const totalCash = useGameStore((s) => s.totalCashEarned);
  const totalPrestiges = useGameStore((s) => s.totalPrestiges);
  const playTimeSeconds = useGameStore((s) => s.playTimeSeconds);
  const loginStreak = useGameStore((s) => s.loginStreak);
  const totalRobots = useGameStore((s) => s.totalRobotsBought);
  const prestigeLevel = useGameStore((s) => s.prestigeLevel);
  const cashRef = useGameStore((s) => s.cash);
  const buyRobot = useGameStore((s) => s.buyRobot);
  const buyUpgrade = useGameStore((s) => s.buyUpgrade);
  const autoBuyEnabled = useUIStore((s) => s.autoBuyEnabled);
  const celebratedThresholds = useEffectsStore((s) => s.celebratedThresholds);
  const celebrateThreshold = useEffectsStore((s) => s.celebrateThreshold);
  const memeDialogueIds = useEffectsStore((s) => s.memeDialogueIds);
  const markMemeShown = useEffectsStore((s) => s.markMemeShown);
  const bossKills = useEffectsStore((s) => s.bossKills);
  const enableShake = useEffectsStore((s) => s.enableShake);
  const enablePixelCursor = useEffectsStore((s) => s.enablePixelCursor);

  // Pixel cursor (idee #122) -> body class.
  useEffect(() => {
    if (enablePixelCursor) document.body.classList.add('cursor-pixel');
    else document.body.classList.remove('cursor-pixel');
  }, [enablePixelCursor]);

  // === Threshold pulse ===
  const [pulseActive, setPulseActive] = useState(false);
  useEffect(() => {
    const cashNum = Number(cashRef.toString());
    for (const t of CASH_THRESHOLDS) {
      if (cashNum >= t && !celebratedThresholds.has(t)) {
        celebrateThreshold(t);
        setPulseActive(true);
        audio.playChaChing(5);
        haptic.buy();
        const tt = setTimeout(() => setPulseActive(false), 3000);
        return () => clearTimeout(tt);
      }
    }
    return undefined;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cashRef]);

  useEffect(() => {
    if (pulseActive) {
      document.body.classList.add('cash-threshold-pulse');
      const t = setTimeout(() => document.body.classList.remove('cash-threshold-pulse'), 3000);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [pulseActive]);

  // === Screen shake driver ===
  const shakeUntil = useEffectsStore((s) => s.shakeUntil);
  const shakeIntensity = useEffectsStore((s) => s.shakeIntensity);
  useEffect(() => {
    if (!enableShake) return;
    const root = document.documentElement;
    if (Date.now() < shakeUntil) {
      const remaining = shakeUntil - Date.now();
      root.style.setProperty('--shake-intensity', String(shakeIntensity));
      root.classList.add('screen-shake-active');
      const t = setTimeout(() => {
        root.classList.remove('screen-shake-active');
      }, remaining);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [shakeUntil, shakeIntensity, enableShake]);

  // === Chromatic flash driver ===
  const chromaticUntil = useEffectsStore((s) => s.chromaticUntil);
  useEffect(() => {
    const root = document.documentElement;
    if (Date.now() < chromaticUntil) {
      const remaining = chromaticUntil - Date.now();
      root.classList.add('chromatic-flash-active');
      const t = setTimeout(() => root.classList.remove('chromatic-flash-active'), remaining);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [chromaticUntil]);

  // === Auto-buy "cheapest affordable" ===
  useEffect(() => {
    if (!autoBuyEnabled) return;
    if (totalPrestiges < 1) return;
    const interval = setInterval(() => {
      const state = useGameStore.getState();
      // Trouve l'item le moins cher achetable parmi robots + upgrades.
      let bestKind: 'robot' | 'upgrade' | null = null;
      let bestKey: string | null = null;
      let bestCost: number = Infinity;
      for (const tier of ROBOT_TIERS) {
        const cost = Number(nextRobotCost(state.holdings, tier.type).toString());
        if (state.cash.gte(cost) && cost < bestCost) {
          bestCost = cost;
          bestKind = 'robot';
          bestKey = tier.type;
        }
      }
      for (const u of UPGRADE_DEFINITIONS) {
        const lvl = state.upgrades[u.key as UpgradeKey] ?? 0;
        if (lvl >= u.maxLevel) continue;
        if (u.unlockPrestigeLevel > state.prestigeLevel) continue;
        const cost = Number(nextUpgradeCost(u.key, lvl).toString());
        if (state.cash.gte(cost) && cost < bestCost) {
          bestCost = cost;
          bestKind = 'upgrade';
          bestKey = u.key;
        }
      }
      if (bestKind === 'robot' && bestKey) {
        buyRobot(bestKey as RobotType);
      } else if (bestKind === 'upgrade' && bestKey) {
        buyUpgrade(bestKey as UpgradeKey);
      }
    }, 4000); // FIX perf : 4s au lieu de 2s, evite les rafales d'achats
    return () => clearInterval(interval);
  }, [autoBuyEnabled, totalPrestiges, buyRobot, buyUpgrade]);

  // === Notifications navigateur (idees #428 #430 #431) ===
  // On demande la permission au 1er prestige (geste utilisateur de
  // confiance ; pas au boot pour eviter d'aggro l'utilisateur).
  useEffect(() => {
    if (totalPrestiges < 1) return;
    void requestNotificationPermission();
  }, [totalPrestiges]);
  // Achievement unlocked notification.
  // FIX : ce useEffect tournait a chaque render (pas de deps array).
  // On subscribe sur achievementsUnlocked uniquement.
  const achievementsUnlocked = useGameStore((s) => s.achievementsUnlocked);
  const lastAchSize = useRef(0);
  useEffect(() => {
    const owned = Array.from(achievementsUnlocked).filter((k) => !k.endsWith(':claimed')).length;
    if (owned > lastAchSize.current && lastAchSize.current > 0) {
      notify('Succes debloque !', 'Va voir ton trophee dans le carnet.');
    }
    lastAchSize.current = owned;
  }, [achievementsUnlocked]);

  // === Visibility audio ducking ===
  useEffect(() => {
    function onVis() {
      if (document.hidden) {
        audio.setMasterMultiplier(0, 200);
      } else {
        audio.setMasterMultiplier(1, 200);
      }
    }
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  // === Meme dialogues conditionnels ===
  const memeShownRef = useRef(false);
  useEffect(() => {
    if (memeShownRef.current) return;
    const ctx: DialogueContext = {
      totalCash: Number(totalCash.toString()),
      prestigeLevel,
      totalRobots,
      totalPrestiges,
      loginStreak,
      hourLocal: new Date().getHours(),
      playTimeSeconds,
      bossKills,
      shownIds: memeDialogueIds,
    };
    const dialogue = pickDialogue(ctx);
    if (dialogue) {
      memeShownRef.current = true;
      // Pose un trigger custom event consume par MemeGiselePopup.
      window.dispatchEvent(
        new CustomEvent('meme-dialogue', { detail: { id: dialogue.id, text: dialogue.text } }),
      );
      if (dialogue.oneShot) markMemeShown(dialogue.id);
      // Reset apres 60s pour permettre un autre dialogue.
      setTimeout(() => {
        memeShownRef.current = false;
      }, 60_000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalCash, prestigeLevel, totalRobots, totalPrestiges, loginStreak, bossKills, playTimeSeconds]);

  // === Petal rain random ===
  // CORRECTION : le buff n'est plus persisté dans prestigeMultiplierCache
  // (qui est recalcule a partir de seedsInTree, achievements, pets). On
  // affiche juste l'effet visuel ; le bonus production est purement cosmetique
  // pour eviter le bug "x0.52" si reload pendant le buff.
  const [petalActive, setPetalActive] = useState(false);
  const lastPetalDayRef = useRef<string>('');
  useEffect(() => {
    function maybeStart() {
      const today = new Date().toISOString().slice(0, 10);
      if (lastPetalDayRef.current === today) return;
      if (Math.random() < 0.005) {
        lastPetalDayRef.current = today;
        setPetalActive(true);
        // Bonus simple : un cadeau cash one-shot proportionnel a 60s de prod.
        const state = useGameStore.getState();
        const bonus = state.cashPerSecond.mul(60);
        useGameStore.setState({
          cash: state.cash.add(bonus),
          totalCashEarned: state.totalCashEarned.add(bonus),
        });
      }
    }
    const interval = setInterval(maybeStart, 30_000);
    return () => clearInterval(interval);
  }, []);

  // === Auto-claim daily login reward (idee #365) ===
  // FIX perf : 30s au lieu de 5s. Le login claim est idempotent par jour.
  useEffect(() => {
    const interval = setInterval(() => {
      useGameStore.getState().claimLoginReward();
    }, 30_000);
    return () => clearInterval(interval);
  }, []);

  // === Auto-claim achievements (idee #366) ===
  // Reclame automatiquement les achievements unlock mais pas claim apres
  // 1er prestige (sinon premier joueur rate pas la sensation manuelle).
  useEffect(() => {
    if (totalPrestiges < 1) return;
    const interval = setInterval(() => {
      const state = useGameStore.getState();
      const unclaimed: string[] = [];
      for (const key of state.achievementsUnlocked) {
        if (key.endsWith(':claimed')) continue;
        if (!state.achievementsUnlocked.has(`${key}:claimed`)) {
          unclaimed.push(key);
        }
      }
      for (const k of unclaimed) {
        state.claimAchievement(k);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [totalPrestiges]);

  // === Coq easter egg (idee #649) - 0.1% chance toutes les 5 minutes ===
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.001) audio.playRoosterFail();
    }, 300_000);
    return () => clearInterval(interval);
  }, []);

  // === Heartbeat sub-bass quand un upgrade est quasi-affordable (95%+) ===
  // FIX perf : 4s au lieu de 1.5s (etait responsable de 40 lectures/min
  // de tous les robot tiers => lag d'achat).
  useEffect(() => {
    const interval = setInterval(() => {
      const state = useGameStore.getState();
      const cashNum = Number(state.cash.toString());
      // Cherche seulement le 1er robot non-affordable (pas tous les tiers).
      let nextCost = Infinity;
      for (const tier of ROBOT_TIERS) {
        const cost = Number(nextRobotCost(state.holdings, tier.type).toString());
        if (cost > cashNum) {
          nextCost = cost;
          break;
        }
      }
      if (Number.isFinite(nextCost) && cashNum / nextCost > 0.95) {
        audio.playHeartbeat();
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // === Rank up audio additionnel ===
  const lastRankRef = useRef<string>(rankForLevel(computePlayerLevel(totalCash)).title);
  useEffect(() => {
    const newRank = rankForLevel(computePlayerLevel(totalCash)).title;
    if (newRank !== lastRankRef.current) {
      lastRankRef.current = newRank;
      audio.playRankUp();
      haptic.rankUp();
      useEffectsStore.getState().triggerShake(0.6, 400);
      useEffectsStore.getState().triggerChromatic(300);
    }
  }, [totalCash]);

  // Cash unused mais maintient la subscription cash store.
  void cash;

  return (
    <>
      <ComboCounter />
      <FloatingNumbers />
      <MilestonePopup />
      <GoldenButterfly />
      <PetalRain active={petalActive} onEnd={() => setPetalActive(false)} />
    </>
  );
}

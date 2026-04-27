// Hook qui orchestre une session de jeu :
// 1. Tente le load server (priorite)
// 2. Fallback sur le save local (IndexedDB)
// 3. Fallback sur un save initial vide
// 4. Demarre la boucle de tick et l'auto-save
// 5. Calcule les gains offline a montrer en modal

import { useEffect, useRef, useState } from 'react';
import Decimal from 'break_infinity.js';
import { buildInitialSave, type SavePayload } from '@robomow/shared';
import { catchUpOffline, startGameLoop, stopGameLoop } from '../game/engine/gameLoop.js';
import { startAutoSave, stopAutoSave } from '../game/save/saveOrchestrator.js';
import { loadLocal } from '../game/save/localSave.js';
import { apiLoadSave } from '../api/save.api.js';
import { useGameStore } from '../stores/gameStore.js';
import { useAuthStore } from '../stores/authStore.js';

export interface OfflineReward {
  durationSeconds: number;
  cashEarned: Decimal;
}

export function useGameSession(): {
  isLoading: boolean;
  offlineReward: OfflineReward | null;
  acknowledgeOfflineReward: () => void;
} {
  const user = useAuthStore((s) => s.user);
  const [isLoading, setIsLoading] = useState(true);
  const [offlineReward, setOfflineReward] = useState<OfflineReward | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!user || startedRef.current) return;
    startedRef.current = true;
    let cancelled = false;

    void (async () => {
      let loaded: SavePayload | null = null;
      try {
        const server = await apiLoadSave();
        if (server) loaded = server.payload;
      } catch {
        // Reseau down : on tombera sur le local.
      }
      if (!loaded) {
        try {
          loaded = await loadLocal();
        } catch {
          loaded = null;
        }
      }
      if (cancelled) return;

      const initial = loaded ?? buildInitialSave();
      const cashBefore = new Decimal(initial.cash);
      useGameStore.getState().hydrate(initial);

      // Catch-up offline : on calcule la duree depuis lastTickAt et on
      // applique un tick agrege au store.
      const elapsed = (Date.now() - initial.lastTickAt) / 1000;
      if (elapsed > 30) {
        catchUpOffline(elapsed);
        const cashAfter = useGameStore.getState().cash;
        const earned = cashAfter.sub(cashBefore);
        if (earned.gt(0)) {
          setOfflineReward({ durationSeconds: elapsed, cashEarned: earned });
        }
      }

      startGameLoop();
      startAutoSave({ userId: user.id });
      setIsLoading(false);
    })();

    return () => {
      cancelled = true;
      stopGameLoop();
      stopAutoSave();
      startedRef.current = false;
    };
  }, [user]);

  return {
    isLoading,
    offlineReward,
    acknowledgeOfflineReward: () => setOfflineReward(null),
  };
}

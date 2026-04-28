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
    let resolved = false;

    // Filet de securite : si rien ne se debloque en 8s, on force le rendu
    // avec un save initial pour ne pas bloquer le joueur sur le loading.
    const safetyTimeout = setTimeout(() => {
      if (cancelled || resolved) return;
      // eslint-disable-next-line no-console
      console.warn('[session] Loading timeout 8s atteint, fallback save initial');
      try {
        useGameStore.getState().hydrate(buildInitialSave());
        startGameLoop();
        startAutoSave({ userId: user.id });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[session] Fallback failed', err);
      }
      resolved = true;
      setIsLoading(false);
    }, 8000);

    void (async () => {
      try {
        let loaded: SavePayload | null = null;
        try {
          const server = await apiLoadSave();
          if (server) loaded = server.payload;
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn('[session] apiLoadSave failed', err);
        }
        if (!loaded) {
          try {
            loaded = await loadLocal();
          } catch (err) {
            // eslint-disable-next-line no-console
            console.warn('[session] loadLocal failed', err);
            loaded = null;
          }
        }
        if (cancelled || resolved) return;

        const initial = loaded ?? buildInitialSave();
        const cashBefore = new Decimal(initial.cash);
        useGameStore.getState().hydrate(initial);
        useGameStore.getState().registerLogin();

        // Catch-up offline : on calcule la duree depuis lastTickAt et on
        // applique un tick agrege au store.
        const elapsed = (Date.now() - initial.lastTickAt) / 1000;
        if (elapsed > 30) {
          try {
            catchUpOffline(elapsed);
            const cashAfter = useGameStore.getState().cash;
            const earned = cashAfter.sub(cashBefore);
            if (earned.gt(0)) {
              setOfflineReward({ durationSeconds: elapsed, cashEarned: earned });
            }
          } catch (err) {
            // eslint-disable-next-line no-console
            console.warn('[session] catchUpOffline failed', err);
          }
        }

        startGameLoop();
        startAutoSave({ userId: user.id });
        resolved = true;
        setIsLoading(false);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[session] Bootstrap fatal', err);
        try {
          useGameStore.getState().hydrate(buildInitialSave());
          startGameLoop();
          startAutoSave({ userId: user.id });
        } catch {
          /* ignore */
        }
        resolved = true;
        setIsLoading(false);
      } finally {
        clearTimeout(safetyTimeout);
      }
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

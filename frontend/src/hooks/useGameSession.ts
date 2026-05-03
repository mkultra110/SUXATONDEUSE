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

export type LoadingPhase =
  | 'idle'
  | 'server'
  | 'local'
  | 'hydrate'
  | 'offline'
  | 'starting'
  | 'ready'
  | 'error';

export function useGameSession(): {
  isLoading: boolean;
  phase: LoadingPhase;
  errorMessage: string | null;
  forceContinue: () => void;
  offlineReward: OfflineReward | null;
  acknowledgeOfflineReward: () => void;
} {
  const user = useAuthStore((s) => s.user);
  const [isLoading, setIsLoading] = useState(true);
  const [phase, setPhase] = useState<LoadingPhase>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [offlineReward, setOfflineReward] = useState<OfflineReward | null>(null);
  const startedRef = useRef(false);
  const userIdRef = useRef<string | null>(null);
  userIdRef.current = user?.id ?? null;

  function forceContinue() {
    // eslint-disable-next-line no-console
    console.warn('[session] forceContinue() : utilisateur a clique sur Continuer hors-ligne');
    try {
      useGameStore.getState().hydrate(buildInitialSave());
      startGameLoop();
      if (userIdRef.current) startAutoSave({ userId: userIdRef.current });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[session] forceContinue failed', err);
    }
    setPhase('ready');
    setErrorMessage(null);
    setIsLoading(false);
  }

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
        // FIX BUG : on charge SERVER + LOCAL en parallele puis on garde le
        // PLUS RECENT/AVANCE pour eviter que le server ecrase le local
        // (cas reload apres jeu offline non sync).
        let serverSave: SavePayload | null = null;
        let localSave: SavePayload | null = null;
        setPhase('server');
        try {
          const server = await apiLoadSave();
          if (server) serverSave = server.payload;
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn('[session] apiLoadSave failed', err);
        }
        setPhase('local');
        try {
          localSave = await loadLocal();
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn('[session] loadLocal failed', err);
          localSave = null;
        }
        // Choisi le save le plus recent par lastTickAt (timestamp epoch ms).
        // Egalite ou doute : on prefere le local (plus chaud / source de verite).
        let loaded: SavePayload | null = null;
        if (serverSave && localSave) {
          loaded = (localSave.lastTickAt ?? 0) >= (serverSave.lastTickAt ?? 0)
            ? localSave
            : serverSave;
        } else {
          loaded = localSave ?? serverSave;
        }
        if (cancelled || resolved) return;

        setPhase('hydrate');
        const initial = loaded ?? buildInitialSave();
        const cashBefore = new Decimal(initial.cash);
        useGameStore.getState().hydrate(initial);
        useGameStore.getState().registerLogin();

        const elapsed = (Date.now() - initial.lastTickAt) / 1000;
        if (elapsed > 30) {
          setPhase('offline');
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

        setPhase('starting');
        startGameLoop();
        startAutoSave({ userId: user.id });
        resolved = true;
        setPhase('ready');
        setIsLoading(false);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[session] Bootstrap fatal', err);
        setErrorMessage(err instanceof Error ? err.message : String(err));
        setPhase('error');
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
    phase,
    errorMessage,
    forceContinue,
    offlineReward,
    acknowledgeOfflineReward: () => setOfflineReward(null),
  };
}

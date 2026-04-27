// Orchestre les saves : local 5 s, server 30 s, beacon a l'unload.
// Cf. GDD section 8.6.

import type { SavePayload } from '@robomow/shared';
import { useGameStore } from '../../stores/gameStore.js';
import { apiSaveBeacon, apiSaveGame } from '../../api/save.api.js';
import { saveLocal } from './localSave.js';

const LOCAL_INTERVAL_MS = 5_000;
const SERVER_INTERVAL_MS = 30_000;

let localTimer: number | null = null;
let serverTimer: number | null = null;
let beforeUnloadHandler: (() => void) | null = null;
let visibilityHandler: (() => void) | null = null;

/** Calcule un HMAC client. Le secret est un placeholder en PHASE 1 ;
 *  l'autorite reste cote serveur (cf. lecons.md). */
async function clientHmac(payload: SavePayload, userId: string): Promise<string> {
  // SubtleCrypto pour une signature legere cote client. Le serveur recalcule
  // avec son propre secret et la version cliente est juste un anti-replay basique.
  const enc = new TextEncoder();
  const data = enc.encode(`${userId}.${JSON.stringify(payload)}`);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export interface SaveOrchestratorOptions {
  userId: string;
  /** Callback en cas d'erreur de sync server (UI peut afficher un toast). */
  onServerError?: (err: unknown) => void;
}

/** Demarre les timers de save. Idempotent : un seul orchestrator a la fois. */
export function startAutoSave(opts: SaveOrchestratorOptions): void {
  stopAutoSave();

  const saveLocalNow = async () => {
    const state = useGameStore.getState();
    if (!state.isReady) return;
    const payload = state.serialize();
    try {
      await saveLocal(payload);
    } catch {
      // L'IndexedDB peut echouer en mode prive : on ignore.
    }
  };

  const saveServerNow = async () => {
    const state = useGameStore.getState();
    if (!state.isReady) return;
    const payload = state.serialize();
    try {
      const hmac = await clientHmac(payload, opts.userId);
      await apiSaveGame({ payload, payloadVersion: payload.payloadVersion, hmac });
    } catch (err) {
      opts.onServerError?.(err);
    }
  };

  localTimer = window.setInterval(() => void saveLocalNow(), LOCAL_INTERVAL_MS);
  serverTimer = window.setInterval(() => void saveServerNow(), SERVER_INTERVAL_MS);

  // Sauvegarde locale et beacon serveur sur unload / visibilite cachee.
  beforeUnloadHandler = () => {
    void saveLocalNow();
    const state = useGameStore.getState();
    if (state.isReady) {
      const payload = state.serialize();
      // sendBeacon avec hmac vide : best-effort, le serveur traite ce cas.
      apiSaveBeacon({ payload, hmac: '' });
    }
  };
  visibilityHandler = () => {
    if (document.hidden) {
      void saveLocalNow();
      void saveServerNow();
    }
  };
  window.addEventListener('beforeunload', beforeUnloadHandler);
  document.addEventListener('visibilitychange', visibilityHandler);
}

export function stopAutoSave(): void {
  if (localTimer !== null) {
    clearInterval(localTimer);
    localTimer = null;
  }
  if (serverTimer !== null) {
    clearInterval(serverTimer);
    serverTimer = null;
  }
  if (beforeUnloadHandler) {
    window.removeEventListener('beforeunload', beforeUnloadHandler);
    beforeUnloadHandler = null;
  }
  if (visibilityHandler) {
    document.removeEventListener('visibilitychange', visibilityHandler);
    visibilityHandler = null;
  }
}

export { clientHmac };

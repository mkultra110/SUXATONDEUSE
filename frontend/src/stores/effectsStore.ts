// Store ephemere des effets visuels qui ne doivent PAS persister :
// screen shake, combo counter, floating numbers, undoStack, dialogues vus.
// Separe du gameStore pour eviter les re-renders inutiles du jeu.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setVibrationEnabled } from '../utils/vibration.js';

export interface FloatingNumber {
  id: number;
  value: string;
  x: number; // % container 0..100
  y: number;
  color: string;
  fontSize: number;
}

export interface UndoEntry {
  id: number;
  label: string;
  expiresAt: number; // epoch ms
  // Snapshot Decimal serialise + holdings pour rollback.
  cashStr: string;
  // Pour rollback robot/upgrade : meta info.
  kind: 'robot' | 'upgrade';
  key: string;
  // Niveau ou owned avant l'achat.
  previousValue: number;
  // Nombre achete (pour bulk).
  count: number;
}

interface EffectsState {
  // Screen shake intensity 0..1 (consumed via CSS transform).
  shakeUntil: number; // epoch ms quand le shake s'arrete
  shakeIntensity: number;
  // Chromatic aberration flash actif jusqu'a.
  chromaticUntil: number;
  // Combo counter pour taps rapides.
  comboCount: number;
  comboLastAt: number;
  // Floating cash numbers en cours.
  floatingNumbers: FloatingNumber[];
  // Stack des actions reversibles (5s window).
  undoStack: UndoEntry[];
  // Power score actuel (mirroir pour les composants leger).
  powerScore: number;
  // Cash threshold deja celebre (pour ne pas spam la TopBar pulse).
  celebratedThresholds: ReadonlySet<number>;
  // Boss kills count cumule (pour dialogues).
  bossKills: number;
  // Dialogues Meme deja vus (persisted).
  memeDialogueIds: ReadonlySet<string>;
  // Album polaroid : ids de map level deja capturee.
  polaroidLevels: ReadonlyArray<number>;
  // Pinned upgrades pour scroll-into-view auto.
  pinnedUpgrades: ReadonlySet<string>;
  // Search filter shop.
  shopSearch: string;
  // Settings : screen shake on/off, vibration on/off.
  enableShake: boolean;
  enableVibration: boolean;
  enableParticles: boolean;
  enablePixelCursor: boolean;
  // Actions.
  triggerShake: (intensity: number, durationMs: number) => void;
  triggerChromatic: (durationMs: number) => void;
  bumpCombo: () => void;
  resetCombo: () => void;
  addFloating: (n: Omit<FloatingNumber, 'id'>) => void;
  cleanFloating: () => void;
  pushUndo: (entry: Omit<UndoEntry, 'id' | 'expiresAt'>) => void;
  cleanUndo: () => void;
  popUndo: () => UndoEntry | null;
  setPowerScore: (s: number) => void;
  celebrateThreshold: (n: number) => void;
  hasCelebrated: (n: number) => boolean;
  incrementBossKills: () => void;
  markMemeShown: (id: string) => void;
  addPolaroid: (mapLevel: number) => void;
  togglePinUpgrade: (key: string) => void;
  setShopSearch: (s: string) => void;
  setEnableShake: (b: boolean) => void;
  setEnableVibration: (b: boolean) => void;
  setEnableParticles: (b: boolean) => void;
  setEnablePixelCursor: (b: boolean) => void;
}

let nextId = 1;

export const useEffectsStore = create<EffectsState>()(
  persist(
    (set, get) => ({
      shakeUntil: 0,
      shakeIntensity: 0,
      chromaticUntil: 0,
      comboCount: 0,
      comboLastAt: 0,
      floatingNumbers: [],
      undoStack: [],
      powerScore: 1,
      celebratedThresholds: new Set<number>(),
      bossKills: 0,
      memeDialogueIds: new Set<string>(),
      polaroidLevels: [],
      pinnedUpgrades: new Set<string>(),
      shopSearch: '',
      enableShake: true,
      enableVibration: true,
      enableParticles: true,
      enablePixelCursor: false,

      triggerShake: (intensity, durationMs) => {
        set({
          shakeUntil: Date.now() + durationMs,
          shakeIntensity: Math.max(0, Math.min(1, intensity)),
        });
      },
      triggerChromatic: (durationMs) => {
        set({ chromaticUntil: Date.now() + durationMs });
      },
      bumpCombo: () => {
        const now = Date.now();
        const { comboCount, comboLastAt } = get();
        const fresh = now - comboLastAt > 1100;
        set({ comboCount: fresh ? 1 : comboCount + 1, comboLastAt: now });
      },
      resetCombo: () => set({ comboCount: 0 }),
      addFloating: (n) => {
        const id = nextId++;
        set((s) => ({ floatingNumbers: [...s.floatingNumbers, { ...n, id }] }));
        // Auto-cleanup apres 1.4s.
        setTimeout(() => {
          set((s) => ({ floatingNumbers: s.floatingNumbers.filter((f) => f.id !== id) }));
        }, 1400);
      },
      cleanFloating: () => set({ floatingNumbers: [] }),
      pushUndo: (entry) => {
        const id = nextId++;
        const expiresAt = Date.now() + 5000;
        set((s) => ({ undoStack: [...s.undoStack, { ...entry, id, expiresAt }] }));
      },
      cleanUndo: () => {
        const now = Date.now();
        set((s) => ({ undoStack: s.undoStack.filter((u) => u.expiresAt > now) }));
      },
      popUndo: () => {
        const stack = get().undoStack;
        const last = stack[stack.length - 1] ?? null;
        if (last) {
          set({ undoStack: stack.slice(0, -1) });
        }
        return last;
      },
      setPowerScore: (s) => set({ powerScore: s }),
      celebrateThreshold: (n) => {
        set((s) => {
          const next = new Set(s.celebratedThresholds);
          next.add(n);
          return { celebratedThresholds: next };
        });
      },
      hasCelebrated: (n) => get().celebratedThresholds.has(n),
      incrementBossKills: () => set((s) => ({ bossKills: s.bossKills + 1 })),
      markMemeShown: (id) => {
        set((s) => {
          const next = new Set(s.memeDialogueIds);
          next.add(id);
          return { memeDialogueIds: next };
        });
      },
      addPolaroid: (mapLevel) => {
        set((s) => {
          if (s.polaroidLevels.includes(mapLevel)) return s;
          return { polaroidLevels: [...s.polaroidLevels, mapLevel] };
        });
      },
      togglePinUpgrade: (key) => {
        set((s) => {
          const next = new Set(s.pinnedUpgrades);
          if (next.has(key)) next.delete(key);
          else next.add(key);
          return { pinnedUpgrades: next };
        });
      },
      setShopSearch: (s) => set({ shopSearch: s }),
      setEnableShake: (b) => set({ enableShake: b }),
      setEnableVibration: (b) => {
        setVibrationEnabled(b);
        set({ enableVibration: b });
      },
      setEnableParticles: (b) => set({ enableParticles: b }),
      setEnablePixelCursor: (b) => set({ enablePixelCursor: b }),
    }),
    {
      name: 'suxa-effects',
      partialize: (state) => ({
        bossKills: state.bossKills,
        memeDialogueIds: Array.from(state.memeDialogueIds),
        polaroidLevels: state.polaroidLevels,
        celebratedThresholds: Array.from(state.celebratedThresholds),
        pinnedUpgrades: Array.from(state.pinnedUpgrades),
        enableShake: state.enableShake,
        enableVibration: state.enableVibration,
        enableParticles: state.enableParticles,
        enablePixelCursor: state.enablePixelCursor,
      }),
      // Restaure les Sets a partir des arrays serialises.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<{
          bossKills: number;
          memeDialogueIds: string[];
          polaroidLevels: number[];
          celebratedThresholds: number[];
          pinnedUpgrades: string[];
          enableShake: boolean;
          enableVibration: boolean;
          enableParticles: boolean;
          enablePixelCursor: boolean;
        }>;
        return {
          ...current,
          bossKills: p.bossKills ?? current.bossKills,
          memeDialogueIds: new Set(p.memeDialogueIds ?? []),
          polaroidLevels: p.polaroidLevels ?? current.polaroidLevels,
          celebratedThresholds: new Set(p.celebratedThresholds ?? []),
          pinnedUpgrades: new Set(p.pinnedUpgrades ?? []),
          enableShake: p.enableShake ?? current.enableShake,
          enableVibration: p.enableVibration ?? current.enableVibration,
          enableParticles: p.enableParticles ?? current.enableParticles,
          enablePixelCursor: p.enablePixelCursor ?? current.enablePixelCursor,
        };
      },
    },
  ),
);

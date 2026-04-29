// UI store : etat purement visuel (active tab, drawers, modals).
// Separe du gameStore pour ne pas re-render le canvas a chaque toggle UI.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppTabKey = 'shop' | 'plots' | 'daily' | 'collection' | 'progress';
export type ProgresSubTab = 'prestige' | 'achievements' | 'stats';
export type ShopSubTab = 'robots' | 'upgrades';

interface UIState {
  activeTab: AppTabKey;
  progresTab: ProgresSubTab;
  shopTab: ShopSubTab;
  shopBulkSize: 1 | 10 | 100 | 'max';
  marcelLogOpen: boolean;
  aboutOpen: boolean;
  // Toggle auto-buy "cheapest" (debloque apres 1er prestige).
  autoBuyEnabled: boolean;
  // Album polaroid ouvert.
  polaroidAlbumOpen: boolean;
  // Stats hebdo modal ouverte.
  statsHebdoOpen: boolean;
  // Achievement grid ouverte.
  achievementGridOpen: boolean;
  bestiaryOpen: boolean;
  dailyChallengeOpen: boolean;
  // Date du dernier polaroid auto-capture (ISO).
  lastPolaroidISODate: string | null;
  // Last-seen save anniversary day (pour ne donner le cadeau qu'une fois).
  lastAnniversaryDay: number;
  setActiveTab: (tab: AppTabKey) => void;
  setProgresTab: (tab: ProgresSubTab) => void;
  setShopTab: (tab: ShopSubTab) => void;
  setShopBulkSize: (s: 1 | 10 | 100 | 'max') => void;
  setMarcelLogOpen: (open: boolean) => void;
  setAboutOpen: (open: boolean) => void;
  setAutoBuyEnabled: (b: boolean) => void;
  setPolaroidAlbumOpen: (b: boolean) => void;
  setStatsHebdoOpen: (b: boolean) => void;
  setAchievementGridOpen: (b: boolean) => void;
  setBestiaryOpen: (b: boolean) => void;
  setDailyChallengeOpen: (b: boolean) => void;
  setLastPolaroidISODate: (d: string) => void;
  setLastAnniversaryDay: (d: number) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      activeTab: 'shop',
      progresTab: 'prestige',
      shopTab: 'robots',
      shopBulkSize: 1,
      marcelLogOpen: false,
      aboutOpen: false,
      autoBuyEnabled: false,
      polaroidAlbumOpen: false,
      statsHebdoOpen: false,
      achievementGridOpen: false,
      bestiaryOpen: false,
      dailyChallengeOpen: false,
      lastPolaroidISODate: null,
      lastAnniversaryDay: 0,
      setActiveTab: (tab) => set({ activeTab: tab }),
      setProgresTab: (tab) => set({ progresTab: tab }),
      setShopTab: (tab) => set({ shopTab: tab }),
      setShopBulkSize: (s) => set({ shopBulkSize: s }),
      setMarcelLogOpen: (open) => set({ marcelLogOpen: open }),
      setAboutOpen: (open) => set({ aboutOpen: open }),
      setAutoBuyEnabled: (b) => set({ autoBuyEnabled: b }),
      setPolaroidAlbumOpen: (b) => set({ polaroidAlbumOpen: b }),
      setStatsHebdoOpen: (b) => set({ statsHebdoOpen: b }),
      setAchievementGridOpen: (b) => set({ achievementGridOpen: b }),
      setBestiaryOpen: (b) => set({ bestiaryOpen: b }),
      setDailyChallengeOpen: (b) => set({ dailyChallengeOpen: b }),
      setLastPolaroidISODate: (d) => set({ lastPolaroidISODate: d }),
      setLastAnniversaryDay: (d) => set({ lastAnniversaryDay: d }),
    }),
    {
      name: 'suxa-ui',
      partialize: (state) => ({
        activeTab: state.activeTab,
        progresTab: state.progresTab,
        shopTab: state.shopTab,
        shopBulkSize: state.shopBulkSize,
        autoBuyEnabled: state.autoBuyEnabled,
        lastPolaroidISODate: state.lastPolaroidISODate,
        lastAnniversaryDay: state.lastAnniversaryDay,
      }),
    },
  ),
);

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
  setActiveTab: (tab: AppTabKey) => void;
  setProgresTab: (tab: ProgresSubTab) => void;
  setShopTab: (tab: ShopSubTab) => void;
  setShopBulkSize: (s: 1 | 10 | 100 | 'max') => void;
  setMarcelLogOpen: (open: boolean) => void;
  setAboutOpen: (open: boolean) => void;
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
      setActiveTab: (tab) => set({ activeTab: tab }),
      setProgresTab: (tab) => set({ progresTab: tab }),
      setShopTab: (tab) => set({ shopTab: tab }),
      setShopBulkSize: (s) => set({ shopBulkSize: s }),
      setMarcelLogOpen: (open) => set({ marcelLogOpen: open }),
      setAboutOpen: (open) => set({ aboutOpen: open }),
    }),
    {
      name: 'suxa-ui',
      partialize: (state) => ({
        activeTab: state.activeTab,
        progresTab: state.progresTab,
        shopTab: state.shopTab,
        shopBulkSize: state.shopBulkSize,
      }),
    },
  ),
);

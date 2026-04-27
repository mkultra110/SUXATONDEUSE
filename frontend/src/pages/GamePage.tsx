// Page principale du jeu (PHASE 2).
// TopBar + canvas + onglets de panneaux : Shop | Plots | Prestige | Achievements.

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TopBar } from '../components/hud/TopBar.js';
import { ShopPanel } from '../components/hud/ShopPanel.js';
import { PlotsPanel } from '../components/hud/PlotsPanel.js';
import { PrestigePanel } from '../components/hud/PrestigePanel.js';
import { AchievementsPanel } from '../components/hud/AchievementsPanel.js';
import { DailyPanel } from '../components/hud/DailyPanel.js';
import { OfflineRewardModal } from '../components/modals/OfflineRewardModal.js';
import { PixiCanvas } from '../game/engine/PixiCanvas.js';
import { useGameSession } from '../hooks/useGameSession.js';

type TabKey = 'shop' | 'plots' | 'prestige' | 'achievements' | 'daily';

const TABS: Array<{ key: TabKey; emoji: string }> = [
  { key: 'shop', emoji: '🛒' },
  { key: 'plots', emoji: '🌳' },
  { key: 'daily', emoji: '📅' },
  { key: 'prestige', emoji: '🌱' },
  { key: 'achievements', emoji: '🏆' },
];

export function GamePage() {
  const { t } = useTranslation();
  const session = useGameSession();
  const [activeTab, setActiveTab] = useState<TabKey>('shop');

  if (session.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-grass-deep text-panel-base">
        {t('game.loading')}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-sky-deep to-grass-deep p-2 gap-2">
      <TopBar />
      <main className="flex flex-1 flex-col items-center gap-4 lg:flex-row lg:items-start lg:justify-center lg:gap-6">
        <div className="flex flex-col items-center gap-2 flex-1">
          <PixiCanvas />
          <p className="text-center text-panel-paper text-xs max-w-2xl">
            {t('game.tapHint')}
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full max-w-sm">
          <nav className="grid grid-cols-4 gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex flex-col items-center justify-center rounded p-2 text-xs font-bold transition ${
                  activeTab === tab.key
                    ? 'bg-accent-gold text-ink-base'
                    : 'bg-panel-base text-ink-dark hover:bg-panel-paper'
                }`}
              >
                <span aria-hidden className="text-lg">
                  {tab.emoji}
                </span>
                <span>{t(`tabs.${tab.key}`)}</span>
              </button>
            ))}
          </nav>
          {activeTab === 'shop' && <ShopPanel />}
          {activeTab === 'plots' && <PlotsPanel />}
          {activeTab === 'daily' && <DailyPanel />}
          {activeTab === 'prestige' && <PrestigePanel />}
          {activeTab === 'achievements' && <AchievementsPanel />}
        </div>
      </main>

      {session.offlineReward && (
        <OfflineRewardModal
          durationSeconds={session.offlineReward.durationSeconds}
          cashEarned={session.offlineReward.cashEarned}
          onAcknowledge={session.acknowledgeOfflineReward}
        />
      )}
    </div>
  );
}

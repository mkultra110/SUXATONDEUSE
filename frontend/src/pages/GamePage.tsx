// Page principale du jeu (refonte cozy).
// TopBar + jardin anime + onglets pixel-art (Boutique/Plots/Daily/...).

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TopBar } from '../components/hud/TopBar.js';
import { ShopPanel } from '../components/hud/ShopPanel.js';
import { PlotsPanel } from '../components/hud/PlotsPanel.js';
import { PrestigePanel } from '../components/hud/PrestigePanel.js';
import { AchievementsPanel } from '../components/hud/AchievementsPanel.js';
import { DailyPanel } from '../components/hud/DailyPanel.js';
import { CollectionPanel } from '../components/hud/CollectionPanel.js';
import { StatsPanel } from '../components/hud/StatsPanel.js';
import { OfflineRewardModal } from '../components/modals/OfflineRewardModal.js';
import { AnimatedGarden } from '../components/AnimatedGarden.js';
import { useGameSession } from '../hooks/useGameSession.js';

type TabKey =
  | 'shop'
  | 'plots'
  | 'prestige'
  | 'achievements'
  | 'daily'
  | 'collection'
  | 'stats';

const TABS: Array<{ key: TabKey; emoji: string }> = [
  { key: 'shop', emoji: '🛒' },
  { key: 'plots', emoji: '🌳' },
  { key: 'daily', emoji: '📅' },
  { key: 'collection', emoji: '🐾' },
  { key: 'prestige', emoji: '🌱' },
  { key: 'achievements', emoji: '🏆' },
  { key: 'stats', emoji: '📊' },
];

export function GamePage() {
  const { t } = useTranslation();
  const session = useGameSession();
  const [activeTab, setActiveTab] = useState<TabKey>('shop');

  if (session.isLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{
          background: 'var(--color-paper-2)',
          color: 'var(--color-text-body)',
          fontFamily: 'var(--font-title)',
        }}
      >
        {t('game.loading')}
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen flex-col gap-2 p-2"
      style={{
        background:
          'linear-gradient(180deg, var(--color-sky-morning) 0%, var(--color-paper-2) 30%, var(--color-paper-2) 100%)',
      }}
    >
      <TopBar />
      <main className="flex flex-1 flex-col items-center gap-3 lg:flex-row lg:items-start lg:justify-center lg:gap-6">
        <div className="flex flex-col items-center gap-2 flex-1 w-full">
          <AnimatedGarden />
        </div>
        <div className="flex flex-col gap-2 w-full max-w-sm">
          <nav className="grid grid-cols-4 gap-1.5 lg:grid-cols-7">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pixel-tab ${activeTab === tab.key ? 'pixel-tab-active' : ''}`}
              >
                <span aria-hidden className="pixel-tab-emoji">
                  {tab.emoji}
                </span>
                <span>{t(`tabs.${tab.key}`)}</span>
              </button>
            ))}
          </nav>
          {activeTab === 'shop' && <ShopPanel />}
          {activeTab === 'plots' && <PlotsPanel />}
          {activeTab === 'daily' && <DailyPanel />}
          {activeTab === 'collection' && <CollectionPanel />}
          {activeTab === 'prestige' && <PrestigePanel />}
          {activeTab === 'achievements' && <AchievementsPanel />}
          {activeTab === 'stats' && <StatsPanel />}
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

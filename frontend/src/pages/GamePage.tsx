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
import { AchievementToast } from '../components/hud/AchievementToast.js';
import { MemeGiselePopup } from '../components/hud/MemeGiselePopup.js';
import { useGameSession } from '../hooks/useGameSession.js';
import { useAudio } from '../hooks/useAudio.js';
import { ATLAS_URL, ATLAS_SIZE } from '../components/garden/Sprite.js';

type TabKey =
  | 'shop'
  | 'plots'
  | 'prestige'
  | 'achievements'
  | 'daily'
  | 'collection'
  | 'stats';

// Tab icons depuis ui.png : 16x16, y=48, x = col * 16.
// Ordre dans l'atlas : boutique, parcelles, journalier, collection, prestige, succes, stats.
const TAB_ICON_COL: Record<TabKey, number> = {
  shop: 0,
  plots: 1,
  daily: 2,
  collection: 3,
  prestige: 4,
  achievements: 5,
  stats: 6,
};

const TABS: Array<{ key: TabKey }> = [
  { key: 'shop' },
  { key: 'plots' },
  { key: 'daily' },
  { key: 'collection' },
  { key: 'prestige' },
  { key: 'achievements' },
  { key: 'stats' },
];

function TabIcon({ tabKey }: { tabKey: TabKey }) {
  const SCALE = 2;
  const col = TAB_ICON_COL[tabKey];
  const sx = col * 16;
  const sy = 48;
  const [aw, ah] = ATLAS_SIZE.ui;
  return (
    <div
      style={{
        width: 16 * SCALE,
        height: 16 * SCALE,
        backgroundImage: `url(${ATLAS_URL.ui})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${aw * SCALE}px ${ah * SCALE}px`,
        backgroundPosition: `-${sx * SCALE}px -${sy * SCALE}px`,
        imageRendering: 'pixelated',
      }}
    />
  );
}

export function GamePage() {
  const { t } = useTranslation();
  const session = useGameSession();
  // Bootstrap audio (charge ambient.mp3 si present, demarre apres user gesture).
  useAudio();
  const [activeTab, setActiveTab] = useState<TabKey>('shop');

  if (session.isLoading) {
    const phaseLabels: Record<string, string> = {
      idle: 'Mémé range la cuisine...',
      server: 'Mémé contacte le serveur...',
      local: 'Mémé fouille dans son carnet...',
      hydrate: 'Mémé installe la ferme...',
      offline: 'Mémé compte les pièces gagnées...',
      starting: 'Mémé sort le café...',
      error: 'Aïe, le tracteur fait des siennes...',
    };
    const label = phaseLabels[session.phase] ?? t('meme.loading');
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-4 px-4"
        style={{ background: 'var(--color-paper-2)' }}
      >
        <div className="meme" style={{ fontSize: 28, color: 'var(--color-text-body)', textAlign: 'center' }}>
          {label}
        </div>
        {session.errorMessage && (
          <div
            className="meme"
            style={{
              fontSize: 16,
              color: 'var(--color-accent-red)',
              textAlign: 'center',
              maxWidth: 320,
              padding: '8px 12px',
              background: 'var(--color-paper-1)',
              border: '2px solid var(--color-accent-red)',
              borderRadius: 4,
            }}
          >
            {session.errorMessage}
          </div>
        )}
        <button
          type="button"
          onClick={session.forceContinue}
          className="pixel-btn pixel-btn-gold"
          style={{ marginTop: 12, fontSize: 12 }}
        >
          Continuer en mode hors-ligne
        </button>
        <p
          className="meme"
          style={{ fontSize: 14, color: 'var(--color-text-muted)', textAlign: 'center', maxWidth: 280 }}
        >
          Si Mémé bloque plus de 8 secondes, le bouton ci-dessus te débloque.
        </p>
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
          <div className="farm-frame-wrap">
            <span className="frame-rivet-bl" />
            <span className="frame-rivet-br" />
            <AnimatedGarden />
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full max-w-sm">
          <nav className="grid grid-cols-4 gap-1.5 lg:grid-cols-7">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pixel-tab ${activeTab === tab.key ? 'pixel-tab-active' : ''}`}
              >
                <TabIcon tabKey={tab.key} />
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
      <AchievementToast />
      <MemeGiselePopup />
    </div>
  );
}

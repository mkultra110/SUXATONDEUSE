// Page principale du jeu — refonte tab bar 7 -> 5 onglets style RCT/Stardew.
// 5 onglets : Boutique / Parcelles / Quêtes / Collection / Progrès
// (où Progrès groupe Prestige+Succès+Stats via SegmentedControl interne).

import { useTranslation } from 'react-i18next';
import { TopBar } from '../components/hud/TopBar.js';
import { ShopPanel } from '../components/hud/ShopPanel.js';
import { PlotsPanel } from '../components/hud/PlotsPanel.js';
import { DailyPanel } from '../components/hud/DailyPanel.js';
import { CollectionPanel } from '../components/hud/CollectionPanel.js';
import { ProgresPanel } from '../components/hud/ProgresPanel.js';
import { OfflineRewardModal } from '../components/modals/OfflineRewardModal.js';
import { AnimatedGarden } from '../components/AnimatedGarden.js';
import { AchievementToast } from '../components/hud/AchievementToast.js';
import { MemeGiselePopup } from '../components/hud/MemeGiselePopup.js';
import { ActivityFAB } from '../components/hud/FloatingFABs.js';
import { MarcelLog } from '../components/hud/MarcelLog.js';
import { useGameSession } from '../hooks/useGameSession.js';
import { useAudio } from '../hooks/useAudio.js';
import { useUIStore } from '../stores/uiStore.js';
import { ATLAS_URL, ATLAS_SIZE } from '../components/garden/Sprite.js';

// 5 onglets max selon iOS HIG / Material 3 / NN/g.
type TabKey = 'shop' | 'plots' | 'daily' | 'collection' | 'progress';

// Mapping vers les sprites tab du atlas ui.png (16x16, y=48).
// Pour 'progress' on reutilise l'icone prestige (col 4).
const TAB_ICON_COL: Record<TabKey, number> = {
  shop: 0,
  plots: 1,
  daily: 2,
  collection: 3,
  progress: 4,
};

const TABS: ReadonlyArray<{ key: TabKey }> = [
  { key: 'shop' },
  { key: 'plots' },
  { key: 'daily' },
  { key: 'collection' },
  { key: 'progress' },
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
  // Tab actif persiste entre sessions via uiStore.
  const activeTab = useUIStore((s) => s.activeTab) as TabKey;
  const setActiveTabPersist = useUIStore((s) => s.setActiveTab);
  const setActiveTab = (tab: TabKey) => setActiveTabPersist(tab);
  const marcelLogOpen = useUIStore((s) => s.marcelLogOpen);
  const setMarcelLogOpen = useUIStore((s) => s.setMarcelLogOpen);

  // Navigation clavier desktop : fleche gauche/droite parcourt les tabs.
  // (a11y : tabs interchangeables sans souris).
  const handleTabKeydown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const idx = TABS.findIndex((tt) => tt.key === activeTab);
    if (idx < 0) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = TABS[(idx + 1) % TABS.length]?.key;
      if (next) setActiveTab(next);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = TABS[(idx - 1 + TABS.length) % TABS.length]?.key;
      if (prev) setActiveTab(prev);
    }
  };

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
          <nav
            role="tablist"
            aria-label="Navigation principale"
            className="grid grid-cols-5 gap-1.5"
            onKeyDown={handleTabKeydown}
          >
            {TABS.map((tab) => (
              <button
                key={tab.key}
                role="tab"
                aria-selected={activeTab === tab.key}
                tabIndex={activeTab === tab.key ? 0 : -1}
                onClick={() => {
                  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
                    try {
                      navigator.vibrate(8);
                    } catch {
                      /* ignore */
                    }
                  }
                  setActiveTab(tab.key);
                }}
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
          {activeTab === 'progress' && <ProgresPanel />}
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
      <ActivityFAB onClick={() => setMarcelLogOpen(true)} notificationCount={0} />
      {marcelLogOpen && <MarcelLog onClose={() => setMarcelLogOpen(false)} />}
    </div>
  );
}

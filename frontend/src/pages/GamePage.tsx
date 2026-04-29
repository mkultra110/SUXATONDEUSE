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
import { DesktopSidebar } from '../components/hud/DesktopSidebar.js';
import { RightStatsPanel } from '../components/hud/RightStatsPanel.js';
import { SpecialDateBanner } from '../components/hud/SpecialDateBanner.js';
import { useGameSession } from '../hooks/useGameSession.js';
import { useAudio } from '../hooks/useAudio.js';
import { useResponsive } from '../hooks/useResponsive.js';
import { useKonamiCode } from '../hooks/useKonamiCode.js';
import { useUIStore } from '../stores/uiStore.js';
import { ATLAS_URL, ATLAS_SIZE } from '../components/garden/Sprite.js';
import { useState } from 'react';

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
  const breakpoint = useResponsive();
  const useSidebar = breakpoint === 'tablet' || breakpoint === 'desktop';
  // Konami code easter egg : ↑↑↓↓←→←→BA -> mode sepia 30s.
  const [sepiaMode, setSepiaMode] = useState(false);
  useKonamiCode(() => {
    setSepiaMode(true);
    setTimeout(() => setSepiaMode(false), 30_000);
  });

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

  // Sur mobile : layout VERTICAL (TopBar / Garden / Panel) + tab bar STICKY en bas.
  // Sur tablet/desktop : layout HORIZONTAL (Sidebar / Garden / Panel).
  const isMobile = breakpoint === 'mobile';

  return (
    <div
      className="flex flex-col"
      style={{
        height: '100dvh',
        width: '100vw',
        overflow: 'hidden',
        background:
          'linear-gradient(180deg, var(--color-sky-morning) 0%, var(--color-paper-2) 30%, var(--color-paper-2) 100%)',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        // Konami easter egg : mode sepia 30s.
        filter: sepiaMode ? 'sepia(0.85) saturate(1.2)' : undefined,
        transition: 'filter 800ms ease-out',
      }}
    >
      <TopBar />

      {isMobile ? (
        // ======== LAYOUT MOBILE 375x667 ========
        <>
          <main
            className="flex flex-col gap-2 flex-1 min-h-0 overflow-y-auto"
            style={{
              padding: '8px 8px 80px',
              paddingBottom: 'calc(72px + env(safe-area-inset-bottom, 0px))',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {/* Jardin compact (frame retire pour gagner de la place) */}
            <div className="flex justify-center">
              <AnimatedGarden />
            </div>
            {/* Panel actif sous le jardin */}
            <div className="flex flex-col gap-2">
              {activeTab === 'shop' && <ShopPanel />}
              {activeTab === 'plots' && <PlotsPanel />}
              {activeTab === 'daily' && <DailyPanel />}
              {activeTab === 'collection' && <CollectionPanel />}
              {activeTab === 'progress' && <ProgresPanel />}
            </div>
          </main>

          {/* Bottom tab bar STICKY (vraie nav mobile RCT/Stardew) */}
          <nav
            role="tablist"
            aria-label="Navigation principale"
            onKeyDown={handleTabKeydown}
            className="grid grid-cols-5"
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 800,
              gap: 4,
              padding: 6,
              paddingBottom: 'calc(6px + env(safe-area-inset-bottom, 0px))',
              background: 'var(--color-wood-5)',
              borderTop: '3px solid var(--color-accent-gold)',
              boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.4)',
            }}
          >
            {TABS.map((tab) => (
              <button
                key={tab.key}
                role="tab"
                aria-selected={activeTab === tab.key}
                tabIndex={activeTab === tab.key ? 0 : -1}
                onClick={() => {
                  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
                    try { navigator.vibrate(8); } catch { /* ignore */ }
                  }
                  setActiveTab(tab.key);
                }}
                className={`pixel-tab ${activeTab === tab.key ? 'pixel-tab-active' : ''}`}
                style={{ minHeight: 56, minWidth: 0, padding: '6px 2px' }}
              >
                <TabIcon tabKey={tab.key} />
                <span style={{ fontSize: 9 }}>{t(`tabs.${tab.key}`)}</span>
              </button>
            ))}
          </nav>
        </>
      ) : (
        // ======== LAYOUT TABLET / DESKTOP ========
        <main className="flex flex-1 flex-row items-stretch gap-3 min-h-0 p-2">
          {useSidebar && <DesktopSidebar />}
          <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
            <div className="farm-frame-wrap">
              <span className="frame-rivet-bl" />
              <span className="frame-rivet-br" />
              <AnimatedGarden />
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full max-w-sm flex-shrink-0 overflow-y-auto">
            {activeTab === 'shop' && <ShopPanel />}
            {activeTab === 'plots' && <PlotsPanel />}
            {activeTab === 'daily' && <DailyPanel />}
            {activeTab === 'collection' && <CollectionPanel />}
            {activeTab === 'progress' && <ProgresPanel />}
          </div>
          {/* Sidebar droite : visible >=1280px (desktop large). */}
          <RightStatsPanel />
        </main>
      )}

      {session.offlineReward && (
        <OfflineRewardModal
          durationSeconds={session.offlineReward.durationSeconds}
          cashEarned={session.offlineReward.cashEarned}
          onAcknowledge={session.acknowledgeOfflineReward}
        />
      )}
      <AchievementToast />
      <MemeGiselePopup />
      <SpecialDateBanner />
      <ActivityFAB onClick={() => setMarcelLogOpen(true)} notificationCount={0} />
      {marcelLogOpen && <MarcelLog onClose={() => setMarcelLogOpen(false)} />}
    </div>
  );
}

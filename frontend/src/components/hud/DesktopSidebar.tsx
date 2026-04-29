// DesktopSidebar : rail vertical des 5 tabs (md+ 80px icones-only,
// lg+ 240px expanded avec labels). Remplace la grille tabs en bas
// pour exploiter la place laterale sur PC.

import { useTranslation } from 'react-i18next';
import { useUIStore, type AppTabKey } from '../../stores/uiStore.js';
import { ATLAS_URL, ATLAS_SIZE } from '../garden/Sprite.js';
import { useResponsive } from '../../hooks/useResponsive.js';

const TAB_ICON_COL: Record<AppTabKey, number> = {
  shop: 0,
  plots: 1,
  daily: 2,
  collection: 3,
  progress: 4,
};

const TABS: ReadonlyArray<{ key: AppTabKey }> = [
  { key: 'shop' },
  { key: 'plots' },
  { key: 'daily' },
  { key: 'collection' },
  { key: 'progress' },
];

function TabIconLarge({ tabKey }: { tabKey: AppTabKey }) {
  const SCALE = 3;
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
        flexShrink: 0,
      }}
    />
  );
}

export function DesktopSidebar() {
  const { t } = useTranslation();
  const breakpoint = useResponsive();
  const activeTab = useUIStore((s) => s.activeTab);
  const setActiveTab = useUIStore((s) => s.setActiveTab);
  const expanded = breakpoint === 'desktop'; // ≥1280 = labels visibles

  return (
    <nav
      role="tablist"
      aria-label="Navigation principale"
      className="flex flex-col"
      style={{
        width: expanded ? 240 : 80,
        background: 'var(--color-wood-5)',
        borderRight: '3px solid var(--color-accent-gold)',
        boxShadow: 'inset -3px 0 0 var(--color-wood-4), 4px 0 12px rgba(0, 0, 0, 0.3)',
        padding: 12,
        gap: 8,
        flexShrink: 0,
        height: '100%',
        overflowY: 'auto',
      }}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => setActiveTab(tab.key)}
            title={t(`tabs.${tab.key}`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: expanded ? '10px 14px' : '12px',
              background: isActive ? 'var(--color-accent-gold)' : 'var(--color-paper-1)',
              border: '2px solid var(--color-wood-5)',
              cursor: 'pointer',
              fontFamily: 'var(--font-button)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: isActive ? 'var(--color-text-title)' : 'var(--color-text-muted)',
              borderRadius: 4,
              boxShadow: isActive
                ? 'inset 0 0 0 1px #fde08a, 0 0 16px rgba(245, 196, 67, 0.5), 3px 3px 0 #6b4d12'
                : 'inset 0 0 0 1px var(--color-paper-3), 2px 2px 0 var(--color-wood-5)',
              transition: 'all 100ms ease-out',
              minHeight: 56,
              justifyContent: expanded ? 'flex-start' : 'center',
              textAlign: 'left',
            }}
          >
            <TabIconLarge tabKey={tab.key} />
            {expanded && <span>{t(`tabs.${tab.key}`)}</span>}
          </button>
        );
      })}

      {/* Footer : nom de la ferme + version (si expanded) */}
      {expanded && (
        <div
          style={{
            marginTop: 'auto',
            padding: '12px 8px 4px',
            borderTop: '2px dashed var(--color-wood-4)',
            color: 'var(--color-paper-3)',
            fontSize: 11,
          }}
          className="meme"
        >
          <div style={{ fontFamily: 'var(--font-title)', color: 'var(--color-accent-gold)', fontSize: 13 }}>
            La Ferme des Tournesols
          </div>
          <div style={{ fontStyle: 'italic', marginTop: 2 }}>
            Fondée en 1962
          </div>
        </div>
      )}
    </nav>
  );
}

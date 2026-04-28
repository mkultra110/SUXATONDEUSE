// Panel parcelles : liste de cards panel-9 avec preview pixel art,
// nom, multiplier, surface, et bouton de deblocage gold.

import { useTranslation } from 'react-i18next';
import { PLOT_DEFINITIONS } from '@robomow/shared';
import { useGameStore, plotUnlockCost } from '../../stores/gameStore.js';
import { formatBig } from '../../game/engine/bigNumber.js';
import { CoinIcon, NavMapIcon } from '../icons/PixelIcon.js';

export function PlotsPanel() {
  const { t } = useTranslation();
  const cash = useGameStore((s) => s.cash);
  const plotsUnlocked = useGameStore((s) => s.plotsUnlocked);
  const unlockPlot = useGameStore((s) => s.unlockPlot);

  const visiblePlots = PLOT_DEFINITIONS.filter((p, i) => {
    if (i === 0) return true;
    const prev = PLOT_DEFINITIONS[i - 1];
    if (!prev) return true;
    return plotsUnlocked[prev.type] || plotsUnlocked[p.type];
  });

  return (
    <aside className="flex flex-col gap-3 max-h-[80vh]">
      <header className="flex items-center justify-between gap-2 px-1">
        <h2
          className="flex items-center gap-2 text-lg leading-none"
          style={{ fontFamily: 'var(--font-title)', color: 'var(--color-text-title)' }}
        >
          <NavMapIcon size={22} />
          {t('plots.title')}
        </h2>
      </header>
      <div className="overflow-y-auto pr-1 flex flex-col gap-2.5" style={{ maxHeight: 'calc(80vh - 60px)' }}>
        {visiblePlots.map((plot, i) => {
          const unlocked = plotsUnlocked[plot.type];
          const cost = plotUnlockCost(plot.type);
          const affordable = !unlocked && cash.gte(cost);
          return (
            <div
              key={plot.type}
              className="panel-9"
              style={{
                padding: 10,
                display: 'flex',
                gap: 10,
                alignItems: 'center',
                opacity: !unlocked && !affordable ? 0.65 : 1,
                cursor: unlocked || !affordable ? 'default' : 'pointer',
              }}
              onClick={() => {
                if (!unlocked && affordable) unlockPlot(plot.type);
              }}
            >
              <span className="nail-bl" />
              <span className="nail-br" />
              <PlotArt index={i} unlocked={unlocked} />
              <div className="flex-1 min-w-0">
                <div
                  style={{
                    fontFamily: 'var(--font-title)',
                    fontWeight: 600,
                    fontSize: 14,
                    color: 'var(--color-text-title)',
                    lineHeight: 1.1,
                  }}
                >
                  {plot.name}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 11,
                    color: 'var(--color-text-muted)',
                    marginTop: 2,
                  }}
                >
                  ×{plot.globalMultiplier} prod · {plot.surfaceM2.toLocaleString()} m²
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-button)',
                    fontSize: 9,
                    color: unlocked ? 'var(--color-grass-6)' : 'var(--color-text-muted)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginTop: 3,
                  }}
                >
                  {unlocked ? `Niveau ${i + 1}` : 'Verrouillé'}
                </div>
              </div>
              {!unlocked && (
                <button
                  type="button"
                  disabled={!affordable}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (affordable) unlockPlot(plot.type);
                  }}
                  style={{
                    background: affordable ? 'var(--color-accent-gold)' : 'var(--color-paper-3)',
                    color: affordable ? 'var(--color-text-title)' : 'var(--color-text-muted)',
                    border: '2px solid var(--color-wood-5)',
                    borderRadius: 5,
                    padding: '6px 10px',
                    fontFamily: 'var(--font-title)',
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: affordable ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    boxShadow: affordable ? '0 3px 0 #6b4d12' : '0 3px 0 var(--color-wood-3)',
                    flexShrink: 0,
                  }}
                >
                  <CoinIcon size={13} />
                  <span className="numeric">{formatBig(cost)}</span>
                </button>
              )}
              {unlocked && (
                <span
                  style={{
                    background: 'var(--color-grass-4)',
                    color: 'var(--color-paper-1)',
                    fontFamily: 'var(--font-button)',
                    fontSize: 9,
                    padding: '4px 8px',
                    border: '2px solid var(--color-grass-6)',
                    borderRadius: 4,
                    letterSpacing: '0.1em',
                    flexShrink: 0,
                    fontWeight: 700,
                  }}
                >
                  ACTIF
                </span>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

// Vignette parcelle 56x56 : carre vert avec quelques "feuilles" pixel
// pseudo-aleatoires (motif different par index). Locked = papier + cadenas.
function PlotArt({ index, unlocked }: { index: number; unlocked: boolean }) {
  if (!unlocked) {
    return (
      <div
        style={{
          width: 56,
          height: 56,
          background: 'var(--color-paper-3)',
          border: '2px solid var(--color-wood-5)',
          borderRadius: 4,
          boxShadow: 'inset 0 -2px 0 var(--color-wood-3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg viewBox="0 0 16 16" shapeRendering="crispEdges" style={{ width: 24, height: 24, imageRendering: 'pixelated' }}>
          <rect x="5" y="2" width="6" height="2" fill="#5c3d24" />
          <rect x="4" y="3" width="2" height="4" fill="#5c3d24" />
          <rect x="10" y="3" width="2" height="4" fill="#5c3d24" />
          <rect x="3" y="7" width="10" height="7" fill="#c49b6a" />
          <rect x="3" y="7" width="10" height="2" fill="#f5e6c8" />
          <rect x="3" y="13" width="10" height="1" fill="#5c3d24" />
          <rect x="7" y="9" width="2" height="3" fill="#5c3d24" />
        </svg>
      </div>
    );
  }
  // Pattern leaves pseudo-random by index
  const leaves: Array<[number, number, string]> = [
    [10, 12, '#b8d672'],
    [28, 24, '#8fbf4f'],
    [38, 14, '#f29bb8'],
    [18, 38, '#b8d672'],
    [44, 38, '#8fbf4f'],
  ];
  const offset = (index * 7) % 30;
  return (
    <div
      style={{
        width: 56,
        height: 56,
        background: 'var(--color-grass-4)',
        border: '2px solid var(--color-wood-5)',
        borderRadius: 4,
        boxShadow: 'inset 0 -2px 0 var(--color-grass-6), inset 0 2px 0 var(--color-grass-2)',
        position: 'relative',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {leaves.map(([x, y, c], i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            top: `${(y + offset) % 50 + 4}px`,
            left: `${(x + offset * 2) % 48 + 4}px`,
            width: 4,
            height: 4,
            background: c,
            borderRadius: 1,
          }}
        />
      ))}
    </div>
  );
}

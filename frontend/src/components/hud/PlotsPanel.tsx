// Panel des parcelles : liste des 10 zones et bouton de deblocage.

import { useTranslation } from 'react-i18next';
import { PLOT_DEFINITIONS } from '@robomow/shared';
import { useGameStore, plotUnlockCost } from '../../stores/gameStore.js';
import { formatBig } from '../../game/engine/bigNumber.js';

export function PlotsPanel() {
  const { t } = useTranslation();
  const cash = useGameStore((s) => s.cash);
  const plotsUnlocked = useGameStore((s) => s.plotsUnlocked);
  const unlockPlot = useGameStore((s) => s.unlockPlot);

  // Visible si debloque ou si le precedent l'est.
  const visiblePlots = PLOT_DEFINITIONS.filter((p, i) => {
    if (i === 0) return true;
    const prev = PLOT_DEFINITIONS[i - 1];
    if (!prev) return true;
    return plotsUnlocked[prev.type] || plotsUnlocked[p.type];
  });

  return (
    <aside className="flex w-full max-w-sm flex-col gap-2 panel p-3 max-h-[80vh] overflow-y-auto">
      <h2 className="text-sm font-bold text-ink-base">{t('plots.title')}</h2>
      <ul className="flex flex-col gap-2">
        {visiblePlots.map((plot) => {
          const unlocked = plotsUnlocked[plot.type];
          const cost = plotUnlockCost(plot.type);
          const affordable = !unlocked && cash.gte(cost);
          return (
            <li key={plot.type}>
              <button
                disabled={unlocked || !affordable}
                onClick={() => unlockPlot(plot.type)}
                className={`flex w-full items-center justify-between rounded border-2 p-2 text-left transition ${
                  unlocked
                    ? 'border-grass-base bg-grass-shadow text-panel-base'
                    : affordable
                      ? 'border-accent-gold bg-panel-paper hover:bg-panel-base'
                      : 'cursor-not-allowed border-robot-shadow bg-panel-paper opacity-60'
                }`}
              >
                <div>
                  <div className="text-sm font-bold">
                    {plot.name}
                    {unlocked && ' ✓'}
                  </div>
                  <div className="text-xs">
                    ×{plot.globalMultiplier} prod · {plot.surfaceM2.toLocaleString()} m²
                  </div>
                </div>
                {!unlocked && (
                  <div className="text-sm font-bold text-accent-gold tabular-nums">
                    🪙 {formatBig(cost)}
                  </div>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

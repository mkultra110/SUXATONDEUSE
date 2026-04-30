// MiniMapOverview : vue d'ensemble parcelles (idee #114). 5 colonnes
// representant les parcelles unlocked / lock / boss en cours.

import { PLOT_DEFINITIONS } from '@robomow/shared';
import { useGameStore } from '../../stores/gameStore.js';

export function MiniMapOverview() {
  const plotsUnlocked = useGameStore((s) => s.plotsUnlocked);

  return (
    <div className="mini-map-overview" title="Vue d'ensemble des parcelles">
      {PLOT_DEFINITIONS.map((p) => {
        const unlocked = plotsUnlocked[p.type];
        return (
          <div
            key={p.type}
            className="mini-map-tile"
            style={{
              background: unlocked ? 'var(--color-grass-5)' : 'var(--color-wood-3)',
              opacity: unlocked ? 1 : 0.5,
              color: unlocked ? 'var(--color-paper-1)' : 'var(--color-wood-5)',
            }}
            title={`${p.name}${unlocked ? ' (debloque)' : ' (verrouille)'}`}
          >
            {unlocked ? '✓' : '🔒'}
          </div>
        );
      })}
    </div>
  );
}

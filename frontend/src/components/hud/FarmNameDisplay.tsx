// FarmNameDisplay : affiche le nom de la ferme custom + avatar emoji
// dans le coin haut-droit du jardin (idees #385 #387 #389).

import { useUIStore } from '../../stores/uiStore.js';
import { useGameStore } from '../../stores/gameStore.js';

export function FarmNameDisplay() {
  const farmName = useUIStore((s) => s.farmName);
  const playerEmoji = useUIStore((s) => s.playerEmoji);
  const totalRobots = useGameStore((s) => s.totalRobotsBought);
  const status = totalRobots === 0 ? 'au lit' : totalRobots < 10 ? 'demarre' : totalRobots < 100 ? 'tonde a fond' : totalRobots < 1000 ? 'magnat' : 'legendaire';

  return (
    <div
      style={{
        position: 'fixed',
        top: 'calc(56px + env(safe-area-inset-top, 0px) + 4px)',
        right: 8,
        zIndex: 35,
        background: 'var(--color-paper-1)',
        border: '2px solid var(--color-wood-5)',
        padding: '4px 8px',
        fontFamily: 'var(--font-meme)',
        fontStyle: 'italic',
        fontSize: 11,
        color: 'var(--color-text-body)',
        pointerEvents: 'none',
        opacity: 0.85,
        maxWidth: 200,
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        boxShadow: '0 2px 0 var(--color-wood-5)',
      }}
    >
      {playerEmoji} {farmName} · <span style={{ color: 'var(--color-text-muted)', fontSize: 9 }}>{status}</span>
    </div>
  );
}

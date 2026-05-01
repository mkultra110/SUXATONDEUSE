// NextMilestoneBanner : banner discrete sticky entre TopBar et jardin
// qui affiche le prochain palier visible (rang / niveau / map / boss).
// Donne au joueur un OBJECTIF visible permanent (research idee #25 : HUD persistent).

import { useGameStore } from '../../stores/gameStore.js';
import { computePlayerLevel, rankForLevel, nextRankAt, xpRatioInLevel } from '../../utils/playerLevel.js';
import { formatBig } from '../../utils/format.js';

export function NextMilestoneBanner() {
  const totalCash = useGameStore((s) => s.totalCashEarned);
  const level = computePlayerLevel(totalCash);
  const ratio = xpRatioInLevel(totalCash, level);
  const next = nextRankAt(level);
  const rank = rankForLevel(level);

  if (!next) return null;
  const levelsToNext = next.minLevel - level;

  return (
    <div
      style={{
        background: 'var(--color-paper-1)',
        borderBottom: `2px solid ${rank.color}`,
        padding: '4px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 11,
        fontFamily: 'var(--font-button)',
        color: 'var(--color-text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        flexShrink: 0,
        boxShadow: 'inset 0 -1px 0 var(--color-wood-3)',
      }}
    >
      <span>Prochain</span>
      <span style={{ color: next.color, fontWeight: 700 }}>{next.title}</span>
      <span style={{ color: 'var(--color-text-muted)' }}>· {levelsToNext} lv</span>
      <span className="flex-1" />
      <span style={{ color: 'var(--color-accent-gold)' }} className="numeric">
        {Math.round(ratio * 100)}%
      </span>
      <div
        style={{
          flex: '0 0 60px',
          height: 6,
          background: 'var(--color-wood-3)',
          border: '1px solid var(--color-wood-5)',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${Math.min(100, ratio * 100)}%`,
            height: '100%',
            background: rank.color,
            transition: 'width 600ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      </div>
      <span style={{ color: 'var(--color-text-muted)', fontSize: 9 }}>
        {formatBig(totalCash)} pieces
      </span>
    </div>
  );
}

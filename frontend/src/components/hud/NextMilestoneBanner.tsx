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
    <div className="kawaii-goal-ticker">
      <span className="goal-label">PROCHAIN OBJECTIF</span>
      <span style={{ color: next.color, fontWeight: 700, fontFamily: 'var(--font-title)' }}>
        {next.title}
      </span>
      <span>· {levelsToNext} lv restant{levelsToNext > 1 ? 's' : ''}</span>
      <span className="flex-1" />
      <span className="numeric" style={{ color: 'var(--k-gold, #FFD921)' }}>
        {Math.round(ratio * 100)}%
      </span>
      <div
        style={{
          flex: '0 0 60px',
          height: 6,
          background: 'rgba(255, 255, 255, 0.15)',
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
      <span style={{ fontSize: 11, opacity: 0.7 }}>
        {formatBig(totalCash)}
      </span>
    </div>
  );
}

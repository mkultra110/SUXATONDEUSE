// MilestoneTimeline : timeline horizontale milestones franchies
// (idee #113). Affiche les paliers de niveau / cash / robots passes.

import { useMemo } from 'react';
import { useGameStore } from '../../stores/gameStore.js';
import { computePlayerLevel } from '../../utils/playerLevel.js';
import { formatBig } from '../../utils/format.js';

interface Milestone {
  label: string;
  reached: boolean;
  emoji: string;
}

export function MilestoneTimeline() {
  const totalCash = useGameStore((s) => s.totalCashEarned);
  const totalRobots = useGameStore((s) => s.totalRobotsBought);
  const totalPrestiges = useGameStore((s) => s.totalPrestiges);
  const level = computePlayerLevel(totalCash);

  const milestones: ReadonlyArray<Milestone> = useMemo(
    () => [
      { label: 'Niveau 5', reached: level >= 5, emoji: '🌱' },
      { label: '10 robots', reached: totalRobots >= 10, emoji: '🤖' },
      { label: '100K cash', reached: Number(totalCash.toString()) >= 1e5, emoji: '💰' },
      { label: 'Niveau 10', reached: level >= 10, emoji: '🌻' },
      { label: '100 robots', reached: totalRobots >= 100, emoji: '🚜' },
      { label: '1M cash', reached: Number(totalCash.toString()) >= 1e6, emoji: '💎' },
      { label: 'Niveau 25', reached: level >= 25, emoji: '⭐' },
      { label: '1er prestige', reached: totalPrestiges >= 1, emoji: '🌸' },
      { label: 'Niveau 50', reached: level >= 50, emoji: '🏆' },
      { label: 'Niveau 100', reached: level >= 100, emoji: '👑' },
    ],
    [level, totalRobots, totalCash, totalPrestiges],
  );

  const reachedCount = milestones.filter((m) => m.reached).length;

  return (
    <div className="panel-paper" style={{ padding: 10 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-button)',
            fontSize: 9,
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          Paliers atteints
        </span>
        <span className="numeric" style={{ fontSize: 11, color: 'var(--color-accent-gold)', fontWeight: 700 }}>
          {reachedCount} / {milestones.length}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 4, overflowX: 'auto', paddingBottom: 4 }}>
        {milestones.map((m, i) => (
          <div
            key={m.label}
            title={m.label}
            style={{
              flexShrink: 0,
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: m.reached ? 'var(--color-accent-gold)' : 'var(--color-paper-3)',
              border: `2px solid ${m.reached ? 'var(--color-wood-5)' : 'var(--color-wood-3)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              opacity: m.reached ? 1 : 0.4,
              filter: m.reached ? undefined : 'grayscale(1)',
              transition: 'all 200ms ease',
              position: 'relative',
            }}
          >
            {m.emoji}
            {m.reached && i < milestones.length - 1 && milestones[i + 1]?.reached && (
              <span
                style={{
                  position: 'absolute',
                  left: '100%',
                  top: '50%',
                  width: 4,
                  height: 2,
                  background: 'var(--color-accent-gold)',
                }}
              />
            )}
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>
        {formatBig(totalCash)} pieces · {totalRobots} robots
      </div>
    </div>
  );
}

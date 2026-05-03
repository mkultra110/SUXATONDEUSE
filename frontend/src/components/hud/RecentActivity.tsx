// RecentActivity : log des 10 derniers evenements (achats, boss, milestones).
// S'affiche sous le jardin sur desktop (en plus de MilestoneTimeline).

import { useEffectsStore } from '../../stores/effectsStore.js';

const KIND_ICON: Record<string, string> = {
  buy: '🛒',
  upgrade: '⬆️',
  boss: '⚔️',
  level: '⭐',
  rank: '👑',
  rare: '🌟',
  milestone: '🏆',
};

const KIND_COLOR: Record<string, string> = {
  buy: 'var(--color-grass-5)',
  upgrade: 'var(--color-accent-purple)',
  boss: 'var(--color-accent-red)',
  level: 'var(--color-accent-gold)',
  rank: 'var(--color-accent-gold)',
  rare: '#FF8FA3',
  milestone: 'var(--color-accent-fuel)',
};

function timeAgo(ts: number): string {
  const sec = Math.floor((Date.now() - ts) / 1000);
  if (sec < 60) return `${sec}s`;
  if (sec < 3600) return `${Math.floor(sec / 60)}min`;
  if (sec < 86_400) return `${Math.floor(sec / 3600)}h`;
  return `${Math.floor(sec / 86_400)}j`;
}

export function RecentActivity() {
  const log = useEffectsStore((s) => s.activityLog);

  if (log.length === 0) {
    return (
      <div className="panel-paper" style={{ padding: 12, marginTop: 8 }}>
        <div
          style={{
            fontFamily: 'var(--font-button)',
            fontSize: 9,
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: 6,
          }}
        >
          Activité récente
        </div>
        <div className="empty-state" style={{ padding: 8, fontSize: 12 }}>
          « Pas encore d'activité. Achète un robot ! »
        </div>
      </div>
    );
  }

  return (
    <div className="panel-paper" style={{ padding: 12, marginTop: 8 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-button)',
            fontSize: 9,
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          Activité récente
        </div>
        <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>
          {log.length} événement{log.length > 1 ? 's' : ''}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 200, overflowY: 'auto' }}>
        {log.slice(0, 10).map((e) => (
          <div
            key={e.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 8px',
              background: 'var(--color-paper-2)',
              border: '1px solid var(--color-wood-3)',
              borderLeft: `3px solid ${KIND_COLOR[e.kind] ?? 'var(--color-wood-3)'}`,
              fontSize: 12,
              color: 'var(--color-text-body)',
            }}
          >
            <span style={{ fontSize: 14 }}>{KIND_ICON[e.kind] ?? '·'}</span>
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {e.text}
            </span>
            <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{timeAgo(e.timestamp)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

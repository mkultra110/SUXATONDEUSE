// StatsHebdo : modal "Cette semaine" qui resume les stats des 7 derniers
// jours via les compteurs daily du gameStore (approximatif sur la session
// courante, mais visible pour le sentiment de progression).

import { useGameStore } from '../../stores/gameStore.js';
import { useUIStore } from '../../stores/uiStore.js';
import { CrossIcon, CoinIcon, IconBlade, RobotLogo, TrophyIcon } from '../icons/PixelIcon.js';
import { formatBig } from '../../utils/format.js';

export function StatsHebdo() {
  const open = useUIStore((s) => s.statsHebdoOpen);
  const setOpen = useUIStore((s) => s.setStatsHebdoOpen);
  const totalCash = useGameStore((s) => s.totalCashEarned);
  const totalGrass = useGameStore((s) => s.totalGrassMowed);
  const totalRobots = useGameStore((s) => s.totalRobotsBought);
  const totalUpgrades = useGameStore((s) => s.totalUpgrades);
  const playTime = useGameStore((s) => s.playTimeSeconds);
  const dailyCash = useGameStore((s) => s.dailyCashEarned);
  const dailyGrass = useGameStore((s) => s.dailyGrassMowed);
  const dailyRobots = useGameStore((s) => s.dailyRobotsBought);
  const dailyUpgrades = useGameStore((s) => s.dailyUpgradesBought);
  const loginStreak = useGameStore((s) => s.loginStreak);

  if (!open) return null;

  const hours = Math.floor(playTime / 3600);
  const minutes = Math.floor((playTime % 3600) / 60);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1600,
        background: 'rgba(0,0,0,0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      role="dialog"
      aria-labelledby="stats-hebdo-title"
    >
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          background: 'var(--color-paper-1)',
          border: '4px solid var(--color-wood-5)',
          padding: 18,
          maxHeight: '90vh',
          overflow: 'auto',
        }}
      >
        <header className="flex items-center justify-between" style={{ marginBottom: 12 }}>
          <h2
            id="stats-hebdo-title"
            style={{
              fontFamily: 'var(--font-title)',
              fontSize: 20,
              fontWeight: 700,
              color: 'var(--color-text-title)',
              margin: 0,
            }}
          >
            Bilan de la ferme
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fermer"
            className="pixel-btn pixel-btn-wood"
            style={{ padding: 6 }}
          >
            <CrossIcon size={14} />
          </button>
        </header>
        <p
          className="meme"
          style={{ fontSize: 13, color: 'var(--color-text-muted)', fontStyle: 'italic', textAlign: 'center', marginBottom: 12 }}
        >
          « Voici ce que tu as récolté sur ce cycle, mon petit. »
        </p>

        <div className="grid grid-cols-2 gap-2">
          <Cell label="Cash gagné (cycle)" icon={<CoinIcon size={20} />} value={formatBig(totalCash)} accent="var(--color-accent-gold)" />
          <Cell label="Cash gagné (aujourd'hui)" icon={<CoinIcon size={20} />} value={formatBig(dailyCash)} accent="var(--color-accent-gold)" />
          <Cell label="Herbe coupée (cycle)" icon={<IconBlade size={20} />} value={formatBig(totalGrass)} accent="var(--color-grass-5)" />
          <Cell label="Herbe coupée (aujourd'hui)" icon={<IconBlade size={20} />} value={formatBig(dailyGrass)} accent="var(--color-grass-5)" />
          <Cell label="Robots achetés (cycle)" icon={<RobotLogo size={20} />} value={String(totalRobots)} accent="var(--color-text-title)" />
          <Cell label="Robots achetés (aujourd'hui)" icon={<RobotLogo size={20} />} value={String(dailyRobots)} accent="var(--color-text-title)" />
          <Cell label="Améliorations (cycle)" icon={<TrophyIcon size={20} />} value={String(totalUpgrades)} accent="var(--color-accent-purple)" />
          <Cell label="Améliorations (jour)" icon={<TrophyIcon size={20} />} value={String(dailyUpgrades)} accent="var(--color-accent-purple)" />
        </div>

        <div
          style={{
            marginTop: 14,
            padding: 12,
            background: 'var(--color-paper-2)',
            border: '2px solid var(--color-wood-5)',
            display: 'flex',
            justifyContent: 'space-around',
            textAlign: 'center',
          }}
        >
          <div>
            <div style={{ fontFamily: 'var(--font-button)', fontSize: 9, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Streak
            </div>
            <div className="numeric" style={{ fontSize: 22, color: 'var(--color-accent-fuel)', fontWeight: 700 }}>
              {loginStreak} j
            </div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-button)', fontSize: 9, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Temps de jeu
            </div>
            <div className="numeric" style={{ fontSize: 22, color: 'var(--color-accent-gold)', fontWeight: 700 }}>
              {hours}h{String(minutes).padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Cell({ label, icon, value, accent }: { label: string; icon: React.ReactNode; value: string; accent: string }) {
  return (
    <div
      className="panel-paper"
      style={{ padding: 10, display: 'flex', alignItems: 'center', gap: 8 }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          background: 'var(--color-paper-2)',
          border: '2px solid var(--color-wood-5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div
          style={{
            fontFamily: 'var(--font-button)',
            fontSize: 8,
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          {label}
        </div>
        <div className="numeric" style={{ fontSize: 14, fontWeight: 700, color: accent }}>
          {value}
        </div>
      </div>
    </div>
  );
}

// RightStatsPanel : sidebar droite desktop ≥1280px avec stats live de la
// ferme. Pattern dashboard tycoon (Egg Inc., AdVenture Capitalist desktop).
// Affiche : revenus/s + total cash + parcelle active + robots actifs +
// succes count + cycle jour/saison.

import { useTranslation } from 'react-i18next';
import { ROBOT_TIERS, PLOT_DEFINITIONS, ACHIEVEMENTS } from '@robomow/shared';
import { useGameStore } from '../../stores/gameStore.js';
import { formatBig } from '../../utils/format.js';
import { CoinIcon, IconBlade, NavMapIcon, RobotLogo, TrophyIcon } from '../icons/PixelIcon.js';
import { useResponsive } from '../../hooks/useResponsive.js';

const SECONDS_PER_GAME_DAY = 60;

export function RightStatsPanel() {
  const { t } = useTranslation();
  const breakpoint = useResponsive();
  const cash = useGameStore((s) => s.cash);
  const cashPerSecond = useGameStore((s) => s.cashPerSecond);
  const totalCashEarned = useGameStore((s) => s.totalCashEarned);
  const totalGrass = useGameStore((s) => s.totalGrassMowed);
  const holdings = useGameStore((s) => s.holdings);
  const plotsUnlocked = useGameStore((s) => s.plotsUnlocked);
  const achievementsUnlocked = useGameStore((s) => s.achievementsUnlocked);
  const playTime = useGameStore((s) => s.playTimeSeconds);
  const dayNumber = Math.floor(playTime / SECONDS_PER_GAME_DAY) + 1;

  // Visible uniquement sur desktop large (≥1280px).
  if (breakpoint !== 'desktop') return null;

  const robotsTotal = ROBOT_TIERS.reduce(
    (acc, tier) => acc + (holdings[tier.type]?.owned ?? 0),
    0,
  );
  const ownedAchievements = Array.from(achievementsUnlocked).filter(
    (k) => !k.endsWith(':claimed'),
  ).length;
  // Parcelle "active" = la plus haute parcelle debloquee.
  const activePlot = [...PLOT_DEFINITIONS].reverse().find((p) => plotsUnlocked[p.type]);
  // Top robot tier possede.
  const topRobot = [...ROBOT_TIERS].reverse().find(
    (tier) => (holdings[tier.type]?.owned ?? 0) > 0,
  );

  return (
    <aside
      className="flex flex-col gap-3 flex-shrink-0"
      style={{
        width: 320,
        background: 'var(--color-paper-2)',
        borderLeft: '3px solid var(--color-accent-gold)',
        boxShadow: 'inset 3px 0 0 var(--color-wood-4), -4px 0 12px rgba(0, 0, 0, 0.2)',
        padding: 16,
        height: '100%',
        overflowY: 'auto',
      }}
    >
      <header className="flex items-center justify-between">
        <h2
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--color-text-title)',
            margin: 0,
          }}
        >
          Live
        </h2>
        <span className="meme" style={{ fontSize: 13, color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
          Jour {dayNumber}
        </span>
      </header>

      {/* Hero card : cash + cash/sec gros */}
      <div
        className="panel-9"
        style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}
      >
        <span className="nail-bl" />
        <span className="nail-br" />
        <span
          className="micro"
          style={{
            fontFamily: 'var(--font-button)',
            fontSize: 9,
            color: 'var(--color-text-muted)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          Pièces
        </span>
        <span className="flex items-center gap-2">
          <CoinIcon size={28} />
          <span
            className="numeric"
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: 'var(--color-accent-gold)',
              textShadow: '2px 2px 0 var(--color-wood-5)',
            }}
          >
            {formatBig(cash)}
          </span>
        </span>
        {cashPerSecond.gt(0) && (
          <span
            className="numeric"
            style={{
              fontSize: 14,
              color: 'var(--color-grass-5)',
              fontWeight: 700,
            }}
          >
            +{formatBig(cashPerSecond)}/s
          </span>
        )}
      </div>

      {/* Parcelle active */}
      {activePlot && (
        <StatRow
          icon={<NavMapIcon size={20} />}
          label="Parcelle active"
          value={activePlot.name}
          accent="var(--color-grass-5)"
        />
      )}

      {/* Robots actifs */}
      <StatRow
        icon={<RobotLogo size={20} />}
        label="Robots actifs"
        value={`${robotsTotal} robots`}
        sublabel={topRobot ? `Top : ${t(`robotNicknames.${topRobot.type}`, topRobot.name)}` : undefined}
        accent="var(--color-text-title)"
      />

      {/* Cash total gagne (lifetime) */}
      <StatRow
        icon={<CoinIcon size={20} />}
        label="Cash total gagné"
        value={formatBig(totalCashEarned)}
        accent="var(--color-accent-gold)"
      />

      {/* Herbe coupee */}
      <StatRow
        icon={<IconBlade size={20} />}
        label="Herbe coupée"
        value={formatBig(totalGrass)}
        accent="var(--color-grass-5)"
      />

      {/* Succes */}
      <StatRow
        icon={<TrophyIcon size={20} />}
        label="Succès"
        value={`${ownedAchievements} / ${ACHIEVEMENTS.length}`}
        accent="var(--color-accent-gold)"
      />

      {/* Footer : citation rotative Memé */}
      <div
        className="panel-paper"
        style={{
          marginTop: 'auto',
          padding: 12,
          fontSize: 14,
          fontStyle: 'italic',
          color: 'var(--color-text-muted)',
          textAlign: 'center',
        }}
      >
        <p className="meme" style={{ margin: 0, lineHeight: 1.4 }}>
          « Petit à petit, l'oiseau fait son nid. »
        </p>
        <p
          className="meme"
          style={{
            margin: '4px 0 0',
            fontSize: 11,
            color: 'var(--color-accent-red)',
          }}
        >
          — Mémé Gisèle
        </p>
      </div>
    </aside>
  );
}

interface StatRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel?: string | undefined;
  accent: string;
}

function StatRow({ icon, label, value, sublabel, accent }: StatRowProps) {
  return (
    <div
      className="panel-paper"
      style={{
        padding: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          background: 'var(--color-paper-2)',
          border: '2px solid var(--color-wood-5)',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: 'inset 0 -2px 0 var(--color-wood-3)',
        }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div
          style={{
            fontFamily: 'var(--font-button)',
            fontSize: 9,
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          {label}
        </div>
        <div
          className="numeric"
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: accent,
            lineHeight: 1.1,
          }}
        >
          {value}
        </div>
        {sublabel && (
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              color: 'var(--color-text-muted)',
              marginTop: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {sublabel}
          </div>
        )}
      </div>
    </div>
  );
}

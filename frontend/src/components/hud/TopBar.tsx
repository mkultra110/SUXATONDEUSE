// TopBar style RCT Touch / Stardew : 1 seule ligne horizontale 56-72px.
// LevelBadge + 3 currencies (cash + fuel + seeds) + Day pill + Weather +
// KebabMenu. Plus de bouton Deconnexion visible (deplace dans kebab menu).
// Plus de sous-titre 'Fondee en 1962 par Memé Gisele' (deplace dans 'A propos').

import { useGameStore } from '../../stores/gameStore.js';
import { useAuth } from '../../hooks/useAuth.js';
import { CashCounter } from './CashCounter.js';
import { WeatherBadge } from './WeatherBadge.js';
import { AudioControls } from './AudioControls.js';
import { KebabMenu } from './KebabMenu.js';
import { FuelIcon, SeedIcon, RobotLogo, StarIcon } from '../icons/PixelIcon.js';
import {
  computePlayerLevel,
  progressionTier,
  TIER_GLOW,
  rankForLevel,
  nextRankAt,
  xpRatioInLevel,
} from '../../utils/playerLevel.js';
import { AnimatedNumber } from './AnimatedNumber.js';

const SECONDS_PER_GAME_DAY = 60;

export function TopBar() {
  const { user } = useAuth();
  const gems = useGameStore((s) => s.gems);
  const prestigePoints = useGameStore((s) => s.prestigePoints);
  const totalCash = useGameStore((s) => s.totalCashEarned);
  const playTime = useGameStore((s) => s.playTimeSeconds);
  const dayNumber = Math.floor(playTime / SECONDS_PER_GAME_DAY) + 1;
  const level = computePlayerLevel(totalCash);
  const tier = progressionTier(level);
  const tierGlow = TIER_GLOW[tier];
  const rank = rankForLevel(level);
  const nextRank = nextRankAt(level);
  const xpRatio = xpRatioInLevel(totalCash, level);

  return (
    <header
      className="flex w-full items-center gap-1.5 px-2 py-1.5 flex-nowrap overflow-x-auto"
      style={{
        background: 'var(--color-wood-5)',
        borderBottom: '2px solid var(--color-accent-gold)',
        boxShadow: 'inset 0 -3px 0 var(--color-wood-4), 0 4px 12px rgba(0,0,0,0.3)',
        minHeight: 52,
        scrollbarWidth: 'none',
        flexShrink: 0,
      }}
    >
      {/* LevelBadge - cercle dore 40x40 avec etoile + numero (mock niveau = playerLevel) */}
      <LevelBadge level={level} username={user?.username ?? ''} tierGlow={tierGlow} />

      {/* Rank title + XP bar mini - signature progression visible. */}
      <RankAndXp
        rankTitle={rank.title}
        rankColor={rank.color}
        xpRatio={xpRatio}
        nextRankTitle={nextRank?.title ?? null}
        nextRankAtLevel={nextRank?.minLevel ?? null}
        currentLevel={level}
      />

      {/* Day pill compact */}
      <Pill title={`Jour ${dayNumber}`}>
        <StarIcon size={12} />
        <span
          className="numeric"
          style={{ fontSize: 14, color: 'var(--color-accent-gold)', lineHeight: 1 }}
        >
          {dayNumber}
        </span>
      </Pill>

      {/* WeatherBadge */}
      <WeatherBadge />

      {/* Spacer pour pousser les currencies a droite si large ecran */}
      <div className="flex-1 min-w-0" />

      {/* Currencies (cash counter + fuel + seeds), avec format K/M/B */}
      <CashCounter />
      <Pill title="Essence">
        <span className="icon-fuel-tangue" style={{ display: 'inline-flex' }}>
          <FuelIcon size={14} />
        </span>
        <AnimatedNumber
          value={Number(gems)}
          className="numeric"
          style={{ fontSize: 13, color: 'var(--color-accent-fuel)', lineHeight: 1 }}
        />
      </Pill>
      <Pill title="Graines de Printemps">
        <span className="icon-seed-pulse" style={{ display: 'inline-flex' }}>
          <SeedIcon size={14} />
        </span>
        <AnimatedNumber
          value={Number(prestigePoints.toString())}
          className="numeric"
          style={{ fontSize: 13, color: 'var(--color-accent-purple)', lineHeight: 1 }}
        />
      </Pill>

      <AudioControls />
      <KebabMenu />
    </header>
  );
}

// Pill compacte pour currencies/info (40px de hauteur).
function Pill({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div
      title={title}
      className="flex items-center gap-1 px-2 py-1 flex-shrink-0"
      style={{
        background: 'var(--color-wood-5)',
        border: '2px solid var(--color-wood-4)',
        boxShadow: 'inset 0 -1px 0 rgba(0,0,0,0.3)',
        minHeight: 30,
      }}
    >
      {children}
    </div>
  );
}

// RankAndXp : titre de rang colore + barre XP mini sous le titre.
// Affiche aussi 'Lv N -> M' pour signaler le prochain palier de rang.
function RankAndXp({
  rankTitle,
  rankColor,
  xpRatio,
  nextRankTitle,
  nextRankAtLevel,
  currentLevel,
}: {
  rankTitle: string;
  rankColor: string;
  xpRatio: number;
  nextRankTitle: string | null;
  nextRankAtLevel: number | null;
  currentLevel: number;
}) {
  const pct = Math.min(100, Math.max(0, Math.round(xpRatio * 100)));
  const tooltip = nextRankTitle
    ? `Rang : ${rankTitle} · Prochain : ${nextRankTitle} (Lv ${nextRankAtLevel}) · ${pct}% du niveau ${currentLevel + 1}`
    : `Rang : ${rankTitle} · ${pct}% du niveau ${currentLevel + 1}`;
  return (
    <div
      title={tooltip}
      className="flex flex-col gap-0.5 flex-shrink-0"
      style={{ minWidth: 0 }}
    >
      <span
        style={{
          fontFamily: 'var(--font-button)',
          fontSize: 10,
          fontWeight: 700,
          color: rankColor,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          lineHeight: 1,
          textShadow: '1px 1px 0 var(--color-wood-5)',
          whiteSpace: 'nowrap',
        }}
      >
        {rankTitle}
      </span>
      <div className="xp-bar-track" aria-label={`XP ${pct}%`} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="xp-bar-fill" style={{ width: `${pct}%` }} />
        {pct > 4 && pct < 96 && <div className="xp-bar-shimmer" />}
      </div>
    </div>
  );
}

// LevelBadge cercle dore 40x40 avec robot logo + halo subtil.
// Niveau calcule depuis totalCashEarned (progression logarithmique).
function LevelBadge({ level, username, tierGlow }: { level: number; username: string; tierGlow: string }) {
  return (
    <div
      title={`Niveau ${level}${username ? ` · ${username}` : ''}`}
      style={{
        width: 44,
        height: 44,
        background: 'radial-gradient(circle at 35% 30%, #fde08a, var(--color-accent-gold) 60%, #a87a1f)',
        border: '2px solid var(--color-wood-5)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        flexShrink: 0,
        boxShadow: `inset 0 -2px 0 #a87a1f, 0 2px 0 var(--color-wood-5), 0 0 12px rgba(245, 196, 67, 0.5), 0 0 24px ${tierGlow}`,
      }}
    >
      <RobotLogo size={26} />
      <span
        style={{
          position: 'absolute',
          bottom: -2,
          right: -2,
          background: 'var(--color-wood-5)',
          color: 'var(--color-accent-gold)',
          fontFamily: 'var(--font-button)',
          fontSize: 9,
          padding: '1px 4px',
          border: '1px solid var(--color-accent-gold)',
          borderRadius: 2,
          lineHeight: 1,
          fontWeight: 700,
        }}
      >
        LV{level}
      </span>
    </div>
  );
}

// Panel statistiques : grid 2-col de KPI cards panel-paper avec icones
// SVG pixel art, valeurs en Inter tabular-nums.

import { useTranslation } from 'react-i18next';
import { ROBOT_TIERS } from '@robomow/shared';
import { useGameStore } from '../../stores/gameStore.js';
import { formatBig } from '../../game/engine/bigNumber.js';
import {
  CoinIcon,
  SeedIcon,
  TrophyIcon,
  StarIcon,
  HeartIcon,
  IconGear,
  RobotLogo,
  NavShopIcon,
  IconBlade,
} from '../icons/PixelIcon.js';
import type { ReactNode } from 'react';

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}h ${m}min`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function StatsPanel() {
  const { t } = useTranslation();
  const totalCash = useGameStore((s) => s.totalCashEarned);
  const totalGrass = useGameStore((s) => s.totalGrassMowed);
  const totalRobots = useGameStore((s) => s.totalRobotsBought);
  const totalUpgrades = useGameStore((s) => s.totalUpgrades);
  const totalPrestiges = useGameStore((s) => s.totalPrestiges);
  const playTime = useGameStore((s) => s.playTimeSeconds);
  const cashPerSecond = useGameStore((s) => s.cashPerSecond);
  const holdings = useGameStore((s) => s.holdings);
  const loginStreak = useGameStore((s) => s.loginStreak);
  const achievements = useGameStore((s) => s.achievementsUnlocked);
  const petsOwned = useGameStore((s) => s.petsOwned);
  const skinsOwned = useGameStore((s) => s.skinsOwned);

  const robotsTotal = ROBOT_TIERS.reduce((acc, tier) => acc + holdings[tier.type].owned, 0);
  const ownedAchievements = Array.from(achievements).filter((k) => !k.endsWith(':claimed')).length;

  return (
    <aside className="flex flex-col gap-3 max-h-[80vh]">
      <header className="px-1">
        <h2
          className="flex items-center gap-2 text-lg leading-none"
          style={{ fontFamily: 'var(--font-title)', color: 'var(--color-text-title)' }}
        >
          <IconGear size={22} />
          {t('stats.title')}
        </h2>
      </header>

      <div className="overflow-y-auto pr-1 flex flex-col gap-3" style={{ maxHeight: 'calc(80vh - 60px)' }}>
        <section className="grid grid-cols-2 gap-2">
          <Stat label={t('stats.totalCash')} value={formatBig(totalCash)} icon={<CoinIcon size={16} />} accent="var(--color-accent-gold)" />
          <Stat label={t('stats.totalGrass')} value={formatBig(totalGrass)} icon={<IconBlade size={16} />} accent="var(--color-grass-5)" />
          <Stat label={t('stats.cashPerSecond')} value={`${formatBig(cashPerSecond)}/s`} icon={<CoinIcon size={16} />} accent="var(--color-accent-gold)" />
          <Stat label={t('stats.robotsCount')} value={`${robotsTotal}`} icon={<RobotLogo size={16} />} accent="var(--color-text-title)" />
          <Stat label={t('stats.robotsBought')} value={`${totalRobots}`} icon={<NavShopIcon size={16} />} accent="var(--color-text-title)" />
          <Stat label={t('stats.upgrades')} value={`${totalUpgrades}`} icon={<IconGear size={16} />} accent="var(--color-text-title)" />
          <Stat label={t('stats.prestiges')} value={`${totalPrestiges}`} icon={<SeedIcon size={16} />} accent="var(--color-accent-purple)" />
          <Stat label={t('stats.streak')} value={`${loginStreak}`} icon={<StarIcon size={16} />} accent="var(--color-accent-gold)" />
          <Stat label={t('stats.playTime')} value={formatDuration(playTime)} icon={<IconGear size={16} />} accent="var(--color-text-title)" />
          <Stat label={t('stats.achievements')} value={`${ownedAchievements}`} icon={<TrophyIcon size={16} />} accent="var(--color-accent-gold)" />
          <Stat label={t('stats.pets')} value={`${petsOwned.size}`} icon={<HeartIcon size={16} />} accent="var(--color-accent-pink)" />
          <Stat label={t('stats.skins')} value={`${skinsOwned.size}`} icon={<StarIcon size={16} />} accent="var(--color-accent-purple)" />
        </section>

        <section className="flex flex-col gap-2">
          <h3
            style={{
              fontFamily: 'var(--font-button)',
              fontSize: 11,
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            {t('stats.byTier')}
          </h3>
          {ROBOT_TIERS.filter((tier) => holdings[tier.type].owned > 0).length === 0 ? (
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', fontStyle: 'italic' }}>—</p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {ROBOT_TIERS.filter((tier) => holdings[tier.type].owned > 0).map((tier) => (
                <div
                  key={tier.type}
                  className="panel-paper"
                  style={{
                    padding: '6px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-title)', fontWeight: 600, fontSize: 13, color: 'var(--color-text-title)' }}>
                    {tier.name}
                  </span>
                  <span
                    className="numeric"
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: 'var(--color-accent-gold)',
                      textShadow: '1px 1px 0 var(--color-wood-5)',
                    }}
                  >
                    ×{holdings[tier.type].owned}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </aside>
  );
}

function Stat({ label, value, icon, accent }: { label: string; value: string; icon: ReactNode; accent: string }) {
  return (
    <div className="panel-paper" style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span
        style={{
          fontFamily: 'var(--font-button)',
          fontSize: 9,
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        {label}
      </span>
      <span className="flex items-center gap-1.5">
        {icon}
        <span
          className="numeric"
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: accent,
          }}
        >
          {value}
        </span>
      </span>
    </div>
  );
}

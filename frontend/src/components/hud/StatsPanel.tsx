// Panel Statistiques : vue exhaustive du joueur.

import { useTranslation } from 'react-i18next';
import { ROBOT_TIERS } from '@robomow/shared';
import { useGameStore } from '../../stores/gameStore.js';
import { formatBig } from '../../game/engine/bigNumber.js';

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

  const robotsTotal = ROBOT_TIERS.reduce(
    (acc, tier) => acc + holdings[tier.type].owned,
    0,
  );
  const ownedAchievements = Array.from(achievements).filter((k) => !k.endsWith(':claimed')).length;

  return (
    <aside className="flex w-full max-w-sm flex-col gap-3 panel p-3 max-h-[80vh] overflow-y-auto">
      <h2 className="text-sm font-bold text-ink-base">{t('stats.title')}</h2>

      <section className="grid grid-cols-2 gap-2 text-xs">
        <Stat label={t('stats.totalCash')} value={formatBig(totalCash)} icon="🪙" />
        <Stat label={t('stats.totalGrass')} value={formatBig(totalGrass)} icon="🌿" />
        <Stat label={t('stats.cashPerSecond')} value={`${formatBig(cashPerSecond)}/s`} icon="📈" />
        <Stat label={t('stats.robotsCount')} value={`${robotsTotal}`} icon="🤖" />
        <Stat label={t('stats.robotsBought')} value={`${totalRobots}`} icon="🛒" />
        <Stat label={t('stats.upgrades')} value={`${totalUpgrades}`} icon="⚙️" />
        <Stat label={t('stats.prestiges')} value={`${totalPrestiges}`} icon="🌱" />
        <Stat label={t('stats.streak')} value={`${loginStreak}`} icon="🔥" />
        <Stat label={t('stats.playTime')} value={formatDuration(playTime)} icon="⏱️" />
        <Stat label={t('stats.achievements')} value={`${ownedAchievements}`} icon="🏆" />
        <Stat label={t('stats.pets')} value={`${petsOwned.size}`} icon="🐾" />
        <Stat label={t('stats.skins')} value={`${skinsOwned.size}`} icon="🎨" />
      </section>

      <section className="flex flex-col gap-1">
        <h3 className="text-xs font-bold uppercase text-ink-dark">{t('stats.byTier')}</h3>
        <ul className="flex flex-col gap-1 text-xs">
          {ROBOT_TIERS.filter((tier) => holdings[tier.type].owned > 0).map((tier) => (
            <li key={tier.type} className="flex items-center justify-between panel bg-panel-paper p-1 px-2">
              <span className="font-bold text-ink-base">{tier.name}</span>
              <span className="tabular-nums text-accent-gold">×{holdings[tier.type].owned}</span>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="panel bg-panel-paper p-2 flex flex-col gap-0">
      <span className="text-[10px] uppercase text-ink-dark">{label}</span>
      <span className="font-bold text-ink-base flex items-center gap-1">
        <span aria-hidden>{icon}</span>
        <span className="tabular-nums">{value}</span>
      </span>
    </div>
  );
}

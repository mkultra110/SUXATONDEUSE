// Panel d'achat : liste les 10 tiers de robots + les 6 categories d'upgrades.
// Decouverte progressive des tiers (visible si possede ou si le precedent l'est).

import { useTranslation } from 'react-i18next';
import {
  ROBOT_TIERS,
  type RobotType,
  UPGRADE_DEFINITIONS,
  type UpgradeKey,
} from '@robomow/shared';
import { useGameStore, nextRobotCost, nextUpgradeCost } from '../../stores/gameStore.js';
import { formatBig } from '../../game/engine/bigNumber.js';

const ALL_TIERS: RobotType[] = ROBOT_TIERS.map((t) => t.type);

export function ShopPanel() {
  const { t } = useTranslation();
  const cash = useGameStore((s) => s.cash);
  const holdings = useGameStore((s) => s.holdings);
  const upgrades = useGameStore((s) => s.upgrades);
  const prestigeLevel = useGameStore((s) => s.prestigeLevel);
  const buyRobot = useGameStore((s) => s.buyRobot);
  const buyUpgrade = useGameStore((s) => s.buyUpgrade);

  // Tier visible : le 1er toujours, sinon si possede ou si on a au moins
  // une unite du precedent.
  const visibleTiers = ALL_TIERS.filter((type, i) => {
    if (i === 0) return true;
    const prev = ALL_TIERS[i - 1];
    if (!prev) return true;
    return holdings[prev].owned > 0 || holdings[type].owned > 0;
  });

  return (
    <aside className="flex w-full max-w-sm flex-col gap-2 panel p-3 max-h-[80vh] overflow-y-auto">
      <h2 className="text-sm font-bold text-ink-base">{t('shop.title')}</h2>
      <ul className="flex flex-col gap-2">
        {visibleTiers.map((type) => {
          const tier = ROBOT_TIERS.find((tt) => tt.type === type);
          if (!tier) return null;
          const owned = holdings[type].owned;
          const cost = nextRobotCost(holdings, type);
          const affordable = cash.gte(cost);
          return (
            <li key={type}>
              <button
                disabled={!affordable}
                onClick={() => buyRobot(type)}
                className={`flex w-full items-center justify-between rounded border-2 p-2 text-left transition ${
                  affordable
                    ? 'border-grass-base bg-panel-paper hover:bg-panel-base'
                    : 'cursor-not-allowed border-robot-shadow bg-panel-paper opacity-60'
                }`}
              >
                <div>
                  <div className="text-sm font-bold text-ink-base">{tier.name}</div>
                  <div className="text-xs text-ink-dark">
                    +{tier.baseGrassPerSecond}/s · possede : {owned}
                  </div>
                </div>
                <div className="text-sm font-bold text-accent-gold tabular-nums">
                  🪙 {formatBig(cost)}
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-2 border-t-2 border-robot-shadow pt-2">
        <h3 className="text-xs font-bold uppercase text-ink-dark">{t('shop.upgrades')}</h3>
        <ul className="flex flex-col gap-1 mt-1">
          {UPGRADE_DEFINITIONS.map((def) => {
            const level: number = upgrades[def.key as UpgradeKey] ?? 0;
            const locked = def.unlockPrestigeLevel > prestigeLevel;
            const maxed = level >= def.maxLevel;
            const cost = nextUpgradeCost(def.key, level);
            const affordable = !locked && !maxed && cash.gte(cost);
            return (
              <li key={def.key}>
                <button
                  disabled={!affordable}
                  onClick={() => buyUpgrade(def.key)}
                  className={`flex w-full items-center justify-between rounded border-2 p-2 text-left transition ${
                    affordable
                      ? 'border-accent-gold bg-panel-paper hover:bg-panel-base'
                      : 'cursor-not-allowed border-robot-shadow bg-panel-paper opacity-60'
                  }`}
                >
                  <div>
                    <div className="text-sm font-bold text-ink-base">{def.name}</div>
                    <div className="text-xs text-ink-dark">
                      {def.description} · niv. {level}
                      {locked && ` · prestige ${def.unlockPrestigeLevel} requis`}
                      {maxed && ' · MAX'}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-accent-gold tabular-nums">
                    {maxed ? '—' : `🪙 ${formatBig(cost)}`}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}

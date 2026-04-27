// Panel d'achat : liste les robots achetables + le seul upgrade Lames.
// PHASE 1 : 3 tiers (Cisaille, Pousser, Thermique). PHASE 2 : tous les tiers.

import { useTranslation } from 'react-i18next';
import { ROBOT_TIERS, type RobotType } from '@robomow/shared';
import { useGameStore, nextRobotCost, nextBladesCost } from '../../stores/gameStore.js';
import { formatBig } from '../../game/engine/bigNumber.js';

const PHASE1_TIERS: RobotType[] = ['HAND_SHEARS', 'PUSH_MOWER', 'GAS_MOWER'];

export function ShopPanel() {
  const { t } = useTranslation();
  const cash = useGameStore((s) => s.cash);
  const holdings = useGameStore((s) => s.holdings);
  const bladesLevel = useGameStore((s) => s.bladesLevel);
  const buyRobot = useGameStore((s) => s.buyRobot);
  const buyBlades = useGameStore((s) => s.buyBladesUpgrade);

  return (
    <aside className="flex w-full max-w-sm flex-col gap-2 panel p-3">
      <h2 className="text-sm font-bold text-ink-base">{t('shop.title')}</h2>
      <ul className="flex flex-col gap-2">
        {PHASE1_TIERS.map((type) => {
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
        <button
          disabled={!cash.gte(nextBladesCost(bladesLevel))}
          onClick={() => buyBlades()}
          className={`mt-1 flex w-full items-center justify-between rounded border-2 p-2 text-left transition ${
            cash.gte(nextBladesCost(bladesLevel))
              ? 'border-accent-gold bg-panel-paper hover:bg-panel-base'
              : 'cursor-not-allowed border-robot-shadow bg-panel-paper opacity-60'
          }`}
        >
          <div>
            <div className="text-sm font-bold text-ink-base">{t('shop.bladesName')}</div>
            <div className="text-xs text-ink-dark">
              +5 % prod · niveau : {bladesLevel}
            </div>
          </div>
          <div className="text-sm font-bold text-accent-gold tabular-nums">
            🪙 {formatBig(nextBladesCost(bladesLevel))}
          </div>
        </button>
      </div>
    </aside>
  );
}

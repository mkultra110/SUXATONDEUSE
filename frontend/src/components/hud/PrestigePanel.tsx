// Panel prestige : aperçu des graines a obtenir + bouton de prestige.
// Le prestige reset cash/robots/parcelles mais conserve gemmes,
// achievements, et accumule des graines pour un multiplier permanent.

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { calculatePrestigeSeeds, FIRST_PRESTIGE_THRESHOLD_CASH } from '@robomow/shared';
import { useGameStore } from '../../stores/gameStore.js';
import { formatBig } from '../../game/engine/bigNumber.js';

export function PrestigePanel() {
  const { t } = useTranslation();
  const totalCash = useGameStore((s) => s.totalCashEarned);
  const prestigePoints = useGameStore((s) => s.prestigePoints);
  const prestigeLevel = useGameStore((s) => s.prestigeLevel);
  const totalPrestiges = useGameStore((s) => s.totalPrestiges);
  const triggerPrestige = useGameStore((s) => s.triggerPrestige);
  const [confirming, setConfirming] = useState(false);

  const totalCashBigInt = BigInt(totalCash.floor().toString());
  const seedsAlreadySpent = BigInt(prestigePoints.floor().toString());
  const projectedSeeds = calculatePrestigeSeeds(totalCashBigInt, seedsAlreadySpent);
  const eligible = totalCashBigInt >= FIRST_PRESTIGE_THRESHOLD_CASH;

  function handlePrestige() {
    const gained = triggerPrestige();
    if (gained > 0n) setConfirming(false);
  }

  return (
    <aside className="flex w-full max-w-sm flex-col gap-3 panel p-4 max-h-[80vh] overflow-y-auto">
      <header className="text-center">
        <h2 className="text-lg font-bold text-ink-base">🌱 {t('prestige.title')}</h2>
        <p className="text-xs text-ink-dark mt-1">{t('prestige.subtitle')}</p>
      </header>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="panel bg-grass-shadow text-panel-base p-2 flex flex-col items-center">
          <span className="text-xs">{t('prestige.level')}</span>
          <span className="text-xl font-bold">{prestigeLevel}</span>
        </div>
        <div className="panel bg-grass-shadow text-panel-base p-2 flex flex-col items-center">
          <span className="text-xs">{t('prestige.totalPrestiges')}</span>
          <span className="text-xl font-bold">{totalPrestiges}</span>
        </div>
        <div className="col-span-2 panel bg-grass-deep text-panel-base p-2 flex flex-col items-center">
          <span className="text-xs">{t('prestige.seedsBank')}</span>
          <span className="text-2xl font-bold text-grass-highlight">
            🌱 {formatBig(prestigePoints)}
          </span>
        </div>
      </div>

      <div className="border-t-2 border-robot-shadow pt-2 text-sm">
        <p className="text-ink-dark">{t('prestige.preview')}</p>
        <p className="text-2xl font-bold text-accent-gold text-center my-2">
          🌱 +{formatBig(projectedSeeds.toString())}
        </p>
      </div>

      {!eligible && (
        <p className="text-xs text-center text-ink-dark italic">
          {t('prestige.notEligible', {
            target: formatBig(FIRST_PRESTIGE_THRESHOLD_CASH.toString()),
            current: formatBig(totalCash),
          })}
        </p>
      )}

      {!confirming ? (
        <button
          disabled={!eligible || projectedSeeds <= 0n}
          onClick={() => setConfirming(true)}
          className="btn btn-danger text-base font-bold disabled:opacity-50"
        >
          {t('prestige.action')}
        </button>
      ) : (
        <div className="flex flex-col gap-2 panel bg-accent-danger/20 p-2">
          <p className="text-xs font-bold text-center">{t('prestige.confirmWarning')}</p>
          <div className="flex gap-2">
            <button onClick={handlePrestige} className="btn btn-danger flex-1 text-sm">
              {t('prestige.confirm')}
            </button>
            <button onClick={() => setConfirming(false)} className="btn flex-1 text-sm">
              {t('common.cancel')}
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}

// Modal "Bon retour" : count-up des gains offline + bouton Recolter.

import Decimal from 'break_infinity.js';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatBig } from '../../game/engine/bigNumber.js';
import { CoinIcon } from '../icons/PixelIcon.js';

interface Props {
  durationSeconds: number;
  cashEarned: Decimal;
  onAcknowledge: () => void;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}min`;
  if (m > 0) return `${m} min`;
  return `${Math.floor(seconds)} s`;
}

export function OfflineRewardModal({ durationSeconds, cashEarned, onAcknowledge }: Props) {
  const { t } = useTranslation();
  const [animatedValue, setAnimatedValue] = useState(new Decimal(0));

  useEffect(() => {
    // Count-up sur 800 ms : interpolation lineaire.
    const duration = 800;
    const start = performance.now();
    let raf: number;
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setAnimatedValue(cashEarned.mul(progress));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [cashEarned]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-base/70 backdrop-blur-sm">
      <div className="w-full max-w-md panel p-6 flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center">{t('game.offlineRewards.title')}</h2>
        <p className="text-center text-ink-dark">
          {t('game.offlineRewards.duration', {
            duration: formatDuration(durationSeconds),
          })}
        </p>
        <div className="flex flex-col items-center gap-1 panel bg-grass-shadow p-4">
          <span className="text-sm text-panel-paper">{t('game.offlineRewards.earned')}</span>
          <span className="flex items-center gap-2 text-3xl font-bold text-accent-gold numeric">
            <CoinIcon size={28} />
            {formatBig(animatedValue)}
          </span>
        </div>
        <button onClick={onAcknowledge} className="btn btn-primary w-full text-lg">
          {t('game.offlineRewards.claim')}
        </button>
      </div>
    </div>
  );
}

// Compteur de cash cozy : icone + chiffre + cps en dessous, bounce a chaque
// gain notable.

import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../../stores/gameStore.js';
import { formatBig } from '../../game/engine/bigNumber.js';
import { CoinIcon } from '../icons/PixelIcon.js';

export function CashCounter() {
  const cash = useGameStore((s) => s.cash);
  const cps = useGameStore((s) => s.cashPerSecond);
  const [pop, setPop] = useState(false);
  const lastValue = useRef(cash.toString());

  useEffect(() => {
    const current = cash.toString();
    if (current === lastValue.current) return;
    lastValue.current = current;
    setPop(true);
    const t = setTimeout(() => setPop(false), 250);
    return () => clearTimeout(t);
  }, [cash]);

  return (
    <div
      className={`flex flex-col items-center px-2 py-1 rounded ${pop ? 'animate-currency-pop' : ''}`}
      style={{
        background: 'var(--color-wood-5)',
        border: '2px solid #a87a1f',
        boxShadow:
          'inset 0 -2px 0 rgba(0,0,0,0.3), 0 0 8px rgba(245, 196, 67, 0.3)',
      }}
    >
      <div className="flex items-center gap-1.5">
        <CoinIcon size={16} />
        <span
          className="numeric text-sm"
          style={{
            color: 'var(--color-accent-gold)',
            textShadow: '1px 1px 0 var(--color-text-title)',
          }}
        >
          {formatBig(cash)}
        </span>
      </div>
      <div
        className="numeric leading-none mt-0.5"
        style={{
          color: 'var(--color-paper-3)',
          fontSize: '10px',
        }}
      >
        +{formatBig(cps)}/s
      </div>
    </div>
  );
}

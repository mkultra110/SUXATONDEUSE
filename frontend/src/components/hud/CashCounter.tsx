// Compteur de cash cozy : icone + chiffre + cps en dessous, bounce a chaque
// gain notable.

import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../../stores/gameStore.js';
import { formatBig } from '../../game/engine/bigNumber.js';
import { AnimatedNumber } from './AnimatedNumber.js';
import { KawaiiCoin } from './KawaiiSprites.js';

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

  const frame = Math.floor(Date.now() / 80);
  return (
    <div
      className={`kawaii-pill kawaii-pill--gold flex-col ${pop ? 'animate-currency-pop' : ''}`}
      style={{ padding: '4px 10px' }}
    >
      <div className="flex items-center gap-1.5">
        <KawaiiCoin size={18} frame={frame} />
        <AnimatedNumber
          value={Number(cash.toString())}
          className="numeric"
          style={{ fontSize: 16, lineHeight: 1, color: 'var(--k-ink, #1A1A2E)' }}
        />
      </div>
      <div
        className="numeric leading-none"
        style={{
          color: 'var(--k-green-bright-dark, #1F8246)',
          fontSize: 12,
          marginTop: 2,
        }}
      >
        +{formatBig(cps)}/s
      </div>
    </div>
  );
}

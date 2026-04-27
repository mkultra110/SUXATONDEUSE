// Compteur de cash avec animation count-up bouncy a chaque mutation notable.

import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../../stores/gameStore.js';
import { formatBig } from '../../game/engine/bigNumber.js';

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
    const t = setTimeout(() => setPop(false), 200);
    return () => clearTimeout(t);
  }, [cash]);

  return (
    <div className="flex flex-col items-end">
      <div
        className={`flex items-center gap-2 text-xl font-bold text-accent-gold ${
          pop ? 'animate-currency-pop' : ''
        }`}
      >
        <span aria-hidden>🪙</span>
        <span className="tabular-nums">{formatBig(cash)}</span>
      </div>
      <div className="text-xs text-panel-paper tabular-nums">
        +{formatBig(cps)}/s
      </div>
    </div>
  );
}

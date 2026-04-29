// CoinRain : pluie de pieces dorees declenchee sur prestige (idee #109).
// Ecoute totalPrestiges et trigger 30 pieces qui tombent.

import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../../stores/gameStore.js';

interface Coin {
  id: number;
  left: number;
  delay: number;
  duration: number;
}

export function CoinRain() {
  const totalPrestiges = useGameStore((s) => s.totalPrestiges);
  const lastRef = useRef(totalPrestiges);
  const [coins, setCoins] = useState<Coin[]>([]);

  useEffect(() => {
    if (totalPrestiges > lastRef.current) {
      lastRef.current = totalPrestiges;
      const generated: Coin[] = [];
      for (let i = 0; i < 30; i++) {
        generated.push({
          id: Date.now() + i,
          left: Math.random() * 100,
          delay: Math.random() * 1.5,
          duration: 2 + Math.random() * 2,
        });
      }
      setCoins(generated);
      setTimeout(() => setCoins([]), 4500);
    }
  }, [totalPrestiges]);

  if (coins.length === 0) return null;
  return (
    <>
      {coins.map((c) => (
        <span
          key={c.id}
          className="coin-rain"
          style={{
            left: `${c.left}%`,
            top: '-30px',
            animationDelay: `${c.delay}s`,
            ['--coin-dur' as string]: `${c.duration}s`,
          } as React.CSSProperties}
        >
          🪙
        </span>
      ))}
    </>
  );
}

// HappyHearts : coeurs roses qui flottent au-dessus des robots heureux
// (multiples de 10 owned). Spawn aleatoire toutes les 8 secondes.

import { useEffect, useState } from 'react';
import { useGameStore } from '../../stores/gameStore.js';
import { useEffectsStore } from '../../stores/effectsStore.js';

interface Heart {
  id: number;
  x: number;
  y: number;
}

export function HappyHearts() {
  const holdings = useGameStore((s) => s.holdings);
  const enableParticles = useEffectsStore((s) => s.enableParticles);
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    if (!enableParticles) return;
    const interval = setInterval(() => {
      // Verifie si on a au moins un robot avec un count multiple de 10.
      const hasHappy = Object.values(holdings).some(
        (h) => h.owned > 0 && h.owned % 10 === 0,
      );
      if (!hasHappy) return;
      const id = Date.now();
      setHearts((h) => [
        ...h,
        {
          id,
          x: 30 + Math.random() * 40,
          y: 50 + Math.random() * 30,
        },
      ]);
      setTimeout(() => setHearts((h) => h.filter((x) => x.id !== id)), 1700);
    }, 8000);
    return () => clearInterval(interval);
  }, [holdings, enableParticles]);

  if (hearts.length === 0) return null;
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 200,
      }}
    >
      {hearts.map((h) => (
        <span key={h.id} className="happy-heart" style={{ left: `${h.x}%`, top: `${h.y}%` }}>
          ♥
        </span>
      ))}
    </div>
  );
}

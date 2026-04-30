// BossKillFlight : volee d'oiseaux qui s'envole quand bossKills augmente
// (idee #63). 5-8 oiseaux qui traversent l'ecran de gauche a droite.

import { useEffect, useRef, useState } from 'react';
import { useEffectsStore } from '../../stores/effectsStore.js';

interface Bird {
  id: number;
  topPercent: number;
  delay: number;
  duration: number;
}

export function BossKillFlight() {
  const bossKills = useEffectsStore((s) => s.bossKills);
  const lastRef = useRef(bossKills);
  const [birds, setBirds] = useState<Bird[]>([]);

  useEffect(() => {
    if (bossKills <= lastRef.current) return;
    lastRef.current = bossKills;
    const flock: Bird[] = [];
    const count = 5 + Math.floor(Math.random() * 4);
    for (let i = 0; i < count; i++) {
      flock.push({
        id: Date.now() + i,
        topPercent: 10 + Math.random() * 30,
        delay: i * 0.15,
        duration: 3 + Math.random() * 1.5,
      });
    }
    setBirds(flock);
    setTimeout(() => setBirds([]), 5000);
  }, [bossKills]);

  if (birds.length === 0) return null;

  return (
    <>
      {birds.map((b) => (
        <span
          key={b.id}
          aria-hidden
          style={{
            position: 'fixed',
            top: `${b.topPercent}%`,
            left: '-40px',
            fontSize: 22,
            zIndex: 35,
            pointerEvents: 'none',
            animation: `mouse-run ${b.duration}s linear ${b.delay}s forwards`,
            filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,0.3))',
          }}
        >
          🕊️
        </span>
      ))}
    </>
  );
}

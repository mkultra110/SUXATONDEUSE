// Fireflies : lucioles la nuit (idee #25). Apparaissent entre 22h et 5h
// locales, 8 particules dispersees random.

import { useEffect, useState } from 'react';
import { useEffectsStore } from '../../stores/effectsStore.js';

interface Firefly {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
}

export function Fireflies() {
  const enableParticles = useEffectsStore((s) => s.enableParticles);
  const [isNight, setIsNight] = useState(false);
  const [fireflies, setFireflies] = useState<Firefly[]>([]);

  useEffect(() => {
    function check() {
      const h = new Date().getHours();
      setIsNight(h >= 22 || h < 5);
    }
    check();
    const i = setInterval(check, 60_000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    if (!isNight || !enableParticles) {
      setFireflies([]);
      return;
    }
    const generated: Firefly[] = [];
    for (let i = 0; i < 12; i++) {
      generated.push({
        id: i,
        x: Math.random() * 100,
        y: 30 + Math.random() * 50,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 3,
      });
    }
    setFireflies(generated);
  }, [isNight, enableParticles]);

  if (fireflies.length === 0) return null;
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {fireflies.map((f) => (
        <span
          key={f.id}
          className="firefly"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            animationDelay: `${f.delay}s`,
            animationDuration: `${f.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

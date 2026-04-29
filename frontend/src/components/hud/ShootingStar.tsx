// ShootingStar : etoile filante rare la nuit (idee #26).
// 1% de chance toutes les 60s entre 22h et 5h.

import { useEffect, useState } from 'react';
import { useEffectsStore } from '../../stores/effectsStore.js';
import { audio } from '../../services/audio.js';

interface Star {
  id: number;
  topPercent: number;
}

export function ShootingStar() {
  const enableParticles = useEffectsStore((s) => s.enableParticles);
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    if (!enableParticles) return;
    const interval = setInterval(() => {
      const h = new Date().getHours();
      if (h < 22 && h >= 5) return;
      if (Math.random() > 0.05) return;
      const id = Date.now();
      setStars((s) => [...s, { id, topPercent: Math.random() * 30 }]);
      audio.playRare();
      setTimeout(() => setStars((s) => s.filter((x) => x.id !== id)), 1500);
    }, 30_000);
    return () => clearInterval(interval);
  }, [enableParticles]);

  if (stars.length === 0) return null;
  return (
    <>
      {stars.map((s) => (
        <span key={s.id} className="shooting-star" style={{ top: `${s.topPercent}%` }} />
      ))}
    </>
  );
}

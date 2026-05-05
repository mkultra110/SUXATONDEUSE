// KawaiiClouds : 3 nuages SVG kawaii qui drift lentement sur le ciel.
// Position fixed top, z-index sous TopBar mais au-dessus du body.
// Caches sur theme nuit pour ne pas masquer la lune/etoiles.

import { useEffect, useState } from 'react';
import { KawaiiCloud, KawaiiSun, KawaiiMoon } from './KawaiiSprites.js';
import { useEffectsStore } from '../../stores/effectsStore.js';

export function KawaiiClouds() {
  const enableParticles = useEffectsStore((s) => s.enableParticles);
  const [period, setPeriod] = useState<string>('day');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    function check() {
      const h = new Date().getHours();
      if (h < 5) setPeriod('night');
      else if (h < 8) setPeriod('dawn');
      else if (h < 18) setPeriod('day');
      else if (h < 21) setPeriod('dusk');
      else setPeriod('night');
    }
    check();
    const i = setInterval(check, 60_000);
    const t = setInterval(() => setTick((v) => v + 1), 1000);
    return () => {
      clearInterval(i);
      clearInterval(t);
    };
  }, []);

  if (!enableParticles) return null;

  const isNight = period === 'night';

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        top: 'calc(56px + env(safe-area-inset-top, 0px) + 24px)',
        left: 0,
        right: 0,
        height: 120,
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden',
      }}
    >
      {/* Sun ou Moon */}
      <div
        style={{
          position: 'absolute',
          top: 8,
          right: '8%',
          opacity: 0.85,
          filter: 'drop-shadow(0 0 12px rgba(255,217,33,0.4))',
        }}
      >
        {isNight ? <KawaiiMoon size={56} /> : <KawaiiSun size={64} frame={tick * 4} />}
      </div>

      {/* 3 nuages drift */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: `${((tick * 0.4) % 130) - 15}%`,
          opacity: 0.92,
          transition: 'opacity 1s',
          filter: isNight ? 'brightness(0.5)' : 'none',
        }}
      >
        <KawaiiCloud size={120} />
      </div>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: `${((tick * 0.25 + 50) % 130) - 15}%`,
          opacity: 0.85,
          transition: 'opacity 1s',
          filter: isNight ? 'brightness(0.5)' : 'none',
        }}
      >
        <KawaiiCloud size={90} />
      </div>
      <div
        style={{
          position: 'absolute',
          top: '5%',
          left: `${((tick * 0.32 + 80) % 130) - 15}%`,
          opacity: 0.9,
          transition: 'opacity 1s',
          filter: isNight ? 'brightness(0.5)' : 'none',
        }}
      >
        <KawaiiCloud size={100} />
      </div>
    </div>
  );
}

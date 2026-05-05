// KawaiiNightStars : 30 etoiles SVG qui scintillent la nuit (22h-5h).
// Position fixed top, sous TopBar, au-dessus de KawaiiHills.

import { useEffect, useState } from 'react';
import { useEffectsStore } from '../../stores/effectsStore.js';

export function KawaiiNightStars() {
  const enableParticles = useEffectsStore((s) => s.enableParticles);
  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    function check() {
      const h = new Date().getHours();
      setIsNight(h >= 22 || h < 5);
    }
    check();
    const i = setInterval(check, 60_000);
    return () => clearInterval(i);
  }, []);

  if (!enableParticles || !isNight) return null;

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {Array.from({ length: 30 }).map((_, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: `${(i * 37) % 100}%`,
            top: `${(i * 23) % 50}%`,
            width: 3,
            height: 3,
            background: '#fff',
            boxShadow: '0 0 4px #fff',
            animation: `kawaii-twinkle ${1.5 + (i % 5) * 0.4}s ease-in-out infinite`,
            animationDelay: `${(i * 0.1) % 2}s`,
          }}
        />
      ))}
    </div>
  );
}

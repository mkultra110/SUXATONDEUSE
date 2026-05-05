// KawaiiGrannyPorch : Memé Gisele visible en bas-droite du jardin
// (decoratif). Idle bob anim. Disparait sur tres petit ecran et la nuit
// (elle dort).

import { useEffect, useState } from 'react';
import { KawaiiGranny } from './KawaiiSprites.js';
import { useEffectsStore } from '../../stores/effectsStore.js';

export function KawaiiGrannyPorch() {
  const enableParticles = useEffectsStore((s) => s.enableParticles);
  const [tick, setTick] = useState(0);
  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    const i = setInterval(() => setTick((v) => v + 1), 100);
    function check() {
      const h = new Date().getHours();
      setIsNight(h >= 22 || h < 6);
    }
    check();
    const i2 = setInterval(check, 60_000);
    return () => {
      clearInterval(i);
      clearInterval(i2);
    };
  }, []);

  if (!enableParticles || isNight) return null;

  return (
    <div
      aria-label="Mémé Gisèle sur le porche"
      title="Mémé Gisèle"
      style={{
        position: 'fixed',
        bottom: 'calc(120px + env(safe-area-inset-bottom, 0px))',
        right: 16,
        zIndex: 25,
        pointerEvents: 'none',
        filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,0.3))',
      }}
    >
      <KawaiiGranny size={56} frame={tick} />
    </div>
  );
}

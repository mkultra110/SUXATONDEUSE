// KawaiiHills : 2 couches de collines en clip-path + petite maison cottagecore
// posee sur la colline back. Decoratif, position fixed, pointer-events none.

import { useEffect, useState } from 'react';
import { KawaiiHouse } from './KawaiiSprites.js';
import { useEffectsStore } from '../../stores/effectsStore.js';

export function KawaiiHills() {
  const enableParticles = useEffectsStore((s) => s.enableParticles);
  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    function check() {
      const h = new Date().getHours();
      setIsNight(h >= 19 || h < 6);
    }
    check();
    const i = setInterval(check, 60_000);
    return () => clearInterval(i);
  }, []);

  return (
    <>
      <div className="kawaii-hills kawaii-hills--back" aria-hidden />
      <div className="kawaii-hills kawaii-hills--front" aria-hidden />
      {enableParticles && (
        <div
          aria-hidden
          style={{
            position: 'fixed',
            left: '12%',
            bottom: 'calc(36% + env(safe-area-inset-bottom, 0px))',
            zIndex: 1,
            pointerEvents: 'none',
            filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,0.3))',
          }}
        >
          <KawaiiHouse size={64} lit={isNight} />
        </div>
      )}
    </>
  );
}

// KawaiiFlowerCorners : 4 fleurs decoratives dans les 4 coins de l'ecran.
// Couleurs varies selon saison. Position fixed bottom-corners.

import { useEffect, useState } from 'react';
import { KawaiiFlower } from './KawaiiSprites.js';
import { useEffectsStore } from '../../stores/effectsStore.js';

const SEASON_COLORS: Record<string, string[]> = {
  spring: ['#FF6B9D', '#FFD921', '#A06CD5', '#FFC2DD'],
  summer: ['#FF6B9D', '#FFD921', '#5EC4FF', '#FFA040'],
  autumn: ['#FFA040', '#D26B1A', '#FFD921', '#A03832'],
  winter: ['#fff', '#A8B5A8', '#A06CD5', '#FFC2DD'],
};

function currentSeason(): keyof typeof SEASON_COLORS {
  const m = new Date().getMonth();
  if (m >= 2 && m <= 4) return 'spring';
  if (m >= 5 && m <= 7) return 'summer';
  if (m >= 8 && m <= 10) return 'autumn';
  return 'winter';
}

export function KawaiiFlowerCorners() {
  const enableParticles = useEffectsStore((s) => s.enableParticles);
  const [tick, setTick] = useState(0);
  const season = currentSeason();
  const colors = SEASON_COLORS[season] ?? SEASON_COLORS.summer!;

  useEffect(() => {
    if (!enableParticles) return;
    const i = setInterval(() => setTick((v) => v + 1), 200);
    return () => clearInterval(i);
  }, [enableParticles]);

  if (!enableParticles) return null;

  // Empeche les fleurs sous la bottom-nav mobile + ne pas chevaucher la TopBar.
  const positions = [
    { left: 6, bottom: 'calc(76px + env(safe-area-inset-bottom, 0px))' },
    { right: 6, bottom: 'calc(76px + env(safe-area-inset-bottom, 0px))' },
    { left: 22, bottom: 'calc(120px + env(safe-area-inset-bottom, 0px))' },
    { right: 22, bottom: 'calc(120px + env(safe-area-inset-bottom, 0px))' },
  ];

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 4,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {positions.map((pos, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            ...pos,
            filter: 'drop-shadow(1px 1px 0 rgba(0,0,0,0.3))',
          }}
        >
          <KawaiiFlower size={20} color={colors[i % colors.length] ?? '#FF6B9D'} frame={tick + i * 3} />
        </div>
      ))}
    </div>
  );
}

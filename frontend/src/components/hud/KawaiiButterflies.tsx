// KawaiiButterflies : 4 papillons SVG kawaii qui drift en boucle dans
// la scene. Position fixed au-dessus du jardin. Couleurs variees.

import { useEffect, useState } from 'react';
import { KawaiiButterfly } from './KawaiiSprites.js';
import { useEffectsStore } from '../../stores/effectsStore.js';

const COLORS = ['#FF6B9D', '#A06CD5', '#5EC4FF', '#FFD921'];

interface Bf {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

export function KawaiiButterflies() {
  const enableParticles = useEffectsStore((s) => s.enableParticles);
  const [bfs, setBfs] = useState<Bf[]>(() =>
    Array.from({ length: 4 }, (_, i) => ({
      id: i,
      x: typeof window === 'undefined' ? 50 : Math.random() * window.innerWidth,
      y: 80 + Math.random() * 200,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.4,
      color: COLORS[i % COLORS.length] ?? COLORS[0]!,
    })),
  );
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!enableParticles) return;
    const id = setInterval(() => {
      setTick((v) => v + 1);
      setBfs((bs) =>
        bs.map((b) => {
          let nx = b.x + b.vx;
          let ny = b.y + b.vy;
          let nvx = b.vx + (Math.random() - 0.5) * 0.08;
          let nvy = b.vy + (Math.random() - 0.5) * 0.08;
          const W = typeof window === 'undefined' ? 800 : window.innerWidth;
          if (nx < 20 || nx > W - 40) nvx = -nvx;
          if (ny < 60 || ny > 400) nvy = -nvy;
          return { ...b, x: nx, y: ny, vx: Math.max(-1.2, Math.min(1.2, nvx * 0.99)), vy: Math.max(-0.8, Math.min(0.8, nvy * 0.99)) };
        }),
      );
    }, 60);
    return () => clearInterval(id);
  }, [enableParticles]);

  if (!enableParticles) return null;

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 30,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {bfs.map((b) => (
        <span
          key={b.id}
          style={{
            position: 'absolute',
            left: b.x,
            top: b.y,
            transform: 'translate(-50%, -50%)',
            filter: 'drop-shadow(1px 1px 0 rgba(0,0,0,0.3))',
          }}
        >
          <KawaiiButterfly size={20} color={b.color} frame={tick + b.id * 2} />
        </span>
      ))}
    </div>
  );
}

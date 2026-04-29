// PetalRain : evenement aleatoire (1x/jour environ) qui declenche une
// pluie de petales 60s avec ×2 production. Visuel + bonus state.

import { useEffect, useRef, useState } from 'react';
import { useEffectsStore } from '../../stores/effectsStore.js';

interface Petal {
  id: number;
  x: number;
  delay: number;
  duration: number;
  rotate: number;
  color: string;
}

const PETAL_COLORS = ['#F4ACBA', '#F5C443', '#A8D8EE', '#FFD921', '#FF8FA3'];

export function PetalRain({ active, onEnd }: { active: boolean; onEnd: () => void }) {
  const enableParticles = useEffectsStore((s) => s.enableParticles);
  const [petals, setPetals] = useState<Petal[]>([]);
  const startedAt = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    if (!enableParticles) {
      // On laisse le bonus actif, juste pas l'effet visuel.
      const t = setTimeout(onEnd, 60_000);
      return () => clearTimeout(t);
    }
    startedAt.current = Date.now();
    const generated: Petal[] = [];
    for (let i = 0; i < 40; i++) {
      generated.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 4 + Math.random() * 4,
        rotate: Math.random() * 720 - 360,
        color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)] ?? '#F4ACBA',
      });
    }
    setPetals(generated);
    const t = setTimeout(() => {
      setPetals([]);
      onEnd();
    }, 60_000);
    return () => clearTimeout(t);
  }, [active, enableParticles, onEnd]);

  if (!active || petals.length === 0) return null;

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {petals.map((p) => (
        <span
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: '-40px',
            width: 14,
            height: 18,
            background: p.color,
            borderRadius: '60% 40% 50% 50%',
            opacity: 0.85,
            animation: `petal-fall ${p.duration}s linear ${p.delay}s infinite`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
      {/* Banniere "Bonus production x2" */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '6px 14px',
          background: 'var(--color-paper-1)',
          border: '3px solid var(--color-accent-pink)',
          fontFamily: 'var(--font-button)',
          fontSize: 12,
          color: 'var(--color-accent-pink)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          boxShadow: '0 4px 12px rgba(244, 172, 186, 0.6)',
          animation: 'pulse 1.6s ease-in-out infinite',
        }}
      >
        Pluie de pétales · ×2 production
      </div>
    </div>
  );
}

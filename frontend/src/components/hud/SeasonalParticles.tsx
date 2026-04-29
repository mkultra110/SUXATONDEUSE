// SeasonalParticles : pollen au printemps, feuilles mortes en automne,
// bonhomme de neige flottant l'hiver (idees #39 #40).

import { useMemo } from 'react';
import { useEffectsStore } from '../../stores/effectsStore.js';

function currentSeason(): 'spring' | 'summer' | 'autumn' | 'winter' {
  const m = new Date().getMonth();
  if (m >= 2 && m <= 4) return 'spring';
  if (m >= 5 && m <= 7) return 'summer';
  if (m >= 8 && m <= 10) return 'autumn';
  return 'winter';
}

export function SeasonalParticles() {
  const enableParticles = useEffectsStore((s) => s.enableParticles);
  const season = useMemo(currentSeason, []);

  const particles = useMemo(() => {
    if (!enableParticles) return [];
    const count = season === 'summer' ? 0 : 14;
    if (count === 0) return [];
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 6,
      kind: season,
    }));
  }, [enableParticles, season]);

  if (particles.length === 0) return null;

  const symbol = season === 'spring' ? '·' : season === 'autumn' ? '🍂' : '❄';
  const color = season === 'spring' ? '#F5C443' : season === 'autumn' ? '#A57144' : '#FFFFFF';

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 40,
        overflow: 'hidden',
      }}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="drift-particle"
          style={{
            left: `${p.left}%`,
            top: '-20px',
            color,
            fontSize: season === 'spring' ? 14 : 12,
            ['--drift-dur' as string]: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          } as React.CSSProperties}
        >
          {symbol}
        </span>
      ))}
    </div>
  );
}

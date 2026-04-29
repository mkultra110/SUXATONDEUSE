// LuckyClover : un trefle a 4 feuilles spawn aleatoirement (idee #67).
// Tap = +1 essence + audio rare. Ne spawn qu'1x par tranche de 5min.

import { useEffect, useState } from 'react';
import { useGameStore } from '../../stores/gameStore.js';
import { useEffectsStore } from '../../stores/effectsStore.js';
import { audio } from '../../services/audio.js';
import { haptic } from '../../utils/vibration.js';

interface CloverState {
  id: number;
  x: number;
  y: number;
}

export function LuckyClover() {
  const enableParticles = useEffectsStore((s) => s.enableParticles);
  const [clover, setClover] = useState<CloverState | null>(null);

  useEffect(() => {
    if (!enableParticles) return;
    const interval = setInterval(() => {
      if (clover) return;
      if (Math.random() < 0.06) {
        setClover({
          id: Date.now(),
          x: 10 + Math.random() * 80,
          y: 30 + Math.random() * 50,
        });
      }
    }, 60_000);
    return () => clearInterval(interval);
  }, [clover, enableParticles]);

  useEffect(() => {
    if (!clover) return;
    const t = setTimeout(() => setClover(null), 12_000);
    return () => clearTimeout(t);
  }, [clover]);

  if (!clover) return null;
  return (
    <button
      type="button"
      className="lucky-clover"
      style={{ left: `${clover.x}%`, top: `${clover.y}%` }}
      aria-label="Trèfle à 4 feuilles"
      onClick={() => {
        const state = useGameStore.getState();
        useGameStore.setState({ gems: state.gems + 5 });
        audio.playRare();
        haptic.rare();
        setClover(null);
      }}
    >
      🍀
    </button>
  );
}

// KawaiiLadybug : coccinelle pixel art qui marche TRES lentement sur le
// bord bas de l'ecran (Easter egg Junimo-like mentionne dans le brief
// Margaux du design Claude Design). Loop infini, position fixed.

import { useEffect, useState } from 'react';
import { useEffectsStore } from '../../stores/effectsStore.js';

export function KawaiiLadybug() {
  const enableParticles = useEffectsStore((s) => s.enableParticles);
  const [progress, setProgress] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!enableParticles) return;
    const i = setInterval(() => {
      setTick((v) => v + 1);
      setProgress((p) => (p + 0.05) % 100);
    }, 100);
    return () => clearInterval(i);
  }, [enableParticles]);

  if (!enableParticles) return null;

  // Frame de marche : alterne 2 frames pour les pattes.
  const walkFrame = tick % 4 < 2;

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        bottom: 'calc(72px + env(safe-area-inset-bottom, 0px) + 6px)',
        left: `${progress}%`,
        zIndex: 4,
        pointerEvents: 'none',
        transition: 'left 100ms linear',
        filter: 'drop-shadow(1px 1px 0 rgba(0,0,0,0.4))',
      }}
    >
      <svg width="14" height="10" viewBox="0 0 14 10" style={{ shapeRendering: 'crispEdges' }} aria-hidden>
        {/* corps */}
        <ellipse cx="7" cy="5" rx="6" ry="4" fill="#E63946" />
        <ellipse cx="7" cy="4" rx="5.5" ry="3.5" fill="#FF1A1A" />
        {/* trait noir vertical (split elytres) */}
        <rect x="6" y="2" width="2" height="6" fill="#1A1A2E" />
        {/* points noirs */}
        <rect x="3" y="3" width="1" height="1" fill="#1A1A2E" />
        <rect x="3" y="6" width="1" height="1" fill="#1A1A2E" />
        <rect x="9" y="3" width="1" height="1" fill="#1A1A2E" />
        <rect x="9" y="6" width="1" height="1" fill="#1A1A2E" />
        <rect x="11" y="4" width="1" height="2" fill="#1A1A2E" />
        {/* tete */}
        <rect x="5" y="1" width="4" height="2" fill="#1A1A2E" />
        {/* antennes */}
        <rect x="5" y="0" width="1" height="1" fill="#1A1A2E" />
        <rect x="8" y="0" width="1" height="1" fill="#1A1A2E" />
        {/* pattes (animation) */}
        {walkFrame ? (
          <>
            <rect x="2" y="9" width="1" height="1" fill="#1A1A2E" />
            <rect x="6" y="9" width="1" height="1" fill="#1A1A2E" />
            <rect x="11" y="9" width="1" height="1" fill="#1A1A2E" />
          </>
        ) : (
          <>
            <rect x="3" y="9" width="1" height="1" fill="#1A1A2E" />
            <rect x="7" y="9" width="1" height="1" fill="#1A1A2E" />
            <rect x="10" y="9" width="1" height="1" fill="#1A1A2E" />
          </>
        )}
      </svg>
    </div>
  );
}

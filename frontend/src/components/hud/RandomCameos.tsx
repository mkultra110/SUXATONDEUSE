// RandomCameos : apparitions aleatoires (souris, helico Marcel, OVNI, drone).
// Chaque cameo apparait 1-2x par session, anim qui traverse l'ecran.

import { useEffect, useState } from 'react';
import { useEffectsStore } from '../../stores/effectsStore.js';

type CameoKind = 'mouse' | 'helico' | 'ufo' | 'drone';

interface Cameo {
  id: number;
  kind: CameoKind;
  topPercent: number;
}

const CAMEO_PROBA: Record<CameoKind, number> = {
  mouse: 0.04,
  helico: 0.02,
  ufo: 0.005, // tres rare easter egg #139
  drone: 0.01,
};

const CAMEO_EMOJI: Record<CameoKind, string> = {
  mouse: '🐭',
  helico: '🚁',
  ufo: '🛸',
  drone: '🛰️',
};

export function RandomCameos() {
  const enableParticles = useEffectsStore((s) => s.enableParticles);
  const [active, setActive] = useState<Cameo[]>([]);

  useEffect(() => {
    if (!enableParticles) return;
    const interval = setInterval(() => {
      for (const k of Object.keys(CAMEO_PROBA) as CameoKind[]) {
        if (Math.random() < CAMEO_PROBA[k]) {
          const id = Date.now() + Math.random();
          const top = k === 'mouse' ? 92 : k === 'helico' ? 8 : 5 + Math.random() * 30;
          setActive((a) => [...a, { id, kind: k, topPercent: top }]);
          setTimeout(() => setActive((a) => a.filter((x) => x.id !== id)), 9000);
          break;
        }
      }
    }, 60_000);
    return () => clearInterval(interval);
  }, [enableParticles]);

  if (active.length === 0) return null;
  return (
    <>
      {active.map((c) => (
        <span
          key={c.id}
          className={c.kind === 'helico' ? 'marcel-helico' : 'tiny-mouse'}
          style={{
            top: `${c.topPercent}%`,
            fontSize: c.kind === 'helico' || c.kind === 'ufo' ? 32 : 18,
          }}
        >
          {CAMEO_EMOJI[c.kind]}
        </span>
      ))}
    </>
  );
}

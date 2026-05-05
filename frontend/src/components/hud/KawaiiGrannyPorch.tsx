// KawaiiGrannyPorch : Memé Gisele visible en bas-droite du jardin
// (decoratif). Idle bob anim. Disparait la nuit (elle dort). Petite
// bulle de speech occasionnelle.

import { useEffect, useState } from 'react';
import { KawaiiGranny } from './KawaiiSprites.js';
import { useEffectsStore } from '../../stores/effectsStore.js';

const SHORT_QUOTES = [
  'Coucou !',
  'Tonde bien !',
  'Mes mirabelles ?',
  'Ho ho ho.',
  'Bonjour mon p\'tit',
  'Marcel arrive.',
  '*sourit*',
];

export function KawaiiGrannyPorch() {
  const enableParticles = useEffectsStore((s) => s.enableParticles);
  const [tick, setTick] = useState(0);
  const [isNight, setIsNight] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);

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

  // Speech bubble random toutes les 30-60s.
  useEffect(() => {
    if (!enableParticles || isNight) return;
    const showBubble = () => {
      const q = SHORT_QUOTES[Math.floor(Math.random() * SHORT_QUOTES.length)] ?? 'Coucou !';
      setBubble(q);
      setTimeout(() => setBubble(null), 4000);
    };
    const i = setInterval(showBubble, 30_000 + Math.random() * 30_000);
    return () => clearInterval(i);
  }, [enableParticles, isNight]);

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
      {bubble && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 6px)',
            right: 0,
            background: 'var(--k-cream, #FFF8DC)',
            border: '2px solid var(--k-ink, #1A1A2E)',
            boxShadow: '2px 2px 0 var(--k-ink, #1A1A2E)',
            padding: '4px 10px',
            fontFamily: 'Patrick Hand, cursive',
            fontSize: 14,
            color: 'var(--k-ink, #1A1A2E)',
            whiteSpace: 'nowrap',
            animation: 'speech-pop 280ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {bubble}
        </div>
      )}
      <KawaiiGranny size={56} frame={tick} />
    </div>
  );
}

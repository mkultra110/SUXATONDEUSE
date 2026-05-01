// AmbientLayer : agglutine effets ambient contextuels (idees #24 #126 #150).
// Brouillard matinal 6h-9h, ombres nuages aleatoires, aurora theme legendaire.

import { useEffect, useState } from 'react';
import { useEffectsStore } from '../../stores/effectsStore.js';
import { useGameStore } from '../../stores/gameStore.js';

export function AmbientLayer() {
  const enableParticles = useEffectsStore((s) => s.enableParticles);
  const totalCash = useGameStore((s) => s.totalCashEarned);
  const [showFog, setShowFog] = useState(false);
  const [shadowKey, setShadowKey] = useState(0);

  // Brouillard matinal 6-9h, declenche 1x par session.
  useEffect(() => {
    if (!enableParticles) return;
    const h = new Date().getHours();
    if (h >= 6 && h < 9) {
      setShowFog(true);
      const t = setTimeout(() => setShowFog(false), 30_000);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [enableParticles]);

  // Ombre de nuage aleatoire toutes les 90s.
  useEffect(() => {
    if (!enableParticles) return;
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        setShadowKey((k) => k + 1);
      }
    }, 90_000);
    return () => clearInterval(interval);
  }, [enableParticles]);

  // Aurora overlay sur theme legendaire (mapLevel >= 100 proxy via cash).
  const cashNum = Number(totalCash.toString());
  const showAurora = enableParticles && cashNum >= 1e15; // proxy haut niveau

  return (
    <>
      {showFog && <div className="morning-fog-overlay" aria-hidden />}
      {shadowKey > 0 && (
        <div
          key={shadowKey}
          className="cloud-shadow"
          aria-hidden
          style={{ top: `${20 + Math.random() * 40}vh` }}
        />
      )}
      {showAurora && <div className="aurora-overlay" aria-hidden />}
    </>
  );
}

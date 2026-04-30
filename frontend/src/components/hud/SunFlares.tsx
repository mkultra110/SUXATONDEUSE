// SunFlares : god rays + lensflare visibles le jour clair (idees #147 #148).
// Visible 8h-18h sauf en pluie.

import { useEffect, useState } from 'react';
import { useEffectsStore } from '../../stores/effectsStore.js';

export function SunFlares() {
  const enableParticles = useEffectsStore((s) => s.enableParticles);
  const [show, setShow] = useState(false);

  useEffect(() => {
    function check() {
      const h = new Date().getHours();
      setShow(enableParticles && h >= 9 && h < 17);
    }
    check();
    const i = setInterval(check, 60_000);
    return () => clearInterval(i);
  }, [enableParticles]);

  if (!show) return null;
  return (
    <>
      <div className="godrays-overlay" aria-hidden />
      <div className="lensflare" aria-hidden />
    </>
  );
}

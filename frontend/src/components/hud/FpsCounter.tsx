// FpsCounter : compteur FPS optionnel (idee #441). Toggle via Ctrl+F.
// Affiche FPS arrondi avec 3 couleurs (vert/jaune/rouge).

import { useEffect, useRef, useState } from 'react';

export function FpsCounter() {
  const [enabled, setEnabled] = useState(false);
  const [fps, setFps] = useState(60);
  const framesRef = useRef(0);
  const lastRef = useRef(performance.now());

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.ctrlKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setEnabled((b) => !b);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    function tick() {
      framesRef.current += 1;
      const now = performance.now();
      const dt = now - lastRef.current;
      if (dt >= 500) {
        setFps(Math.round((framesRef.current * 1000) / dt));
        framesRef.current = 0;
        lastRef.current = now;
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [enabled]);

  if (!enabled) return null;
  const color = fps >= 50 ? '#8FBF4F' : fps >= 30 ? '#F5C443' : '#FF6B6B';
  return (
    <div className="fps-counter" style={{ color }}>
      {fps} FPS
    </div>
  );
}

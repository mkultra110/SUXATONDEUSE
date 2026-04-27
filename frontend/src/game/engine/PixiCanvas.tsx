// Canvas Pixi placeholder pour la PHASE 0.
// On configure une instance avec antialias=false (pixel art).
// La scene reelle (parcelle + robots) arrive en PHASE 1.

import { useEffect, useRef } from 'react';
import { Application } from 'pixi.js';

interface Props {
  width?: number;
  height?: number;
}

/** Canvas Pixi initialise pour pixel art. Affiche un fond et un texte placeholder. */
export function PixiCanvas({ width = 480, height = 270 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const app = new Application();
    let cancelled = false;

    void app
      .init({
        width,
        height,
        backgroundColor: 0x265c42,
        antialias: false,
        roundPixels: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      })
      .then(() => {
        if (cancelled) {
          app.destroy(true);
          return;
        }
        container.appendChild(app.canvas);
      });

    return () => {
      cancelled = true;
      app.destroy(true, { children: true, texture: true });
    };
  }, [width, height]);

  return (
    <div
      ref={containerRef}
      className="aspect-video w-full max-w-3xl rounded-lg border-4 border-grass-deep bg-grass-shadow shadow-lg"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}

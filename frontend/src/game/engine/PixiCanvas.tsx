// Canvas Pixi : initialise la scene Garden et gere son cycle de vie.
// PHASE 1 : monte la GardenScene sur le canvas, ne s'occupe pas du tick
// economique (gere par gameLoop.ts).

import { useEffect, useRef } from 'react';
import { Application } from 'pixi.js';
import { GardenScene } from '../scenes/GardenScene.js';
import { useGameStore } from '../../stores/gameStore.js';

interface Props {
  width?: number;
  height?: number;
  /** Callback de tap manuel (cliquer sur l'herbe). */
  onTap?: () => void;
}

/** Canvas Pixi initialise pour pixel art + scene jardin. */
export function PixiCanvas({ width = 480, height = 270, onTap }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<GardenScene | null>(null);
  const appRef = useRef<Application | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const app = new Application();
    appRef.current = app;
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
        sceneRef.current = new GardenScene(app);

        // Tap to mow : un clic sur le canvas lance manualTap.
        const handler = () => {
          if (onTap) onTap();
          else useGameStore.getState().manualTap();
        };
        app.canvas.addEventListener('click', handler);
        // Stockage pour cleanup
        (app.canvas as HTMLCanvasElement & { __onTap?: () => void }).__onTap = handler;
      });

    return () => {
      cancelled = true;
      const canvas = app.canvas as HTMLCanvasElement & { __onTap?: () => void };
      if (canvas?.__onTap) {
        canvas.removeEventListener('click', canvas.__onTap);
      }
      sceneRef.current?.destroy();
      sceneRef.current = null;
      app.destroy(true, { children: true, texture: true });
    };
  }, [width, height, onTap]);

  return (
    <div
      ref={containerRef}
      className="aspect-video w-full max-w-3xl rounded-lg border-4 border-grass-deep bg-grass-shadow shadow-lg cursor-pointer select-none"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}

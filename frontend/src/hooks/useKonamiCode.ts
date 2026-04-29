// Easter egg : detection du Konami code (↑ ↑ ↓ ↓ ← → ← → B A).
// Activation : 30 secondes de mode 'sepia' (palette desaturee teintee marron).

import { useEffect } from 'react';

const SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'KeyB',
  'KeyA',
] as const;

export function useKonamiCode(onActivate: () => void) {
  useEffect(() => {
    let buffer: string[] = [];
    function handler(e: KeyboardEvent) {
      buffer = [...buffer.slice(-(SEQUENCE.length - 1)), e.code];
      if (buffer.length !== SEQUENCE.length) return;
      const ok = buffer.every((k, i) => k === SEQUENCE[i]);
      if (ok) {
        buffer = [];
        onActivate();
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onActivate]);
}

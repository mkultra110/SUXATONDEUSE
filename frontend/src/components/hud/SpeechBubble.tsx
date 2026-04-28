// Bulle de dialogue pixel-art style Camille v9 :
// fond papier-1, queue triangulaire pointant vers le bas,
// texte Patrick Hand cursive (signature Meme).
// Auto-fade apres delay.

import { useEffect, useState, type CSSProperties } from 'react';

interface SpeechBubbleProps {
  x: number; // px from left of stage
  y: number; // px from top of stage
  text: string;
  durationMs?: number;
  onDone?: () => void;
}

export function SpeechBubble({ x, y, text, durationMs = 2800, onDone }: SpeechBubbleProps) {
  const [phase, setPhase] = useState<'in' | 'visible' | 'out'>('in');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('visible'), 200);
    const t2 = setTimeout(() => setPhase('out'), durationMs - 300);
    const t3 = setTimeout(() => onDone?.(), durationMs);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [durationMs, onDone]);

  return (
    <div
      style={
        {
          position: 'absolute',
          left: x,
          top: y - 8,
          transform: 'translate(-50%, -100%)',
          maxWidth: 200,
          padding: '8px 12px 10px',
          background: 'var(--color-paper-1)',
          border: '2px solid var(--color-wood-5)',
          borderRadius: 6,
          boxShadow: '0 3px 0 var(--color-wood-5), 0 5px 8px rgba(92,61,36,0.3)',
          fontFamily: 'var(--font-meme, "Patrick Hand", cursive)',
          fontSize: 16,
          color: 'var(--color-text-body)',
          lineHeight: 1.2,
          textAlign: 'center',
          pointerEvents: 'none',
          zIndex: 28,
          opacity: phase === 'out' ? 0 : 1,
          transition: 'opacity 300ms ease-out, transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          animation: phase === 'in' ? 'speech-pop 250ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : undefined,
        } as CSSProperties
      }
    >
      {text}
      {/* Queue triangulaire pointant vers le bas */}
      <span
        style={{
          position: 'absolute',
          left: '50%',
          bottom: -10,
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderTop: '10px solid var(--color-wood-5)',
        }}
      />
      <span
        style={{
          position: 'absolute',
          left: '50%',
          bottom: -7,
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: '8px solid var(--color-paper-1)',
        }}
      />
    </div>
  );
}

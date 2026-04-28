// Cutscene prestige 6 secondes (signature Camille v9) :
// 0-1s   : fade to white overlay
// 0.5-2.5s : 60 particles dorees montent en spirale
// 2-3.5s  : "Une saison s'acheve..." (machine a ecrire)
// 3.5-4s  : full white flash
// 4-4.5s  : "Une nouvelle commence."
// 4.5-5.5s : compteur "+50 ⭐ Etoiles" tick + cloche
// 5.5-6s  : fade vers nouvelle ferme
// Skip auto disponible apres le 1er prestige.

import { useEffect, useState } from 'react';
import { SeedIcon } from '../icons/PixelIcon.js';

interface PrestigeCutsceneProps {
  seedsGained: bigint;
  totalPrestiges: number;
  onComplete: () => void;
}

interface Particle {
  id: number;
  delay: number;
  angle: number;
  radius: number;
  duration: number;
}

export function PrestigeCutscene({ seedsGained, totalPrestiges, onComplete }: PrestigeCutsceneProps) {
  type Phase = 'fade-in' | 'spiral' | 'text1' | 'flash' | 'text2' | 'counter' | 'fade-out' | 'done';
  const [phase, setPhase] = useState<Phase>('fade-in');
  const [counterValue, setCounterValue] = useState(0n);
  const seedsTarget = seedsGained;
  const allowSkip = totalPrestiges > 1;

  // Sequence des phases.
  useEffect(() => {
    const timeline: Array<{ delay: number; phase: Phase }> = [
      { delay: 500, phase: 'spiral' },
      { delay: 2000, phase: 'text1' },
      { delay: 3500, phase: 'flash' },
      { delay: 4000, phase: 'text2' },
      { delay: 4500, phase: 'counter' },
      { delay: 5500, phase: 'fade-out' },
      { delay: 6000, phase: 'done' },
    ];
    const timers = timeline.map((step) =>
      setTimeout(() => {
        if (step.phase === 'done') {
          onComplete();
        } else {
          setPhase(step.phase);
        }
      }, step.delay),
    );
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  // Compteur tick lors de la phase 'counter'.
  useEffect(() => {
    if (phase !== 'counter') return;
    const target = Number(seedsTarget);
    const steps = 30;
    const stepMs = 800 / steps;
    let i = 0;
    const itv = setInterval(() => {
      i++;
      const pct = i / steps;
      setCounterValue(BigInt(Math.floor(target * pct)));
      if (i >= steps) {
        clearInterval(itv);
        setCounterValue(seedsTarget);
      }
    }, stepMs);
    return () => clearInterval(itv);
  }, [phase, seedsTarget]);

  // Genere 60 particles aleatoires.
  const particles: Particle[] = Array.from({ length: 60 }).map((_, i) => ({
    id: i,
    delay: Math.random() * 800,
    angle: Math.random() * 360,
    radius: 80 + Math.random() * 200,
    duration: 1200 + Math.random() * 800,
  }));

  return (
    <div
      onClick={allowSkip ? onComplete : undefined}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 5000,
        background: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: allowSkip ? 'pointer' : 'default',
        overflow: 'hidden',
      }}
    >
      {/* White flash overlay (controlled per phase) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--color-paper-1)',
          opacity:
            phase === 'fade-in' ? 0 :
            phase === 'flash' ? 1 :
            phase === 'fade-out' ? 0 :
            0.15,
          transition: 'opacity 500ms ease-out',
          pointerEvents: 'none',
        }}
      />

      {/* Spirale doree */}
      {(phase === 'spiral' || phase === 'text1' || phase === 'flash') && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', pointerEvents: 'none' }}>
          {particles.map((p) => (
            <span
              key={p.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 8,
                height: 8,
                background: 'var(--color-accent-gold)',
                boxShadow: '0 0 8px var(--color-accent-gold), 0 0 16px rgba(245, 196, 67, 0.6)',
                animationName: 'prestige-spiral',
                animationDuration: `${p.duration}ms`,
                animationDelay: `${p.delay}ms`,
                animationFillMode: 'forwards',
                animationTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                ['--angle' as string]: `${p.angle}deg`,
                ['--radius' as string]: `${p.radius}px`,
              }}
            />
          ))}
        </div>
      )}

      {/* Texte machine a ecrire phase 1 */}
      {phase === 'text1' && (
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontFamily: 'var(--font-title)',
            fontSize: 32,
            fontWeight: 700,
            color: 'var(--color-paper-1)',
            textShadow: '2px 2px 0 var(--color-wood-5), 4px 4px 0 var(--color-accent-gold)',
            textAlign: 'center',
            animation: 'typewriter 1200ms steps(20) forwards',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            borderRight: '3px solid var(--color-accent-gold)',
          }}
        >
          Une saison s'achève...
        </div>
      )}

      {/* Texte phase 2 */}
      {(phase === 'text2' || phase === 'counter') && (
        <div
          style={{
            position: 'absolute',
            top: '32%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontFamily: 'var(--font-title)',
            fontSize: 32,
            fontWeight: 700,
            color: 'var(--color-text-title)',
            textShadow: '2px 2px 0 var(--color-paper-1), 4px 4px 0 var(--color-accent-gold)',
            textAlign: 'center',
            animation: 'fade-in-scale 500ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          }}
        >
          Une nouvelle commence.
        </div>
      )}

      {/* Compteur graines avec halo */}
      {(phase === 'counter' || phase === 'fade-out') && (
        <div
          style={{
            position: 'absolute',
            top: '55%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            animation: 'fade-in-scale 600ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <SeedIcon size={48} />
            <span
              className="numeric"
              style={{
                fontSize: 64,
                fontWeight: 700,
                color: 'var(--color-accent-gold)',
                textShadow: '3px 3px 0 var(--color-wood-5), 0 0 24px rgba(245, 196, 67, 0.8)',
              }}
            >
              +{counterValue.toString()}
            </span>
          </div>
          <div
            style={{
              fontFamily: 'var(--font-button)',
              fontSize: 12,
              color: 'var(--color-paper-1)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            Graines de Printemps gagnées
          </div>
        </div>
      )}

      {/* Hint skip */}
      {allowSkip && (
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'var(--font-button)',
            fontSize: 10,
            color: 'rgba(255, 248, 231, 0.5)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            pointerEvents: 'none',
          }}
        >
          Cliquer pour passer
        </div>
      )}
    </div>
  );
}

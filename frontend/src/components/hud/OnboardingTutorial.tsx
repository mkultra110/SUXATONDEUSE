// OnboardingTutorial : tutoriel 3 etapes pour les newbies (1ere session).
// Detecte via localStorage flag, montre modal full-screen avec 3 cartes.
// CTA "Compris" et flag persist pour ne plus jamais apparaitre.

import { useEffect, useState } from 'react';
import { useGameStore } from '../../stores/gameStore.js';
import { CrossIcon, CoinIcon, NavShopIcon, SeedIcon } from '../icons/PixelIcon.js';

const STORAGE_KEY = 'suxa-onboarded';

interface Step {
  emoji: string;
  title: string;
  body: string;
  icon: () => React.ReactNode;
}

const STEPS: ReadonlyArray<Step> = [
  {
    emoji: '🌻',
    title: 'Tape l\'herbe haute',
    body: 'Touche les tuiles d\'herbe haute pour les couper et gagner du cash. Tape vite pour declencher des combos !',
    icon: () => <CoinIcon size={32} />,
  },
  {
    emoji: '🤖',
    title: 'Achete des robots',
    body: 'Dans la boutique, achete des robots qui tondent automatiquement pour toi. Long-press = mode achat MAX.',
    icon: () => <NavShopIcon size={32} />,
  },
  {
    emoji: '🌱',
    title: 'Prestige a 1 milliard',
    body: 'Apres 1B de cash gagne, tu peux prestiger : reset le progres pour gagner des Graines de Printemps qui boostent ta production future.',
    icon: () => <SeedIcon size={32} />,
  },
];

export function OnboardingTutorial() {
  const totalRobots = useGameStore((s) => s.totalRobotsBought);
  const playTime = useGameStore((s) => s.playTimeSeconds);
  const [open, setOpen] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const seen = window.localStorage.getItem(STORAGE_KEY);
    if (seen === 'done') return;
    // Affiche le tutoriel apres 3s sur la 1ere session (pas de robots, peu de play time).
    if (totalRobots === 0 && playTime < 60) {
      const t = setTimeout(() => setOpen(true), 3000);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [totalRobots, playTime]);

  function close() {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, 'done');
    }
    setOpen(false);
  }

  function next() {
    if (stepIdx < STEPS.length - 1) setStepIdx(stepIdx + 1);
    else close();
  }

  if (!open) return null;
  const step = STEPS[stepIdx]!;
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1750,
        background: 'rgba(0,0,0,0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backdropFilter: 'blur(6px)',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div
        style={{
          width: '100%',
          maxWidth: 380,
          background: 'var(--color-paper-1)',
          border: '4px solid var(--color-accent-gold)',
          padding: 24,
          textAlign: 'center',
          boxShadow: '0 8px 0 var(--color-wood-5), 0 0 32px rgba(245, 196, 67, 0.4)',
          animation: 'levelup-drop 600ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          opacity: 0,
        }}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Passer"
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: 'transparent',
            border: 'none',
            padding: 8,
            cursor: 'pointer',
          }}
        >
          <CrossIcon size={16} />
        </button>
        <div style={{ fontSize: 64, marginBottom: 8 }}>{step.emoji}</div>
        <h2
          id="onboarding-title"
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--color-text-title)',
            margin: '0 0 12px',
          }}
        >
          {step.title}
        </h2>
        <p
          className="meme"
          style={{
            fontSize: 14,
            color: 'var(--color-text-body)',
            lineHeight: 1.5,
            margin: '0 0 16px',
            fontStyle: 'italic',
          }}
        >
          {step.body}
        </p>

        {/* Step dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: i === stepIdx ? 'var(--color-accent-gold)' : 'var(--color-wood-3)',
                border: '1px solid var(--color-wood-5)',
                transition: 'background 200ms ease',
              }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          className="pixel-btn pixel-btn-gold"
          style={{ fontSize: 13, padding: '10px 20px', minWidth: 120 }}
        >
          {stepIdx < STEPS.length - 1 ? 'Suivant' : 'C\'est parti !'}
        </button>
      </div>
    </div>
  );
}

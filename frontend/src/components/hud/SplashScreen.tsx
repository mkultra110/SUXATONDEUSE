// SplashScreen : ecran d'accueil avec logo SUXA TONDEUSE flair
// (text-shadow stack jaune/rouge/blanc + bob animation). Disparait apres
// 2.5s ou clic. Adapte du design Claude Design v2.

import { useEffect, useState } from 'react';
import { useGameStore } from '../../stores/gameStore.js';

const STORAGE_KEY = 'suxa-splash-seen';

export function SplashScreen() {
  const isReady = useGameStore((s) => s.isReady);
  const totalRobots = useGameStore((s) => s.totalRobotsBought);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isReady) return;
    // Pas de splash si deja vu cette session.
    if (sessionStorage.getItem(STORAGE_KEY) === 'done') return;
    setOpen(true);
    const t = setTimeout(() => {
      setOpen(false);
      sessionStorage.setItem(STORAGE_KEY, 'done');
    }, 2800);
    return () => clearTimeout(t);
  }, [isReady]);

  function dismiss() {
    setOpen(false);
    sessionStorage.setItem(STORAGE_KEY, 'done');
  }

  if (!open) return null;

  const isReturning = totalRobots > 0;

  return (
    <div
      onClick={dismiss}
      role="dialog"
      aria-modal="true"
      aria-labelledby="splash-logo"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: 'linear-gradient(180deg, var(--k-sky-day-top, #7DD3F0) 0%, var(--k-sky-day-bottom, #C5EBFB) 60%, var(--k-grass-light, #6BBA45) 60%, var(--k-grass-bg, #4F8E2F) 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        cursor: 'pointer',
        animation: 'splash-fade-out 400ms ease-out 2.4s forwards',
        overflow: 'hidden',
      }}
    >
      {/* Hills decoratives */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: '32%',
          height: '14%',
          background: 'linear-gradient(180deg, var(--k-grass-mid, #4FA858) 0%, var(--k-grass-dark, #3D8E47) 100%)',
          clipPath: 'polygon(0 60%, 12% 30%, 25% 50%, 40% 20%, 55% 45%, 72% 25%, 88% 50%, 100% 30%, 100% 100%, 0 100%)',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: '20%',
          height: '14%',
          background: 'linear-gradient(180deg, var(--k-grass-light, #6BBA45) 0%, var(--k-grass-mid, #4F8E2F) 100%)',
          clipPath: 'polygon(0 70%, 18% 40%, 35% 60%, 52% 30%, 70% 55%, 85% 35%, 100% 50%, 100% 100%, 0 100%)',
        }}
      />

      {/* Logo */}
      <div id="splash-logo" className="kawaii-logo" style={{ position: 'relative', zIndex: 10 }}>
        <span className="kawaii-logo--suxa">SUXA</span>
        <span className="kawaii-logo--tondeuse">TONDEUSE</span>
      </div>

      {/* Sub */}
      <p
        className="meme"
        style={{
          position: 'relative',
          zIndex: 10,
          marginTop: 32,
          fontSize: 20,
          color: 'var(--k-ink, #1A1A2E)',
          textShadow: '2px 2px 0 #fff',
          textAlign: 'center',
          fontStyle: 'italic',
          fontFamily: 'Patrick Hand, cursive',
        }}
      >
        {isReturning ? '« Rebienvenue à la ferme, mon p\'tit. »' : '« Bienvenue à la ferme des Tournesols. »'}
      </p>

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          marginTop: 24,
          fontFamily: 'Press Start 2P, monospace',
          fontSize: 10,
          color: 'var(--k-ink, #1A1A2E)',
          opacity: 0.7,
          letterSpacing: '0.2em',
        }}
      >
        TAP POUR COMMENCER
      </div>
    </div>
  );
}

// GoldenButterfly : papillon dore rare (0.1% spawn par tick) qui traverse
// l'ecran. Tap = bonus instant cash + audio rare. Auto-disparait apres 8s.

import { useEffect, useState } from 'react';
import { useGameStore } from '../../stores/gameStore.js';
import { audio } from '../../services/audio.js';
import { haptic } from '../../utils/vibration.js';
import { useEffectsStore } from '../../stores/effectsStore.js';

interface ButterflySpawn {
  id: number;
  startSide: 'left' | 'right';
  yPercent: number;
}

export function GoldenButterfly() {
  const cashPerSecond = useGameStore((s) => s.cashPerSecond);
  const enableParticles = useEffectsStore((s) => s.enableParticles);
  const [spawn, setSpawn] = useState<ButterflySpawn | null>(null);
  const [caught, setCaught] = useState(false);

  useEffect(() => {
    if (!enableParticles) return;
    // Verifie spawn toutes les 30s avec proba 5% (~ 1 / 10 min en moyenne).
    const interval = setInterval(() => {
      if (spawn) return;
      if (Math.random() < 0.05) {
        setSpawn({
          id: Date.now(),
          startSide: Math.random() < 0.5 ? 'left' : 'right',
          yPercent: 30 + Math.random() * 30,
        });
        setCaught(false);
      }
    }, 30_000);
    return () => clearInterval(interval);
  }, [spawn, enableParticles]);

  useEffect(() => {
    if (!spawn) return;
    const t = setTimeout(() => {
      setSpawn(null);
      setCaught(false);
    }, 8000);
    return () => clearTimeout(t);
  }, [spawn]);

  function handleCatch() {
    if (!spawn || caught) return;
    setCaught(true);
    audio.playRare();
    haptic.rare();
    // Bonus = 10 minutes de production passive instant.
    const bonus = cashPerSecond.mul(600);
    const state = useGameStore.getState();
    useGameStore.setState({
      cash: state.cash.add(bonus),
      totalCashEarned: state.totalCashEarned.add(bonus),
    });
    setTimeout(() => setSpawn(null), 600);
  }

  if (!spawn) return null;

  return (
    <button
      type="button"
      onClick={handleCatch}
      aria-label="Papillon doré rare"
      style={{
        position: 'fixed',
        top: `${spawn.yPercent}%`,
        left: spawn.startSide === 'left' ? '-60px' : 'auto',
        right: spawn.startSide === 'right' ? '-60px' : 'auto',
        width: 48,
        height: 48,
        zIndex: 1200,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        animation: `golden-fly-${spawn.startSide} 8s linear forwards`,
        opacity: caught ? 0 : 1,
        transition: 'opacity 600ms ease-out',
        padding: 0,
      }}
    >
      <svg viewBox="0 0 32 32" width="48" height="48" style={{
        animation: 'butterfly-flap 280ms ease-in-out infinite alternate',
        filter: 'drop-shadow(0 0 8px #FFD921) drop-shadow(0 0 16px #F5C443)',
      }}>
        <defs>
          <radialGradient id="gold-wing" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFE680" />
            <stop offset="60%" stopColor="#FFD921" />
            <stop offset="100%" stopColor="#A87A1F" />
          </radialGradient>
        </defs>
        {/* Aile gauche */}
        <ellipse cx="9" cy="14" rx="8" ry="10" fill="url(#gold-wing)" stroke="#5C3A1F" strokeWidth="1" />
        {/* Aile droite */}
        <ellipse cx="23" cy="14" rx="8" ry="10" fill="url(#gold-wing)" stroke="#5C3A1F" strokeWidth="1" />
        {/* Corps */}
        <rect x="15" y="8" width="2" height="16" fill="#5C3A1F" />
        {/* Antennes */}
        <line x1="16" y1="8" x2="13" y2="4" stroke="#5C3A1F" strokeWidth="1" />
        <line x1="16" y1="8" x2="19" y2="4" stroke="#5C3A1F" strokeWidth="1" />
      </svg>
    </button>
  );
}

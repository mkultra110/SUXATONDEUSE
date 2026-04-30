// NewYearCountdown : easter egg 31/12 a minuit (idee #671). Compte
// rebours visible, puis explosion de confettis a 0.

import { useEffect, useRef, useState } from 'react';
import { audio } from '../../services/audio.js';

function isCountdownNight(): boolean {
  const now = new Date();
  // 31 decembre, entre 23h55 et 0h05.
  if (now.getMonth() === 11 && now.getDate() === 31 && now.getHours() === 23 && now.getMinutes() >= 55) return true;
  if (now.getMonth() === 0 && now.getDate() === 1 && now.getHours() === 0 && now.getMinutes() < 5) return true;
  return false;
}

function secondsUntilMidnight(): number {
  const now = new Date();
  const target = new Date(now.getFullYear() + (now.getMonth() === 11 ? 1 : 0), 0, 1, 0, 0, 0, 0);
  return Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000));
}

export function NewYearCountdown() {
  const [active, setActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const triggeredRef = useRef(false);

  useEffect(() => {
    function tick() {
      const isNight = isCountdownNight();
      setActive(isNight);
      if (!isNight) return;
      const s = secondsUntilMidnight();
      setSeconds(s);
      if (s <= 10 && s > 0) audio.playXpTick();
      if (s === 0 && !triggeredRef.current) {
        triggeredRef.current = true;
        audio.playRankUp();
      }
    }
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);

  if (!active) return null;
  return (
    <div
      style={{
        position: 'fixed',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1700,
        padding: '14px 28px',
        background: 'var(--color-paper-1)',
        border: '4px solid var(--color-accent-gold)',
        textAlign: 'center',
        boxShadow: '0 0 32px var(--color-accent-gold)',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-button)',
          fontSize: 11,
          color: 'var(--color-text-muted)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}
      >
        Nouvel an
      </div>
      <div
        className="numeric"
        style={{
          fontSize: 48,
          fontWeight: 900,
          color: seconds <= 10 ? 'var(--color-accent-red)' : 'var(--color-accent-gold)',
          lineHeight: 1,
          textShadow: '2px 2px 0 var(--color-wood-5)',
        }}
      >
        {seconds > 0 ? seconds : 'BONNE ANNÉE !'}
      </div>
    </div>
  );
}

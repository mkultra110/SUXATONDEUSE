// MilestonePopup : badge SVG drop tous les 5 niveaux + flash blanc.
// Distinct du LevelUpCelebration (qui pop a chaque niveau).

import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../../stores/gameStore.js';
import { computePlayerLevel } from '../../utils/playerLevel.js';
import { audio } from '../../services/audio.js';
import { haptic } from '../../utils/vibration.js';

const MILESTONE_STEP = 5;

export function MilestonePopup() {
  const totalCash = useGameStore((s) => s.totalCashEarned);
  const level = computePlayerLevel(totalCash);
  const lastMilestoneRef = useRef(Math.floor(level / MILESTONE_STEP) * MILESTONE_STEP);
  const [popLevel, setPopLevel] = useState<number | null>(null);

  useEffect(() => {
    const milestone = Math.floor(level / MILESTONE_STEP) * MILESTONE_STEP;
    if (milestone > lastMilestoneRef.current && milestone >= MILESTONE_STEP) {
      lastMilestoneRef.current = milestone;
      setPopLevel(milestone);
      audio.playRankUp();
      haptic.levelUp();
      const t = setTimeout(() => setPopLevel(null), 3200);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [level]);

  if (popLevel === null) return null;

  return (
    <>
      {/* Flash blanc plein ecran 250ms */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1480,
          background: 'white',
          pointerEvents: 'none',
          animation: 'milestone-flash 280ms ease-out forwards',
        }}
      />
      {/* Badge SVG */}
      <div
        style={{
          position: 'fixed',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, 0)',
          zIndex: 1490,
          pointerEvents: 'none',
          textAlign: 'center',
          animation: 'milestone-badge-drop 800ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        }}
      >
        <svg width="120" height="120" viewBox="0 0 120 120">
          <defs>
            <radialGradient id="badge-grad" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#FFE680" />
              <stop offset="60%" stopColor="#F5C443" />
              <stop offset="100%" stopColor="#A87A1F" />
            </radialGradient>
          </defs>
          <circle cx="60" cy="60" r="54" fill="url(#badge-grad)" stroke="#5C3A1F" strokeWidth="4" />
          <circle cx="60" cy="60" r="46" fill="none" stroke="#FFE680" strokeWidth="2" opacity="0.6" />
          <text
            x="60"
            y="68"
            textAnchor="middle"
            fontFamily="var(--font-title)"
            fontWeight="900"
            fontSize="32"
            fill="#5C3A1F"
            stroke="#FFE680"
            strokeWidth="0.5"
          >
            {popLevel}
          </text>
        </svg>
        <div
          style={{
            fontFamily: 'var(--font-title)',
            fontWeight: 700,
            fontSize: 18,
            color: 'var(--color-accent-gold)',
            textShadow: '2px 2px 0 var(--color-wood-5)',
            letterSpacing: '0.1em',
            marginTop: 8,
          }}
        >
          PALIER ATTEINT
        </div>
      </div>
    </>
  );
}

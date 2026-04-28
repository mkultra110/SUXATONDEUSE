// Toast polaroid : notification achievement style Camille v9.
// Slide-from-top + drop bounce + rotation aleatoire (cubic-bezier easeBack).
// Auto-dismiss 3.5s. Stack max 3.

import { useEffect, useState } from 'react';
import { ACHIEVEMENTS } from '@robomow/shared';
import { useGameStore } from '../../stores/gameStore.js';
import { TrophyIcon, StarIcon } from '../icons/PixelIcon.js';
import { audio } from '../../services/audio.js';

interface ToastEntry {
  id: number;
  achievementKey: string;
  rotation: number;
  spawnedAt: number;
}

const TOAST_DURATION_MS = 3500;
const MAX_STACK = 3;

export function AchievementToast() {
  const unlocked = useGameStore((s) => s.achievementsUnlocked);
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const [seenKeys] = useState<Set<string>>(() => new Set());

  // Detecte les nouveaux deblocages.
  useEffect(() => {
    let added = false;
    for (const key of unlocked) {
      if (key.endsWith(':claimed')) continue;
      if (seenKeys.has(key)) continue;
      seenKeys.add(key);
      added = true;
      const id = Date.now() + Math.random();
      const rotation = (Math.random() * 6 - 3); // -3..+3 deg
      setToasts((prev) => {
        const next = [...prev, { id, achievementKey: key, rotation, spawnedAt: Date.now() }];
        // Cap stack a MAX_STACK.
        return next.slice(-MAX_STACK);
      });
      // Auto-dismiss apres TOAST_DURATION_MS.
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, TOAST_DURATION_MS);
    }
    if (added) {
      audio.playPurchase();
    }
  }, [unlocked, seenKeys]);

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        alignItems: 'center',
      }}
    >
      {toasts.map((toast) => {
        const ach = ACHIEVEMENTS.find((a) => a.key === toast.achievementKey);
        if (!ach) return null;
        return <Polaroid key={toast.id} achievement={ach} rotation={toast.rotation} />;
      })}
    </div>
  );
}

function Polaroid({ achievement, rotation }: { achievement: typeof ACHIEVEMENTS[number]; rotation: number }) {
  return (
    <div
      style={{
        width: 240,
        background: 'var(--color-paper-1)',
        border: '3px solid var(--color-wood-5)',
        padding: '10px 10px 24px',
        boxShadow: '0 6px 0 var(--color-wood-5), 0 12px 24px rgba(92,61,36,0.5)',
        animation: 'polaroid-drop 700ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        transform: `translateY(-200px) rotate(${rotation}deg)`,
        transformOrigin: 'top center',
        position: 'relative',
        // CSS var pour la rotation finale (utilise par @keyframes).
        ['--final-rotate' as string]: `${rotation}deg`,
      }}
    >
      {/* Punaise rouge en haut-centre */}
      <span
        style={{
          position: 'absolute',
          top: -8,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 14,
          height: 14,
          background: 'radial-gradient(circle at 35% 30%, #FF6B6B, #B52121)',
          border: '2px solid var(--color-wood-5)',
          borderRadius: '50%',
          boxShadow: '0 2px 0 var(--color-wood-5), inset 1px 1px 0 rgba(255,255,255,0.4)',
        }}
      />
      {/* Image area : icone trophy gold sur fond papier 2 */}
      <div
        style={{
          width: '100%',
          height: 100,
          background: 'linear-gradient(180deg, var(--color-paper-2) 0%, var(--color-paper-3) 100%)',
          border: '2px solid var(--color-wood-4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 8,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Rayons solaires SVG en fond */}
        <svg
          viewBox="0 0 200 200"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 200,
            height: 200,
            transform: 'translate(-50%, -50%)',
            opacity: 0.18,
            animation: 'sun-rays-spin 30s linear infinite',
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 45 * Math.PI) / 180;
            const x = 100 + Math.cos(angle) * 90;
            const y = 100 + Math.sin(angle) * 90;
            return (
              <line
                key={i}
                x1="100"
                y1="100"
                x2={x}
                y2={y}
                stroke="var(--color-accent-gold)"
                strokeWidth="3"
              />
            );
          })}
        </svg>
        <TrophyIcon size={56} />
      </div>
      {/* Titre */}
      <div
        style={{
          fontFamily: 'var(--font-title)',
          fontWeight: 700,
          fontSize: 13,
          color: 'var(--color-text-title)',
          textAlign: 'center',
          lineHeight: 1.2,
          marginBottom: 4,
        }}
      >
        {achievement.name}
      </div>
      {/* Sous-titre */}
      <div
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 10,
          color: 'var(--color-text-muted)',
          textAlign: 'center',
          lineHeight: 1.2,
        }}
      >
        {achievement.description}
      </div>
      {/* Ruban dore en bas avec etoile */}
      <div
        style={{
          position: 'absolute',
          bottom: -6,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(180deg, var(--color-accent-gold), #B89510)',
          border: '2px solid var(--color-wood-5)',
          padding: '2px 12px',
          boxShadow: '0 2px 0 var(--color-wood-5)',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <StarIcon size={12} />
        <span
          style={{
            fontFamily: 'var(--font-button)',
            fontSize: 9,
            fontWeight: 700,
            color: 'var(--color-text-title)',
            letterSpacing: '0.1em',
          }}
        >
          DÉBLOQUÉ
        </span>
      </div>
    </div>
  );
}

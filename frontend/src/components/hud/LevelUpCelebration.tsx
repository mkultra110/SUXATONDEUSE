// LevelUpCelebration : detecte les changements de niveau joueur et
// declenche une banner-pop centrale 'NIVEAU N' + confettis or.

import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../../stores/gameStore.js';
import { useEffectsStore } from '../../stores/effectsStore.js';
import { audio } from '../../services/audio.js';
import { haptic } from '../../utils/vibration.js';
import { computePlayerLevel, rankForLevel } from '../../utils/playerLevel.js';
import { StarIcon } from '../icons/PixelIcon.js';

export function LevelUpCelebration() {
  const totalCash = useGameStore((s) => s.totalCashEarned);
  const level = computePlayerLevel(totalCash);
  const lastLevelRef = useRef(level);
  const [pop, setPop] = useState<{ id: number; level: number; rank: string; rankColor: string } | null>(null);

  useEffect(() => {
    if (level > lastLevelRef.current) {
      const rank = rankForLevel(level);
      const previousRank = rankForLevel(lastLevelRef.current);
      const id = Date.now();
      // Si on franchit un palier de rang, c'est un evenement encore plus visible.
      setPop({ id, level, rank: rank.title, rankColor: rank.color });
      audio.playPurchase();
      haptic.levelUp();
      useEffectsStore.getState().triggerShake(0.4, 300);
      useEffectsStore.getState().triggerChromatic(220);
      // Si nouveau rang : 2eme audio bling + shake plus fort.
      if (rank.title !== previousRank.title) {
        setTimeout(() => audio.playRankUp(), 200);
        useEffectsStore.getState().triggerShake(0.8, 500);
      }
      const t = setTimeout(() => {
        setPop((p) => (p && p.id === id ? null : p));
      }, 2500);
      lastLevelRef.current = level;
      return () => clearTimeout(t);
    }
    lastLevelRef.current = level;
    return undefined;
  }, [level]);

  if (!pop) return null;

  return (
    <>
      {/* Vague de chaleur dore radiale (idee #144) */}
      <div className="heatwave-ring" />
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          padding: '20px 32px',
          background: 'var(--color-paper-1)',
          border: `4px solid ${pop.rankColor}`,
          boxShadow: `0 6px 0 var(--color-wood-5), 0 0 40px ${pop.rankColor}88`,
          textAlign: 'center',
          animation: 'levelup-drop 600ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          opacity: 0,
        }}
      >
        <div
          className="meme"
          style={{
            fontSize: 14,
            color: 'var(--color-text-muted)',
            fontStyle: 'italic',
            marginBottom: 4,
          }}
        >
          Nouveau niveau !
        </div>
        <div className="flex items-center justify-center gap-2">
          <StarIcon size={28} />
          <span
            className="numeric"
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: pop.rankColor,
              textShadow: '2px 2px 0 var(--color-wood-5)',
              letterSpacing: '0.04em',
            }}
          >
            NIVEAU {pop.level}
          </span>
          <StarIcon size={28} />
        </div>
        <div
          style={{
            fontFamily: 'var(--font-button)',
            fontSize: 12,
            color: pop.rankColor,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginTop: 6,
          }}
        >
          {pop.rank}
        </div>
      </div>
    </div>
    </>
  );
}

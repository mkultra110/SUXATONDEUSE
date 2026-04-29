// AchievementConfetti : declenche une explosion de confettis quand un
// achievement est unlock. Listen sur achievementsUnlocked size.

import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../../stores/gameStore.js';

const COLORS = ['#F5C443', '#8FBF4F', '#A8D8EE', '#FF8FA3', '#A855F7', '#FFD921'];

interface ConfettiPiece {
  id: number;
  cx: number;
  cy: number;
  color: string;
  delay: number;
}

export function AchievementConfetti() {
  const achievements = useGameStore((s) => s.achievementsUnlocked);
  const lastSize = useRef(0);
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    // Filter out :claimed entries pour le compteur.
    const ownedSize = Array.from(achievements).filter((k) => !k.endsWith(':claimed')).length;
    if (ownedSize > lastSize.current) {
      // Genere 30 confettis dans toutes directions.
      const generated: ConfettiPiece[] = [];
      for (let i = 0; i < 30; i++) {
        const angle = (i / 30) * Math.PI * 2;
        const dist = 100 + Math.random() * 100;
        generated.push({
          id: Date.now() + i,
          cx: Math.cos(angle) * dist,
          cy: Math.sin(angle) * dist - 50,
          color: COLORS[i % COLORS.length] ?? '#F5C443',
          delay: Math.random() * 100,
        });
      }
      setPieces(generated);
      setTimeout(() => setPieces([]), 1600);
    }
    lastSize.current = ownedSize;
  }, [achievements]);

  if (pieces.length === 0) return null;

  return (
    <>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            ['--cx' as string]: `${p.cx}px`,
            ['--cy' as string]: `${p.cy}px`,
            ['--cf-color' as string]: p.color,
            animationDelay: `${p.delay}ms`,
          } as React.CSSProperties}
        />
      ))}
    </>
  );
}

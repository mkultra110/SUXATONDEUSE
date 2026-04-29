// RobotThoughts : bulles de pensee aleatoires (idee #19).
// Toutes les 25-45s, un robot "pense" un truc.

import { useEffect, useState } from 'react';
import { useGameStore } from '../../stores/gameStore.js';
import { useEffectsStore } from '../../stores/effectsStore.js';

const THOUGHTS = [
  'tic toc tic toc...',
  'beep boop !',
  'oh, une fleur',
  'j\'ai faim de mauvaises herbes',
  'rrrrhhhh',
  'je pense donc je suis',
  '01000101 ?',
  'hmm, encore tondre...',
  'la vie est belle',
  'bzzzzz',
  'mode tonte engage',
  '...',
];

interface Thought {
  id: number;
  text: string;
  x: number;
  y: number;
}

export function RobotThoughts() {
  const totalRobots = useGameStore((s) => s.totalRobotsBought);
  const enableParticles = useEffectsStore((s) => s.enableParticles);
  const [thoughts, setThoughts] = useState<Thought[]>([]);

  useEffect(() => {
    if (!enableParticles || totalRobots === 0) return;
    function spawn() {
      const id = Date.now();
      const text = THOUGHTS[Math.floor(Math.random() * THOUGHTS.length)] ?? '...';
      setThoughts((t) => [
        ...t,
        {
          id,
          text,
          x: 20 + Math.random() * 60,
          y: 40 + Math.random() * 30,
        },
      ]);
      setTimeout(() => setThoughts((t) => t.filter((x) => x.id !== id)), 3100);
    }
    const interval = setInterval(spawn, 25_000 + Math.random() * 20_000);
    return () => clearInterval(interval);
  }, [totalRobots, enableParticles]);

  if (thoughts.length === 0) return null;
  return (
    <>
      {thoughts.map((t) => (
        <span key={t.id} className="thought-bubble" style={{ left: `${t.x}%`, top: `${t.y}%` }}>
          {t.text}
        </span>
      ))}
    </>
  );
}

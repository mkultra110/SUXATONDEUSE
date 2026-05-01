// HolidayDecor : decorations saisonnieres flottantes (sapin Noel,
// citrouille Halloween, muguet 1er mai, drapeau 14 juillet).
// Idees #50 #85 #86 #87.

import { useMemo } from 'react';

interface DecorItem { emoji: string; label: string; key: string }

function computeItems(): DecorItem[] {
  const now = new Date();
  const m = now.getMonth();
  const d = now.getDate();
  const list: DecorItem[] = [];
  // Decembre : sapin + bonhomme + lampion.
  if (m === 11) {
    list.push({ emoji: '🎄', label: 'Joyeux Noel', key: 'tree' });
    list.push({ emoji: '☃️', label: 'Bonhomme de neige', key: 'snowman' });
    list.push({ emoji: '🏮', label: 'Lampion suspendu', key: 'lantern' });
  }
  if (m === 0 || m === 1) list.push({ emoji: '❄️', label: 'Givre', key: 'snowflake' });
  if (m === 9 && d >= 25) {
    list.push({ emoji: '🎃', label: 'Halloween', key: 'pumpkin' });
    list.push({ emoji: '🕸️', label: 'Toile d\'araignee', key: 'cobweb' });
    list.push({ emoji: '🦇', label: 'Chauve-souris', key: 'bat' });
  }
  if (m === 4 && d === 1) list.push({ emoji: '🌼', label: '1er mai', key: 'lily' });
  if (m === 6 && d === 14) {
    list.push({ emoji: '🇫🇷', label: '14 juillet', key: 'flag' });
    list.push({ emoji: '🎆', label: 'Feu d\'artifice', key: 'firework' });
  }
  if (m === 0 && d === 1) list.push({ emoji: '🎉', label: 'Bonne annee !', key: 'newyear' });
  if (m === 1 && d === 14) list.push({ emoji: '💝', label: 'Saint-Valentin', key: 'valentine' });
  if (m === 3 && d <= 7 && now.getDay() === 0) list.push({ emoji: '🐰', label: 'Paques', key: 'easter' });
  if (m === 3 && d === 1) {
    list.push({ emoji: '🐟', label: 'Poisson d\'avril', key: 'fish' });
    list.push({ emoji: '🌸', label: 'Pluie de petales', key: 'april-petal' });
  }
  if (m === 2 && d === 17) list.push({ emoji: '🍀', label: 'Saint-Patrick', key: 'patrick' });
  if (m === 1 && d <= 14 && now.getDay() === 2) list.push({ emoji: '🎭', label: 'Mardi gras', key: 'mardigras' });
  return list;
}

export function HolidayDecor() {
  const items = useMemo(computeItems, []);
  if (items.length === 0) return null;
  return (
    <>
      {items.map((it, i) => (
        <div
          key={it.key}
          aria-label={it.label}
          title={it.label}
          style={{
            position: 'fixed',
            // Stack vertical sur la gauche, max 3 items visibles en mobile.
            top: 'calc(96px + env(safe-area-inset-top, 0px) + ' + (i * 56) + 'px)',
            left: 8,
            zIndex: 50,
            fontSize: i < 2 ? 28 : 22,
            filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,0.3))',
            pointerEvents: 'none',
            animation: 'pulse 3s ease-in-out infinite',
          }}
        >
          {it.emoji}
        </div>
      ))}
    </>
  );
}

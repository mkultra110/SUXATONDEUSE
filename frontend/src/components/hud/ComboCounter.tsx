// ComboCounter : affiche x2/x3/x4... centre ecran quand le joueur tap
// rapidement (multi-shadow Stardew-like). Auto-fade apres 1.1s d'inactivite.

import { useEffect, useState } from 'react';
import { useEffectsStore } from '../../stores/effectsStore.js';

export function ComboCounter() {
  const comboCount = useEffectsStore((s) => s.comboCount);
  const comboLastAt = useEffectsStore((s) => s.comboLastAt);
  const resetCombo = useEffectsStore((s) => s.resetCombo);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (comboCount < 2) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      resetCombo();
    }, 1100);
    return () => clearTimeout(t);
  }, [comboCount, comboLastAt, resetCombo]);

  if (!visible || comboCount < 2) return null;

  // Couleur escalante par paliers.
  const color =
    comboCount >= 20
      ? '#FF4081'
      : comboCount >= 10
        ? '#FFD921'
        : comboCount >= 5
          ? '#F5C443'
          : '#8FBF4F';
  const scale = Math.min(1.6, 1 + comboCount * 0.04);

  return (
    <div
      style={{
        position: 'fixed',
        top: '32%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${scale})`,
        zIndex: 1400,
        pointerEvents: 'none',
        fontFamily: 'var(--font-title)',
        fontWeight: 900,
        fontSize: 64,
        color,
        letterSpacing: '0.05em',
        textShadow: `
          3px 3px 0 var(--color-wood-5),
          0 0 24px ${color}88,
          0 0 48px ${color}44
        `,
        animation: 'combo-pop 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        userSelect: 'none',
      }}
    >
      ×{comboCount}
    </div>
  );
}

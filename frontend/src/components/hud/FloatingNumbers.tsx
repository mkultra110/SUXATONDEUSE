// FloatingNumbers : overlay des nombres qui flottent (cash gain).
// Lit le buffer du effectsStore et anime via CSS keyframe.

import { useEffectsStore } from '../../stores/effectsStore.js';

export function FloatingNumbers() {
  const numbers = useEffectsStore((s) => s.floatingNumbers);
  if (numbers.length === 0) return null;
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1300,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {numbers.map((n) => (
        <span
          key={n.id}
          className="numeric"
          style={{
            position: 'absolute',
            left: `${n.x}%`,
            top: `${n.y}%`,
            transform: 'translate(-50%, -50%)',
            color: n.color,
            fontSize: n.fontSize,
            fontWeight: 700,
            textShadow: '2px 2px 0 var(--color-wood-5)',
            animation: 'floating-cash 1.4s cubic-bezier(0.22, 1, 0.36, 1) forwards',
            whiteSpace: 'nowrap',
          }}
        >
          {n.value}
        </span>
      ))}
    </div>
  );
}

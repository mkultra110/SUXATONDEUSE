// AnimatedNumber : count-up animation quand une valeur change.
// Utilise pour les currencies dans la TopBar (effet 'bling-bling' au gain).

import { useEffect, useRef, useState } from 'react';
import { formatBig } from '../../utils/format.js';

interface Props {
  value: number;
  durationMs?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function AnimatedNumber({ value, durationMs = 600, className, style }: Props) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (value === display) return;
    fromRef.current = display;
    startRef.current = performance.now();
    const animate = (now: number) => {
      const start = startRef.current ?? now;
      const t = Math.min(1, (now - start) / durationMs);
      // Easing easeOutCubic.
      const eased = 1 - Math.pow(1 - t, 3);
      const v = fromRef.current + (value - fromRef.current) * eased;
      setDisplay(v);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, durationMs]);

  return (
    <span className={className} style={style}>
      {formatBig(display)}
    </span>
  );
}

// Hook responsive : 'mobile' (<768px) / 'tablet' (768-1279) / 'desktop' (≥1280).
// Aligne sur les breakpoints Tailwind v4 du brief.

import { useEffect, useState } from 'react';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

function compute(): Breakpoint {
  if (typeof window === 'undefined') return 'mobile';
  const w = window.innerWidth;
  if (w >= 1280) return 'desktop';
  if (w >= 768) return 'tablet';
  return 'mobile';
}

export function useResponsive(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>(compute);
  useEffect(() => {
    const handler = () => setBp(compute());
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return bp;
}

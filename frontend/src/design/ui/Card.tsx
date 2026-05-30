// Carte (ex: carte robot de la boutique). La brillance reflète le palier
// de possession : bronze → argent → or → diamant.
import type { HTMLAttributes } from 'react';
import { cx } from './cx.js';

export type CardShine = 'none' | 'bronze' | 'silver' | 'gold' | 'diamond';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  shine?: CardShine;
}

export function Card({ shine = 'none', className, children, ...rest }: CardProps) {
  return (
    <div className={cx('ds-card', shine !== 'none' && `ds-card--${shine}`, className)} {...rest}>
      {children}
    </div>
  );
}

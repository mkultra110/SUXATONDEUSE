// Chip / badge compact. Tons sémantiques (neutre par défaut).
import type { HTMLAttributes } from 'react';
import { cx } from './cx.js';

export type ChipTone = 'neutral' | 'accent' | 'success' | 'danger' | 'premium';

interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: ChipTone;
}

export function Chip({ tone = 'neutral', className, children, ...rest }: ChipProps) {
  return (
    <span className={cx('ds-chip', tone !== 'neutral' && `ds-chip--${tone}`, className)} {...rest}>
      {children}
    </span>
  );
}

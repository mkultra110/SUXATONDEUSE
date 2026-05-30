// Panneau « papier cottage » avec clous de coin optionnels (signature visuelle).
import type { HTMLAttributes } from 'react';
import { cx } from './cx.js';

interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  nailed?: boolean;
}

export function Panel({ nailed = false, className, children, ...rest }: PanelProps) {
  return (
    <div className={cx('ds-panel', nailed && 'ds-panel--nailed', className)} {...rest}>
      {children}
      {nailed && (
        <>
          <span className="ds-nail-bl" aria-hidden="true" />
          <span className="ds-nail-br" aria-hidden="true" />
        </>
      )}
    </div>
  );
}

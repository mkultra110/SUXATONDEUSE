// Toast crème (style « note épinglée »). Tons sémantiques via la bordure.
import type { ReactNode } from 'react';
import { cx } from './cx.js';

export type ToastTone = 'default' | 'success' | 'danger' | 'info';

interface ToastProps {
  tone?: ToastTone;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Toast({ tone = 'default', icon, children, className }: ToastProps) {
  return (
    <div
      className={cx('ds-toast', tone !== 'default' && `ds-toast--${tone}`, className)}
      role="status"
    >
      {icon && (
        <span className="ds-toast__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{children}</span>
    </div>
  );
}

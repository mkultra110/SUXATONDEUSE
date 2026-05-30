// Barre de progression accessible (role=progressbar). value/max en 0..1 borné.
import { cx } from './cx.js';

interface ProgressBarProps {
  value: number;
  max?: number;
  gold?: boolean;
  label?: string;
  className?: string;
}

export function ProgressBar({ value, max = 1, gold = false, label, className }: ProgressBarProps) {
  const ratio = max <= 0 ? 0 : Math.min(1, Math.max(0, value / max));
  const pct = Math.round(ratio * 100);
  return (
    <div
      className={cx('ds-progress', gold && 'ds-progress--gold', className)}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className="ds-progress__fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

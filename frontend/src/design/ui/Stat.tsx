// Compteur HUD : libellé + valeur en chiffres pixel. `pop` rejoue une
// animation d'à-coup quand la valeur change (feedback « juteux »).
import { cx } from './cx.js';

interface StatProps {
  label: string;
  value: string;
  pop?: boolean;
  className?: string;
}

export function Stat({ label, value, pop = false, className }: StatProps) {
  return (
    <div className={cx('ds-stat', className)}>
      <span className="ds-stat__label">{label}</span>
      <span className={cx('ds-stat__value', pop && 'ds-stat__value--pop')}>{value}</span>
    </div>
  );
}

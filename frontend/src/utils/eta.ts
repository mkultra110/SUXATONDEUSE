// Format ETA (estimated time of arrival) en texte court.
// Exemples : "12s" / "3 min" / "2 h" / "—" si inatteignable.

import type Decimal from 'break_infinity.js';

export function formatEta(remainingCash: Decimal, cashPerSecond: Decimal): string {
  const cps = Number(cashPerSecond.toString());
  if (!Number.isFinite(cps) || cps <= 0) return '—';
  const remaining = Number(remainingCash.toString());
  if (!Number.isFinite(remaining) || remaining <= 0) return 'maintenant';
  const seconds = remaining / cps;
  if (seconds < 1) return '< 1s';
  if (seconds < 60) return `${Math.ceil(seconds)}s`;
  if (seconds < 3600) return `${Math.ceil(seconds / 60)} min`;
  if (seconds < 86_400) return `${Math.ceil(seconds / 3600)} h`;
  if (seconds < 86_400 * 30) return `${Math.ceil(seconds / 86_400)} j`;
  return '∞';
}

// Format compact des grands nombres (K/M/B/T...) avec virgule decimale
// francaise. Utilise pour tous les compteurs de currencies du HUD.
//
// Exemples :
//   81184      -> "81,18K"
//   2_630_000  -> "2,63M"
//   999        -> "999"
//   1.5e9      -> "1,50B"
//   1e36       -> "1,00AA" (notation au-dela du decillion)

import type Decimal from 'break_infinity.js';

const SHORT = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];

export function formatBig(input: number | bigint | Decimal | string): string {
  let n: number;
  if (typeof input === 'number') {
    n = input;
  } else if (typeof input === 'bigint') {
    n = Number(input);
  } else if (typeof input === 'string') {
    n = Number(input);
  } else {
    // Decimal
    n = Number(input.toString());
  }
  if (!Number.isFinite(n)) return '∞';
  if (Math.abs(n) < 10_000) {
    return n.toLocaleString('fr-FR', { maximumFractionDigits: 0 });
  }
  const tier = Math.floor(Math.log10(Math.abs(n)) / 3);
  if (tier < SHORT.length) {
    const scaled = n / Math.pow(10, tier * 3);
    const decimals = Math.abs(scaled) < 10 ? 2 : Math.abs(scaled) < 100 ? 1 : 0;
    return `${scaled.toFixed(decimals).replace('.', ',')}${SHORT[tier]}`;
  }
  // AA-notation au-dela du decillion (1e36+).
  const aaTier = tier - SHORT.length;
  const a = Math.floor(aaTier / 26);
  const b = aaTier % 26;
  const suffix =
    (a > 0 ? String.fromCharCode(65 + a - 1) : '') +
    String.fromCharCode(65 + b) +
    String.fromCharCode(65 + b);
  const scaled = n / Math.pow(10, tier * 3);
  return `${scaled.toFixed(2).replace('.', ',')}${suffix}`;
}

export function formatRate(n: number): string {
  if (n === 0) return '';
  const sign = n > 0 ? '+' : '';
  return `${sign}${formatBig(n)}/s`;
}

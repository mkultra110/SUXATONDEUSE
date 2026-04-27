// Wrapper autour de break_infinity.js pour les currencies cote client.
// L'API expose Decimal mais on l'utilise avec un nom plus court.
// On formate aussi les nombres pour l'UI selon le standard short scale.

import Decimal from 'break_infinity.js';

export type Big = Decimal;

const SUFFIXES = [
  '',
  'K',
  'M',
  'B',
  'T',
  'Qa',
  'Qi',
  'Sx',
  'Sp',
  'Oc',
  'No',
  'Dc',
];

/** Cree un Decimal a partir de n'importe quelle source. */
export function big(value: Decimal | number | string | bigint): Decimal {
  if (value instanceof Decimal) return value;
  if (typeof value === 'bigint') return new Decimal(value.toString());
  return new Decimal(value);
}

/**
 * Formate un grand nombre en short scale.
 * Ex : 1234567 -> "1.23M", 1.5e15 -> "1.5Qa".
 * Au-dela de 1e36 (10^36 = decillion), bascule en notation scientifique.
 */
export function formatBig(value: Decimal | number | string, decimals = 2): string {
  const d = big(value);
  if (d.lt(1000) && d.gte(0)) {
    // Petits nombres : pas de suffixe, 0 decimales pour les entiers <100.
    return d.lt(100) && d.eq(d.floor()) ? d.toFixed(0) : d.toFixed(decimals);
  }

  const log10 = d.abs().log10();
  if (!Number.isFinite(log10)) return d.toExponential(decimals);

  const tier = Math.floor(log10 / 3);
  if (tier < SUFFIXES.length) {
    const scaled = d.div(Decimal.pow(10, tier * 3));
    const suffix = SUFFIXES[tier];
    return `${scaled.toFixed(decimals)}${suffix}`;
  }

  // Au-dela : notation scientifique 1.23e36+
  return d.toExponential(decimals);
}

/** Convertit un Decimal en string pour persistance (transit JSON). */
export function bigToString(value: Decimal): string {
  return value.toString();
}

/** Conversion BigInt <-> Decimal (perte possible au-dela de 2^53). */
export function bigToBigInt(value: Decimal): bigint {
  return BigInt(value.floor().toString());
}

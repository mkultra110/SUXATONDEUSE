// Helpers de serialisation BigInt <-> JSON.
// JSON.stringify ne sait pas encoder BigInt par defaut : on serialise en string.

/**
 * Replacer pour JSON.stringify : convertit les BigInt en string.
 * Usage : JSON.stringify(obj, bigIntReplacer)
 */
export function bigIntReplacer(_key: string, value: unknown): unknown {
  return typeof value === 'bigint' ? value.toString() : value;
}

/** Tente de parser une string en BigInt, sinon throw. */
export function parseBigInt(value: string | number | bigint): bigint {
  if (typeof value === 'bigint') return value;
  if (typeof value === 'number') return BigInt(Math.trunc(value));
  return BigInt(value);
}

/** Convertit un BigInt en string (jamais en number, perte de precision). */
export function bigIntToString(value: bigint): string {
  return value.toString();
}

/**
 * Convertit une string serialisant un BigInt (potentiellement decimale ou en
 * notation scientifique) en bigint, en tronquant toute partie fractionnaire.
 * Utilise pour parser les montants venant du client (cash, prestige, stats).
 */
export function toBigIntFromString(s: string): bigint {
  if (s.includes('e') || s.includes('E')) {
    // Notation scientifique : on convertit via Number puis BigInt.
    return BigInt(Math.trunc(Number(s)));
  }
  const dot = s.indexOf('.');
  return BigInt(dot === -1 ? s : s.slice(0, dot));
}

/** Patch global Express response pour stringifier automatiquement les BigInt. */
export function installBigIntJsonPatch(): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };
}

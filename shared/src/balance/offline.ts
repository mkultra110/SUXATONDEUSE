// Calcul des gains offline (cf. GDD section 4.11).
//
// Modele Cookie Clicker ameliore :
// - 0..12h : 100 % des gains online
// - 12..72h : degradation lineaire jusqu'a 50 %
// - 72h+ : 25 % (jamais 0 % pour preserver le feel idle)

const HOUR_SECONDS = 3600;

/**
 * Multiplicateur applique sur les gains offline en fonction de la duree d'absence.
 *
 * @param elapsedSeconds Duree d'absence en secondes (>= 0).
 * @param capHours Plafond superieur autorise par les upgrades de prestige (en heures).
 */
export function offlineMultiplier(elapsedSeconds: number, capHours = 12): number {
  if (elapsedSeconds <= 0) return 1;

  const hours = elapsedSeconds / HOUR_SECONDS;
  const fullRateLimit = capHours;
  const degradedLimit = capHours * 6;

  if (hours <= fullRateLimit) return 1;
  if (hours <= degradedLimit) {
    // Degradation lineaire de 1.0 a 0.5 entre fullRateLimit et degradedLimit.
    const progression = (hours - fullRateLimit) / (degradedLimit - fullRateLimit);
    return 1 - progression * 0.5;
  }
  return 0.25;
}

/**
 * Calcule la quantite cumulee de currency gagnee offline.
 *
 * @param idleRatePerSecond Production passive en currency/seconde (BigInt).
 * @param elapsedSeconds Duree d'absence (sec).
 * @param capHours Plafond personnalise (heures).
 */
export function offlineGain(
  idleRatePerSecond: bigint,
  elapsedSeconds: number,
  capHours = 12,
): bigint {
  if (elapsedSeconds <= 0 || idleRatePerSecond <= 0n) return 0n;

  const cappedElapsed = Math.min(elapsedSeconds, capHours * 6 * HOUR_SECONDS);
  const multiplier = offlineMultiplier(cappedElapsed, capHours);
  // Multiplie BigInt par flottant via mise a l'echelle 1e6.
  const scale = 1_000_000;
  const totalSeconds = BigInt(Math.floor(cappedElapsed));
  const factorScaled = BigInt(Math.round(multiplier * scale));
  return (idleRatePerSecond * totalSeconds * factorScaled) / BigInt(scale);
}

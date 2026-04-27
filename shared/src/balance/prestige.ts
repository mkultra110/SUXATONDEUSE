// Formules de prestige (cf. GDD section 4.7 a 4.9).

/**
 * Calcule le nombre de Graines de Printemps gagnees lors du prochain prestige.
 * seeds_gained = floor(150 * sqrt(total_cash_earned / 1e9)) - seeds_already_spent
 *
 * @param totalCashEarned Total de cash gagne sur ce cycle (BigInt).
 * @param seedsAlreadySpent Graines deja claimees lors des prestiges precedents.
 */
export function calculatePrestigeSeeds(
  totalCashEarned: bigint,
  seedsAlreadySpent: bigint,
): bigint {
  const billion = 1_000_000_000;
  // Conversion sure : pour de tres gros nombres on plafonne a 2^53 - 1
  // (suffisant car la racine ramene en zone bornee).
  const cashF = Number(totalCashEarned > BigInt(Number.MAX_SAFE_INTEGER)
    ? BigInt(Number.MAX_SAFE_INTEGER)
    : totalCashEarned);
  if (cashF < billion) return 0n;

  const raw = Math.floor(150 * Math.sqrt(cashF / billion));
  const result = BigInt(raw) - seedsAlreadySpent;
  return result < 0n ? 0n : result;
}

/**
 * Multiplicateur total compose des bonus de prestige.
 * Cf. GDD section 4.9.
 */
export function prestigeMultiplier(params: {
  seedsInMultiplierTree: number;
  achievementsUnlocked: number;
  petsCount: number;
}): number {
  const seedsBonus = params.seedsInMultiplierTree * 0.02;
  const achievementsBonus = params.achievementsUnlocked * 0.01;
  const petsBonus = params.petsCount * 0.1;
  return 1 + seedsBonus + achievementsBonus + petsBonus;
}

/** Cout en graines pour activer le N-eme node d'une branche (escalade x5). */
export function nodeCost(nodeIndex: number): bigint {
  if (nodeIndex < 0) throw new Error('nodeIndex doit etre positif');
  // 1, 5, 25, 125, 625, ...
  let cost = 1n;
  for (let i = 0; i < nodeIndex; i++) {
    cost *= 5n;
  }
  return cost;
}

/**
 * Indique si le joueur devrait prestiger maintenant.
 * Recommandation in-game : prestige quand new_seeds >= 2 * current_seeds.
 */
export function shouldRecommendPrestige(currentSeeds: bigint, projectedSeeds: bigint): boolean {
  if (currentSeeds === 0n) return projectedSeeds > 0n;
  return projectedSeeds >= currentSeeds * 2n;
}

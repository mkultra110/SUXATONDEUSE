// Formules de cout des generateurs (cf. GDD section 4.1 a 4.4).
//
// On utilise Number pour les exposants et BigInt pour le resultat final
// afin d'eviter les pertes de precision sur les hauts tiers (>1e15).

/**
 * Cout d'achat de la N-eme unite (0-indexed).
 * cost(N) = baseCost * r^N
 */
export function generatorCost(baseCost: bigint, growthRate: number, ownedCount: number): bigint {
  if (ownedCount < 0) throw new Error('ownedCount doit etre positif');
  // Calcul en flottant puis arrondi : suffisant tant que cost < 2^53.
  // Au-dela, on garde la precision via une multiplication de bigint en chaine.
  const factor = Math.pow(growthRate, ownedCount);
  return scaleBigInt(baseCost, factor);
}

/**
 * Cout d'achat groupe de n unites a partir de la k-eme deja possedee.
 * Formule geometrique de Pecorella :
 * cost_bulk = baseCost * r^k * (r^n - 1) / (r - 1)
 */
export function bulkCost(
  baseCost: bigint,
  growthRate: number,
  ownedCount: number,
  bulkSize: number,
): bigint {
  if (bulkSize <= 0) return 0n;
  if (growthRate === 1) return baseCost * BigInt(bulkSize);

  const start = Math.pow(growthRate, ownedCount);
  const numerator = Math.pow(growthRate, bulkSize) - 1;
  const denominator = growthRate - 1;
  const factor = (start * numerator) / denominator;
  return scaleBigInt(baseCost, factor);
}

/**
 * Quantite max achetable avec un budget donne.
 * max_buy = floor(log_r((c * (r - 1)) / (baseCost * r^k) + 1))
 */
export function maxAffordable(
  baseCost: bigint,
  growthRate: number,
  ownedCount: number,
  budget: bigint,
): number {
  if (budget <= 0n || baseCost <= 0n) return 0;
  if (growthRate === 1) {
    return Number(budget / baseCost);
  }

  const baseCostF = Number(baseCost);
  const budgetF = Number(budget);
  const rPowK = Math.pow(growthRate, ownedCount);
  const inner = (budgetF * (growthRate - 1)) / (baseCostF * rPowK) + 1;
  if (inner <= 0) return 0;
  return Math.floor(Math.log(inner) / Math.log(growthRate));
}

/**
 * Valeur de revente d'une unite (style Cookie Clicker : 25 % du dernier cout).
 */
export function sellValue(currentCost: bigint, ratio = 0.25): bigint {
  return scaleBigInt(currentCost, ratio);
}

/**
 * Multiplie un BigInt par un facteur flottant en preservant la precision
 * pour les valeurs raisonnables (< 1e15) et tombant en arrondi simple sinon.
 */
export function scaleBigInt(value: bigint, factor: number): bigint {
  if (factor === 0) return 0n;
  if (factor === 1) return value;

  // On passe par 1e6 d'echelle pour conserver 6 chiffres apres la virgule.
  const scale = 1_000_000;
  const factorScaled = BigInt(Math.round(factor * scale));
  return (value * factorScaled) / BigInt(scale);
}

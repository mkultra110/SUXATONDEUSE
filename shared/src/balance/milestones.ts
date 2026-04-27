// Multiplicateurs de production en fonction du nombre d'unites possedees
// (cf. GDD section 4.5).

/** Paliers (quantite, multiplicateur a appliquer en plus a ce palier). */
export const MILESTONES: ReadonlyArray<readonly [number, number]> = [
  [25, 2],
  [50, 2],
  [100, 3],
  [200, 3],
  [300, 3],
  [400, 3],
  [500, 2],
  [600, 2],
  [700, 2],
  [800, 2],
  [900, 2],
  [1000, 2],
  [1500, 2],
  [2000, 2],
  [3000, 2],
  [4000, 2],
];

/**
 * Calcule le multiplicateur cumulatif de production pour un nombre d'unites donne.
 * Le multiplicateur est cumulatif : a 100 unites, on a 2 * 2 * 3 = 12.
 */
export function milestoneMultiplier(ownedCount: number): number {
  let multiplier = 1;
  for (const [threshold, mult] of MILESTONES) {
    if (ownedCount >= threshold) {
      multiplier *= mult;
    } else {
      break;
    }
  }
  return multiplier;
}

/** Renvoie le prochain palier non encore atteint, ou null si tout est atteint. */
export function nextMilestone(ownedCount: number): { threshold: number; multiplier: number } | null {
  for (const [threshold, mult] of MILESTONES) {
    if (ownedCount < threshold) {
      return { threshold, multiplier: mult };
    }
  }
  return null;
}

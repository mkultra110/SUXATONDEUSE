// Types decrivant les parcelles (zones de tonte).

/** Identifiants des 10 parcelles (cf. GDD section 3.3). */
export type PlotType =
  | 'RESIDENTIAL_GARDEN'
  | 'PAVILION_GARDEN'
  | 'SUBDIVISION'
  | 'MUNICIPAL_PARK'
  | 'CEMETERY'
  | 'GOLF_COURSE'
  | 'STADIUM'
  | 'HIPPODROME'
  | 'CITY'
  | 'MEGALOPOLIS';

/** Stats fixes d'une parcelle. */
export interface PlotDefinition {
  type: PlotType;
  index: number;
  name: string;
  unlockCost: bigint;
  globalMultiplier: number;
  surfaceM2: number;
}

/** Etat d'une parcelle possedee par un joueur. */
export interface PlotInstance {
  id: string;
  type: PlotType;
  level: number;
  isUnlocked: boolean;
  grassDensity: number;
  multiplier: number;
}

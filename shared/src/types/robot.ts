// Types decrivant les robots du jeu.

/** Identifiants des 10 tiers de robots (cf. GDD section 3.2). */
export type RobotType =
  | 'HAND_SHEARS'
  | 'PUSH_MOWER'
  | 'GAS_MOWER'
  | 'ELECTRIC_MOWER'
  | 'ROBOMOW_V1'
  | 'NAVIBOT'
  | 'HELIOCUT'
  | 'MEGAMOWER'
  | 'AEROMOW'
  | 'NANOSWARM';

/** Stats fixes d'un tier (5 axes du GDD). */
export interface RobotTierStats {
  type: RobotType;
  index: number;
  name: string;
  baseCost: bigint;
  costGrowth: number;
  baseGrassPerSecond: number;
  cuttingSpeed: number;
  batteryWh: number;
  autonomySeconds: number;
  cuttingWidthCm: number;
  movementSpeedMs: number;
}

/** Etat d'un robot possede par un joueur a runtime. */
export interface RobotInstance {
  id: string;
  type: RobotType;
  level: number;
  speed: number;
  efficiency: number;
  battery: number;
  assignedPlotId: string | null;
  acquiredAt: string;
}

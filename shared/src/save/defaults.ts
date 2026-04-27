// Etat initial d'un nouveau joueur.

import { SAVE_PAYLOAD_VERSION } from '../constants/index.js';
import type { SavePayload } from '../types/save.js';

/** Construit un save vide pour un nouveau joueur. Ne mute pas. */
export function buildInitialSave(now: number = Date.now()): SavePayload {
  return {
    payloadVersion: SAVE_PAYLOAD_VERSION,
    cash: '0',
    grass: '0',
    gems: 0,
    prestigePoints: '0',
    prestigeMultiplier: 1,
    robots: [],
    plots: [
      {
        id: 'plot-residential-garden',
        type: 'RESIDENTIAL_GARDEN',
        level: 1,
        isUnlocked: true,
        grassDensity: 1.0,
        multiplier: 1.0,
      },
    ],
    upgrades: {},
    achievements: [],
    statistics: {
      totalEarned: '0',
      totalGrassMowed: '0',
      totalRobotsBought: 0,
      totalUpgrades: 0,
      totalPrestiges: 0,
      playTimeSeconds: 0,
    },
    lastTickAt: now,
  };
}

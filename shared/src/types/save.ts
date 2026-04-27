// Types decrivant le payload de sauvegarde transmis client <-> serveur.
import type { RobotInstance } from './robot.js';
import type { PlotInstance } from './plot.js';

/** Payload de save complet (compresse en LZ-string avant transit). */
export interface SavePayload {
  payloadVersion: number;
  /** Currencies sont serialisees en string pour franchir JSON sans perte BigInt. */
  cash: string;
  grass: string;
  gems: number;
  prestigePoints: string;
  prestigeMultiplier: number;
  robots: RobotInstance[];
  plots: PlotInstance[];
  upgrades: Record<string, number>;
  achievements: string[];
  statistics: {
    totalEarned: string;
    totalGrassMowed: string;
    totalRobotsBought: number;
    totalUpgrades: number;
    totalPrestiges: number;
    playTimeSeconds: number;
  };
  /** Timestamp serveur du dernier tick valide (ms epoch). */
  lastTickAt: number;
  /** Source d'autorisation pour gain de gems (achievement id, quest id, IAP receipt). */
  gemSourceProof?: string | undefined;
}

/** Reponse de l'endpoint GET /api/save. */
export interface LoadSaveResponse {
  payload: SavePayload;
  payloadVersion: number;
  lastSavedAt: string;
  serverTime: string;
}

/** Corps de l'endpoint POST /api/save. */
export interface SaveRequest {
  payload: SavePayload;
  payloadVersion: number;
  hmac: string;
}

export interface SaveResponse {
  saved: boolean;
  serverTime: string;
}

// Schemas Zod pour les routes de save.

import { z } from 'zod';
import { SAVE_PAYLOAD_VERSION } from '@robomow/shared';

const robotInstanceSchema = z.object({
  id: z.string(),
  type: z.enum([
    'HAND_SHEARS',
    'PUSH_MOWER',
    'GAS_MOWER',
    'ELECTRIC_MOWER',
    'ROBOMOW_V1',
    'NAVIBOT',
    'HELIOCUT',
    'MEGAMOWER',
    'AEROMOW',
    'NANOSWARM',
  ]),
  level: z.number().int().nonnegative(),
  speed: z.number().nonnegative(),
  efficiency: z.number().nonnegative(),
  battery: z.number().nonnegative(),
  assignedPlotId: z.string().nullable(),
  acquiredAt: z.string(),
});

const plotInstanceSchema = z.object({
  id: z.string(),
  type: z.enum([
    'RESIDENTIAL_GARDEN',
    'PAVILION_GARDEN',
    'SUBDIVISION',
    'MUNICIPAL_PARK',
    'CEMETERY',
    'GOLF_COURSE',
    'STADIUM',
    'HIPPODROME',
    'CITY',
    'MEGALOPOLIS',
  ]),
  level: z.number().int().nonnegative(),
  isUnlocked: z.boolean(),
  grassDensity: z.number().nonnegative(),
  multiplier: z.number().nonnegative(),
});

export const savePayloadSchema = z.object({
  payloadVersion: z.number().int().min(1).max(SAVE_PAYLOAD_VERSION),
  cash: z.string().regex(/^-?\d+(\.\d+)?(e[+-]?\d+)?$/i),
  grass: z.string().regex(/^-?\d+(\.\d+)?(e[+-]?\d+)?$/i),
  gems: z.number().int().nonnegative(),
  prestigePoints: z.string(),
  prestigeMultiplier: z.number().positive(),
  robots: z.array(robotInstanceSchema).max(100_000),
  plots: z.array(plotInstanceSchema).max(50),
  upgrades: z.record(z.string(), z.number().int().nonnegative()),
  achievements: z.array(z.string()),
  statistics: z.object({
    totalEarned: z.string(),
    totalGrassMowed: z.string(),
    totalRobotsBought: z.number().int().nonnegative(),
    totalUpgrades: z.number().int().nonnegative(),
    totalPrestiges: z.number().int().nonnegative(),
    playTimeSeconds: z.number().nonnegative(),
  }),
  lastTickAt: z.number(),
  gemSourceProof: z.string().optional(),
});

export const saveRequestSchema = z.object({
  payload: savePayloadSchema,
  payloadVersion: z.number().int().min(1).max(SAVE_PAYLOAD_VERSION),
  hmac: z.string(),
});

export type SaveRequestInput = z.infer<typeof saveRequestSchema>;

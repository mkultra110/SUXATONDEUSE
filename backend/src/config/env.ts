// Validation des variables d'environnement au demarrage.
// Si une variable critique manque ou est invalide, on echoue tot et bruyamment.

import { z } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().url(),

  // Secrets : longueurs minimales pour eviter les configs faibles en production.
  JWT_SECRET: z.string().min(32, 'JWT_SECRET doit faire au moins 32 caracteres'),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, 'JWT_REFRESH_SECRET doit faire au moins 32 caracteres'),
  SAVE_HMAC_SECRET: z
    .string()
    .min(64, 'SAVE_HMAC_SECRET doit faire au moins 64 caracteres'),

  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),

  // Cle partagee avec le bot Discord pour generer les invites (optionnelle en dev).
  DISCORD_BOT_API_KEY: z.string().min(16).optional(),
  // URL publique du frontend pour construire les invites (avec /play?invite=xxx).
  PUBLIC_GAME_URL: z.string().url().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Variables d\'environnement invalides :');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export type Env = typeof env;

export const isProd = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';

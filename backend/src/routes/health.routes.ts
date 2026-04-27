// Routes /api/health et /api/version.

import { Router } from 'express';
import { GAME_VERSION } from '@robomow/shared';
import { prisma } from '../config/prisma.js';
import { ok } from '../utils/api.js';

export const healthRouter = Router();

healthRouter.get('/health', async (_req, res) => {
  // Verifie la connectivite DB.
  let dbOk = false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch {
    dbOk = false;
  }

  const status = dbOk ? 'ok' : 'degraded';
  const httpStatus = dbOk ? 200 : 503;
  res.status(httpStatus).json({
    success: dbOk,
    data: {
      status,
      uptime: process.uptime(),
      db: dbOk,
      timestamp: new Date().toISOString(),
    },
  });
});

healthRouter.get('/version', (_req, res) => {
  ok(res, {
    api: '0.1.0',
    game: GAME_VERSION,
    node: process.version,
  });
});

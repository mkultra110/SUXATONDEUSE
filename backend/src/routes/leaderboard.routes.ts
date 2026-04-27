// Routes /api/leaderboard : top par categorie + rank perso.

import { Router } from 'express';
import { z } from 'zod';
import { LEADERBOARD_CATEGORIES } from '@robomow/shared';
import { requireAuth } from '../middleware/auth.middleware.js';
import { getMyRank, getTopLeaderboard } from '../services/leaderboard.service.js';
import { ok, AppError } from '../utils/api.js';

export const leaderboardRouter = Router();

const querySchema = z.object({
  category: z.enum(LEADERBOARD_CATEGORIES),
  limit: z.coerce.number().int().min(1).max(100).default(100),
});

leaderboardRouter.get('/', async (req, res, next) => {
  try {
    const parsed = querySchema.safeParse(req.query);
    if (!parsed.success) {
      throw new AppError('VALIDATION_ERROR', 'Parametres invalides.', 400);
    }
    const top = await getTopLeaderboard(parsed.data.category, parsed.data.limit);
    ok(res, top);
  } catch (err) {
    next(err);
  }
});

leaderboardRouter.get('/me', requireAuth, async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError('UNAUTHORIZED', 'Non auth.', 401);
    }
    const parsed = querySchema.safeParse(req.query);
    if (!parsed.success) {
      throw new AppError('VALIDATION_ERROR', 'Parametres invalides.', 400);
    }
    const result = await getMyRank(req.user.id, parsed.data.category);
    ok(res, result);
  } catch (err) {
    next(err);
  }
});

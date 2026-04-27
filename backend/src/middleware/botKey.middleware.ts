// Middleware qui verifie l'header X-Bot-Key contre DISCORD_BOT_API_KEY.
// Protege les endpoints destines uniquement au bot Discord.

import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env.js';
import { AppError } from '../utils/api.js';

export function requireBotKey(req: Request, _res: Response, next: NextFunction): void {
  if (!env.DISCORD_BOT_API_KEY) {
    next(new AppError('FORBIDDEN', 'API bot non configuree.', 403));
    return;
  }
  const key = req.headers['x-bot-key'];
  if (typeof key !== 'string' || key !== env.DISCORD_BOT_API_KEY) {
    next(new AppError('FORBIDDEN', 'Cle bot invalide.', 403));
    return;
  }
  next();
}

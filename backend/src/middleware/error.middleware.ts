// Middleware d'erreur final : capture toutes les erreurs (sync + async)
// et renvoie une reponse uniforme. Toujours en derniere position.

import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError, fail } from '../utils/api.js';
import { logger } from '../utils/logger.js';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
   
  _next: NextFunction,
): void {
  if (res.headersSent) return;

  if (err instanceof AppError) {
    logger.warn(
      { requestId: req.requestId, code: err.code, message: err.message },
      'AppError',
    );
    fail(res, err.code, err.message, err.status, err.details);
    return;
  }

  if (err instanceof ZodError) {
    logger.warn(
      { requestId: req.requestId, issues: err.issues },
      'Validation error',
    );
    fail(res, 'VALIDATION_ERROR', 'Donnees invalides.', 400, err.flatten());
    return;
  }

  // Erreur non geree : on logue et on retourne une 500 generique.
  logger.error({ requestId: req.requestId, err }, 'Erreur non geree');
  fail(res, 'INTERNAL_ERROR', 'Erreur serveur interne.', 500);
}

/** 404 final pour les routes inconnues. */
export function notFoundHandler(_req: Request, res: Response): void {
  fail(res, 'NOT_FOUND', 'Ressource introuvable.', 404);
}

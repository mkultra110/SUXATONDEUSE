// Middleware d'authentification : extrait et verifie l'access token JWT.
// Si valide, attache les claims a req.user. Sinon : 401.

import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/api.js';
import { verifyAccessToken } from '../utils/jwt.js';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      username: string;
      role: string;
    };
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    next(new AppError('UNAUTHORIZED', 'Token d\'acces manquant.', 401));
    return;
  }

  const token = header.slice('Bearer '.length).trim();
  try {
    const claims = verifyAccessToken(token);
    req.user = {
      id: claims.sub,
      username: claims.username,
      role: claims.role,
    };
    next();
  } catch {
    next(new AppError('UNAUTHORIZED', 'Token d\'acces invalide ou expire.', 401));
  }
}

/** Middleware optionnel : restreint aux roles donnes. */
export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('UNAUTHORIZED', 'Non authentifie.', 401));
      return;
    }
    if (!roles.includes(req.user.role)) {
      next(new AppError('FORBIDDEN', 'Acces interdit.', 403));
      return;
    }
    next();
  };
}

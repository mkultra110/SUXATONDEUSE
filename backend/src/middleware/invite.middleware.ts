// Middleware qui exige un cookie d'invite valide pour acceder a certaines
// routes (register, login). Si le cookie est absent ou expire, on renvoie
// un 403 avec un code clair que le frontend peut afficher.

import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/api.js';
import { INVITE_COOKIE, verifyInvite } from '../services/invite.service.js';

export function requireInvite(req: Request, _res: Response, next: NextFunction): void {
  const token = req.cookies?.[INVITE_COOKIE];
  if (!token) {
    next(
      new AppError(
        'FORBIDDEN',
        'Aucun lien d\'acces. Demande un lien sur Discord avec /suxa_tondeuse.',
        403,
      ),
    );
    return;
  }
  try {
    verifyInvite(token);
    next();
  } catch (err) {
    next(err);
  }
}

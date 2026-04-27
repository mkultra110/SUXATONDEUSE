// Attache un identifiant unique a chaque requete pour correler les logs.

import { v4 as uuidv4 } from 'uuid';
import type { NextFunction, Request, Response } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    requestId: string;
  }
}

export function requestId(req: Request, res: Response, next: NextFunction): void {
  const incoming = req.headers['x-request-id'];
  req.requestId = typeof incoming === 'string' ? incoming : uuidv4();
  res.setHeader('x-request-id', req.requestId);
  next();
}

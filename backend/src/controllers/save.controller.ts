// Controllers pour /api/save.

import type { NextFunction, Request, Response } from 'express';
import { loadSave, persistSave } from '../services/save.service.js';
import { ok } from '../utils/api.js';

export async function getSave(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Non auth.' },
      });
      return;
    }
    const data = await loadSave(req.user.id);
    ok(res, data);
  } catch (err) {
    next(err);
  }
}

export async function postSave(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Non auth.' },
      });
      return;
    }
    const { payload, payloadVersion, hmac } = req.body;
    const result = await persistSave(req.user.id, payload, payloadVersion, hmac);
    ok(res, result);
  } catch (err) {
    next(err);
  }
}

/** Beacon endpoint : best-effort, pas de validation stricte
 *  car le payload peut arriver tronque. On essaie d'enregistrer mais
 *  on repond toujours 204 pour ne pas bloquer le navigateur. */
export async function postSaveBeacon(
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> {
  res.status(204).send();
  // Tentative best-effort en arriere-plan, sans bloquer la reponse.
  void (async () => {
    try {
      if (!req.user) return;
      const { payload, hmac } = req.body ?? {};
      if (!payload) return;
      const { saveRequestSchema } = await import('../schemas/save.schemas.js');
      const parsed = saveRequestSchema.safeParse({
        payload,
        payloadVersion: payload.payloadVersion,
        hmac: hmac ?? '',
      });
      if (!parsed.success) return;
      await persistSave(
        req.user.id,
        parsed.data.payload,
        parsed.data.payloadVersion,
        parsed.data.hmac,
      );
    } catch {
      // Ignore : c'est best-effort.
    }
  })();
}

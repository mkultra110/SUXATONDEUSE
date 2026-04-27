// Controllers d'invite : issue (bot only), redeem (public), status (public).

import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { isProd } from '../config/env.js';
import {
  buildInviteUrl,
  INVITE_COOKIE,
  INVITE_COOKIE_TTL_SEC,
  issueInvite,
  verifyInvite,
} from '../services/invite.service.js';
import { ok } from '../utils/api.js';

const issueSchema = z.object({
  source: z.string().min(1).max(64),
});

const redeemSchema = z.object({
  token: z.string().min(10).max(2000),
});

const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: INVITE_COOKIE_TTL_SEC * 1000,
};

/** POST /api/auth/invite/issue (protege par X-Bot-Key) */
export function issue(req: Request, res: Response, next: NextFunction): void {
  try {
    const parsed = issueSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'source manquant.' },
      });
      return;
    }
    const result = issueInvite(parsed.data.source);
    const url = buildInviteUrl(result.token);
    ok(res, {
      url,
      token: result.token,
      expiresAt: result.expiresAt.toISOString(),
    });
  } catch (err) {
    next(err);
  }
}

/** POST /api/auth/invite/redeem (public, body { token }) */
export function redeem(req: Request, res: Response, next: NextFunction): void {
  try {
    const parsed = redeemSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'token invalide.' },
      });
      return;
    }
    const info = verifyInvite(parsed.data.token);
    res.cookie(INVITE_COOKIE, parsed.data.token, cookieOptions);
    ok(res, { expiresAt: info.expiresAt.toISOString() });
  } catch (err) {
    next(err);
  }
}

/** GET /api/auth/invite/status (public, lit le cookie) */
export function status(req: Request, res: Response, next: NextFunction): void {
  try {
    const token = req.cookies?.[INVITE_COOKIE];
    if (!token) {
      ok(res, { valid: false });
      return;
    }
    try {
      const info = verifyInvite(token);
      ok(res, { valid: true, expiresAt: info.expiresAt.toISOString() });
    } catch {
      ok(res, { valid: false });
    }
  } catch (err) {
    next(err);
  }
}

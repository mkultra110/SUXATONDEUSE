// Controllers HTTP : translation entre la couche Express et la couche service.

import type { Request, Response, NextFunction } from 'express';
import { isProd } from '../config/env.js';
import {
  getMe,
  loginUser,
  logoutUser,
  registerUser,
  rotateRefreshToken,
} from '../services/auth.service.js';
import { ok } from '../utils/api.js';
import { TOKEN_TTLS } from '../utils/jwt.js';

const REFRESH_COOKIE = 'rt';

// sameSite='lax' (au lieu de 'strict') pour que le cookie soit envoye
// lors du refresh silencieux (F5 sur la page) y compris quand le frontend
// est servi via un tunnel/sous-domaine different. 'strict' bloquait les
// reloads venant d'une navigation top-level cross-site (ex: lien Discord).
const refreshCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: 'lax' as const,
  path: '/api/auth',
  maxAge: TOKEN_TTLS.refreshSeconds * 1000,
};

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const ip = req.ip ?? '';
    const userAgent = req.headers['user-agent'] ?? '';
    const bundle = await registerUser(req.body, userAgent, ip);
    res.cookie(REFRESH_COOKIE, bundle.refreshToken, refreshCookieOptions);
    ok(res, { user: bundle.user, accessToken: bundle.accessToken }, 201);
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const ip = req.ip ?? '';
    const userAgent = req.headers['user-agent'] ?? '';
    const bundle = await loginUser(req.body, userAgent, ip);
    res.cookie(REFRESH_COOKIE, bundle.refreshToken, refreshCookieOptions);
    ok(res, { user: bundle.user, accessToken: bundle.accessToken });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const refreshToken = req.cookies?.[REFRESH_COOKIE];
    if (!refreshToken) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Aucun refresh token.' },
      });
      return;
    }
    const ip = req.ip ?? '';
    const userAgent = req.headers['user-agent'] ?? '';
    const bundle = await rotateRefreshToken(refreshToken, userAgent, ip);
    res.cookie(REFRESH_COOKIE, bundle.refreshToken, refreshCookieOptions);
    ok(res, { user: bundle.user, accessToken: bundle.accessToken });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const refreshToken = req.cookies?.[REFRESH_COOKIE];
    await logoutUser(refreshToken);
    res.clearCookie(REFRESH_COOKIE, { path: '/api/auth' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Non auth.' } });
      return;
    }
    const profile = await getMe(req.user.id);
    ok(res, profile);
  } catch (err) {
    next(err);
  }
}

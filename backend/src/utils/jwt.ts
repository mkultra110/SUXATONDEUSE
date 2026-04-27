// Helpers JWT : generation et verification des access et refresh tokens.

import jwt, { type SignOptions } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import type { AccessTokenPayload, RefreshTokenPayload } from '@robomow/shared';
import { env } from '../config/env.js';

const ACCESS_TOKEN_TTL_SEC = 15 * 60; // 15 minutes
const REFRESH_TOKEN_TTL_SEC = 30 * 24 * 60 * 60; // 30 jours

export interface AccessClaims {
  sub: string;
  username: string;
  role: string;
}

export function signAccessToken(claims: AccessClaims): string {
  const options: SignOptions = { expiresIn: ACCESS_TOKEN_TTL_SEC };
  return jwt.sign(claims, env.JWT_SECRET, options);
}

export function signRefreshToken(userId: string): { token: string; jti: string; expiresAt: Date } {
  const jti = uuidv4();
  const options: SignOptions = { expiresIn: REFRESH_TOKEN_TTL_SEC };
  const token = jwt.sign({ sub: userId, jti }, env.JWT_REFRESH_SECRET, options);
  return {
    token,
    jti,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_SEC * 1000),
  };
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
}

export const TOKEN_TTLS = {
  accessSeconds: ACCESS_TOKEN_TTL_SEC,
  refreshSeconds: REFRESH_TOKEN_TTL_SEC,
};

// Service d'invite : genere des liens valables 1h qui debloquent l'acces
// au jeu. L'utilisateur cree son propre compte (pseudo + password) une fois
// le lien valide, le bot Discord est juste le portier qui distribue les liens.

import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../utils/api.js';

const INVITE_TTL_SEC = 60 * 60; // 1 heure
const INVITE_SCOPE = 'game-invite';

interface InvitePayload {
  scope: typeof INVITE_SCOPE;
  /** Identifiant brut de la source qui a demande l'invite (Discord ID ou autre). */
  source: string;
  iat: number;
  exp: number;
}

/** Cree un token signe valable 1h pour acceder au jeu. */
export function issueInvite(source: string): { token: string; expiresAt: Date } {
  const claims = { scope: INVITE_SCOPE, source };
  const options: SignOptions = { expiresIn: INVITE_TTL_SEC };
  const token = jwt.sign(claims, env.JWT_SECRET, options);
  return {
    token,
    expiresAt: new Date(Date.now() + INVITE_TTL_SEC * 1000),
  };
}

/** Verifie un token d'invite et retourne sa date d'expiration. */
export function verifyInvite(token: string): { expiresAt: Date; source: string } {
  let payload: InvitePayload;
  try {
    payload = jwt.verify(token, env.JWT_SECRET) as InvitePayload;
  } catch {
    throw new AppError('UNAUTHORIZED', 'Lien expire ou invalide.', 401);
  }
  if (payload.scope !== INVITE_SCOPE) {
    throw new AppError('UNAUTHORIZED', 'Token de mauvais type.', 401);
  }
  return {
    expiresAt: new Date(payload.exp * 1000),
    source: payload.source,
  };
}

/** Construit l'URL a partager. */
export function buildInviteUrl(token: string): string {
  const base = env.PUBLIC_GAME_URL ?? env.FRONTEND_URL;
  const url = new URL(base);
  url.searchParams.set('invite', token);
  return url.toString();
}

export const INVITE_COOKIE = 'gameInvite';
export const INVITE_COOKIE_TTL_SEC = INVITE_TTL_SEC;

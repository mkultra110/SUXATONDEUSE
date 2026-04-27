import type { UserRole } from '../constants/index.js';

/** Profil utilisateur expose au client (jamais le hashedPassword). */
export interface PublicUser {
  id: string;
  username: string;
  role: UserRole;
  createdAt: string;
  emailVerified: boolean;
}

export interface RegisterRequest {
  username: string;
  password: string;
  /** Email optionnel pour la recuperation de mot de passe (peut etre ajoute plus tard). */
  email?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: PublicUser;
  accessToken: string;
}

/** Payload signe dans le JWT d'acces. */
export interface AccessTokenPayload {
  sub: string;
  username: string;
  role: UserRole;
  iat: number;
  exp: number;
}

/** Payload signe dans le refresh token. */
export interface RefreshTokenPayload {
  sub: string;
  jti: string;
  iat: number;
  exp: number;
}

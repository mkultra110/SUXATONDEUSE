// Service d'authentification : encapsule toute la logique metier hors HTTP.

import bcrypt from 'bcrypt';
import type { PublicUser, UserRole } from '@robomow/shared';
import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/api.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import type { LoginInput, RegisterInput } from '../schemas/auth.schemas.js';

const BCRYPT_ROUNDS = 12;

interface AuthBundle {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
  refreshExpiresAt: Date;
}

/** Cree un nouvel utilisateur, hash le mot de passe, retourne les tokens. */
export async function registerUser(
  input: RegisterInput,
  userAgent?: string,
  ipAddress?: string,
): Promise<AuthBundle> {
  // Conflit eventuel sur le pseudo (case-insensitive : on lower-case avant insert).
  const existing = await prisma.user.findFirst({
    where: { username: input.username },
    select: { id: true },
  });
  if (existing) {
    throw new AppError('CONFLICT', 'Ce pseudo est deja utilise.', 409);
  }

  const hashedPassword = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      username: input.username,
      hashedPassword,
      ...(input.email !== undefined ? { email: input.email } : {}),
    },
    select: {
      id: true,
      username: true,
      role: true,
      createdAt: true,
      emailVerified: true,
    },
  });

  return issueTokens(user, userAgent, ipAddress);
}

/** Verifie les identifiants et retourne un nouveau bundle de tokens. */
export async function loginUser(
  input: LoginInput,
  userAgent?: string,
  ipAddress?: string,
): Promise<AuthBundle> {
  const user = await prisma.user.findUnique({
    where: { username: input.username },
  });
  if (!user) {
    throw new AppError('UNAUTHORIZED', 'Identifiants invalides.', 401);
  }
  if (user.isBanned) {
    throw new AppError('FORBIDDEN', 'Compte suspendu.', 403);
  }

  const matches = await bcrypt.compare(input.password, user.hashedPassword);
  if (!matches) {
    throw new AppError('UNAUTHORIZED', 'Identifiants invalides.', 401);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  return issueTokens(
    {
      id: user.id,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
      emailVerified: user.emailVerified,
    },
    userAgent,
    ipAddress,
  );
}

/** Rotation : revoque l'ancien refresh token et en emet un nouveau. */
export async function rotateRefreshToken(
  refreshToken: string,
  userAgent?: string,
  ipAddress?: string,
): Promise<AuthBundle> {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError('UNAUTHORIZED', 'Refresh token invalide.', 401);
  }

  const stored = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });
  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    // Si on detecte une reutilisation d'un token revoque, on revoque toutes
    // les sessions de l'utilisateur (defense en profondeur).
    if (stored?.revokedAt) {
      await prisma.refreshToken.updateMany({
        where: { userId: stored.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
    throw new AppError('UNAUTHORIZED', 'Refresh token revoque ou expire.', 401);
  }

  // Revoque l'ancien.
  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revokedAt: new Date() },
  });

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: {
      id: true,
      username: true,
      role: true,
      createdAt: true,
      emailVerified: true,
      isBanned: true,
    },
  });
  if (!user || user.isBanned) {
    throw new AppError('UNAUTHORIZED', 'Utilisateur inactif.', 401);
  }

  return issueTokens(
    {
      id: user.id,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
      emailVerified: user.emailVerified,
    },
    userAgent,
    ipAddress,
  );
}

/** Revoque un refresh token (logout). */
export async function logoutUser(refreshToken: string | undefined): Promise<void> {
  if (!refreshToken) return;
  await prisma.refreshToken.updateMany({
    where: { token: refreshToken, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

/** Genere access + refresh, persiste le refresh en DB. */
async function issueTokens(
  user: {
    id: string;
    username: string;
    role: string;
    createdAt: Date;
    emailVerified: boolean;
  },
  userAgent?: string,
  ipAddress?: string,
): Promise<AuthBundle> {
  const accessToken = signAccessToken({
    sub: user.id,
    username: user.username,
    role: user.role,
  });

  const refresh = signRefreshToken(user.id);
  await prisma.refreshToken.create({
    data: {
      token: refresh.token,
      userId: user.id,
      expiresAt: refresh.expiresAt,
      ...(userAgent ? { userAgent } : {}),
      ...(ipAddress ? { ipAddress } : {}),
    },
  });

  const publicUser: PublicUser = {
    id: user.id,
    username: user.username,
    role: user.role as UserRole,
    createdAt: user.createdAt.toISOString(),
    emailVerified: user.emailVerified,
  };

  return {
    user: publicUser,
    accessToken,
    refreshToken: refresh.token,
    refreshExpiresAt: refresh.expiresAt,
  };
}

/** Recupere le profil public d'un utilisateur. */
export async function getMe(userId: string): Promise<PublicUser> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      role: true,
      createdAt: true,
      emailVerified: true,
    },
  });
  if (!user) {
    throw new AppError('NOT_FOUND', 'Utilisateur introuvable.', 404);
  }
  return {
    id: user.id,
    username: user.username,
    role: user.role as UserRole,
    createdAt: user.createdAt.toISOString(),
    emailVerified: user.emailVerified,
  };
}

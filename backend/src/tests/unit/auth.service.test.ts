// Tests unitaires de auth.service : register + login.
// Prisma et bcrypt sont mockes ; la signature JWT reste reelle (secrets de test).
import { beforeEach, describe, expect, it, vi } from 'vitest';

const p = vi.hoisted(() => ({
  userFindFirst: vi.fn(),
  userFindUnique: vi.fn(),
  userCreate: vi.fn(),
  userUpdate: vi.fn(),
  refreshCreate: vi.fn(),
  refreshFindUnique: vi.fn(),
  refreshUpdate: vi.fn(),
  refreshUpdateMany: vi.fn(),
}));

const b = vi.hoisted(() => ({
  hash: vi.fn(),
  compare: vi.fn(),
}));

vi.mock('../../config/prisma.js', () => ({
  prisma: {
    user: {
      findFirst: p.userFindFirst,
      findUnique: p.userFindUnique,
      create: p.userCreate,
      update: p.userUpdate,
    },
    refreshToken: {
      create: p.refreshCreate,
      findUnique: p.refreshFindUnique,
      update: p.refreshUpdate,
      updateMany: p.refreshUpdateMany,
    },
  },
}));

vi.mock('bcrypt', () => ({ default: { hash: b.hash, compare: b.compare } }));

import {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
  rotateRefreshToken,
} from '../../services/auth.service.js';
import { signRefreshToken } from '../../utils/jwt.js';
import { AppError } from '../../utils/api.js';

const baseUser = {
  id: 'u1',
  username: 'alice',
  role: 'PLAYER',
  createdAt: new Date('2026-01-01T00:00:00Z'),
  emailVerified: false,
};

beforeEach(() => {
  vi.clearAllMocks();
  b.hash.mockResolvedValue('hashed-pw');
  b.compare.mockResolvedValue(true);
  p.userCreate.mockResolvedValue(baseUser);
  p.userUpdate.mockResolvedValue(baseUser);
  p.refreshCreate.mockResolvedValue({});
  p.refreshUpdate.mockResolvedValue({});
  p.refreshUpdateMany.mockResolvedValue({ count: 1 });
});

describe('registerUser', () => {
  it('refuse un pseudo deja pris', async () => {
    p.userFindFirst.mockResolvedValue({ id: 'existing' });
    await expect(
      registerUser({ username: 'alice', password: 'password123' } as never),
    ).rejects.toMatchObject({ code: 'CONFLICT' });
    expect(p.userCreate).not.toHaveBeenCalled();
  });

  it('cree l utilisateur, hash le mot de passe et emet des tokens', async () => {
    p.userFindFirst.mockResolvedValue(null);
    const bundle = await registerUser({
      username: 'alice',
      password: 'password123',
    } as never);

    expect(b.hash).toHaveBeenCalledWith('password123', 12);
    expect(p.userCreate).toHaveBeenCalledTimes(1);
    expect(bundle.user.username).toBe('alice');
    expect(typeof bundle.accessToken).toBe('string');
    expect(bundle.accessToken.length).toBeGreaterThan(0);
    expect(typeof bundle.refreshToken).toBe('string');
    expect(p.refreshCreate).toHaveBeenCalledTimes(1);
  });
});

describe('loginUser', () => {
  it('rejette un utilisateur inconnu', async () => {
    p.userFindUnique.mockResolvedValue(null);
    await expect(loginUser({ username: 'ghost', password: 'x' } as never)).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it('rejette un compte banni avant meme de comparer le mot de passe', async () => {
    p.userFindUnique.mockResolvedValue({
      ...baseUser,
      isBanned: true,
      hashedPassword: 'hashed-pw',
    });
    await expect(
      loginUser({ username: 'alice', password: 'password123' } as never),
    ).rejects.toMatchObject({ code: 'FORBIDDEN' });
    expect(b.compare).not.toHaveBeenCalled();
  });

  it('rejette un mot de passe incorrect', async () => {
    p.userFindUnique.mockResolvedValue({
      ...baseUser,
      isBanned: false,
      hashedPassword: 'hashed-pw',
    });
    b.compare.mockResolvedValue(false);
    await expect(
      loginUser({ username: 'alice', password: 'wrong' } as never),
    ).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
    expect(p.userUpdate).not.toHaveBeenCalled();
  });

  it('connecte un utilisateur valide et met a jour lastLogin', async () => {
    p.userFindUnique.mockResolvedValue({
      ...baseUser,
      isBanned: false,
      hashedPassword: 'hashed-pw',
    });
    const bundle = await loginUser({
      username: 'alice',
      password: 'password123',
    } as never);

    expect(p.userUpdate).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 'u1' } }));
    expect(bundle.user.username).toBe('alice');
    expect(bundle.accessToken.length).toBeGreaterThan(0);
  });
});

describe('getMe', () => {
  it('renvoie le profil public', async () => {
    p.userFindUnique.mockResolvedValue(baseUser);
    const me = await getMe('u1');
    expect(me).toMatchObject({ id: 'u1', username: 'alice', role: 'PLAYER' });
    expect(me.createdAt).toBe(baseUser.createdAt.toISOString());
  });

  it('throw NOT_FOUND si l utilisateur n existe pas', async () => {
    p.userFindUnique.mockResolvedValue(null);
    await expect(getMe('ghost')).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });
});

describe('logoutUser', () => {
  it('ne fait rien sans token', async () => {
    await logoutUser(undefined);
    expect(p.refreshUpdateMany).not.toHaveBeenCalled();
  });

  it('revoque le token fourni', async () => {
    await logoutUser('refresh-xyz');
    expect(p.refreshUpdateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { token: 'refresh-xyz', revokedAt: null },
      }),
    );
  });
});

describe('rotateRefreshToken', () => {
  it('rejette un refresh token illisible', async () => {
    await expect(rotateRefreshToken('garbage')).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
    });
  });

  it('rejette un token absent en base', async () => {
    const { token } = signRefreshToken('u1');
    p.refreshFindUnique.mockResolvedValue(null);
    await expect(rotateRefreshToken(token)).rejects.toBeInstanceOf(AppError);
  });

  it('fait tourner un token valide et en emet un nouveau', async () => {
    const { token } = signRefreshToken('u1');
    p.refreshFindUnique.mockResolvedValue({
      id: 'rt1',
      userId: 'u1',
      token,
      revokedAt: null,
      expiresAt: new Date(Date.now() + 86_400_000),
    });
    p.userFindUnique.mockResolvedValue({ ...baseUser, isBanned: false });

    const bundle = await rotateRefreshToken(token);

    expect(p.refreshUpdate).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 'rt1' } }));
    expect(bundle.accessToken.length).toBeGreaterThan(0);
    expect(typeof bundle.refreshToken).toBe('string');
    expect(p.refreshCreate).toHaveBeenCalledTimes(1);
  });
});

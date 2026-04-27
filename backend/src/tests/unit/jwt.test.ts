import { describe, expect, it } from 'vitest';
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '../../utils/jwt.js';

describe('jwt utils', () => {
  it('signe et verifie un access token', () => {
    const token = signAccessToken({ sub: 'u1', username: 'alice', role: 'PLAYER' });
    const claims = verifyAccessToken(token);
    expect(claims.sub).toBe('u1');
    expect(claims.username).toBe('alice');
    expect(claims.role).toBe('PLAYER');
  });

  it('signe et verifie un refresh token avec jti unique', () => {
    const r1 = signRefreshToken('u1');
    const r2 = signRefreshToken('u1');
    expect(r1.jti).not.toBe(r2.jti);

    const claims = verifyRefreshToken(r1.token);
    expect(claims.sub).toBe('u1');
    expect(claims.jti).toBe(r1.jti);
  });

  it('rejette un access token altere', () => {
    const token = signAccessToken({ sub: 'u1', username: 'alice', role: 'PLAYER' });
    const tampered = token.slice(0, -2) + 'xx';
    expect(() => verifyAccessToken(tampered)).toThrow();
  });

  it('rejette un refresh token avec mauvais secret (signe par access secret)', () => {
    const accessToken = signAccessToken({ sub: 'u1', username: 'a', role: 'PLAYER' });
    expect(() => verifyRefreshToken(accessToken)).toThrow();
  });
});

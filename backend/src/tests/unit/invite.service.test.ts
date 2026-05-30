// Tests unitaires du service d'invite (JWT pur, pas de DB).
import { describe, expect, it } from 'vitest';
import jwt from 'jsonwebtoken';
import { issueInvite, verifyInvite, buildInviteUrl } from '../../services/invite.service.js';
import { AppError } from '../../utils/api.js';

describe('issueInvite / verifyInvite', () => {
  it('emet un token valable ~1h et le verifie en aller-retour', () => {
    const { token, expiresAt } = issueInvite('discord-123');
    expect(typeof token).toBe('string');
    const deltaMs = expiresAt.getTime() - Date.now();
    // ~1h, on tolere une marge large pour eviter la fragilite temporelle.
    expect(deltaMs).toBeGreaterThan(59 * 60 * 1000);
    expect(deltaMs).toBeLessThanOrEqual(60 * 60 * 1000 + 1000);

    const verified = verifyInvite(token);
    expect(verified.source).toBe('discord-123');
    expect(verified.expiresAt.getTime()).toBeGreaterThan(Date.now());
  });

  it('rejette un token illisible', () => {
    expect(() => verifyInvite('not-a-jwt')).toThrow(AppError);
  });

  it('rejette un token au mauvais scope', () => {
    const wrong = jwt.sign(
      { scope: 'something-else', source: 'x' },
      process.env.JWT_SECRET as string,
      { expiresIn: 3600 },
    );
    expect(() => verifyInvite(wrong)).toThrow(/mauvais type/i);
  });
});

describe('buildInviteUrl', () => {
  it('ajoute le token en parametre invite', () => {
    const url = buildInviteUrl('abc.def.ghi');
    expect(url).toContain('invite=abc.def.ghi');
    // Doit rester une URL valide.
    expect(() => new URL(url)).not.toThrow();
  });
});

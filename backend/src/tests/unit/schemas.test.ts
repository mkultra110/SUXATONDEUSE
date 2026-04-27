import { describe, expect, it } from 'vitest';
import { loginSchema, registerSchema } from '../../schemas/auth.schemas.js';

describe('registerSchema', () => {
  it('accepte un username + password valides', () => {
    const result = registerSchema.safeParse({ username: 'alice', password: 'password123' });
    expect(result.success).toBe(true);
  });

  it('rejette un username trop court', () => {
    const result = registerSchema.safeParse({ username: 'ab', password: 'password123' });
    expect(result.success).toBe(false);
  });

  it('rejette un username avec caracteres invalides', () => {
    const result = registerSchema.safeParse({
      username: 'alice@home',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('rejette un mot de passe trop court', () => {
    const result = registerSchema.safeParse({ username: 'alice', password: 'short' });
    expect(result.success).toBe(false);
  });

  it('accepte les caracteres _ et - dans le username', () => {
    expect(registerSchema.safeParse({ username: 'alice_99', password: '12345678' }).success).toBe(
      true,
    );
    expect(registerSchema.safeParse({ username: 'a-b-c', password: '12345678' }).success).toBe(
      true,
    );
  });

  it('accepte un email optionnel', () => {
    expect(
      registerSchema.safeParse({
        username: 'alice',
        password: '12345678',
        email: 'alice@example.com',
      }).success,
    ).toBe(true);
  });

  it('rejette un email invalide', () => {
    expect(
      registerSchema.safeParse({
        username: 'alice',
        password: '12345678',
        email: 'pas-un-email',
      }).success,
    ).toBe(false);
  });
});

describe('loginSchema', () => {
  it('accepte un username + password non vide', () => {
    expect(loginSchema.safeParse({ username: 'alice', password: 'x' }).success).toBe(true);
  });

  it('rejette un password vide', () => {
    expect(loginSchema.safeParse({ username: 'alice', password: '' }).success).toBe(false);
  });
});

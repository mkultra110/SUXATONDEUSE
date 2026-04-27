import { describe, expect, it } from 'vitest';
import { computeHmac, verifyHmac } from '../../utils/hmac.js';

describe('hmac', () => {
  it('produit le meme hmac pour le meme payload + userId', () => {
    const payload = { cash: 100n, gems: 5 };
    const a = computeHmac(payload, 'u1');
    const b = computeHmac(payload, 'u1');
    expect(a).toBe(b);
  });

  it('produit un hmac different pour un userId different', () => {
    const payload = { cash: 100n };
    expect(computeHmac(payload, 'u1')).not.toBe(computeHmac(payload, 'u2'));
  });

  it('produit un hmac different pour un payload modifie', () => {
    expect(computeHmac({ cash: 100n }, 'u1')).not.toBe(computeHmac({ cash: 101n }, 'u1'));
  });

  it('verifyHmac accepte un hmac valide', () => {
    const payload = { cash: 100n, foo: 'bar' };
    const hmac = computeHmac(payload, 'u1');
    expect(verifyHmac(payload, 'u1', hmac)).toBe(true);
  });

  it('verifyHmac rejette un hmac altere', () => {
    const payload = { cash: 100n };
    const hmac = computeHmac(payload, 'u1');
    const tampered = hmac.slice(0, -2) + (hmac.endsWith('a') ? 'bb' : 'aa');
    expect(verifyHmac(payload, 'u1', tampered)).toBe(false);
  });

  it('verifyHmac rejette un hmac de longueur differente', () => {
    expect(verifyHmac({ cash: 100n }, 'u1', 'tooshort')).toBe(false);
  });
});

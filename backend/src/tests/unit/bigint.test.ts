import { afterAll, describe, expect, it } from 'vitest';
import {
  bigIntReplacer,
  installBigIntJsonPatch,
  parseBigInt,
  toBigIntFromString,
} from '../../utils/bigint.js';

describe('toBigIntFromString', () => {
  it('parse une string entiere', () => {
    expect(toBigIntFromString('42')).toBe(42n);
    expect(toBigIntFromString('123456789012345678901234567890')).toBe(
      123456789012345678901234567890n,
    );
  });

  it('tronque la partie decimale', () => {
    expect(toBigIntFromString('100.99')).toBe(100n);
    expect(toBigIntFromString('0.5')).toBe(0n);
  });

  it('gere la notation scientifique', () => {
    expect(toBigIntFromString('1e3')).toBe(1000n);
    expect(toBigIntFromString('1.5E2')).toBe(150n);
  });

  it('gere zero et les grands entiers sans perte', () => {
    expect(toBigIntFromString('0')).toBe(0n);
  });
});

describe('bigIntReplacer', () => {
  it('serialise un bigint en string', () => {
    expect(bigIntReplacer('cash', 100n)).toBe('100');
  });

  it('passe les autres valeurs telles quelles', () => {
    expect(bigIntReplacer('gems', 5)).toBe(5);
    expect(bigIntReplacer('foo', 'bar')).toBe('bar');
    expect(bigIntReplacer('nope', null)).toBeNull();
  });
});

describe('parseBigInt', () => {
  it('passe un bigint inchange', () => {
    expect(parseBigInt(42n)).toBe(42n);
  });

  it('parse un nombre en bigint', () => {
    expect(parseBigInt(42)).toBe(42n);
  });

  it('parse une string numerique en bigint', () => {
    expect(parseBigInt('123456789012345678901234567890')).toBe(123456789012345678901234567890n);
  });

  it('throw sur une string invalide', () => {
    expect(() => parseBigInt('abc')).toThrow();
  });
});

describe('installBigIntJsonPatch', () => {
  installBigIntJsonPatch();

  it('permet a JSON.stringify d encoder les bigint apres patch', () => {
    expect(JSON.stringify({ cash: 42n })).toBe('{"cash":"42"}');
  });

  afterAll(() => {
    // Nettoyage : on retire la patch pour ne pas polluer d'autres tests.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (BigInt.prototype as any).toJSON;
  });
});

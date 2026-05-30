// Tests du formatage compact des grands nombres (HUD currencies).
import { describe, expect, it } from 'vitest';
import { formatBig, formatRate } from '../utils/format.js';

describe('formatBig', () => {
  it('affiche les petits nombres (<10 000) sans suffixe', () => {
    expect(formatBig(0)).toBe('0');
    expect(formatBig(999)).toBe('999');
    expect(formatBig(42)).toBe('42');
  });

  it('utilise les suffixes K/M/B selon le palier', () => {
    expect(formatBig(2_630_000)).toBe('2,63M');
    expect(formatBig(1.5e9)).toBe('1,50B');
    expect(formatBig(81_184)).toBe('81,2K');
  });

  it('ajuste le nombre de decimales selon la magnitude du mantisse', () => {
    // mantisse <10 -> 2 decimales, <100 -> 1, sinon 0
    expect(formatBig(9_999_999)).toBe('10,00M');
    expect(formatBig(123_000)).toBe('123K');
  });

  it('passe en AA-notation au-dela du decillion (1e36+)', () => {
    expect(formatBig(1e36)).toBe('1,00AA');
  });

  it('accepte bigint, string et renvoie ∞ pour les non-finis', () => {
    expect(formatBig(2_630_000n)).toBe('2,63M');
    expect(formatBig('2630000')).toBe('2,63M');
    expect(formatBig(Infinity)).toBe('∞');
    expect(formatBig(Number.NaN)).toBe('∞');
  });
});

describe('formatRate', () => {
  it('renvoie une chaine vide pour un taux nul', () => {
    expect(formatRate(0)).toBe('');
  });

  it('prefixe les gains positifs et suffixe /s', () => {
    expect(formatRate(100)).toBe('+100/s');
    expect(formatRate(2_630_000)).toBe('+2,63M/s');
  });

  it('garde le signe negatif sans double prefixe', () => {
    expect(formatRate(-2_630_000)).toBe('-2,63M/s');
  });
});

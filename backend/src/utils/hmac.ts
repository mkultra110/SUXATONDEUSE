// HMAC SHA-256 sur les saves (anti-cheat).
// Le client signe son payload avec la cle partagee, le serveur recalcule
// pour verifier qu'aucun champ n'a ete altere.

import crypto from 'node:crypto';
import { env } from '../config/env.js';
import { bigIntReplacer } from './bigint.js';

/** Calcule l'HMAC d'un payload pour un userId donne. */
export function computeHmac(payload: unknown, userId: string): string {
  const serialized = JSON.stringify(payload, bigIntReplacer);
  return crypto
    .createHmac('sha256', env.SAVE_HMAC_SECRET)
    .update(`${userId}.${serialized}`)
    .digest('hex');
}

/** Compare deux HMAC en temps constant (anti timing-attack). */
export function verifyHmac(payload: unknown, userId: string, expected: string): boolean {
  const computed = computeHmac(payload, userId);
  // timingSafeEqual exige des Buffers de meme longueur
  if (computed.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(computed, 'hex'), Buffer.from(expected, 'hex'));
}

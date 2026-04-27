// Service de sauvegarde : load, persist, audit.

import type { LoadSaveResponse, SavePayload } from '@robomow/shared';
import { migrateSave } from '@robomow/shared';
import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/api.js';
import { computeHmac } from '../utils/hmac.js';
import { validateSave } from './anticheat.service.js';

/** Convertit une string serialisant un BigInt en bigint (tronque decimales). */
function toBigInt(s: string): bigint {
  if (s.includes('e') || s.includes('E')) return BigInt(Math.trunc(Number(s)));
  const dot = s.indexOf('.');
  return BigInt(dot === -1 ? s : s.slice(0, dot));
}

/** Charge le save complet d'un utilisateur. Si aucun, renvoie 404. */
export async function loadSave(userId: string): Promise<LoadSaveResponse> {
  const save = await prisma.gameSave.findUnique({ where: { userId } });
  if (!save) {
    throw new AppError('NOT_FOUND', 'Aucune sauvegarde.', 404);
  }
  // Migration eventuelle au load (si schema evolue cote shared)
  const payload = migrateSave(save.payload as Record<string, unknown>) as unknown as SavePayload;
  return {
    payload,
    payloadVersion: save.payloadVersion,
    lastSavedAt: save.lastSavedAt.toISOString(),
    serverTime: new Date().toISOString(),
  };
}

/**
 * Persiste un save apres validation anti-cheat.
 * - Soft-flag : on incremente suspicionScore mais on accepte la donnee
 *   sauf si une issue 'high' empeche.
 */
export async function persistSave(
  userId: string,
  incoming: SavePayload,
  payloadVersion: number,
  hmac: string,
): Promise<{ saved: boolean; serverTime: string }> {
  const now = new Date();
  const prev = await prisma.gameSave.findUnique({ where: { userId } });

  const validation = validateSave(prev, incoming, now);

  // Audit log si suspicion non nulle
  if (validation.issues.length > 0) {
    await prisma.saveAuditLog.create({
      data: {
        userId,
        reason: validation.issues.map((i) => i.reason).join(','),
        delta: { issues: validation.issues } as never,
        rejected: !validation.ok,
      },
    });
  }

  if (!validation.ok) {
    throw new AppError(
      'ANTI_CHEAT_REJECTION',
      'Sauvegarde refusee par l\'anti-cheat.',
      422,
      { issues: validation.issues },
    );
  }

  const cashBigInt = toBigInt(incoming.cash);
  const prestigeBigInt = toBigInt(incoming.prestigePoints);

  await prisma.gameSave.upsert({
    where: { userId },
    create: {
      userId,
      cash: cashBigInt,
      gems: incoming.gems,
      prestigePoints: prestigeBigInt,
      payload: incoming as never,
      payloadVersion,
      payloadHmac: hmac || computeHmac(incoming, userId),
      compressed: false,
      lastSavedAt: now,
      lastTickAt: new Date(incoming.lastTickAt),
      saveCount: 1,
      suspicionScore: validation.suspicionDelta,
    },
    update: {
      cash: cashBigInt,
      gems: incoming.gems,
      prestigePoints: prestigeBigInt,
      payload: incoming as never,
      payloadVersion,
      payloadHmac: hmac || computeHmac(incoming, userId),
      lastSavedAt: now,
      lastTickAt: new Date(incoming.lastTickAt),
      saveCount: { increment: 1 },
      suspicionScore: { increment: validation.suspicionDelta },
    },
  });

  return { saved: true, serverTime: now.toISOString() };
}

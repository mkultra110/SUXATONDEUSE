// Service anti-cheat (cf. GDD section 8.5).
// Strategie : soft-flag avec suspicionScore, jamais ban automatique.

import type { GameSave } from '@prisma/client';
import type { SavePayload } from '@robomow/shared';
import { toBigIntFromString } from '../utils/bigint.js';

/** Plafond de gain par seconde (BigInt). Tres genereux pour ne pas
 *  flag les boosts legitimes. */
const MAX_GAIN_PER_SEC = 10n ** 15n;
const MAX_OFFLINE_HOURS = 24;
const TIME_TOLERANCE_MS = 5_000;

export interface ValidationIssue {
  reason: string;
  severity: 'low' | 'medium' | 'high';
  details?: Record<string, unknown>;
}

export interface ValidationResult {
  ok: boolean;
  issues: ValidationIssue[];
  suspicionDelta: number;
}

const SCORE_BY_SEVERITY: Record<ValidationIssue['severity'], number> = {
  low: 5,
  medium: 20,
  high: 60,
};

/**
 * Valide la coherence d'un save reçu par rapport a celui en DB.
 * Si prev est null (premier save), on accepte largement mais on plafonne.
 */
export function validateSave(
  prev: GameSave | null,
  incoming: SavePayload,
  now: Date,
): ValidationResult {
  const issues: ValidationIssue[] = [];

  if (!prev) {
    // Premier save : on accepte mais on flag les valeurs initiales improbables.
    if (toBigIntFromString(incoming.cash) > 1_000_000n) {
      issues.push({
        reason: 'first_save_high_cash',
        severity: 'medium',
        details: { cash: incoming.cash },
      });
    }
  } else {
    // Detection voyage temporel
    const elapsedMs = now.getTime() - prev.lastTickAt.getTime();
    if (elapsedMs < -TIME_TOLERANCE_MS) {
      issues.push({
        reason: 'time_travel_backward',
        severity: 'high',
        details: { elapsedMs },
      });
    }
    if (elapsedMs > MAX_OFFLINE_HOURS * 3_600_000 + 60_000) {
      issues.push({
        reason: 'time_travel_forward',
        severity: 'medium',
        details: { elapsedMs, maxHours: MAX_OFFLINE_HOURS },
      });
    }

    // Detection gain impossible : on tolere 10 % au-dela du theorique.
    const elapsedSec = Math.max(0, elapsedMs / 1000);
    const incomingCash = toBigIntFromString(incoming.cash);
    const cashDelta = incomingCash - prev.cash;
    const maxPossibleGain =
      BigInt(Math.floor(elapsedSec)) * MAX_GAIN_PER_SEC;
    if (cashDelta > (maxPossibleGain * 110n) / 100n) {
      issues.push({
        reason: 'impossible_gain',
        severity: 'high',
        details: {
          cashDelta: cashDelta.toString(),
          elapsedSec,
        },
      });
    }

    // Conservation des gemmes premium (jamais gagnees sans preuve).
    const gemDelta = incoming.gems - prev.gems;
    if (gemDelta > 0 && !incoming.gemSourceProof) {
      issues.push({
        reason: 'unjustified_gems',
        severity: 'medium',
        details: { gemDelta },
      });
    }
  }

  // Coherence interne du payload
  if (toBigIntFromString(incoming.cash) < 0n) {
    issues.push({ reason: 'negative_cash', severity: 'medium' });
  }
  if (incoming.gems < 0) {
    issues.push({ reason: 'negative_gems', severity: 'medium' });
  }

  const suspicionDelta = issues.reduce(
    (acc, issue) => acc + SCORE_BY_SEVERITY[issue.severity],
    0,
  );
  const ok = issues.every((i) => i.severity !== 'high');

  return { ok, issues, suspicionDelta };
}

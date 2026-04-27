// Migrations de save versionnees, appliquees cote serveur au load.
// Cf. GDD section 8.6.

import { SAVE_PAYLOAD_VERSION } from '../constants/index.js';

type AnySave = Record<string, unknown>;
type Migration = (s: AnySave) => AnySave;

/**
 * Migrations idempotentes appliquees une fois.
 * Ajouter une entree N => fn pour faire passer le save de v(N-1) a vN.
 */
export const migrations: Record<number, Migration> = {
  1: (s) => ({ ...s, payloadVersion: 1 }),
};

/**
 * Migre un payload jusqu'a la version courante.
 * Idempotent : si payload est deja a jour, le retourne tel quel.
 */
export function migrateSave(payload: AnySave): AnySave {
  let current = payload;
  let version = (current.payloadVersion as number | undefined) ?? 0;

  while (version < SAVE_PAYLOAD_VERSION) {
    const next = version + 1;
    const fn = migrations[next];
    if (!fn) break;
    current = fn(current);
    version = next;
    current.payloadVersion = version;
  }

  return current;
}

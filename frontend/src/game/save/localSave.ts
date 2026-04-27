// Sauvegarde locale rapide via IndexedDB (cf. GDD section 8.6).
// Strategie : ecriture toutes les 5-10 s, puis sync serveur 30 s.

import type { SavePayload } from '@robomow/shared';
import { compressToUTF16, decompressFromUTF16 } from 'lz-string';

const DB_NAME = 'robomow';
const STORE = 'saves';
const KEY = 'current';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveLocal(payload: SavePayload): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    const compressed = compressToUTF16(JSON.stringify(payload));
    store.put(compressed, KEY);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

export async function loadLocal(): Promise<SavePayload | null> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).get(KEY);
    req.onsuccess = () => {
      db.close();
      const compressed = req.result as string | undefined;
      if (!compressed) {
        resolve(null);
        return;
      }
      try {
        const json = decompressFromUTF16(compressed);
        if (!json) {
          resolve(null);
          return;
        }
        resolve(JSON.parse(json) as SavePayload);
      } catch {
        resolve(null);
      }
    };
    req.onerror = () => {
      db.close();
      reject(req.error);
    };
  });
}

export async function clearLocal(): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(KEY);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

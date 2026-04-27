// Endpoints API de sauvegarde.

import type { ApiSuccess, LoadSaveResponse, SavePayload, SaveResponse } from '@robomow/shared';
import { apiClient } from './client.js';

export async function apiLoadSave(): Promise<LoadSaveResponse | null> {
  try {
    const { data } = await apiClient.get<ApiSuccess<LoadSaveResponse>>('/save');
    return data.data;
  } catch (err: unknown) {
    if ((err as { response?: { status?: number } })?.response?.status === 404) return null;
    throw err;
  }
}

export async function apiSaveGame(input: {
  payload: SavePayload;
  payloadVersion: number;
  hmac: string;
}): Promise<SaveResponse> {
  const { data } = await apiClient.post<ApiSuccess<SaveResponse>>('/save', input);
  return data.data;
}

/** Beacon a l'unload : sendBeacon best-effort, peut etre perdu. */
export function apiSaveBeacon(payload: { payload: SavePayload; hmac: string }): void {
  if (!navigator.sendBeacon) return;
  const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
  const url = `${apiClient.defaults.baseURL ?? '/api'}/save/beacon`;
  navigator.sendBeacon(url, blob);
}

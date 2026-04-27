// Appels API pour les invites du jeu.

import type { ApiSuccess } from '@robomow/shared';
import { apiClient } from './client.js';

interface InviteStatus {
  valid: boolean;
  expiresAt?: string;
}

/** Echange un token d'invite contre un cookie httpOnly. */
export async function apiRedeemInvite(token: string): Promise<{ expiresAt: string }> {
  const { data } = await apiClient.post<ApiSuccess<{ expiresAt: string }>>(
    '/auth/invite/redeem',
    { token },
  );
  return data.data;
}

/** Verifie si un cookie d'invite valide est present. */
export async function apiInviteStatus(): Promise<InviteStatus> {
  const { data } = await apiClient.get<ApiSuccess<InviteStatus>>('/auth/invite/status');
  return data.data;
}

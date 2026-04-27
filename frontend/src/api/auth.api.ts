// Endpoints d'authentification typés.

import type { ApiSuccess, AuthResponse, PublicUser } from '@robomow/shared';
import { apiClient } from './client.js';

export async function apiRegister(input: {
  username: string;
  password: string;
}): Promise<AuthResponse> {
  const { data } = await apiClient.post<ApiSuccess<AuthResponse>>('/auth/register', input);
  return data.data;
}

export async function apiLogin(input: {
  username: string;
  password: string;
}): Promise<AuthResponse> {
  const { data } = await apiClient.post<ApiSuccess<AuthResponse>>('/auth/login', input);
  return data.data;
}

export async function apiLogout(): Promise<void> {
  await apiClient.post('/auth/logout');
}

export async function apiMe(): Promise<PublicUser> {
  const { data } = await apiClient.get<ApiSuccess<PublicUser>>('/auth/me');
  return data.data;
}

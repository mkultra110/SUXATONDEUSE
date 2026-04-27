// Store Zustand pour l'authentification.
// L'access token reste en memoire uniquement (jamais en localStorage)
// pour limiter la surface d'attaque XSS. Le refresh token est en cookie httpOnly.

import { create } from 'zustand';
import type { PublicUser } from '@robomow/shared';

interface AuthState {
  user: PublicUser | null;
  accessToken: string | null;
  isInitialized: boolean;
  setAuth: (user: PublicUser, accessToken: string) => void;
  clear: () => void;
  setInitialized: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isInitialized: false,
  setAuth: (user, accessToken) => set({ user, accessToken }),
  clear: () => set({ user: null, accessToken: null }),
  setInitialized: () => set({ isInitialized: true }),
}));

// Hook composite : initialisation auth au boot + actions login/logout/register.

import { useEffect } from 'react';
import { apiLogin, apiLogout, apiMe, apiRegister } from '../api/auth.api.js';
import { apiClient } from '../api/client.js';
import { useAuthStore } from '../stores/authStore.js';

export function useAuthBootstrap(): void {
  const setAuth = useAuthStore((s) => s.setAuth);
  const setInitialized = useAuthStore((s) => s.setInitialized);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  useEffect(() => {
    if (isInitialized) return;
    let cancelled = false;
    void (async () => {
      try {
        // Tentative de refresh silencieux : si le cookie est valide,
        // on recupere un access token sans saisie utilisateur.
        const { data } = await apiClient.post('/auth/refresh');
        if (!cancelled && data?.success && data.data?.accessToken) {
          setAuth(data.data.user, data.data.accessToken);
        }
      } catch {
        // Pas de session : on reste deconnecte.
      } finally {
        if (!cancelled) setInitialized();
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isInitialized, setAuth, setInitialized]);
}

export function useAuth() {
  const { user, accessToken, setAuth, clear } = useAuthStore();

  return {
    user,
    isAuthenticated: !!accessToken,
    login: async (username: string, password: string) => {
      const bundle = await apiLogin({ username, password });
      setAuth(bundle.user, bundle.accessToken);
    },
    register: async (username: string, password: string) => {
      const bundle = await apiRegister({ username, password });
      setAuth(bundle.user, bundle.accessToken);
    },
    logout: async () => {
      await apiLogout();
      clear();
    },
    refreshMe: async () => {
      const me = await apiMe();
      const token = useAuthStore.getState().accessToken;
      if (token) setAuth(me, token);
    },
  };
}

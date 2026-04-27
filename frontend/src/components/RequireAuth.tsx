// Garde de route : redirige vers /auth si l'utilisateur n'est pas connecte.

import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore.js';

interface Props {
  children: ReactNode;
}

export function RequireAuth({ children }: Props) {
  const { t } = useTranslation();
  const { user, accessToken, isInitialized } = useAuthStore();

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-grass-deep text-panel-base">
        {t('common.loading')}
      </div>
    );
  }

  if (!user || !accessToken) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

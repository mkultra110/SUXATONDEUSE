// Definit le routage et lance le bootstrap auth + invite au montage.
// Le gate d'invite (lien Discord 1h) protege l'acces aux pages de jeu.

import { Navigate, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthPage } from './pages/AuthPage.js';
import { GamePage } from './pages/GamePage.js';
import { InviteGatePage } from './pages/InviteGatePage.js';
import { RequireAuth } from './components/RequireAuth.js';
import { useAuthBootstrap } from './hooks/useAuth.js';
import { useInviteBootstrap } from './hooks/useInviteBootstrap.js';

export function App() {
  const { t } = useTranslation();
  const invite = useInviteBootstrap();
  useAuthBootstrap();

  if (invite.isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-grass-deep text-panel-base">
        {t('common.loading')}
      </div>
    );
  }

  if (!invite.isValid) {
    return (
      <InviteGatePage
        message={
          invite.errorMessage ??
          'Demande un lien d\'acces sur Discord avec /suxa_tondeuse.'
        }
      />
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/play" replace />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/play"
        element={
          <RequireAuth>
            <GamePage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/play" replace />} />
    </Routes>
  );
}

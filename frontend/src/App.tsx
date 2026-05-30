// Definit le routage et lance le bootstrap auth + invite au montage.
// Le gate d'invite (lien Discord 1h) protege l'acces aux pages de jeu.

import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthPage } from './pages/AuthPage.js';
import { GamePage } from './pages/GamePage.js';
import { InviteGatePage } from './pages/InviteGatePage.js';
import { RequireAuth } from './components/RequireAuth.js';
import { useAuthBootstrap } from './hooks/useAuth.js';
import { useInviteBootstrap } from './hooks/useInviteBootstrap.js';

// Vitrine du design system : chargée à la demande, hors du bundle principal.
const DesignShowcasePage = lazy(() =>
  import('./pages/DesignShowcasePage.js').then((m) => ({
    default: m.DesignShowcasePage,
  })),
);

export function App() {
  const { t } = useTranslation();
  const location = useLocation();
  const invite = useInviteBootstrap();
  useAuthBootstrap();

  // La vitrine /design est une référence interne : accessible sans lien d'invite.
  const isDesign = location.pathname === '/design';

  if (!isDesign && invite.isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-grass-deep text-panel-base">
        {t('common.loading')}
      </div>
    );
  }

  if (!isDesign && !invite.isValid) {
    return (
      <InviteGatePage
        message={invite.errorMessage ?? "Demande un lien d'acces sur Discord avec /suxa_tondeuse."}
      />
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/play" replace />} />
      <Route
        path="/design"
        element={
          <Suspense fallback={<div className="p-6">{t('common.loading')}</div>}>
            <DesignShowcasePage />
          </Suspense>
        }
      />
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

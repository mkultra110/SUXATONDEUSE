// Ecran de jeu : pour la PHASE 0, on n'a qu'un canvas Pixi vide
// avec un message indiquant qu'on est en bootstrap.

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PixiCanvas } from '../game/engine/PixiCanvas.js';
import { useAuth } from '../hooks/useAuth.js';

export function GamePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    navigate('/auth', { replace: true });
  }

  return (
    <div className="flex min-h-screen flex-col items-center gap-4 bg-gradient-to-b from-sky-deep to-grass-deep p-4">
      <header className="flex w-full max-w-3xl items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-panel-base">{t('app.title')}</h1>
          {user && (
            <p className="text-panel-paper text-sm">
              {t('game.welcome', { username: user.username })}
            </p>
          )}
        </div>
        <button onClick={handleLogout} className="btn btn-danger text-sm">
          {t('auth.logout')}
        </button>
      </header>
      <PixiCanvas />
      <p className="text-center text-panel-paper text-sm max-w-2xl">
        {t('game.phase0Notice')}
      </p>
    </div>
  );
}

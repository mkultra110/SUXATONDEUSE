// Barre du haut : titre + cash + gems + bouton logout.

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../stores/gameStore.js';
import { useAuth } from '../../hooks/useAuth.js';
import { CashCounter } from './CashCounter.js';
import { WeatherBadge } from './WeatherBadge.js';

export function TopBar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const gems = useGameStore((s) => s.gems);

  async function handleLogout() {
    await logout();
    navigate('/auth', { replace: true });
  }

  return (
    <header className="flex w-full items-center justify-between gap-4 panel px-4 py-2">
      <div>
        <h1 className="text-lg font-bold text-ink-base">{t('app.title')}</h1>
        {user && <p className="text-xs text-ink-dark">{user.username}</p>}
      </div>
      <div className="flex items-center gap-4">
        <WeatherBadge />
        <div className="flex items-center gap-1 text-sm font-bold text-accent-premium">
          <span aria-hidden>⛽</span>
          <span className="tabular-nums">{gems}</span>
        </div>
        <CashCounter />
        <button onClick={handleLogout} className="btn btn-danger text-xs">
          {t('auth.logout')}
        </button>
      </div>
    </header>
  );
}

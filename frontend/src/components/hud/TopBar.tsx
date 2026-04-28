// Barre du haut cozy : titre Pixelify + currencies pixel + logout.

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../stores/gameStore.js';
import { useAuth } from '../../hooks/useAuth.js';
import { CashCounter } from './CashCounter.js';
import { WeatherBadge } from './WeatherBadge.js';
import { AudioControls } from './AudioControls.js';

export function TopBar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const gems = useGameStore((s) => s.gems);
  const prestigePoints = useGameStore((s) => s.prestigePoints);

  async function handleLogout() {
    await logout();
    navigate('/auth', { replace: true });
  }

  return (
    <header className="pixel-panel-dark flex w-full items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        <span className="text-2xl" aria-hidden>🤖</span>
        <div>
          <h1
            className="text-lg leading-none"
            style={{
              fontFamily: 'var(--font-title)',
              color: 'var(--color-accent-gold)',
              letterSpacing: '0.05em',
            }}
          >
            {t('app.title')}
          </h1>
          {user && (
            <p
              className="text-xs leading-tight mt-0.5"
              style={{
                color: 'var(--color-paper-3)',
                fontFamily: 'var(--font-body)',
                letterSpacing: '0.05em',
              }}
            >
              {user.username}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <WeatherBadge />
        <Counter
          icon="⛽"
          value={gems.toString()}
          color="var(--color-accent-fuel)"
        />
        <Counter
          icon="🌱"
          value={prestigePoints.toString()}
          color="var(--color-accent-purple)"
        />
        <CashCounter />
        <AudioControls />
        <button onClick={handleLogout} className="pixel-btn pixel-btn-danger text-xs">
          {t('auth.logout')}
        </button>
      </div>
    </header>
  );
}

function Counter({ icon, value, color }: { icon: string; value: string; color: string }) {
  return (
    <div
      className="flex items-center gap-1.5 px-2 py-1 rounded"
      style={{
        background: 'var(--color-wood-5)',
        border: '2px solid var(--color-wood-4)',
        boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.3)',
      }}
    >
      <span className="text-base" aria-hidden>{icon}</span>
      <span className="numeric text-sm" style={{ color }}>{value}</span>
    </div>
  );
}

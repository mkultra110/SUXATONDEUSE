// Barre du haut cozy : titre Pixelify + currencies pixel SVG + logout.

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../stores/gameStore.js';
import { useAuth } from '../../hooks/useAuth.js';
import { CashCounter } from './CashCounter.js';
import { WeatherBadge } from './WeatherBadge.js';
import { AudioControls } from './AudioControls.js';
import { FuelIcon, SeedIcon, RobotLogo, StarIcon } from '../icons/PixelIcon.js';

// 1 jour de jeu = 60 secondes reelles (matche le day-night-overlay).
const SECONDS_PER_GAME_DAY = 60;

export function TopBar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const gems = useGameStore((s) => s.gems);
  const prestigePoints = useGameStore((s) => s.prestigePoints);
  const playTime = useGameStore((s) => s.playTimeSeconds);
  const dayNumber = Math.floor(playTime / SECONDS_PER_GAME_DAY) + 1;

  async function handleLogout() {
    await logout();
    navigate('/auth', { replace: true });
  }

  return (
    <header className="pixel-panel-dark flex w-full items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        <RobotLogo size={28} />
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
        {/* Day counter "JOUR X" : 1 jour de jeu = 60s reel (sync day-night cycle) */}
        <div
          className="flex items-center gap-1.5 px-2 py-1 rounded"
          style={{
            background: 'var(--color-wood-5)',
            border: '2px solid #a87a1f',
            boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.3), 0 0 8px rgba(245, 196, 67, 0.2)',
          }}
          title={`Jour ${dayNumber}`}
        >
          <StarIcon size={14} />
          <span
            style={{
              fontFamily: 'var(--font-button)',
              fontSize: 9,
              color: 'var(--color-paper-3)',
              letterSpacing: '0.12em',
            }}
          >
            JOUR
          </span>
          <span
            className="numeric"
            style={{ color: 'var(--color-accent-gold)', fontSize: 18, lineHeight: 1 }}
          >
            {dayNumber}
          </span>
        </div>
        <WeatherBadge />
        <Counter
          icon={<span className="icon-fuel-tangue"><FuelIcon size={16} /></span>}
          value={gems.toString()}
          color="var(--color-accent-fuel)"
        />
        <Counter
          icon={<span className="icon-seed-pulse"><SeedIcon size={16} /></span>}
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

function Counter({ icon, value, color }: { icon: React.ReactNode; value: string; color: string }) {
  return (
    <div
      className="flex items-center gap-1.5 px-2 py-1 rounded"
      style={{
        background: 'var(--color-wood-5)',
        border: '2px solid var(--color-wood-4)',
        boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.3)',
      }}
    >
      {icon}
      <span className="numeric text-sm" style={{ color }}>{value}</span>
    </div>
  );
}

// Ecran d'auth : alterne entre login et register.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LoginForm } from '../components/auth/LoginForm.js';
import { RegisterForm } from '../components/auth/RegisterForm.js';
import { RobotLogo } from '../components/icons/PixelIcon.js';

export function AuthPage() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();

  function handleSuccess() {
    navigate('/play', { replace: true });
  }

  return (
    <div
      className="flex flex-col items-center justify-center gap-4 px-4 py-6"
      style={{
        minHeight: '100dvh',
        background:
          'linear-gradient(180deg, var(--color-sky-morning) 0%, var(--color-sky-noon) 40%, var(--color-grass-2) 70%, var(--color-grass-4) 100%)',
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 24px)',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)',
      }}
    >
      <header className="text-center flex flex-col items-center gap-2">
        <RobotLogo size={56} />
        <h1
          className="leading-none"
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: 'clamp(28px, 8vw, 40px)',
            color: 'var(--color-text-title)',
            textShadow: '2px 2px 0 var(--color-paper-1), 4px 4px 0 var(--color-wood-3)',
            letterSpacing: '0.02em',
          }}
        >
          La Ferme des Tournesols
        </h1>
        <p
          className="meme"
          style={{
            fontSize: 'clamp(13px, 3.5vw, 16px)',
            color: 'var(--color-text-title)',
            letterSpacing: '0.02em',
            fontStyle: 'italic',
            margin: 0,
          }}
        >
          Fondée en 1962 par Mémé Gisèle
        </p>
        <p
          className="meme"
          style={{
            fontSize: 'clamp(12px, 3vw, 14px)',
            color: 'var(--color-text-body)',
            margin: '8px 0 0',
            maxWidth: 320,
          }}
        >
          {t('app.tagline')}
        </p>
      </header>
      {mode === 'login' ? (
        <LoginForm onSwitch={() => setMode('register')} onSuccess={handleSuccess} />
      ) : (
        <RegisterForm onSwitch={() => setMode('login')} onSuccess={handleSuccess} />
      )}
    </div>
  );
}

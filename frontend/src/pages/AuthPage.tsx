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
      className="flex min-h-screen flex-col items-center justify-center gap-6 p-4"
      style={{
        background:
          'linear-gradient(180deg, var(--color-sky-morning) 0%, var(--color-sky-noon) 40%, var(--color-grass-2) 70%, var(--color-grass-4) 100%)',
      }}
    >
      <header className="text-center flex flex-col items-center gap-2">
        <RobotLogo size={64} />
        <h1
          className="leading-none"
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: '40px',
            color: 'var(--color-text-title)',
            textShadow: '2px 2px 0 var(--color-paper-1), 4px 4px 0 var(--color-wood-3)',
            letterSpacing: '0.02em',
          }}
        >
          {t('app.title')}
        </h1>
        <p
          className="mt-2"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '16px',
            color: 'var(--color-text-title)',
            letterSpacing: '0.05em',
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

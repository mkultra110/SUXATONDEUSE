// Ecran d'auth : alterne entre login et register.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../design/jardin/jardin.css';
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
      className="jardin"
      data-theme="jour"
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-5)',
        padding: 'var(--space-4)',
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + var(--space-5))',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + var(--space-5))',
        background: 'linear-gradient(var(--sky-top), var(--sky-bottom))',
      }}
    >
      <header
        style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-2)',
        }}
      >
        <RobotLogo size={56} />
        <h1
          style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 'clamp(24px, 7vw, 39px)',
            color: 'var(--ink)',
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          La Ferme des Tournesols
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 'var(--text-2xs)',
            color: 'var(--grass-deep)',
            letterSpacing: '0.5px',
            margin: 0,
          }}
        >
          FONDÉE EN 1962 PAR MÉMÉ GISÈLE
        </p>
        <p
          style={{
            fontWeight: 600,
            color: 'var(--ink-2)',
            margin: 'var(--space-2) 0 0',
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

// Ecran d'auth : alterne entre login et register.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LoginForm } from '../components/auth/LoginForm.js';
import { RegisterForm } from '../components/auth/RegisterForm.js';

export function AuthPage() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();

  function handleSuccess() {
    navigate('/play', { replace: true });
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-b from-sky-deep to-grass-deep p-4">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-panel-base drop-shadow">{t('app.title')}</h1>
        <p className="text-panel-paper">{t('app.tagline')}</p>
      </header>
      {mode === 'login' ? (
        <LoginForm onSwitch={() => setMode('register')} onSuccess={handleSuccess} />
      ) : (
        <RegisterForm onSwitch={() => setMode('login')} onSuccess={handleSuccess} />
      )}
    </div>
  );
}

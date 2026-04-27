// Formulaire de connexion. Validation cote client minimale,
// le serveur reste la source de verite (cf. lecons.md).

import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth.js';

interface Props {
  onSwitch: () => void;
  onSuccess: () => void;
}

export function LoginForm({ onSwitch, onSuccess }: Props) {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(username, password);
      onSuccess();
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 401) setError(t('auth.login.errors.invalid'));
      else if (status === 403) setError(t('auth.login.errors.banned'));
      else setError(t('auth.login.errors.generic'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-3 panel p-6">
      <h2 className="text-2xl font-bold text-center mb-2">{t('auth.login.title')}</h2>
      <label className="flex flex-col gap-1 text-sm font-semibold">
        {t('auth.login.username')}
        <input
          className="input"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold">
        {t('auth.login.password')}
        <input
          className="input"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      {error && <p className="text-accent-danger text-sm">{error}</p>}
      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? t('common.loading') : t('auth.login.submit')}
      </button>
      <button
        type="button"
        onClick={onSwitch}
        className="text-sm underline text-ink-dark hover:text-ink-base"
      >
        {t('auth.login.switchToRegister')}
      </button>
    </form>
  );
}

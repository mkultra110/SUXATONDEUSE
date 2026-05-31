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
    <form
      onSubmit={handleSubmit}
      className="card"
      style={{
        width: '100%',
        maxWidth: 360,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
      }}
    >
      <h2 className="card__title" style={{ textAlign: 'center', fontSize: 'var(--text-md)' }}>
        {t('auth.login.title')}
      </h2>
      <label className="field">
        <span className="field__label">{t('auth.login.username')}</span>
        <input
          className="input"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>
      <label className="field">
        <span className="field__label">{t('auth.login.password')}</span>
        <input
          className="input"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      {error && <p className="form-error">{error}</p>}
      <button type="submit" className="btn btn--block" disabled={submitting}>
        {submitting ? t('common.loading') : t('auth.login.submit')}
      </button>
      <button type="button" onClick={onSwitch} className="link">
        {t('auth.login.switchToRegister')}
      </button>
    </form>
  );
}

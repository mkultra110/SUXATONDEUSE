// Formulaire d'inscription. Verifie la concordance des mots de passe cote client
// pour donner un feedback immediat, mais le serveur reste la source de verite.

import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth.js';

interface Props {
  onSwitch: () => void;
  onSuccess: () => void;
}

export function RegisterForm({ onSwitch, onSuccess }: Props) {
  const { t } = useTranslation();
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError(t('auth.register.errors.passwordMismatch'));
      return;
    }
    setSubmitting(true);
    try {
      await register(username, password);
      onSuccess();
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 409) setError(t('auth.register.errors.usernameTaken'));
      else setError(t('auth.register.errors.generic'));
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
        {t('auth.register.title')}
      </h2>
      <label className="field">
        <span className="field__label">{t('auth.register.username')}</span>
        <input
          className="input"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          minLength={3}
          maxLength={20}
          required
        />
      </label>
      <label className="field">
        <span className="field__label">{t('auth.register.password')}</span>
        <input
          className="input"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />
      </label>
      <label className="field">
        <span className="field__label">{t('auth.register.confirmPassword')}</span>
        <input
          className="input"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          minLength={8}
          required
        />
      </label>
      {error && <p className="form-error">{error}</p>}
      <button type="submit" className="btn btn--block" disabled={submitting}>
        {submitting ? t('common.loading') : t('auth.register.submit')}
      </button>
      <button type="button" onClick={onSwitch} className="link">
        {t('auth.register.switchToLogin')}
      </button>
    </form>
  );
}

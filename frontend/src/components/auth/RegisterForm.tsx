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
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-3 panel p-6">
      <h2 className="text-2xl font-bold text-center mb-2">{t('auth.register.title')}</h2>
      <label className="flex flex-col gap-1 text-sm font-semibold">
        {t('auth.register.username')}
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
      <label className="flex flex-col gap-1 text-sm font-semibold">
        {t('auth.register.password')}
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
      <label className="flex flex-col gap-1 text-sm font-semibold">
        {t('auth.register.confirmPassword')}
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
      {error && <p className="text-accent-danger text-sm">{error}</p>}
      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? t('common.loading') : t('auth.register.submit')}
      </button>
      <button
        type="button"
        onClick={onSwitch}
        className="text-sm underline text-ink-dark hover:text-ink-base"
      >
        {t('auth.register.switchToLogin')}
      </button>
    </form>
  );
}

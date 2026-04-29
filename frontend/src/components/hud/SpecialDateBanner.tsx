// SpecialDateBanner : banner discret en haut quand la date est speciale.
// Fade-in au mount, sticky sous la TopBar, dismiss apres 8s ou click.

import { useEffect, useState } from 'react';
import { getCurrentSpecialDate, SPECIAL_DATE_LABELS } from '../../utils/specialDates.js';

const STORAGE_KEY = 'suxa-special-date-dismissed';

export function SpecialDateBanner() {
  const [special] = useState(() => getCurrentSpecialDate());
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!special) return;
    // Verifie si l'utilisateur a deja dismiss aujourd'hui.
    const today = new Date().toISOString().slice(0, 10);
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (dismissed === today) return;
    } catch { /* ignore */ }
    // Affiche apres 1.5s pour ne pas distraire au load.
    const t1 = setTimeout(() => setVisible(true), 1500);
    // Auto-dismiss apres 12s.
    const t2 = setTimeout(() => setVisible(false), 13_500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [special]);

  if (!special || !visible) return null;

  function dismiss() {
    setVisible(false);
    try {
      const today = new Date().toISOString().slice(0, 10);
      localStorage.setItem(STORAGE_KEY, today);
    } catch { /* ignore */ }
  }

  const colorMap: Record<string, string> = {
    'april-fools': 'var(--color-accent-pink)',
    christmas: 'var(--color-accent-red)',
    halloween: 'var(--color-accent-fuel)',
    'bastille-day': 'var(--color-water-3)',
  };

  return (
    <div
      onClick={dismiss}
      className="meme"
      style={{
        position: 'fixed',
        top: 'calc(env(safe-area-inset-top, 0px) + 60px)',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 850,
        background: 'var(--color-paper-1)',
        border: `3px solid ${colorMap[special] ?? 'var(--color-accent-gold)'}`,
        padding: '8px 14px',
        fontSize: 14,
        color: 'var(--color-text-body)',
        fontStyle: 'italic',
        boxShadow: '0 4px 0 var(--color-wood-5), 0 8px 16px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        maxWidth: 'min(90vw, 380px)',
        textAlign: 'center',
        animation: 'special-banner-drop 600ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {SPECIAL_DATE_LABELS[special]}
    </div>
  );
}

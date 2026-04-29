// RatePrompt : invite l'utilisateur a noter le jeu apres 7 jours de jeu
// cumule (idee #449). Modal discret + dismiss persistant.

import { useEffect, useState } from 'react';
import { useGameStore } from '../../stores/gameStore.js';
import { CrossIcon, StarIcon } from '../icons/PixelIcon.js';

const STORAGE_KEY = 'suxa-rate-prompt';

export function RatePrompt() {
  const playTime = useGameStore((s) => s.playTimeSeconds);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (playTime < 7 * 86_400) return;
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'rated' || stored === 'dismissed') return;
    setVisible(true);
  }, [playTime]);

  function dismiss(rated: boolean) {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, rated ? 'rated' : 'dismissed');
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'calc(96px + env(safe-area-inset-bottom, 0px))',
        right: 12,
        left: 12,
        maxWidth: 320,
        marginInline: 'auto',
        zIndex: 1500,
        background: 'var(--color-paper-1)',
        border: '3px solid var(--color-accent-gold)',
        padding: 12,
        boxShadow: '0 6px 0 var(--color-wood-5), 0 12px 24px rgba(92, 61, 36, 0.4)',
      }}
    >
      <button
        type="button"
        onClick={() => dismiss(false)}
        aria-label="Plus tard"
        style={{
          position: 'absolute',
          top: 4,
          right: 4,
          background: 'transparent',
          border: 'none',
          padding: 4,
          cursor: 'pointer',
        }}
      >
        <CrossIcon size={14} />
      </button>
      <p
        className="meme"
        style={{ fontSize: 14, color: 'var(--color-text-body)', margin: '0 0 8px' }}
      >
        « Tu joues depuis une semaine ! Memé serait fiere si tu lui donnais une etoile. »
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => dismiss(true)}
          className="pixel-btn pixel-btn-gold"
          style={{ flex: 1, fontSize: 12 }}
        >
          <StarIcon size={12} /> Noter
        </button>
        <button
          type="button"
          onClick={() => dismiss(false)}
          className="pixel-btn pixel-btn-wood"
          style={{ flex: 1, fontSize: 12 }}
        >
          Plus tard
        </button>
      </div>
    </div>
  );
}

// QuickHotkeys : raccourcis clavier globaux.
// F12 = photo mode (cache HUD), S = sepia toggle, ? = aide.

import { useEffect, useState } from 'react';

export function QuickHotkeys() {
  const [photoMode, setPhotoMode] = useState(false);
  const [sepia, setSepia] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Ne pas hijacker si l'utilisateur ecrit dans un input.
      const target = e.target as HTMLElement | null;
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA') return;
      if (e.key === 'F12') {
        e.preventDefault();
        setPhotoMode((p) => !p);
      } else if (e.key.toLowerCase() === 's' && e.shiftKey) {
        setSepia((s) => !s);
      } else if (e.key === '?') {
        setHelpOpen((h) => !h);
      } else if (e.key === 'Escape') {
        setPhotoMode(false);
        setHelpOpen(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (photoMode) document.body.classList.add('photo-mode');
    else document.body.classList.remove('photo-mode');
  }, [photoMode]);

  useEffect(() => {
    if (sepia) document.body.classList.add('sepia-mode');
    else document.body.classList.remove('sepia-mode');
  }, [sepia]);

  if (!helpOpen) return null;

  return (
    <div
      onClick={() => setHelpOpen(false)}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1800,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--color-paper-1)',
          border: '4px solid var(--color-wood-5)',
          padding: 20,
          maxWidth: 360,
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--color-text-title)',
            margin: '0 0 12px',
          }}
        >
          Raccourcis clavier
        </h2>
        <ul style={{ fontSize: 13, lineHeight: 1.8, color: 'var(--color-text-body)', listStyle: 'none', padding: 0 }}>
          <li><kbd>F12</kbd> — Mode photo (cache HUD)</li>
          <li><kbd>Shift+S</kbd> — Mode sepia</li>
          <li><kbd>←</kbd> <kbd>→</kbd> — Naviguer entre les onglets</li>
          <li><kbd>?</kbd> — Cette aide</li>
          <li><kbd>Esc</kbd> — Fermer modale</li>
          <li>↑↑↓↓←→←→BA — Mode disco</li>
        </ul>
      </div>
    </div>
  );
}

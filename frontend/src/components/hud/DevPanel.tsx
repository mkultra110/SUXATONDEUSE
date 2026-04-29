// DevPanel : panel cheats accessible via URL ?dev (idee #680 #793 #794).
// Permet de spawn cash / gems / unlock all upgrades, etc.

import { useEffect, useState } from 'react';
import { useGameStore } from '../../stores/gameStore.js';
import Decimal from 'break_infinity.js';

export function DevPanel() {
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('dev') !== null) {
      setEnabled(true);
      setOpen(true);
    }
  }, []);

  if (!enabled) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          position: 'fixed',
          bottom: 12,
          left: 12,
          zIndex: 1900,
          padding: '4px 8px',
          background: '#5C3A1F',
          color: '#FFD921',
          fontFamily: 'monospace',
          fontSize: 10,
          border: '2px solid #FFD921',
          cursor: 'pointer',
        }}
      >
        DEV
      </button>
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 56,
            left: 12,
            zIndex: 1900,
            background: '#1a1a1a',
            color: '#8FBF4F',
            padding: 12,
            border: '2px solid #FFD921',
            fontFamily: 'monospace',
            fontSize: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            minWidth: 220,
          }}
        >
          <button
            type="button"
            onClick={() => {
              const s = useGameStore.getState();
              useGameStore.setState({ cash: s.cash.add(new Decimal(1e15)) });
            }}
          >
            +1Qa cash
          </button>
          <button
            type="button"
            onClick={() => {
              const s = useGameStore.getState();
              useGameStore.setState({ cash: s.cash.add(new Decimal(1e30)) });
            }}
          >
            +1Dc cash
          </button>
          <button
            type="button"
            onClick={() => {
              const s = useGameStore.getState();
              useGameStore.setState({ gems: s.gems + 1000 });
            }}
          >
            +1000 essence
          </button>
          <button
            type="button"
            onClick={() => {
              const s = useGameStore.getState();
              useGameStore.setState({ playTimeSeconds: s.playTimeSeconds + 86_400 });
            }}
          >
            +1 jour playtime
          </button>
          <button
            type="button"
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            style={{ color: '#FF6B6B' }}
          >
            Reset complet
          </button>
        </div>
      )}
    </>
  );
}

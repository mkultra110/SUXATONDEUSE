// GameModePanel : selecteur des modes de jeu (idees #573-#580).
// Sandbox / Speed run / Pacifist / Hardcore / Endless. Pour l'instant
// purement cosmetique : affiche un badge dans la TopBar.

import { useUIStore } from '../../stores/uiStore.js';
import { CrossIcon, StarIcon } from '../icons/PixelIcon.js';

interface ModeDef {
  key: 'normal' | 'endless' | 'speedrun' | 'pacifist' | 'hardcore' | 'sandbox';
  label: string;
  hint: string;
  emoji: string;
}

const MODES: ReadonlyArray<ModeDef> = [
  { key: 'normal', label: 'Normal', hint: 'Le mode classique', emoji: '🌱' },
  { key: 'endless', label: 'Endless', hint: 'Sans boss, juste tondre', emoji: '♾️' },
  { key: 'speedrun', label: 'Speed run', hint: 'Time attack', emoji: '⏱️' },
  { key: 'pacifist', label: 'Pacifist', hint: 'Zero tap manuel', emoji: '🕊️' },
  { key: 'hardcore', label: 'Hardcore', hint: 'Perma-death', emoji: '💀' },
  { key: 'sandbox', label: 'Sandbox', hint: 'Cheats actifs', emoji: '🧪' },
];

export function GameModePanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const gameMode = useUIStore((s) => s.gameMode);
  const setGameMode = useUIStore((s) => s.setGameMode);

  if (!open) return null;
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1700,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: 'var(--color-paper-1)',
          border: '4px solid var(--color-wood-5)',
          padding: 18,
        }}
      >
        <header className="flex items-center justify-between" style={{ marginBottom: 12 }}>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 18, fontWeight: 700, margin: 0 }}>
            Mode de jeu
          </h2>
          <button type="button" onClick={onClose} className="pixel-btn pixel-btn-wood" style={{ padding: 6 }} aria-label="Fermer">
            <CrossIcon size={14} />
          </button>
        </header>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {MODES.map((m) => {
            const active = gameMode === m.key;
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => setGameMode(m.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: 10,
                  background: active ? 'var(--color-accent-gold)' : 'var(--color-paper-2)',
                  border: '2px solid var(--color-wood-5)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: 24 }}>{m.emoji}</span>
                <div className="flex-1">
                  <div style={{ fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: 14, color: 'var(--color-text-title)' }}>
                    {m.label} {active && <StarIcon size={10} />}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{m.hint}</div>
                </div>
              </button>
            );
          })}
        </div>
        <p
          className="meme"
          style={{ fontSize: 11, fontStyle: 'italic', color: 'var(--color-text-muted)', textAlign: 'center', margin: '12px 0 0' }}
        >
          « Les modes sont cosmetiques pour l'instant. Mémé reflechit a les rendre serieux. »
        </p>
      </div>
    </div>
  );
}

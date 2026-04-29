// ProfileEditor : modal pour customiser nom de la ferme + avatar emoji
// (idees #385 #386 #387). Accessible via KebabMenu.

import { useState } from 'react';
import { useUIStore } from '../../stores/uiStore.js';
import { CrossIcon } from '../icons/PixelIcon.js';

const AVATAR_CHOICES = ['👨‍🌾', '👩‍🌾', '🧑‍🌾', '🧙', '🤖', '🐱', '🦊', '🐰', '🐮', '🦉', '🐝', '🌻'];

export function ProfileEditor({ open, onClose }: { open: boolean; onClose: () => void }) {
  const farmName = useUIStore((s) => s.farmName);
  const setFarmName = useUIStore((s) => s.setFarmName);
  const playerEmoji = useUIStore((s) => s.playerEmoji);
  const setPlayerEmoji = useUIStore((s) => s.setPlayerEmoji);
  const [draftName, setDraftName] = useState(farmName);

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
    >
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          background: 'var(--color-paper-1)',
          border: '4px solid var(--color-wood-5)',
          padding: 18,
        }}
      >
        <header className="flex items-center justify-between" style={{ marginBottom: 12 }}>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 18, fontWeight: 700, margin: 0 }}>
            Profil
          </h2>
          <button type="button" onClick={onClose} className="pixel-btn pixel-btn-wood" style={{ padding: 6 }} aria-label="Fermer">
            <CrossIcon size={14} />
          </button>
        </header>

        <label
          style={{ display: 'block', fontFamily: 'var(--font-button)', fontSize: 10, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 8 }}
        >
          Nom de la ferme
        </label>
        <input
          type="text"
          value={draftName}
          maxLength={50}
          onChange={(e) => setDraftName(e.target.value)}
          onBlur={() => setFarmName(draftName)}
          style={{
            width: '100%',
            padding: '8px 10px',
            marginTop: 4,
            background: 'var(--color-paper-2)',
            border: '2px solid var(--color-wood-5)',
            fontFamily: 'var(--font-title)',
            fontSize: 14,
            color: 'var(--color-text-body)',
          }}
        />
        <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
          Visible dans le titre du jeu et le partage social.
        </p>

        <div
          style={{ fontFamily: 'var(--font-button)', fontSize: 10, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 14 }}
        >
          Avatar
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, marginTop: 8 }}>
          {AVATAR_CHOICES.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setPlayerEmoji(e)}
              style={{
                fontSize: 28,
                padding: 8,
                background: e === playerEmoji ? 'var(--color-accent-gold)' : 'var(--color-paper-2)',
                border: '2px solid var(--color-wood-5)',
                cursor: 'pointer',
                aspectRatio: '1',
              }}
            >
              {e}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="pixel-btn pixel-btn-gold"
          style={{ marginTop: 16, fontSize: 12, width: '100%' }}
        >
          Sauvegarder
        </button>
      </div>
    </div>
  );
}

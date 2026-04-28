// Bouton mute + sliders SFX/Musique dans le coin de la TopBar.

import { useState } from 'react';
import { useAudio } from '../../hooks/useAudio.js';

export function AudioControls() {
  const { prefs, toggleMute, setSfxVolume, setMusicVolume } = useAudio();
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => {
          if (open) toggleMute();
          else setOpen(true);
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          setOpen((o) => !o);
        }}
        title={prefs.muted ? 'Son coupe (clic pour reactiver, clic-droit pour reglages)' : 'Son actif (clic-droit pour reglages)'}
        className="pixel-btn pixel-btn-wood"
        style={{
          minHeight: 'auto',
          padding: '4px 8px',
          fontSize: '14px',
        }}
      >
        {prefs.muted ? '🔇' : '🔊'}
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: 4,
            padding: 12,
            background: 'var(--color-paper-1)',
            border: '3px solid var(--color-wood-5)',
            borderRadius: 4,
            boxShadow: '0 4px 0 var(--color-wood-5), 0 6px 12px rgba(92,61,36,0.4)',
            zIndex: 100,
            minWidth: 200,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 4,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-button)',
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--color-text-title)',
              }}
            >
              Son
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                color: 'var(--color-text-muted)',
              }}
            >
              ×
            </button>
          </div>

          <button
            type="button"
            onClick={() => toggleMute()}
            className="pixel-btn"
            style={{
              minHeight: 'auto',
              padding: '6px 10px',
              fontSize: '11px',
              background: prefs.muted ? 'var(--color-accent-red)' : 'var(--color-grass-4)',
              borderColor: prefs.muted ? '#8b1f1f' : 'var(--color-grass-6)',
            }}
          >
            {prefs.muted ? '🔇 Active le son' : '🔊 Coupe le son'}
          </button>

          <label style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>SFX</span>
              <span>{Math.round(prefs.sfxVolume * 100)}%</span>
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={prefs.sfxVolume}
              onChange={(e) => setSfxVolume(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </label>

          <label style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Musique</span>
              <span>{Math.round(prefs.musicVolume * 100)}%</span>
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={prefs.musicVolume}
              onChange={(e) => setMusicVolume(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </label>
        </div>
      )}
    </div>
  );
}

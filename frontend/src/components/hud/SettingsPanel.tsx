// SettingsPanel : modal toggle pour shake / vibration / particules / autobuy.
// Accessible via le KebabMenu (item "Reglages").

import { useEffectsStore } from '../../stores/effectsStore.js';
import { useUIStore } from '../../stores/uiStore.js';
import { useGameStore } from '../../stores/gameStore.js';
import { CrossIcon } from '../icons/PixelIcon.js';

export function SettingsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const enableShake = useEffectsStore((s) => s.enableShake);
  const enableVibration = useEffectsStore((s) => s.enableVibration);
  const enableParticles = useEffectsStore((s) => s.enableParticles);
  const enablePixelCursor = useEffectsStore((s) => s.enablePixelCursor);
  const setEnableShake = useEffectsStore((s) => s.setEnableShake);
  const setEnableVibration = useEffectsStore((s) => s.setEnableVibration);
  const setEnableParticles = useEffectsStore((s) => s.setEnableParticles);
  const setEnablePixelCursor = useEffectsStore((s) => s.setEnablePixelCursor);
  const autoBuyEnabled = useUIStore((s) => s.autoBuyEnabled);
  const setAutoBuyEnabled = useUIStore((s) => s.setAutoBuyEnabled);
  const totalPrestiges = useGameStore((s) => s.totalPrestiges);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1700,
        background: 'rgba(0,0,0,0.6)',
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
          maxWidth: 360,
          background: 'var(--color-paper-1)',
          border: '4px solid var(--color-wood-5)',
          padding: 18,
        }}
      >
        <header className="flex items-center justify-between" style={{ marginBottom: 12 }}>
          <h2
            style={{
              fontFamily: 'var(--font-title)',
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--color-text-title)',
              margin: 0,
            }}
          >
            Réglages
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="pixel-btn pixel-btn-wood"
            style={{ padding: 6 }}
          >
            <CrossIcon size={14} />
          </button>
        </header>
        <ToggleRow label="Tremblement écran" hint="Effets de shake sur gros gains" value={enableShake} onChange={setEnableShake} />
        <ToggleRow label="Vibration" hint="Tap, level up, boss" value={enableVibration} onChange={setEnableVibration} />
        <ToggleRow label="Particules" hint="Papillons, pétales, fleurs" value={enableParticles} onChange={setEnableParticles} />
        <ToggleRow label="Curseur pixel art" hint="Style retro avec fleche en bois" value={enablePixelCursor} onChange={setEnablePixelCursor} />
        <ToggleRow
          label="Auto-achat"
          hint={totalPrestiges > 0 ? "Achete le moins cher dispo / 2s" : "Débloqué après 1er prestige"}
          value={autoBuyEnabled}
          onChange={setAutoBuyEnabled}
          disabled={totalPrestiges < 1}
        />
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  hint,
  value,
  onChange,
  disabled,
}: {
  label: string;
  hint: string;
  value: boolean;
  onChange: (b: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!value)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: 10,
        background: 'transparent',
        border: 'none',
        borderBottom: '1px solid var(--color-wood-3)',
        width: '100%',
        textAlign: 'left',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <div
        style={{
          width: 44,
          height: 24,
          background: value ? 'var(--color-grass-5)' : 'var(--color-wood-3)',
          borderRadius: 12,
          border: '2px solid var(--color-wood-5)',
          position: 'relative',
          flexShrink: 0,
          transition: 'background 200ms ease',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 1,
            left: value ? 22 : 1,
            width: 18,
            height: 18,
            background: 'var(--color-paper-1)',
            border: '1px solid var(--color-wood-5)',
            borderRadius: '50%',
            transition: 'left 200ms ease',
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div style={{ fontFamily: 'var(--font-title)', fontWeight: 600, fontSize: 13, color: 'var(--color-text-title)' }}>
          {label}
        </div>
        <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{hint}</div>
      </div>
    </button>
  );
}

// Bestiary : Cabinet de tous les boss vaincus (idee #233).
// Modal accessible via KebabMenu. Pour chaque boss, montre nom + tagline,
// avec un compteur de kills.

import { useUIStore } from '../../stores/uiStore.js';
import { useEffectsStore } from '../../stores/effectsStore.js';
import { BOSSES } from '../../utils/bossMaps.js';
import { CrossIcon, TrophyIcon } from '../icons/PixelIcon.js';

export function Bestiary() {
  // Reuse statsHebdoOpen ? Non, on cree son propre toggle via stat dedicated.
  const open = useUIStore((s) => s.bestiaryOpen ?? false);
  const setOpen = useUIStore((s) => s.setBestiaryOpen ?? (() => {}));
  const bossKills = useEffectsStore((s) => s.bossKills);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1600,
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
          maxWidth: 520,
          background: 'var(--color-paper-1)',
          border: '4px solid var(--color-wood-5)',
          padding: 18,
          maxHeight: '90vh',
          overflow: 'auto',
        }}
      >
        <header className="flex items-center justify-between" style={{ marginBottom: 12 }}>
          <h2
            style={{
              fontFamily: 'var(--font-title)',
              fontSize: 20,
              fontWeight: 700,
              color: 'var(--color-text-title)',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <TrophyIcon size={22} />
            Bestiaire
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fermer"
            className="pixel-btn pixel-btn-wood"
            style={{ padding: 6 }}
          >
            <CrossIcon size={14} />
          </button>
        </header>
        <p
          className="meme"
          style={{ fontSize: 13, color: 'var(--color-text-muted)', fontStyle: 'italic', marginBottom: 12 }}
        >
          « Tous les boss que tu as croises. Total : {bossKills} kill{bossKills > 1 ? 's' : ''}. »
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {BOSSES.map((boss) => {
            const seen = bossKills > 0;
            return (
              <div
                key={boss.kind}
                className="panel-paper"
                style={{
                  padding: 10,
                  display: 'flex',
                  gap: 10,
                  alignItems: 'center',
                  opacity: seen ? 1 : 0.5,
                  filter: seen ? undefined : 'grayscale(0.7)',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 6,
                    background: boss.color,
                    border: '2px solid var(--color-wood-5)',
                    flexShrink: 0,
                  }}
                />
                <div className="flex-1">
                  <div style={{ fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: 14, color: 'var(--color-text-title)' }}>
                    {seen ? boss.name : '???'}
                  </div>
                  <div style={{ fontFamily: 'var(--font-meme)', fontStyle: 'italic', fontSize: 11, color: 'var(--color-text-muted)' }}>
                    {seen ? `« ${boss.tagline} »` : 'Encore jamais croise'}
                  </div>
                </div>
                <div className="numeric" style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-accent-gold)' }}>
                  {seen ? `${boss.hp} HP` : '?'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

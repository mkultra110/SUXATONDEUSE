// PolaroidAlbum : galerie des "photos" de la ferme. Chaque polaroid est
// genere proceduralement a partir du map level (theme + couleur + boss).
// Pas de html2canvas : on cree des div avec un style fige.

import { useUIStore } from '../../stores/uiStore.js';
import { useEffectsStore } from '../../stores/effectsStore.js';
import { themeForMapLevel } from '../../utils/mapThemes.js';
import { bossForMapLevel } from '../../utils/bossMaps.js';
import { CrossIcon } from '../icons/PixelIcon.js';

export function PolaroidAlbum() {
  const open = useUIStore((s) => s.polaroidAlbumOpen);
  const setOpen = useUIStore((s) => s.setPolaroidAlbumOpen);
  const polaroidLevels = useEffectsStore((s) => s.polaroidLevels);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1600,
        background: 'rgba(60, 40, 20, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      role="dialog"
      aria-labelledby="album-title"
    >
      <div
        style={{
          width: '100%',
          maxWidth: 640,
          maxHeight: '90vh',
          background: 'var(--color-paper-1)',
          border: '4px solid var(--color-wood-5)',
          padding: 16,
          overflow: 'auto',
          position: 'relative',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
        }}
      >
        <header className="flex items-center justify-between" style={{ marginBottom: 12 }}>
          <h2
            id="album-title"
            style={{
              fontFamily: 'var(--font-title)',
              fontSize: 22,
              fontWeight: 700,
              color: 'var(--color-text-title)',
              margin: 0,
            }}
          >
            Album de la ferme
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

        {polaroidLevels.length === 0 && (
          <p
            className="meme"
            style={{
              fontSize: 14,
              color: 'var(--color-text-muted)',
              fontStyle: 'italic',
              textAlign: 'center',
              padding: '24px 0',
            }}
          >
            « Pas encore de photos. Avance dans les niveaux pour remplir l'album ! »
          </p>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 16,
            padding: '8px 0',
          }}
        >
          {polaroidLevels.map((lvl, idx) => {
            const theme = themeForMapLevel(lvl);
            const boss = bossForMapLevel(lvl);
            const tilt = ((idx * 37) % 11) - 5;
            return (
              <Polaroid
                key={lvl}
                mapLevel={lvl}
                themeName={theme.name}
                themeColor={theme.accentColor}
                bossName={boss?.name ?? null}
                tilt={tilt}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Polaroid({
  mapLevel,
  themeName,
  themeColor,
  bossName,
  tilt,
}: {
  mapLevel: number;
  themeName: string;
  themeColor: string;
  bossName: string | null;
  tilt: number;
}) {
  return (
    <div
      style={{
        background: 'var(--color-paper-1)',
        border: '2px solid var(--color-wood-5)',
        padding: 8,
        boxShadow: '4px 4px 0 var(--color-wood-5), 0 6px 16px rgba(0,0,0,0.3)',
        transform: `rotate(${tilt}deg)`,
        transition: 'transform 200ms ease',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'rotate(0deg) scale(1.05)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = `rotate(${tilt}deg)`;
      }}
    >
      <div
        style={{
          width: '100%',
          aspectRatio: '1 / 1',
          background: `radial-gradient(circle at 30% 30%, ${themeColor}88, var(--color-grass-3) 60%, var(--color-grass-5))`,
          border: '1px solid var(--color-wood-5)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Soleil stylise */}
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: 'radial-gradient(#fde08a, #F5C443)',
            boxShadow: `0 0 12px ${themeColor}`,
          }}
        />
        {/* Boss en silhouette si applicable */}
        {bossName && (
          <div
            style={{
              position: 'absolute',
              bottom: '20%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 32,
              height: 40,
              background: 'var(--color-wood-5)',
              borderRadius: '50% 50% 30% 30%',
              boxShadow: `0 0 12px ${themeColor}`,
            }}
          />
        )}
        {/* Lignes d'herbe */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40%',
            background: 'repeating-linear-gradient(90deg, var(--color-grass-5), var(--color-grass-5) 4px, var(--color-grass-4) 4px, var(--color-grass-4) 8px)',
          }}
        />
      </div>
      <div
        style={{
          marginTop: 6,
          fontFamily: 'var(--font-meme)',
          fontStyle: 'italic',
          fontSize: 12,
          color: 'var(--color-text-body)',
          textAlign: 'center',
        }}
      >
        Map {mapLevel} — {themeName}
        {bossName && (
          <div style={{ fontSize: 10, color: 'var(--color-accent-red)' }}>{bossName}</div>
        )}
      </div>
    </div>
  );
}

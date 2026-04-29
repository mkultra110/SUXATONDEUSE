// Carnet de Marcel : modal cahier d'ecolier ouvert avec pages quadrillees.
// Entrees datees, taches cafe, ecriture cursive Patrick Hand.

import { useState } from 'react';
import { MARCEL_LOG } from '../../data/marcel-log.js';
import { NotebookIcon } from '../icons/PixelIcon.js';

interface Props {
  onClose: () => void;
}

export function MarcelLog({ onClose }: Props) {
  const [pageIdx, setPageIdx] = useState(0);
  const entry = MARCEL_LOG[pageIdx];
  if (!entry) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: 'rgba(0, 0, 0, 0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          background: 'var(--color-paper-1)',
          backgroundImage:
            'linear-gradient(var(--color-water-1) 1px, transparent 1px), linear-gradient(90deg, var(--color-water-1) 1px, transparent 1px)',
          backgroundSize: '100% 28px, 28px 100%',
          backgroundPosition: '0 60px, 0 0',
          border: '4px solid var(--color-wood-5)',
          padding: 'clamp(14px, 4vw, 24px)',
          maxWidth: 480,
          width: '100%',
          maxHeight: '90dvh',
          overflowY: 'auto',
          cursor: 'default',
          boxShadow: '0 8px 0 var(--color-wood-5), 0 16px 32px rgba(0,0,0,0.5)',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Spirale cahier en haut */}
        <div
          style={{
            position: 'absolute',
            top: -12,
            left: 12,
            right: 12,
            height: 14,
            background:
              'repeating-linear-gradient(90deg, var(--color-wood-5) 0 4px, transparent 4px 16px)',
          }}
        />
        {/* Tache de cafe ronde decorative */}
        <span
          style={{
            position: 'absolute',
            top: 80,
            right: 30,
            width: 60,
            height: 60,
            borderRadius: '50%',
            background:
              'radial-gradient(circle at 35% 30%, rgba(139, 98, 64, 0.18), rgba(139, 98, 64, 0.05) 60%, transparent 80%)',
            pointerEvents: 'none',
          }}
        />

        {/* Header */}
        <div className="flex items-center gap-3 mb-4" style={{ borderBottom: '2px dashed var(--color-wood-3)', paddingBottom: 10 }}>
          <NotebookIcon size={32} />
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: 20,
                fontWeight: 700,
                color: 'var(--color-text-title)',
                margin: 0,
              }}
            >
              Carnet de Marcel
            </h2>
            <p
              className="meme"
              style={{
                fontSize: 14,
                color: 'var(--color-text-muted)',
                margin: 0,
                fontStyle: 'italic',
              }}
            >
              Page {pageIdx + 1} / {MARCEL_LOG.length}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'var(--color-accent-red)',
              color: 'var(--color-paper-1)',
              border: '2px solid var(--color-wood-5)',
              padding: '4px 10px',
              fontFamily: 'var(--font-button)',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 0 var(--color-wood-5)',
            }}
          >
            Fermer
          </button>
        </div>

        {/* Contenu de la page */}
        <div style={{ minHeight: 280 }}>
          <p
            className="meme"
            style={{
              fontSize: 16,
              color: 'var(--color-accent-red)',
              fontStyle: 'italic',
              marginBottom: 8,
            }}
          >
            {entry.date}
          </p>
          <h3
            className="meme"
            style={{
              fontFamily: 'var(--font-meme, "Patrick Hand", cursive)',
              fontSize: 24,
              color: 'var(--color-text-title)',
              fontWeight: 600,
              marginBottom: 14,
              borderBottom: '1px solid var(--color-paper-3)',
              paddingBottom: 6,
            }}
          >
            {entry.title}
          </h3>
          <p
            className="meme"
            style={{
              fontSize: 18,
              color: 'var(--color-text-body)',
              lineHeight: 1.6,
              whiteSpace: 'pre-line',
            }}
          >
            {entry.body}
          </p>
        </div>

        {/* Navigation pages */}
        <div className="flex justify-between items-center mt-4" style={{ borderTop: '2px dashed var(--color-wood-3)', paddingTop: 10 }}>
          <button
            type="button"
            disabled={pageIdx === 0}
            onClick={() => setPageIdx((p) => Math.max(0, p - 1))}
            className="pixel-btn pixel-btn-wood"
            style={{ minHeight: 'auto', fontSize: 11, padding: '6px 12px', opacity: pageIdx === 0 ? 0.5 : 1 }}
          >
            ‹ Précédente
          </button>
          <span
            className="numeric"
            style={{
              fontSize: 16,
              color: 'var(--color-text-muted)',
            }}
          >
            {pageIdx + 1} / {MARCEL_LOG.length}
          </span>
          <button
            type="button"
            disabled={pageIdx === MARCEL_LOG.length - 1}
            onClick={() => setPageIdx((p) => Math.min(MARCEL_LOG.length - 1, p + 1))}
            className="pixel-btn pixel-btn-wood"
            style={{ minHeight: 'auto', fontSize: 11, padding: '6px 12px', opacity: pageIdx === MARCEL_LOG.length - 1 ? 0.5 : 1 }}
          >
            Suivante ›
          </button>
        </div>
      </div>
    </div>
  );
}

// ShareProgress : bouton partager les stats sur reseaux (idee #450).
// Utilise navigator.share API (mobile) ou copie clipboard (desktop).

import { useState } from 'react';
import { useGameStore } from '../../stores/gameStore.js';
import { useUIStore } from '../../stores/uiStore.js';
import { computePlayerLevel, rankForLevel } from '../../utils/playerLevel.js';
import { formatBig } from '../../utils/format.js';
import { CrossIcon } from '../icons/PixelIcon.js';

export function ShareProgress({ open, onClose }: { open: boolean; onClose: () => void }) {
  const totalCash = useGameStore((s) => s.totalCashEarned);
  const playTime = useGameStore((s) => s.playTimeSeconds);
  const totalPrestiges = useGameStore((s) => s.totalPrestiges);
  const farmName = useUIStore((s) => s.farmName);
  const playerEmoji = useUIStore((s) => s.playerEmoji);
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const level = computePlayerLevel(totalCash);
  const rank = rankForLevel(level);
  const hours = Math.floor(playTime / 3600);
  const text = `${playerEmoji} ${farmName}\n` +
    `Niveau ${level} · ${rank.title}\n` +
    `${formatBig(totalCash)} pieces gagnees\n` +
    `${totalPrestiges} prestige(s) · ${hours}h de jeu\n` +
    `\n#FermeDesTournesols`;

  function shareNative() {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      void (navigator as Navigator & { share: (data: ShareData) => Promise<void> }).share({
        title: farmName,
        text,
      }).catch(() => { /* user cancel */ });
    } else {
      copyClipboard();
    }
  }

  function copyClipboard() {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => { /* ignore */ });
  }

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
          maxWidth: 380,
          background: 'var(--color-paper-1)',
          border: '4px solid var(--color-wood-5)',
          padding: 18,
        }}
      >
        <header className="flex items-center justify-between" style={{ marginBottom: 12 }}>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 18, fontWeight: 700, margin: 0 }}>
            Partager
          </h2>
          <button type="button" onClick={onClose} className="pixel-btn pixel-btn-wood" style={{ padding: 6 }} aria-label="Fermer">
            <CrossIcon size={14} />
          </button>
        </header>

        <pre
          style={{
            background: 'var(--color-paper-2)',
            border: '2px solid var(--color-wood-5)',
            padding: 12,
            fontFamily: 'var(--font-meme)',
            fontSize: 13,
            color: 'var(--color-text-body)',
            whiteSpace: 'pre-wrap',
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          {text}
        </pre>

        <div className="flex gap-2 mt-3" style={{ marginTop: 12 }}>
          <button
            type="button"
            onClick={shareNative}
            className="pixel-btn pixel-btn-gold"
            style={{ flex: 1, fontSize: 12 }}
          >
            Partager
          </button>
          <button
            type="button"
            onClick={copyClipboard}
            className="pixel-btn pixel-btn-wood"
            style={{ flex: 1, fontSize: 12 }}
          >
            {copied ? 'Copie !' : 'Copier'}
          </button>
        </div>
      </div>
    </div>
  );
}

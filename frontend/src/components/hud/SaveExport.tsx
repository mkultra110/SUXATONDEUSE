// SaveExport : modal de gestion sauvegarde (idees #391 #393 #394 #395).
// Ferme manuellement, exporte JSON, importe JSON, reset complet.

import { useEffect, useState } from 'react';
import { useGameStore } from '../../stores/gameStore.js';
import { CrossIcon } from '../icons/PixelIcon.js';

export function SaveExport({ open, onClose }: { open: boolean; onClose: () => void }) {
  const serialize = useGameStore((s) => s.serialize);
  const hydrate = useGameStore((s) => s.hydrate);
  const [showSaved, setShowSaved] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  // Auto-save toutes les 30s avec toast feedback (idee #390).
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const payload = serialize();
        localStorage.setItem('suxa-game-save', JSON.stringify(payload));
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 2000);
      } catch {
        /* ignore */
      }
    }, 30_000);
    return () => clearInterval(interval);
  }, [serialize]);

  function manualSave() {
    const payload = serialize();
    localStorage.setItem('suxa-game-save', JSON.stringify(payload));
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  }

  function exportJson() {
    const payload = serialize();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ferme-tournesols-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJson(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);
    file
      .text()
      .then((txt) => {
        try {
          const payload = JSON.parse(txt);
          hydrate(payload);
          alert('Sauvegarde restauree !');
          onClose();
        } catch (err) {
          setImportError(`Format invalide : ${(err as Error).message}`);
        }
      })
      .catch(() => setImportError('Lecture du fichier impossible'));
  }

  function resetAll() {
    if (!confirm('REMETRE A ZERO TOUT LE PROGRES ? Cette action est definitive.')) return;
    if (!confirm('Vraiment ? Memé Gisele ne te le pardonnera pas.')) return;
    try {
      localStorage.clear();
      window.location.reload();
    } catch {
      /* ignore */
    }
  }

  if (!open) return showSaved ? <div className="save-toast">Sauvegarde !</div> : null;

  return (
    <>
      {showSaved && <div className="save-toast">Sauvegarde !</div>}
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
            maxWidth: 360,
            background: 'var(--color-paper-1)',
            border: '4px solid var(--color-wood-5)',
            padding: 18,
          }}
        >
          <header className="flex items-center justify-between" style={{ marginBottom: 12 }}>
            <h2
              style={{ fontFamily: 'var(--font-title)', fontSize: 18, fontWeight: 700, color: 'var(--color-text-title)', margin: 0 }}
            >
              Sauvegarde
            </h2>
            <button type="button" onClick={onClose} className="pixel-btn pixel-btn-wood" style={{ padding: 6 }} aria-label="Fermer">
              <CrossIcon size={14} />
            </button>
          </header>
          <div className="flex flex-col gap-2">
            <button type="button" onClick={manualSave} className="pixel-btn pixel-btn-gold" style={{ fontSize: 12 }}>
              Sauvegarder maintenant
            </button>
            <button type="button" onClick={exportJson} className="pixel-btn pixel-btn-wood" style={{ fontSize: 12 }}>
              Telecharger en JSON
            </button>
            <label className="pixel-btn pixel-btn-wood" style={{ fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Restaurer depuis JSON
              <input type="file" accept="application/json" onChange={importJson} style={{ display: 'none' }} />
            </label>
            {importError && <p style={{ color: 'var(--color-accent-red)', fontSize: 11, margin: 0 }}>{importError}</p>}
            <button type="button" onClick={resetAll} className="pixel-btn pixel-btn-danger" style={{ fontSize: 12 }}>
              Tout remettre a zero
            </button>
          </div>
          <p
            className="meme"
            style={{ fontSize: 11, fontStyle: 'italic', color: 'var(--color-text-muted)', textAlign: 'center', margin: '12px 0 0' }}
          >
            « Auto-save toutes les 30 secondes. »
          </p>
        </div>
      </div>
    </>
  );
}

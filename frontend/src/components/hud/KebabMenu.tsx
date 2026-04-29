// Menu kebab de la TopBar : ouvre un dropdown panneau-bois avec
// les actions secondaires (Profil, Reglages, Carnet de Marcel, A propos,
// Deconnexion en separateur). La deconnexion exige une ConfirmDialog.

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useUIStore } from '../../stores/uiStore.js';
import { ConfirmDialog } from './ConfirmDialog.js';
import { MarcelLog } from './MarcelLog.js';
import { SettingsPanel } from './SettingsPanel.js';
import { SaveExport } from './SaveExport.js';
import { NotebookIcon, IconGear, StarIcon, HeartIcon, CrossIcon, NavCollectionIcon, TrophyIcon } from '../icons/PixelIcon.js';

interface KebabMenuProps {
  onClose?: () => void;
}

export function KebabMenu({ onClose }: KebabMenuProps) {
  const [open, setOpen] = useState(false);
  const [marcelOpen, setMarcelOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const setPolaroidAlbumOpen = useUIStore((s) => s.setPolaroidAlbumOpen);
  const setStatsHebdoOpen = useUIStore((s) => s.setStatsHebdoOpen);
  const setBestiaryOpen = useUIStore((s) => s.setBestiaryOpen);
  const setDailyChallengeOpen = useUIStore((s) => s.setDailyChallengeOpen);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const ref = useRef<HTMLDivElement>(null);

  // Ferme le dropdown au clic exterieur.
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        onClose?.();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, onClose]);

  async function handleLogout() {
    await logout();
    setConfirmLogout(false);
    setOpen(false);
    navigate('/auth', { replace: true });
  }

  return (
    <>
      <div ref={ref} style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
          aria-expanded={open}
          className="pixel-btn pixel-btn-wood"
          style={{
            minHeight: 44,
            minWidth: 44,
            padding: 0,
            fontSize: 22,
            lineHeight: 1,
          }}
        >
          ⋯
        </button>
        {open && (
          <div
            role="menu"
            style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              right: 0,
              minWidth: 220,
              background: 'var(--color-paper-1)',
              border: '3px solid var(--color-wood-5)',
              boxShadow: '0 6px 0 var(--color-wood-5), 0 12px 24px rgba(92, 61, 36, 0.5)',
              padding: 6,
              zIndex: 1100,
            }}
          >
            <MenuItem
              icon={<NotebookIcon size={18} />}
              label="Carnet de Marcel"
              onClick={() => {
                setMarcelOpen(true);
                setOpen(false);
              }}
            />
            <MenuItem
              icon={<HeartIcon size={18} />}
              label="À propos"
              onClick={() => {
                setAboutOpen(true);
                setOpen(false);
              }}
            />
            <MenuItem
              icon={<IconGear size={18} />}
              label="Réglages"
              onClick={() => {
                setSettingsOpen(true);
                setOpen(false);
              }}
            />
            <MenuItem
              icon={<NavCollectionIcon size={18} />}
              label="Album de la ferme"
              onClick={() => {
                setPolaroidAlbumOpen(true);
                setOpen(false);
              }}
            />
            <MenuItem
              icon={<TrophyIcon size={18} />}
              label="Bilan"
              onClick={() => {
                setStatsHebdoOpen(true);
                setOpen(false);
              }}
            />
            <MenuItem
              icon={<TrophyIcon size={18} />}
              label="Bestiaire"
              onClick={() => {
                setBestiaryOpen(true);
                setOpen(false);
              }}
            />
            <MenuItem
              icon={<StarIcon size={18} />}
              label="Defi du jour"
              onClick={() => {
                setDailyChallengeOpen(true);
                setOpen(false);
              }}
            />
            <MenuItem
              icon={<NotebookIcon size={18} />}
              label="Sauvegarde"
              onClick={() => {
                setSaveOpen(true);
                setOpen(false);
              }}
            />
            <MenuItem
              icon={<StarIcon size={18} />}
              label="Crédits"
              onClick={() => {
                setOpen(false);
              }}
            />
            <div
              style={{
                height: 2,
                background: 'var(--color-wood-3)',
                margin: '6px 0',
              }}
            />
            <MenuItem
              icon={<CrossIcon size={18} />}
              label="Déconnexion"
              destructive
              onClick={() => {
                setConfirmLogout(true);
                setOpen(false);
              }}
            />
          </div>
        )}
      </div>
      {marcelOpen && <MarcelLog onClose={() => setMarcelOpen(false)} />}
      {aboutOpen && <AboutDialog onClose={() => setAboutOpen(false)} />}
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <SaveExport open={saveOpen} onClose={() => setSaveOpen(false)} />

      <ConfirmDialog
        open={confirmLogout}
        title="Deconnexion ?"
        message="Mémé Gisèle veillera sur la ferme en ton absence."
        confirmLabel="Se déconnecter"
        cancelLabel="Rester"
        onConfirm={handleLogout}
        onCancel={() => setConfirmLogout(false)}
        destructive
      />
    </>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  destructive,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 10px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'var(--font-title)',
        fontSize: 13,
        fontWeight: 600,
        color: destructive ? 'var(--color-accent-red)' : 'var(--color-text-title)',
        textAlign: 'left',
        opacity: destructive ? 0.85 : 1,
        transition: 'background 100ms ease-out',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--color-paper-2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function AboutDialog({ onClose }: { onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 3000,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="panel-paper"
        style={{
          maxWidth: 380,
          width: '100%',
          padding: 22,
          cursor: 'default',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: 26,
            fontWeight: 700,
            color: 'var(--color-accent-gold)',
            margin: '0 0 4px',
          }}
        >
          La Ferme des Tournesols
        </h1>
        <p
          className="meme"
          style={{
            fontSize: 16,
            color: 'var(--color-text-muted)',
            fontStyle: 'italic',
            margin: '0 0 16px',
          }}
        >
          Fondée en 1962 par Mémé Gisèle
        </p>
        <p className="meme" style={{ fontSize: 16, color: 'var(--color-text-body)', lineHeight: 1.5 }}>
          Bienvenue dans cette petite ferme française où Mémé Gisèle a passé
          sa vie. Aujourd'hui, c'est ton tour de prendre soin des tournesols
          et de la flotte de robots tondeuses.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="pixel-btn pixel-btn-wood"
          style={{ marginTop: 16, fontSize: 12 }}
        >
          Fermer
        </button>
      </div>
    </div>
  );
}

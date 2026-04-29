// FABs flottants RCT-Touch : Carnet de Marcel a gauche (toujours visible),
// Retour a droite (visible uniquement si onCloseSubView est defini).
// Position fixed bottom + safe-area inset.

import { NotebookIcon, ArrowLeftIcon } from '../icons/PixelIcon.js';

interface ActivityFABProps {
  notificationCount?: number;
  onClick: () => void;
  visible?: boolean;
}

export function ActivityFAB({ notificationCount = 0, onClick, visible = true }: ActivityFABProps) {
  if (!visible) return null;
  const cap = notificationCount > 9 ? '9+' : String(notificationCount);
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          try {
            navigator.vibrate(8);
          } catch {
            /* ignore */
          }
        }
        onClick();
      }}
      aria-label="Carnet de Marcel"
      className="farm-fab farm-fab-pulse"
      style={{
        position: 'fixed',
        // Au-dessus de la bottom tab bar mobile (84px = 72px nav + 12px gap),
        // ou en bas direct sur tablet/desktop ou il n'y a pas de tab bar.
        left: 'calc(env(safe-area-inset-left, 0px) + 12px)',
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 84px)',
        zIndex: 850,
      }}
    >
      <NotebookIcon size={28} />
      {notificationCount > 0 && (
        <span className="farm-fab-badge">{cap}</span>
      )}
    </button>
  );
}

interface BackFABProps {
  onClick: () => void;
  visible: boolean;
}

export function BackFAB({ onClick, visible }: BackFABProps) {
  if (!visible) return null;
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          try {
            navigator.vibrate(8);
          } catch {
            /* ignore */
          }
        }
        onClick();
      }}
      aria-label="Retour"
      className="farm-fab farm-fab-back"
      style={{
        position: 'fixed',
        right: 'calc(env(safe-area-inset-right, 0px) + 12px)',
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 84px)',
        zIndex: 850,
      }}
    >
      <ArrowLeftIcon size={28} />
    </button>
  );
}

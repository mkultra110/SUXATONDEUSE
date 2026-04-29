// Dialog de confirmation Stardew-style : panneau bois centre avec
// 4 sceaux cire aux coins, titre + corps + boutons Annuler / Confirmer.
// Utilisé pour la deconnexion + autres actions destructrices.

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  onConfirm,
  onCancel,
  destructive = false,
}: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <div
      onClick={onCancel}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 3500,
        background: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="panel-9"
        style={{
          maxWidth: 360,
          width: '100%',
          padding: 18,
          cursor: 'default',
          position: 'relative',
        }}
      >
        <span className="nail-bl" />
        <span className="nail-br" />
        <h2
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--color-text-title)',
            margin: '0 0 10px',
            textAlign: 'center',
          }}
        >
          {title}
        </h2>
        <p
          className="meme"
          style={{
            fontSize: 16,
            color: 'var(--color-text-body)',
            textAlign: 'center',
            margin: '0 0 16px',
            lineHeight: 1.4,
          }}
        >
          {message}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="pixel-btn pixel-btn-wood"
            style={{ flex: 1, fontSize: 12 }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`pixel-btn ${destructive ? 'pixel-btn-danger' : 'pixel-btn-gold'}`}
            style={{ flex: 1, fontSize: 12 }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

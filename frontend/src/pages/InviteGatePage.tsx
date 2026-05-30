// Page affichee quand le lien d'invite est expire ou absent.
// Indique a l'utilisateur de retourner sur Discord pour demander un nouveau lien.
// Stylée avec le design system « Jardin de Poche » (scopé .jardin).

import '../design/jardin/jardin.css';
import { BigLockIcon } from '../components/icons/PixelIcon.js';

interface Props {
  message: string;
}

export function InviteGatePage({ message }: Props) {
  return (
    <div
      className="jardin"
      data-theme="jour"
      style={{
        minHeight: '100dvh',
        display: 'grid',
        placeItems: 'center',
        padding: 'var(--space-4)',
        background: 'linear-gradient(var(--sky-top), var(--sky-bottom))',
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: 420,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-4)',
        }}
      >
        <BigLockIcon size={88} />
        <h1
          style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 'var(--text-2xl)',
            color: 'var(--ink)',
            margin: 0,
            lineHeight: 1.15,
          }}
        >
          Accès refusé
        </h1>
        <p style={{ fontWeight: 700, color: 'var(--ink-2)', margin: 0, lineHeight: 1.5 }}>
          {message}
        </p>

        <div className="card card--inset" style={{ width: '100%' }}>
          <p style={{ fontWeight: 800, margin: '0 0 var(--space-2)' }}>
            Sur Discord, tape la commande :
          </p>
          <span
            className="chip chip--coin"
            style={{ fontSize: 'var(--text-md)', justifyContent: 'center' }}
          >
            /suxa_tondeuse
          </span>
          <p className="muted-note" style={{ margin: 'var(--space-3) 0 0' }}>
            Tu recevras un nouveau lien valable 1 heure.
          </p>
        </div>
      </div>
    </div>
  );
}

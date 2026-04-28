// Page affichee quand le lien d'invite est expire ou absent.
// Indique a l'utilisateur de retourner sur Discord pour demander un nouveau lien.

import { BigLockIcon } from '../components/icons/PixelIcon.js';

interface Props {
  message: string;
}

export function InviteGatePage({ message }: Props) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-b from-sky-deep to-grass-deep p-4">
      <div className="panel-paper w-full max-w-md p-6 flex flex-col items-center gap-4 text-center">
        <BigLockIcon size={96} />
        <h1
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: 28,
            fontWeight: 700,
            color: 'var(--color-text-title)',
          }}
        >
          Accès refusé
        </h1>
        <p className="meme" style={{ fontSize: 18, color: 'var(--color-text-body)' }}>
          {message}
        </p>
        <div
          className="panel-9"
          style={{ marginTop: 8, padding: 12, color: 'var(--color-paper-1)' }}
        >
          <span className="nail-bl" />
          <span className="nail-br" />
          <span style={{ fontSize: 14 }}>Sur Discord, tape la commande :</span>
          <br />
          <code
            style={{
              fontFamily: 'var(--font-numeric)',
              fontSize: 18,
              color: 'var(--color-accent-gold)',
              fontWeight: 700,
            }}
          >
            /suxa_tondeuse
          </code>
          <br />
          <span style={{ fontSize: 13, color: 'var(--color-paper-3)' }}>
            Tu recevras un nouveau lien valable 1 heure.
          </span>
        </div>
      </div>
    </div>
  );
}

// Page affichee quand le lien d'invite est expire ou absent.
// Indique a l'utilisateur de retourner sur Discord pour demander un nouveau lien.

interface Props {
  message: string;
}

export function InviteGatePage({ message }: Props) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-b from-sky-deep to-grass-deep p-4">
      <div className="panel w-full max-w-md p-6 flex flex-col items-center gap-4 text-center">
        <div className="text-6xl">🔒</div>
        <h1 className="text-2xl font-bold text-ink-base">Acces refuse</h1>
        <p className="text-ink-dark">{message}</p>
        <div className="text-sm text-ink-dark mt-2 panel bg-grass-shadow p-3 text-panel-base">
          Sur Discord, tape la commande : <br />
          <code className="text-accent-gold font-bold">/suxa_tondeuse</code>
          <br />
          Tu recevras un nouveau lien valable 1 heure.
        </div>
      </div>
    </div>
  );
}

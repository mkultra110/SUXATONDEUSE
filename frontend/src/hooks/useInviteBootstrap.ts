// Hook qui consomme le query param ?invite=xxx au tout premier chargement.
// Si present, l'echange contre un cookie httpOnly cote serveur, puis nettoie
// l'URL pour eviter de partager le token. Ensuite, verifie si l'invite est
// toujours valide via /auth/invite/status.

import { useEffect, useState } from 'react';
import { apiInviteStatus, apiRedeemInvite } from '../api/invite.api.js';

interface InviteState {
  isChecking: boolean;
  isValid: boolean;
  expiresAt: string | null;
  errorMessage: string | null;
}

export function useInviteBootstrap(): InviteState {
  const [state, setState] = useState<InviteState>({
    isChecking: true,
    isValid: false,
    expiresAt: null,
    errorMessage: null,
  });

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const inviteToken = params.get('invite');

        if (inviteToken) {
          // Echange immediat contre cookie, puis nettoie l'URL.
          try {
            const { expiresAt } = await apiRedeemInvite(inviteToken);
            if (cancelled) return;
            params.delete('invite');
            const newUrl =
              window.location.pathname +
              (params.toString() ? `?${params.toString()}` : '') +
              window.location.hash;
            window.history.replaceState({}, '', newUrl);
            setState({ isChecking: false, isValid: true, expiresAt, errorMessage: null });
            return;
          } catch (err: unknown) {
            const status = (err as { response?: { status?: number } })?.response?.status;
            const msg =
              status === 401
                ? 'Le lien a expire. Demande un nouveau lien sur Discord avec /suxa_tondeuse.'
                : 'Lien invalide.';
            setState({ isChecking: false, isValid: false, expiresAt: null, errorMessage: msg });
            return;
          }
        }

        // Pas de token dans l'URL : verifie le cookie existant.
        const status = await apiInviteStatus();
        if (cancelled) return;
        setState({
          isChecking: false,
          isValid: status.valid,
          expiresAt: status.expiresAt ?? null,
          errorMessage: status.valid
            ? null
            : 'Demande un lien d\'acces sur Discord avec /suxa_tondeuse.',
        });
      } catch {
        if (cancelled) return;
        setState({
          isChecking: false,
          isValid: false,
          expiresAt: null,
          errorMessage: 'Impossible de verifier l\'acces.',
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

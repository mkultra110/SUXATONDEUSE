// UsernameEasterEgg : si le joueur s'appelle Marcel ou Gisele,
// affiche un message de bienvenue special + bonus initial 1x.

import { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { useGameStore } from '../../stores/gameStore.js';
import Decimal from 'break_infinity.js';

const STORAGE_KEY = 'suxa-username-egg';

export function UsernameEasterEgg() {
  const { user } = useAuth();
  const username = user?.username ?? '';

  useEffect(() => {
    if (!username) return;
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === username.toLowerCase()) return;
    const lower = username.toLowerCase();
    if (lower === 'marcel' || lower === 'gisele' || lower === 'memé' || lower === 'meme' || lower === 'pompon') {
      window.localStorage.setItem(STORAGE_KEY, lower);
      const state = useGameStore.getState();
      useGameStore.setState({
        cash: state.cash.add(new Decimal(100_000)),
        gems: state.gems + 50,
      });
      window.dispatchEvent(
        new CustomEvent('meme-dialogue', {
          detail: {
            id: `egg-${lower}`,
            text: `« Tu t'appelles ${username} ? Comme... tiens, voilà 100 000 pièces et 50 graines pour fêter ça. »`,
          },
        }),
      );
    }
  }, [username]);

  return null;
}

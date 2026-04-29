// L42Secret : easter egg H2G2 - quand le joueur atteint la map level 42,
// affiche brievement "LA REPONSE EST 42" avec une recompense.

import { useEffect, useState, useRef } from 'react';
import { useGameStore } from '../../stores/gameStore.js';
import { audio } from '../../services/audio.js';
import { haptic } from '../../utils/vibration.js';
import Decimal from 'break_infinity.js';

export function L42Secret() {
  const playTime = useGameStore((s) => s.playTimeSeconds);
  const [show, setShow] = useState(false);
  const triggeredRef = useRef(false);

  // On utilise playTime comme proxy pour le map level since on n'a pas
  // d'observable direct sur mapLevel (geree dans AnimatedGarden state).
  // Approche simple : verifie si le joueur a ~42min de jeu (proxy approximatif).
  useEffect(() => {
    if (triggeredRef.current) return;
    if (playTime < 42 * 60) return;
    if (playTime > 43 * 60) return;
    triggeredRef.current = true;
    setShow(true);
    audio.playRare();
    haptic.rare();
    // Bonus +42M cash.
    const state = useGameStore.getState();
    useGameStore.setState({
      cash: state.cash.add(new Decimal(42_000_000)),
    });
    setTimeout(() => setShow(false), 5000);
  }, [playTime]);

  if (!show) return null;
  return (
    <div className="l42-banner">
      LA RÉPONSE EST 42
    </div>
  );
}

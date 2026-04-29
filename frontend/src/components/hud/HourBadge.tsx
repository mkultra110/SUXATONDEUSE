// HourBadge : compteur d'heures de jeu en bas-droite (idee #115).
// Tres discret, juste pour avoir le sentiment de progression long-term.

import { useGameStore } from '../../stores/gameStore.js';

export function HourBadge() {
  const playTime = useGameStore((s) => s.playTimeSeconds);
  const hours = Math.floor(playTime / 3600);
  if (hours < 1) return null;
  return (
    <div className="hour-badge" title={`${hours}h de jeu cumule`}>
      {hours}h
    </div>
  );
}

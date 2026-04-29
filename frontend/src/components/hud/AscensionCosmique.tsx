// AscensionCosmique : overlay qui s'eleve sur le 5eme+ prestige
// (apres atteinte d'un palier). Sentiment d'ascension finale.

import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../../stores/gameStore.js';

export function AscensionCosmique() {
  const totalPrestiges = useGameStore((s) => s.totalPrestiges);
  const lastRef = useRef(totalPrestiges);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (totalPrestiges > lastRef.current) {
      lastRef.current = totalPrestiges;
      // Trigger ascension sur prestiges 5, 10, 25, 50, 100.
      if ([5, 10, 25, 50, 100].includes(totalPrestiges)) {
        setShow(true);
        setTimeout(() => setShow(false), 3000);
      }
    }
  }, [totalPrestiges]);

  if (!show) return null;
  return <div className="ascension-overlay" />;
}

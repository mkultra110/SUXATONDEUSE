// NextAffordableChip : pill flottante qui apparait quand un nouveau
// robot devient achetable pour la 1ere fois (research idee #5 + polish).
// Disparait apres 4s ou clic.

import { useEffect, useRef, useState } from 'react';
import { useGameStore, nextRobotCost } from '../../stores/gameStore.js';
import { ROBOT_TIERS, type RobotType } from '@robomow/shared';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '../../stores/uiStore.js';

export function NextAffordableChip() {
  const { t } = useTranslation();
  const cash = useGameStore((s) => s.cash);
  const holdings = useGameStore((s) => s.holdings);
  const setActiveTab = useUIStore((s) => s.setActiveTab);
  const lastAffordableRef = useRef<RobotType | null>(null);
  const [chip, setChip] = useState<{ type: RobotType; name: string } | null>(null);

  useEffect(() => {
    // Cherche le robot tier non-poss avec cost le plus bas qui devient affordable.
    for (const tier of ROBOT_TIERS) {
      if (holdings[tier.type].owned > 0) continue; // deja possede
      const cost = nextRobotCost(holdings, tier.type);
      if (cash.gte(cost)) {
        if (lastAffordableRef.current !== tier.type) {
          lastAffordableRef.current = tier.type;
          setChip({ type: tier.type, name: t(`robotNicknames.${tier.type}`, tier.name) });
        }
        return;
      }
    }
    lastAffordableRef.current = null;
  }, [cash, holdings, t]);

  useEffect(() => {
    if (!chip) return;
    const t = setTimeout(() => setChip(null), 4500);
    return () => clearTimeout(t);
  }, [chip]);

  if (!chip) return null;

  return (
    <button
      type="button"
      onClick={() => {
        setActiveTab('shop');
        setChip(null);
      }}
      style={{
        position: 'fixed',
        bottom: 'calc(160px + env(safe-area-inset-bottom, 0px))',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1500,
        background: 'var(--color-paper-1)',
        border: '3px solid var(--color-grass-5)',
        padding: '8px 16px',
        fontFamily: 'var(--font-button)',
        fontSize: 11,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--color-grass-7)',
        cursor: 'pointer',
        boxShadow: '0 4px 0 var(--color-wood-5), 0 0 24px rgba(143, 191, 79, 0.6)',
        animation: 'levelup-drop 600ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        opacity: 0,
        whiteSpace: 'nowrap',
      }}
      aria-label={`${chip.name} desormais achetable`}
    >
      🎯 Nouveau : <strong>{chip.name}</strong> est achetable !
    </button>
  );
}

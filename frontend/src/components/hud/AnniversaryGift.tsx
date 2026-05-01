// AnniversaryGift : modal "Tu joues depuis N jours" qui pop tous les 7
// jours de save (paliers 7, 14, 30, 60, 90, 180, 365). Octroie un cadeau.

import { useEffect, useState } from 'react';
import { useGameStore } from '../../stores/gameStore.js';
import { useUIStore } from '../../stores/uiStore.js';
import { CoinIcon, SeedIcon, StarIcon } from '../icons/PixelIcon.js';
import { audio } from '../../services/audio.js';
import { haptic } from '../../utils/vibration.js';
import { formatBig } from '../../utils/format.js';
import Decimal from 'break_infinity.js';

const ANNIVERSARY_TIERS: ReadonlyArray<{ days: number; label: string; cash: number; gems: number }> = [
  { days: 7, label: 'Une semaine', cash: 5_000, gems: 5 },
  { days: 14, label: 'Deux semaines', cash: 50_000, gems: 10 },
  { days: 30, label: 'Un mois', cash: 500_000, gems: 25 },
  { days: 60, label: 'Deux mois', cash: 5_000_000, gems: 50 },
  { days: 90, label: 'Un trimestre', cash: 50_000_000, gems: 100 },
  { days: 180, label: 'Six mois', cash: 1_000_000_000, gems: 250 },
  { days: 365, label: 'Une année', cash: 100_000_000_000, gems: 1000 },
];

function tierForDay(d: number): typeof ANNIVERSARY_TIERS[number] | null {
  for (let i = ANNIVERSARY_TIERS.length - 1; i >= 0; i--) {
    const tier = ANNIVERSARY_TIERS[i]!;
    if (d >= tier.days) return tier;
  }
  return null;
}

export function AnniversaryGift() {
  const playTime = useGameStore((s) => s.playTimeSeconds);
  const lastDay = useUIStore((s) => s.lastAnniversaryDay);
  const setLastDay = useUIStore((s) => s.setLastAnniversaryDay);
  const [open, setOpen] = useState(false);
  const [activeTier, setActiveTier] = useState<typeof ANNIVERSARY_TIERS[number] | null>(null);

  // Recalcule UNIQUEMENT quand le palier "days" change, pas chaque seconde.
  const dayCount = Math.floor(playTime / 86_400);
  useEffect(() => {
    const tier = tierForDay(dayCount);
    if (tier && tier.days > lastDay) {
      setActiveTier(tier);
      setOpen(true);
      audio.playRankUp();
      haptic.rare();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayCount]);

  function claim() {
    if (!activeTier) return;
    // Override directement le state pour appliquer le bonus.
    const state = useGameStore.getState();
    useGameStore.setState({
      cash: state.cash.add(new Decimal(activeTier.cash)),
      gems: state.gems + activeTier.gems,
    });
    setLastDay(activeTier.days);
    setOpen(false);
    setActiveTier(null);
    audio.playPurchase();
  }

  if (!open || !activeTier) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1700,
        background: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      role="dialog"
      aria-labelledby="anniv-title"
    >
      <div
        className="panel-9"
        style={{
          padding: 24,
          maxWidth: 360,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          position: 'relative',
          background: 'var(--color-paper-1)',
          animation: 'levelup-drop 600ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          opacity: 0,
        }}
      >
        <span className="nail-bl" />
        <span className="nail-br" />
        <div
          style={{
            fontFamily: 'var(--font-button)',
            fontSize: 11,
            color: 'var(--color-text-muted)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          Anniversaire de la ferme
        </div>
        <h2
          id="anniv-title"
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: 26,
            fontWeight: 700,
            color: 'var(--color-accent-gold)',
            textShadow: '2px 2px 0 var(--color-wood-5)',
            margin: 0,
          }}
        >
          {activeTier.label} !
        </h2>
        <p className="meme" style={{ fontSize: 14, color: 'var(--color-text-body)', fontStyle: 'italic', margin: 0 }}>
          « Mémé Gisèle est fière de toi. Tiens, voilà un cadeau. »
        </p>
        <div className="flex items-center justify-center gap-3 my-2">
          <span className="flex items-center gap-1">
            <CoinIcon size={20} />
            <span className="numeric" style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-accent-gold)' }}>
              +{formatBig(activeTier.cash)}
            </span>
          </span>
          <span className="flex items-center gap-1">
            <SeedIcon size={20} />
            <span className="numeric" style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-accent-purple)' }}>
              +{activeTier.gems}
            </span>
          </span>
        </div>
        <button type="button" onClick={claim} className="pixel-btn pixel-btn-gold" style={{ fontSize: 14 }}>
          <StarIcon size={14} />
          Récupérer
        </button>
      </div>
    </div>
  );
}

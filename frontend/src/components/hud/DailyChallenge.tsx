// DailyChallenge : modal qui affiche un defi quotidien deterministe (idee #581).
// Le defi est genere a partir de la date du jour : meme defi pour tous les
// joueurs un meme jour. Recompense bonus en cash si valide.

import { useEffect, useState } from 'react';
import { useUIStore } from '../../stores/uiStore.js';
import { useGameStore } from '../../stores/gameStore.js';
import { CrossIcon, CoinIcon, StarIcon } from '../icons/PixelIcon.js';
import { formatBig } from '../../utils/format.js';
import Decimal from 'break_infinity.js';

interface ChallengeDef {
  id: string;
  title: string;
  description: string;
  goal: number;
  reward: number; // cash bonus
  // Type d'objectif : tap N fois / acheter N robots / tondre N tuiles.
  kind: 'taps' | 'robots' | 'grass';
}

const CHALLENGES_TEMPLATE: ReadonlyArray<ChallengeDef> = [
  { id: 'taps-100', title: 'Taps maitre', description: 'Faire 100 taps manuels', goal: 100, reward: 5_000, kind: 'taps' },
  { id: 'robots-5', title: 'Investisseur', description: 'Acheter 5 robots', goal: 5, reward: 25_000, kind: 'robots' },
  { id: 'grass-1k', title: 'Tondeur infatigable', description: 'Tondre 1000 tuiles d\'herbe', goal: 1000, reward: 50_000, kind: 'grass' },
  { id: 'taps-500', title: 'Hyper-tap', description: 'Faire 500 taps', goal: 500, reward: 100_000, kind: 'taps' },
  { id: 'robots-25', title: 'Magnat', description: 'Acheter 25 robots', goal: 25, reward: 1_000_000, kind: 'robots' },
];

function challengeForDate(d: Date): ChallengeDef {
  // Hash deterministe simple (DDMMYYYY % len).
  const seed = d.getDate() * 31 + (d.getMonth() + 1) * 17 + d.getFullYear();
  const idx = seed % CHALLENGES_TEMPLATE.length;
  return CHALLENGES_TEMPLATE[idx]!;
}

export function DailyChallenge() {
  const open = useUIStore((s) => s.dailyChallengeOpen);
  const setOpen = useUIStore((s) => s.setDailyChallengeOpen);
  const dailyTaps = useGameStore((s) => s.dailyTaps);
  const dailyRobots = useGameStore((s) => s.dailyRobotsBought);
  const dailyGrass = useGameStore((s) => s.dailyGrassMowed);
  const cash = useGameStore((s) => s.cash);
  const [claimed, setClaimed] = useState(false);

  const challenge = challengeForDate(new Date());
  const progress =
    challenge.kind === 'taps'
      ? dailyTaps
      : challenge.kind === 'robots'
        ? dailyRobots
        : Number(dailyGrass.toString());
  const ratio = Math.min(1, progress / challenge.goal);
  const completed = ratio >= 1;

  useEffect(() => {
    if (!open) {
      setClaimed(false);
    }
  }, [open]);

  function claim() {
    if (!completed || claimed) return;
    useGameStore.setState({
      cash: cash.add(new Decimal(challenge.reward)),
    });
    setClaimed(true);
  }

  if (!open) return null;
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1600,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      role="dialog"
    >
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          background: 'var(--color-paper-1)',
          border: '4px solid var(--color-wood-5)',
          padding: 18,
        }}
      >
        <header className="flex items-center justify-between" style={{ marginBottom: 12 }}>
          <h2
            style={{
              fontFamily: 'var(--font-title)',
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--color-text-title)',
              margin: 0,
            }}
          >
            Défi du jour
          </h2>
          <button type="button" onClick={() => setOpen(false)} className="pixel-btn pixel-btn-wood" style={{ padding: 6 }} aria-label="Fermer">
            <CrossIcon size={14} />
          </button>
        </header>

        <div className="panel-paper" style={{ padding: 14 }}>
          <h3 style={{ margin: '0 0 4px', fontFamily: 'var(--font-title)', fontSize: 16, color: 'var(--color-text-title)' }}>
            {challenge.title}
          </h3>
          <p style={{ margin: '0 0 8px', fontSize: 12, color: 'var(--color-text-muted)' }}>
            {challenge.description}
          </p>
          <div style={{ height: 8, background: 'var(--color-wood-3)', borderRadius: 4, overflow: 'hidden', marginBottom: 6 }}>
            <div
              style={{
                width: `${ratio * 100}%`,
                height: '100%',
                background: completed ? 'var(--color-accent-gold)' : 'var(--color-grass-5)',
                transition: 'width 400ms ease',
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: 'var(--color-text-muted)' }}>
            <span className="numeric">{progress} / {challenge.goal}</span>
            <span className="flex items-center gap-1">
              <CoinIcon size={12} />
              <span className="numeric">+{formatBig(challenge.reward)}</span>
            </span>
          </div>
          <button
            type="button"
            onClick={claim}
            disabled={!completed || claimed}
            className={completed && !claimed ? 'pixel-btn pixel-btn-gold' : 'pixel-btn pixel-btn-wood'}
            style={{ marginTop: 10, fontSize: 12, width: '100%' }}
          >
            <StarIcon size={12} />
            {claimed ? 'Recompense recue' : completed ? 'Reclamer' : 'En cours...'}
          </button>
        </div>

        <p
          className="meme"
          style={{ fontSize: 11, fontStyle: 'italic', color: 'var(--color-text-muted)', textAlign: 'center', margin: '10px 0 0' }}
        >
          « Un nouveau defi chaque jour, mon petit. »
        </p>
      </div>
    </div>
  );
}

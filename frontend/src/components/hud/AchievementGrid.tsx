// AchievementGrid : modal full-screen grid 6-col des achievements
// (idees #27 #497). Reuse ACHIEVEMENTS du shared package.

import { ACHIEVEMENTS } from '@robomow/shared';
import { useGameStore } from '../../stores/gameStore.js';
import { useUIStore } from '../../stores/uiStore.js';
import { CrossIcon, TrophyIcon } from '../icons/PixelIcon.js';

export function AchievementGrid() {
  const open = useUIStore((s) => s.achievementGridOpen);
  const setOpen = useUIStore((s) => s.setAchievementGridOpen);
  const unlocked = useGameStore((s) => s.achievementsUnlocked);

  if (!open) return null;

  const ownedCount = Array.from(unlocked).filter((k) => !k.endsWith(':claimed')).length;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1600,
        background: 'rgba(0,0,0,0.8)',
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
          maxWidth: 640,
          background: 'var(--color-paper-1)',
          border: '4px solid var(--color-wood-5)',
          padding: 18,
          maxHeight: '90vh',
          overflow: 'auto',
        }}
      >
        <header className="flex items-center justify-between" style={{ marginBottom: 12 }}>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 20, fontWeight: 700, margin: 0 }}>
            Trophées <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{ownedCount} / {ACHIEVEMENTS.length}</span>
          </h2>
          <button type="button" onClick={() => setOpen(false)} className="pixel-btn pixel-btn-wood" style={{ padding: 6 }} aria-label="Fermer">
            <CrossIcon size={14} />
          </button>
        </header>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
            gap: 10,
          }}
        >
          {ACHIEVEMENTS.map((ach) => {
            const isUnlocked = unlocked.has(ach.key);
            const hidden = ach.hidden && !isUnlocked;
            return (
              <div
                key={ach.key}
                title={hidden ? '???' : `${ach.name}\n${ach.description}`}
                className={isUnlocked ? 'achievement-unlocked' : ''}
                style={{
                  aspectRatio: '1',
                  background: isUnlocked ? 'var(--color-accent-gold)' : 'var(--color-paper-3)',
                  border: '2px solid var(--color-wood-5)',
                  borderRadius: 6,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  opacity: hidden ? 0.3 : isUnlocked ? 1 : 0.55,
                  filter: hidden ? 'blur(2px) grayscale(1)' : isUnlocked ? undefined : 'grayscale(0.5)',
                  textAlign: 'center',
                  padding: 4,
                }}
              >
                <TrophyIcon size={24} />
                <span
                  style={{
                    fontFamily: 'var(--font-button)',
                    fontSize: 8,
                    color: 'var(--color-wood-5)',
                    lineHeight: 1.1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {hidden ? '???' : ach.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

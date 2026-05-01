// AchievementGrid : modal full-screen grid 6-col des achievements
// (idees #27 #497). Reuse ACHIEVEMENTS du shared package.

import { useState } from 'react';
import { ACHIEVEMENTS } from '@robomow/shared';
import { useGameStore } from '../../stores/gameStore.js';
import { useUIStore } from '../../stores/uiStore.js';
import { CrossIcon, TrophyIcon } from '../icons/PixelIcon.js';

type Filter = 'all' | 'owned' | 'locked';

export function AchievementGrid() {
  const open = useUIStore((s) => s.achievementGridOpen);
  const setOpen = useUIStore((s) => s.setAchievementGridOpen);
  const unlocked = useGameStore((s) => s.achievementsUnlocked);
  const [filter, setFilter] = useState<Filter>('all');

  if (!open) return null;

  const ownedCount = Array.from(unlocked).filter((k) => !k.endsWith(':claimed')).length;
  const filteredAchievements = ACHIEVEMENTS.filter((ach) => {
    if (filter === 'owned') return unlocked.has(ach.key);
    if (filter === 'locked') return !unlocked.has(ach.key);
    return true;
  });

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

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
          {(['all', 'owned', 'locked'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              style={{
                padding: '4px 12px',
                background: filter === f ? 'var(--color-accent-gold)' : 'var(--color-paper-2)',
                border: '2px solid var(--color-wood-5)',
                borderRadius: 9999,
                fontFamily: 'var(--font-button)',
                fontSize: 10,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                color: filter === f ? 'var(--color-wood-5)' : 'var(--color-text-muted)',
                fontWeight: filter === f ? 700 : 500,
              }}
            >
              {f === 'all' ? `Tous · ${ACHIEVEMENTS.length}` : f === 'owned' ? `Obtenus · ${ownedCount}` : `Verrouillés · ${ACHIEVEMENTS.length - ownedCount}`}
            </button>
          ))}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="empty-state">
            <span style={{ fontSize: 32 }}>🏆</span>
            « Aucun trophée dans cette categorie. »
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
            gap: 10,
          }}
        >
          {filteredAchievements.map((ach) => {
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

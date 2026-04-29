// Panel achievements : liste de cards panel-paper avec trophy/lock icons,
// reward pill, bouton claim gold.

import { useTranslation } from 'react-i18next';
import { ACHIEVEMENTS } from '@robomow/shared';
import { useGameStore } from '../../stores/gameStore.js';
import { CoinIcon, FuelIcon, TrophyIcon } from '../icons/PixelIcon.js';

function LockSvg({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" style={{ width: size, height: size, imageRendering: 'pixelated' }}>
      <rect x="5" y="2" width="6" height="2" fill="#5c3d24" />
      <rect x="4" y="3" width="2" height="4" fill="#5c3d24" />
      <rect x="10" y="3" width="2" height="4" fill="#5c3d24" />
      <rect x="3" y="7" width="10" height="7" fill="#c49b6a" />
      <rect x="3" y="7" width="10" height="2" fill="#f5e6c8" />
      <rect x="3" y="13" width="10" height="1" fill="#5c3d24" />
      <rect x="7" y="9" width="2" height="3" fill="#5c3d24" />
    </svg>
  );
}

export function AchievementsPanel() {
  const { t } = useTranslation();
  const unlocked = useGameStore((s) => s.achievementsUnlocked);
  const claimAchievement = useGameStore((s) => s.claimAchievement);

  const visible = ACHIEVEMENTS.filter((ach) => !ach.hidden || unlocked.has(ach.key));
  const ownedCount = Array.from(unlocked).filter((k) => !k.endsWith(':claimed')).length;

  return (
    <aside className="flex flex-col gap-3 max-h-[80vh]">
      <header className="flex items-center justify-between gap-2 px-1">
        <h2
          className="flex items-center gap-2 text-lg leading-none"
          style={{ fontFamily: 'var(--font-title)', color: 'var(--color-text-title)' }}
        >
          <TrophyIcon size={22} />
          {t('achievements.title')}
        </h2>
        <span
          className="numeric"
          style={{
            background: 'var(--color-wood-5)',
            color: 'var(--color-accent-gold)',
            padding: '3px 8px',
            border: '2px solid var(--color-wood-4)',
            borderRadius: 3,
            fontFamily: 'var(--font-button)',
            fontSize: 11,
            letterSpacing: '0.05em',
          }}
        >
          {ownedCount} / {ACHIEVEMENTS.length}
        </span>
      </header>

      <div className="overflow-y-auto pr-1 flex flex-col gap-2" style={{ maxHeight: 'calc(80vh - 60px)' }}>
        {visible.map((ach) => {
          const isUnlocked = unlocked.has(ach.key);
          const claimed = unlocked.has(`${ach.key}:claimed`);
          return (
            <div
              key={ach.key}
              className="panel-paper"
              style={{
                padding: 10,
                display: 'flex',
                gap: 10,
                alignItems: 'center',
                opacity: isUnlocked ? 1 : 0.55,
                filter: isUnlocked ? undefined : 'grayscale(0.5)',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  background: isUnlocked ? 'var(--color-accent-gold)' : 'var(--color-paper-3)',
                  border: '2px solid var(--color-wood-5)',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isUnlocked
                    ? 'inset 0 -2px 0 #a87a1f, 0 2px 0 var(--color-wood-5), 0 0 12px rgba(245,196,67,0.5)'
                    : 'inset 0 -2px 0 var(--color-wood-3), 0 2px 0 var(--color-wood-5)',
                  flexShrink: 0,
                }}
              >
                {isUnlocked ? <TrophyIcon size={26} /> : <LockSvg size={22} />}
              </div>
              <div className="flex-1 min-w-0">
                <div
                  style={{
                    fontFamily: 'var(--font-title)',
                    fontWeight: 600,
                    fontSize: 13,
                    color: 'var(--color-text-title)',
                    lineHeight: 1.1,
                  }}
                >
                  {ach.name}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: 'var(--color-text-muted)',
                    marginTop: 2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {ach.description}
                </div>
                {(ach.rewardCash > 0n || ach.rewardGems > 0) && (
                  <div className="flex items-center gap-1.5 mt-1" style={{ fontSize: 10 }}>
                    {ach.rewardCash > 0n && (
                      <span className="flex items-center gap-1" style={{ color: 'var(--color-accent-gold)' }}>
                        <CoinIcon size={11} />
                        <span className="numeric">{ach.rewardCash.toString()}</span>
                      </span>
                    )}
                    {ach.rewardGems > 0 && (
                      <span className="flex items-center gap-1" style={{ color: 'var(--color-accent-fuel)' }}>
                        <FuelIcon size={11} />
                        <span className="numeric">{ach.rewardGems}</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
              {isUnlocked && !claimed && (
                <button
                  type="button"
                  onClick={() => claimAchievement(ach.key)}
                  className="pixel-btn pixel-btn-gold"
                  style={{ minHeight: 36, fontSize: 11, padding: '8px 10px', flexShrink: 0 }}
                >
                  {t('achievements.claim')}
                </button>
              )}
              {claimed && (
                <span
                  style={{
                    background: 'var(--color-grass-4)',
                    color: 'var(--color-paper-1)',
                    fontFamily: 'var(--font-button)',
                    fontSize: 9,
                    padding: '4px 8px',
                    border: '2px solid var(--color-grass-6)',
                    borderRadius: 4,
                    letterSpacing: '0.1em',
                    flexShrink: 0,
                    fontWeight: 700,
                  }}
                >
                  CLAIMED
                </span>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

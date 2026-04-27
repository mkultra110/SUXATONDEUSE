// Panel achievements : grille des achievements deverrouilles ou non.

import { useTranslation } from 'react-i18next';
import { ACHIEVEMENTS } from '@robomow/shared';
import { useGameStore } from '../../stores/gameStore.js';

export function AchievementsPanel() {
  const { t } = useTranslation();
  const unlocked = useGameStore((s) => s.achievementsUnlocked);
  const claimAchievement = useGameStore((s) => s.claimAchievement);

  const visible = ACHIEVEMENTS.filter((ach) => !ach.hidden || unlocked.has(ach.key));

  return (
    <aside className="flex w-full max-w-sm flex-col gap-2 panel p-3 max-h-[80vh] overflow-y-auto">
      <h2 className="text-sm font-bold text-ink-base">{t('achievements.title')}</h2>
      <p className="text-xs text-ink-dark">
        {Array.from(unlocked).filter((k) => !k.endsWith(':claimed')).length} / {ACHIEVEMENTS.length}
      </p>
      <ul className="flex flex-col gap-1">
        {visible.map((ach) => {
          const isUnlocked = unlocked.has(ach.key);
          const claimed = unlocked.has(`${ach.key}:claimed`);
          return (
            <li key={ach.key}>
              <div
                className={`flex items-center justify-between rounded border-2 p-2 transition ${
                  isUnlocked
                    ? 'border-grass-base bg-panel-paper'
                    : 'border-robot-shadow bg-panel-paper opacity-50'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-bold ${isUnlocked ? 'text-ink-base' : 'text-ink-dark'}`}>
                    {isUnlocked ? '🏆' : '🔒'} {ach.name}
                  </div>
                  <div className="text-xs text-ink-dark truncate">{ach.description}</div>
                  {(ach.rewardCash > 0n || ach.rewardGems > 0) && (
                    <div className="text-xs text-accent-gold">
                      Recompense :
                      {ach.rewardCash > 0n && ` 🪙${ach.rewardCash.toString()}`}
                      {ach.rewardGems > 0 && ` ⛽${ach.rewardGems}`}
                    </div>
                  )}
                </div>
                {isUnlocked && !claimed && (
                  <button
                    onClick={() => claimAchievement(ach.key)}
                    className="btn btn-primary text-xs ml-2"
                  >
                    {t('achievements.claim')}
                  </button>
                )}
                {claimed && <span className="text-xs text-grass-base ml-2">✓</span>}
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

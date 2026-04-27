// Panel daily : login reward du jour + 3 quetes journalieres avec progression.

import { useTranslation } from 'react-i18next';
import { loginRewardForDay } from '@robomow/shared';
import { useGameStore } from '../../stores/gameStore.js';
import { formatBig } from '../../game/engine/bigNumber.js';

export function DailyPanel() {
  const { t } = useTranslation();
  const loginStreak = useGameStore((s) => s.loginStreak);
  const lastLoginRewardDate = useGameStore((s) => s.lastLoginRewardDate);
  const claimLoginReward = useGameStore((s) => s.claimLoginReward);
  const dailyQuestProgress = useGameStore((s) => s.dailyQuestProgress);
  const dailyQuestsClaimed = useGameStore((s) => s.dailyQuestsClaimed);
  const claimDailyQuest = useGameStore((s) => s.claimDailyQuest);
  const getDailyQuests = useGameStore((s) => s.getDailyQuests);
  // Pour que le panel se re-render quand les compteurs changent
  const dailyTaps = useGameStore((s) => s.dailyTaps);
  const dailyRobots = useGameStore((s) => s.dailyRobotsBought);
  const dailyUpgrades = useGameStore((s) => s.dailyUpgradesBought);
  const dailyCash = useGameStore((s) => s.dailyCashEarned);
  const dailyGrass = useGameStore((s) => s.dailyGrassMowed);
  const dailyPlots = useGameStore((s) => s.dailyPlotsUnlocked);

  const today = new Date().toISOString().slice(0, 10);
  const loginRewardClaimable = lastLoginRewardDate !== today;
  const reward = loginRewardForDay(Math.max(loginStreak, 1));
  const quests = getDailyQuests();

  function progressFor(progressKey: string): bigint {
    switch (progressKey) {
      case 'cashEarned':
        return BigInt(dailyCash.floor().toString());
      case 'grassMowed':
        return BigInt(dailyGrass.floor().toString());
      case 'robotsBought':
        return BigInt(dailyRobots);
      case 'upgradesBought':
        return BigInt(dailyUpgrades);
      case 'manualTaps':
        return BigInt(dailyTaps);
      case 'plotsUnlocked':
        return BigInt(dailyPlots);
      default:
        return 0n;
    }
  }

  // Reference inutilisee : on lit dailyQuestProgress pour la prop, mais
  // les compteurs ci-dessus sont la source de verite.
  void dailyQuestProgress;

  return (
    <aside className="flex w-full max-w-sm flex-col gap-3 panel p-3 max-h-[80vh] overflow-y-auto">
      <h2 className="text-sm font-bold text-ink-base">{t('daily.title')}</h2>

      {/* Login streak */}
      <section className="panel bg-grass-shadow text-panel-base p-3 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wide">{t('daily.streak')}</span>
          <span className="text-2xl font-bold">🔥 {loginStreak}</span>
        </div>
        <p className="text-sm">{t('daily.todayReward')}: {reward.description}</p>
        <button
          onClick={() => claimLoginReward()}
          disabled={!loginRewardClaimable}
          className={`btn ${loginRewardClaimable ? 'btn-primary' : 'opacity-50 cursor-not-allowed'} text-sm`}
        >
          {loginRewardClaimable ? t('daily.claimReward') : t('daily.alreadyClaimed')}
        </button>
      </section>

      {/* Quetes du jour */}
      <section className="flex flex-col gap-2">
        <h3 className="text-xs font-bold uppercase text-ink-dark">{t('daily.quests')}</h3>
        {quests.length === 0 ? (
          <p className="text-xs text-ink-dark italic">{t('daily.noQuests')}</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {quests.map((q) => {
              const progress = progressFor(q.progressKey);
              const target = q.target;
              const completed = progress >= target;
              const claimed = dailyQuestsClaimed.has(q.key);
              const ratio = target === 0n ? 1 : Math.min(1, Number(progress) / Number(target));
              return (
                <li key={q.key} className="rounded border-2 border-robot-shadow bg-panel-paper p-2">
                  <div className="text-sm font-bold text-ink-base">{q.name}</div>
                  <div className="text-xs text-ink-dark">{q.description}</div>
                  <div className="mt-1 h-2 w-full rounded bg-robot-shadow overflow-hidden">
                    <div
                      className={`h-full transition-all ${completed ? 'bg-grass-base' : 'bg-accent-gold'}`}
                      style={{ width: `${ratio * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1 text-xs">
                    <span className="text-ink-dark">
                      {progress.toString()} / {target.toString()}
                    </span>
                    <span className="text-accent-gold">
                      {q.rewardCash > 0n && `🪙${formatBig(q.rewardCash.toString())} `}
                      {q.rewardGems > 0 && `⛽${q.rewardGems}`}
                    </span>
                  </div>
                  {completed && !claimed && (
                    <button
                      onClick={() => claimDailyQuest(q.key)}
                      className="btn btn-primary w-full mt-2 text-xs"
                    >
                      {t('daily.claim')}
                    </button>
                  )}
                  {claimed && (
                    <span className="block text-center mt-1 text-xs text-grass-base">
                      ✓ {t('daily.claimed')}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </aside>
  );
}

// Panel daily : login streak hero + quetes journalieres en panel-paper
// avec progress bars et reward pills.

import { useTranslation } from 'react-i18next';
import { loginRewardForDay } from '@robomow/shared';
import { useGameStore } from '../../stores/gameStore.js';
import { formatBig } from '../../game/engine/bigNumber.js';
import { CoinIcon, FuelIcon, NavQuestIcon, StarIcon } from '../icons/PixelIcon.js';

export function DailyPanel() {
  const { t } = useTranslation();
  const loginStreak = useGameStore((s) => s.loginStreak);
  const lastLoginRewardDate = useGameStore((s) => s.lastLoginRewardDate);
  const claimLoginReward = useGameStore((s) => s.claimLoginReward);
  const dailyQuestProgress = useGameStore((s) => s.dailyQuestProgress);
  const dailyQuestsClaimed = useGameStore((s) => s.dailyQuestsClaimed);
  const claimDailyQuest = useGameStore((s) => s.claimDailyQuest);
  const getDailyQuests = useGameStore((s) => s.getDailyQuests);
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
      case 'cashEarned': return BigInt(dailyCash.floor().toString());
      case 'grassMowed': return BigInt(dailyGrass.floor().toString());
      case 'robotsBought': return BigInt(dailyRobots);
      case 'upgradesBought': return BigInt(dailyUpgrades);
      case 'manualTaps': return BigInt(dailyTaps);
      case 'plotsUnlocked': return BigInt(dailyPlots);
      default: return 0n;
    }
  }
  void dailyQuestProgress;

  return (
    <aside className="flex flex-col gap-3 max-h-[80vh]">
      <header className="flex items-center justify-between gap-2 px-1">
        <h2
          className="flex items-center gap-2 text-lg leading-none"
          style={{ fontFamily: 'var(--font-title)', color: 'var(--color-text-title)' }}
        >
          <NavQuestIcon size={22} />
          {t('daily.title')}
        </h2>
      </header>

      <div className="overflow-y-auto pr-1 flex flex-col gap-3" style={{ maxHeight: 'calc(80vh - 60px)' }}>
        {/* Login streak hero */}
        <div
          className="panel-9"
          style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 14 }}
        >
          <span className="nail-bl" />
          <span className="nail-br" />
          <div className="flex items-center justify-between">
            <span
              style={{
                fontFamily: 'var(--font-button)',
                fontSize: 10,
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              {t('daily.streak')}
            </span>
            <span className="flex items-center gap-1.5">
              <StarIcon size={20} />
              <span
                className="numeric"
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: 'var(--color-accent-gold)',
                  textShadow: '1px 1px 0 var(--color-wood-5)',
                }}
              >
                {loginStreak}
              </span>
            </span>
          </div>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              color: 'var(--color-text-body)',
              margin: 0,
            }}
          >
            {t('daily.todayReward')}: <strong>{reward.description}</strong>
          </p>
          <button
            type="button"
            onClick={() => claimLoginReward()}
            disabled={!loginRewardClaimable}
            className={`pixel-btn ${loginRewardClaimable ? 'pixel-btn-gold' : ''}`}
            style={{
              minHeight: 'auto',
              fontSize: 11,
              padding: '8px 12px',
              opacity: loginRewardClaimable ? 1 : 0.6,
            }}
          >
            {loginRewardClaimable ? t('daily.claimReward') : t('daily.alreadyClaimed')}
          </button>
        </div>

        {/* Quetes du jour */}
        <h3
          style={{
            fontFamily: 'var(--font-button)',
            fontSize: 11,
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: -4,
          }}
        >
          {t('daily.quests')}
        </h3>
        {quests.length === 0 ? (
          <p style={{ fontSize: 11, color: 'var(--color-text-muted)', fontStyle: 'italic' }}>{t('daily.noQuests')}</p>
        ) : (
          quests.map((q) => {
            const progress = progressFor(q.progressKey);
            const target = q.target;
            const completed = progress >= target;
            const claimed = dailyQuestsClaimed.has(q.key);
            const ratio = target === 0n ? 1 : Math.min(1, Number(progress) / Number(target));
            return (
              <div key={q.key} className="panel-paper" style={{ padding: 12, position: 'relative' }}>
                {claimed && (
                  <span
                    style={{
                      position: 'absolute',
                      top: -6,
                      right: -6,
                      background: 'var(--color-grass-4)',
                      color: 'var(--color-paper-1)',
                      fontFamily: 'var(--font-button)',
                      fontSize: 9,
                      padding: '3px 8px',
                      border: '2px solid var(--color-grass-6)',
                      borderRadius: 4,
                      letterSpacing: '0.1em',
                      transform: 'rotate(8deg)',
                      fontWeight: 700,
                    }}
                  >
                    OK
                  </span>
                )}
                <div
                  style={{
                    fontFamily: 'var(--font-title)',
                    fontWeight: 600,
                    fontSize: 14,
                    color: 'var(--color-text-title)',
                  }}
                >
                  {q.name}
                </div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>{q.description}</div>
                <ProgressBar ratio={ratio} completed={completed} />
                <div className="flex items-center justify-between mt-1.5" style={{ fontSize: 11 }}>
                  <span className="numeric" style={{ color: 'var(--color-text-muted)' }}>
                    {progress.toString()} / {target.toString()}
                  </span>
                  <RewardPill cash={q.rewardCash} fuel={q.rewardGems} />
                </div>
                {completed && !claimed && (
                  <button
                    type="button"
                    onClick={() => claimDailyQuest(q.key)}
                    className="pixel-btn pixel-btn-gold"
                    style={{ width: '100%', marginTop: 8, minHeight: 36, fontSize: 11, padding: '8px 10px' }}
                  >
                    {t('daily.claim')}
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}

function ProgressBar({ ratio, completed }: { ratio: number; completed: boolean }) {
  return (
    <div
      style={{
        height: 10,
        width: '100%',
        background: 'var(--color-wood-3)',
        border: '2px solid var(--color-wood-5)',
        borderRadius: 3,
        overflow: 'hidden',
        marginTop: 6,
        boxShadow: 'inset 0 1px 0 rgba(0,0,0,0.2)',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${ratio * 100}%`,
          background: completed
            ? 'linear-gradient(180deg, var(--color-grass-2), var(--color-grass-5))'
            : 'linear-gradient(180deg, #fde08a, var(--color-accent-gold))',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)',
          transition: 'width 250ms ease-out',
        }}
      />
    </div>
  );
}

function RewardPill({ cash, fuel }: { cash: bigint; fuel: number }) {
  if (cash === 0n && fuel === 0) return null;
  return (
    <span
      className="flex items-center gap-1"
      style={{
        background: 'var(--color-wood-5)',
        color: 'var(--color-paper-1)',
        padding: '2px 6px',
        border: '2px solid var(--color-wood-4)',
        borderRadius: 3,
        fontFamily: 'var(--font-button)',
        fontSize: 10,
      }}
    >
      {cash > 0n && (
        <>
          <CoinIcon size={11} />
          <span className="numeric">{formatBig(cash.toString())}</span>
        </>
      )}
      {fuel > 0 && (
        <>
          <FuelIcon size={11} />
          <span className="numeric">{fuel}</span>
        </>
      )}
    </span>
  );
}

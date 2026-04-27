// Page principale du jeu : top bar + canvas + shop side panel.
// Lance la session de jeu (load save, gameLoop, auto-save) au montage.

import { useTranslation } from 'react-i18next';
import { TopBar } from '../components/hud/TopBar.js';
import { ShopPanel } from '../components/hud/ShopPanel.js';
import { OfflineRewardModal } from '../components/modals/OfflineRewardModal.js';
import { PixiCanvas } from '../game/engine/PixiCanvas.js';
import { useGameSession } from '../hooks/useGameSession.js';

export function GamePage() {
  const { t } = useTranslation();
  const session = useGameSession();

  if (session.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-grass-deep text-panel-base">
        {t('game.loading')}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-sky-deep to-grass-deep p-2 gap-2">
      <TopBar />
      <main className="flex flex-1 flex-col items-center gap-4 lg:flex-row lg:items-start lg:justify-center lg:gap-6">
        <div className="flex flex-col items-center gap-2 flex-1">
          <PixiCanvas />
          <p className="text-center text-panel-paper text-xs max-w-2xl">
            {t('game.tapHint')}
          </p>
        </div>
        <ShopPanel />
      </main>

      {session.offlineReward && (
        <OfflineRewardModal
          durationSeconds={session.offlineReward.durationSeconds}
          cashEarned={session.offlineReward.cashEarned}
          onAcknowledge={session.acknowledgeOfflineReward}
        />
      )}
    </div>
  );
}

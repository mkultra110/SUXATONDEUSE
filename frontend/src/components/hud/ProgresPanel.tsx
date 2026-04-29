// ProgresPanel : groupe les 3 ecrans consultatifs basse-frequence
// (Prestige + Succes + Stats) sous un seul onglet 'Progrès' avec un
// SegmentedControl en haut pour switcher entre les 3 sous-pages.
// Justification : iOS HIG / Material 3 / NN/g recommandent max 5 tabs
// bottom nav, donc fusion logique de 7 -> 5.

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SegmentedControl } from './SegmentedControl.js';
import { PrestigePanel } from './PrestigePanel.js';
import { AchievementsPanel } from './AchievementsPanel.js';
import { StatsPanel } from './StatsPanel.js';
import { SeedIcon, TrophyIcon, IconGear } from '../icons/PixelIcon.js';

type ProgresTab = 'prestige' | 'achievements' | 'stats';

export function ProgresPanel() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<ProgresTab>('prestige');

  return (
    <div className="flex flex-col gap-3 max-h-[80vh]">
      <SegmentedControl
        ariaLabel="Sous-sections Progrès"
        value={tab}
        onChange={setTab}
        options={[
          {
            key: 'prestige',
            label: t('tabs.prestige'),
            icon: <SeedIcon size={14} />,
          },
          {
            key: 'achievements',
            label: t('tabs.achievements'),
            icon: <TrophyIcon size={14} />,
          },
          {
            key: 'stats',
            label: t('tabs.stats'),
            icon: <IconGear size={14} />,
          },
        ]}
      />
      <div className="flex-1 min-h-0">
        {tab === 'prestige' && <PrestigePanel />}
        {tab === 'achievements' && <AchievementsPanel />}
        {tab === 'stats' && <StatsPanel />}
      </div>
    </div>
  );
}

// Boutique cozy : 10 tiers de robots + 6 categories d'upgrades.
// Cards parchemin avec bordure bois, boutons gold pixel-art.

import { useTranslation } from 'react-i18next';
import {
  ROBOT_TIERS,
  type RobotType,
  UPGRADE_DEFINITIONS,
  type UpgradeKey,
} from '@robomow/shared';
import { useGameStore, nextRobotCost, nextUpgradeCost } from '../../stores/gameStore.js';
import { formatBig } from '../../game/engine/bigNumber.js';

const ALL_TIERS: RobotType[] = ROBOT_TIERS.map((t) => t.type);

export function ShopPanel() {
  const { t } = useTranslation();
  const cash = useGameStore((s) => s.cash);
  const holdings = useGameStore((s) => s.holdings);
  const upgrades = useGameStore((s) => s.upgrades);
  const prestigeLevel = useGameStore((s) => s.prestigeLevel);
  const buyRobot = useGameStore((s) => s.buyRobot);
  const buyUpgrade = useGameStore((s) => s.buyUpgrade);

  const visibleTiers = ALL_TIERS.filter((type, i) => {
    if (i === 0) return true;
    const prev = ALL_TIERS[i - 1];
    if (!prev) return true;
    return holdings[prev].owned > 0 || holdings[type].owned > 0;
  });

  return (
    <aside className="pixel-panel flex flex-col gap-3 max-h-[80vh] overflow-y-auto">
      <h2
        className="text-lg leading-none"
        style={{ fontFamily: 'var(--font-title)', color: 'var(--color-text-title)' }}
      >
        🛒 {t('shop.title')}
      </h2>

      {/* Robots */}
      <ul className="flex flex-col gap-2">
        {visibleTiers.map((type) => {
          const tier = ROBOT_TIERS.find((tt) => tt.type === type);
          if (!tier) return null;
          const owned = holdings[type].owned;
          const cost = nextRobotCost(holdings, type);
          const affordable = cash.gte(cost);
          return (
            <li key={type}>
              <button
                disabled={!affordable}
                onClick={() => buyRobot(type)}
                className={`pixel-card w-full flex items-center gap-3 text-left ${
                  affordable ? 'pixel-card-affordable' : ''
                } ${!affordable && owned === 0 ? 'pixel-card-locked' : ''}`}
                style={{ cursor: affordable ? 'pointer' : 'not-allowed' }}
              >
                <RobotIcon tier={tier.index} />
                <div className="flex-1 min-w-0">
                  <div
                    className="leading-tight"
                    style={{
                      fontFamily: 'var(--font-title)',
                      color: 'var(--color-text-title)',
                      fontSize: '14px',
                    }}
                  >
                    {tier.name}
                  </div>
                  <div
                    style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}
                  >
                    +{tier.baseGrassPerSecond}/s · ×{owned}
                  </div>
                </div>
                <div
                  className="numeric flex flex-col items-end"
                  style={{ color: 'var(--color-accent-gold)' }}
                >
                  <span className="text-xs leading-none">🪙</span>
                  <span className="text-sm leading-tight">{formatBig(cost)}</span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Ameliorations */}
      <div
        className="border-t-2 pt-3 mt-1"
        style={{ borderColor: 'var(--color-wood-3)' }}
      >
        <h3
          className="mb-2"
          style={{
            fontFamily: 'var(--font-button)',
            fontSize: '11px',
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          {t('shop.upgrades')}
        </h3>
        <ul className="flex flex-col gap-1.5">
          {UPGRADE_DEFINITIONS.map((def) => {
            const level: number = upgrades[def.key as UpgradeKey] ?? 0;
            const locked = def.unlockPrestigeLevel > prestigeLevel;
            const maxed = level >= def.maxLevel;
            const cost = nextUpgradeCost(def.key, level);
            const affordable = !locked && !maxed && cash.gte(cost);
            return (
              <li key={def.key}>
                <button
                  disabled={!affordable}
                  onClick={() => buyUpgrade(def.key)}
                  className={`pixel-card w-full flex items-center gap-3 text-left ${
                    affordable ? 'pixel-card-affordable' : ''
                  } ${locked || maxed ? 'pixel-card-locked' : ''}`}
                  style={{ cursor: affordable ? 'pointer' : 'not-allowed' }}
                >
                  <UpgradeIcon upgradeKey={def.key} />
                  <div className="flex-1 min-w-0">
                    <div
                      className="leading-tight"
                      style={{
                        fontFamily: 'var(--font-title)',
                        color: 'var(--color-text-title)',
                        fontSize: '13px',
                      }}
                    >
                      {def.name}
                    </div>
                    <div
                      className="leading-tight"
                      style={{ color: 'var(--color-text-muted)', fontSize: '10px' }}
                    >
                      {def.description} · niv. {level}
                      {locked && ` · prestige ${def.unlockPrestigeLevel} requis`}
                      {maxed && ' · MAX'}
                    </div>
                  </div>
                  <div
                    className="numeric flex flex-col items-end"
                    style={{ color: 'var(--color-accent-gold)' }}
                  >
                    {maxed ? (
                      <span className="text-xs">—</span>
                    ) : (
                      <>
                        <span className="text-xs leading-none">🪙</span>
                        <span className="text-sm leading-tight">{formatBig(cost)}</span>
                      </>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}

/** Icone simple pour un robot tier — version SVG pixel art procedurale. */
function RobotIcon({ tier }: { tier: number }) {
  const palette = [
    ['#e8eef2', '#8595a8'], // metal clair
    ['#b8c4d0', '#556678'], // metal moyen
    ['#8595a8', '#2f3a4a'], // metal fonce
    ['#f5c443', '#a87a1f'], // electrique dore
    ['#d54c4c', '#8b1f1f'], // robomow rouge
    ['#7ec5c5', '#4a96a8'], // navibot turquoise
    ['#f29bb8', '#c45a83'], // helio rose
    ['#9b6dc4', '#5c3d7f'], // mega violet
    ['#a8d8f0', '#4a96a8'], // aero bleu ciel
    ['#fff8e7', '#c49b6a'], // nano blanc
  ];
  const [body, accent] = palette[tier % palette.length] ?? palette[0]!;
  return (
    <div
      className="flex-shrink-0"
      style={{
        width: 32,
        height: 32,
        background: body,
        border: `2px solid ${accent}`,
        borderRadius: 4,
        position: 'relative',
        boxShadow: `inset -2px -2px 0 ${accent}, 0 2px 0 ${accent}`,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 4,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 6,
          height: 3,
          background: 'var(--color-accent-red)',
          borderRadius: 1,
        }}
      />
      <span
        style={{
          position: 'absolute',
          bottom: 2,
          left: 4,
          right: 4,
          height: 2,
          background: 'var(--color-text-title)',
          opacity: 0.4,
        }}
      />
    </div>
  );
}

/** Icone pour les categories d'upgrades. */
function UpgradeIcon({ upgradeKey }: { upgradeKey: string }) {
  const map: Record<string, { emoji: string; bg: string }> = {
    blades: { emoji: '🔪', bg: 'var(--color-metal-2)' },
    engine: { emoji: '⚙️', bg: 'var(--color-wood-2)' },
    battery: { emoji: '🔋', bg: 'var(--color-grass-3)' },
    solar: { emoji: '☀️', bg: 'var(--color-accent-gold)' },
    navigation: { emoji: '🧭', bg: 'var(--color-water-1)' },
    weather: { emoji: '☔', bg: 'var(--color-water-2)' },
  };
  const info = map[upgradeKey] ?? { emoji: '🔧', bg: 'var(--color-wood-2)' };
  return (
    <div
      className="flex-shrink-0 flex items-center justify-center"
      style={{
        width: 28,
        height: 28,
        background: info.bg,
        border: '2px solid var(--color-wood-4)',
        borderRadius: 4,
        fontSize: 16,
        boxShadow: 'inset -2px -2px 0 rgba(0,0,0,0.2), 0 2px 0 var(--color-wood-4)',
      }}
    >
      {info.emoji}
    </div>
  );
}

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
import { ATLAS_URL, ATLAS_SIZE } from '../garden/Sprite.js';
import { audio } from '../../services/audio.js';
import {
  CoinIcon,
  NavShopIcon,
  IconBlade,
  IconGear,
  IconBattery,
  IconSolar,
  IconBrain,
  IconWeather,
} from '../icons/PixelIcon.js';

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
        className="flex items-center gap-2 text-lg leading-none"
        style={{ fontFamily: 'var(--font-title)', color: 'var(--color-text-title)' }}
      >
        <NavShopIcon size={20} />
        {t('shop.title')}
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
                onClick={() => {
                  if (affordable) {
                    audio.playPurchase();
                    buyRobot(type);
                  } else {
                    audio.playError();
                  }
                }}
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
                  <CoinIcon size={12} />
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
                  onClick={() => {
                    if (affordable) {
                      audio.playPurchase();
                      buyUpgrade(def.key);
                    } else {
                      audio.playError();
                    }
                  }}
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
                        <CoinIcon size={12} />
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

/** Icone robot : sprite reel depuis robots.png (frame idle, row A col 12). */
function RobotIcon({ tier }: { tier: number }) {
  const SCALE = 2;
  const ROBOT_W = 24;
  const sx = 12 * ROBOT_W; // col 12 = idle
  const sy = tier * 48;    // row A
  const [aw, ah] = ATLAS_SIZE.robots;
  return (
    <div
      className="flex-shrink-0"
      style={{
        width: ROBOT_W * SCALE,
        height: ROBOT_W * SCALE,
        background: 'linear-gradient(180deg, var(--color-grass-3), var(--color-grass-5))',
        border: '2px solid var(--color-wood-5)',
        borderRadius: 4,
        boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.25), 0 2px 0 var(--color-wood-5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: ROBOT_W * SCALE,
          height: ROBOT_W * SCALE,
          backgroundImage: `url(${ATLAS_URL.robots})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${aw * SCALE}px ${ah * SCALE}px`,
          backgroundPosition: `-${sx * SCALE}px -${sy * SCALE}px`,
          imageRendering: 'pixelated',
        }}
      />
    </div>
  );
}

/** Icone upgrade : encadre cozy avec sprite SVG pixel art (zero emoji). */
function UpgradeIcon({ upgradeKey }: { upgradeKey: string }) {
  const map: Record<string, { Icon: typeof IconBlade; bg: string }> = {
    blades: { Icon: IconBlade, bg: 'var(--color-metal-2)' },
    engine: { Icon: IconGear, bg: 'var(--color-wood-2)' },
    battery: { Icon: IconBattery, bg: 'var(--color-grass-3)' },
    solar: { Icon: IconSolar, bg: 'var(--color-accent-gold)' },
    navigation: { Icon: IconBrain, bg: 'var(--color-water-1)' },
    weather: { Icon: IconWeather, bg: 'var(--color-water-2)' },
  };
  const info = map[upgradeKey] ?? { Icon: IconGear, bg: 'var(--color-wood-2)' };
  const { Icon } = info;
  return (
    <div
      className="flex-shrink-0 flex items-center justify-center"
      style={{
        width: 36,
        height: 36,
        background: info.bg,
        border: '2px solid var(--color-wood-5)',
        borderRadius: 4,
        boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.25), inset 0 2px 0 rgba(255,255,255,0.3), 0 2px 0 var(--color-wood-5)',
      }}
    >
      <Icon size={20} />
    </div>
  );
}

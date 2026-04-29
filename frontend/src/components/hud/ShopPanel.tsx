// Boutique style proto Claude Design v5 :
// - Sous-tabs Robots / Ameliorations
// - Grid 2-col de cards panel-9 avec clous decoratifs (signature Margaux)
// - Bouton "shop-buy" gold sur chaque card avec CoinIcon

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ROBOT_TIERS,
  type RobotType,
  UPGRADE_DEFINITIONS,
  type UpgradeKey,
} from '@robomow/shared';
import { useGameStore, nextRobotCost, nextUpgradeCost, bulkRobotCost, maxAffordableRobots } from '../../stores/gameStore.js';
import { useUIStore } from '../../stores/uiStore.js';
import { useResponsive } from '../../hooks/useResponsive.js';
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

type ShopTab = 'robots' | 'upgrades';
type BulkSize = 1 | 10 | 100 | 'max';

export function ShopPanel() {
  const { t } = useTranslation();
  const cash = useGameStore((s) => s.cash);
  const holdings = useGameStore((s) => s.holdings);
  const upgrades = useGameStore((s) => s.upgrades);
  const prestigeLevel = useGameStore((s) => s.prestigeLevel);
  const buyRobot = useGameStore((s) => s.buyRobot);
  const buyUpgrade = useGameStore((s) => s.buyUpgrade);

  // Sub-tab et bulk size persistes dans uiStore (cross-session).
  const tab = useUIStore((s) => s.shopTab) as ShopTab;
  const setTab = useUIStore((s) => s.setShopTab);
  const bulk = useUIStore((s) => s.shopBulkSize) as BulkSize;
  const setBulk = useUIStore((s) => s.setShopBulkSize);
  const breakpoint = useResponsive();

  const visibleTiers = ALL_TIERS.filter((type, i) => {
    if (i === 0) return true;
    const prev = ALL_TIERS[i - 1];
    if (!prev) return true;
    return holdings[prev].owned > 0 || holdings[type].owned > 0;
  });

  return (
    <aside className="flex flex-col gap-3 max-h-[80vh]">
      {/* Header */}
      <header className="flex items-center justify-between gap-2 px-1">
        <h2
          className="flex items-center gap-2 text-lg leading-none"
          style={{ fontFamily: 'var(--font-title)', color: 'var(--color-text-title)' }}
        >
          <NavShopIcon size={22} />
          {t('shop.title')}
        </h2>
      </header>

      {/* Filter chips arrondies (signature RCT-Touch : Junior/Family/Thrill).
          Adaptees en : Robots / Ameliorations. Decorations a venir. */}
      <div className="flex gap-2 px-1" role="tablist" aria-label="Categorie boutique">
        <FilterChip active={tab === 'robots'} onClick={() => setTab('robots')} label="Robots" count={visibleTiers.length} />
        <FilterChip active={tab === 'upgrades'} onClick={() => setTab('upgrades')} label={t('shop.upgrades')} count={UPGRADE_DEFINITIONS.length} />
      </div>

      {/* Selecteur multi-buy : x1 / x10 / x100 / xMax. Visible seulement
          dans l'onglet Robots (les upgrades sont level-by-level). */}
      {tab === 'robots' && (
        <div
          className="flex items-center gap-1 p-1"
          style={{
            background: 'var(--color-paper-2)',
            border: '2px solid var(--color-wood-5)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-button)',
              fontSize: 9,
              color: 'var(--color-text-muted)',
              padding: '0 4px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            ACHAT
          </span>
          {(['1', '10', '100', 'max'] as const).map((size) => {
            const value = (size === 'max' ? 'max' : Number(size)) as BulkSize;
            const isActive = bulk === value;
            return (
              <button
                key={size}
                type="button"
                onClick={() => setBulk(value)}
                style={{
                  flex: 1,
                  padding: '5px 8px',
                  border: '2px solid var(--color-wood-5)',
                  borderRadius: 0,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-title)',
                  fontWeight: 700,
                  fontSize: 12,
                  color: isActive ? 'var(--color-text-title)' : 'var(--color-text-muted)',
                  background: isActive ? 'var(--color-accent-gold)' : 'var(--color-paper-1)',
                  boxShadow: isActive
                    ? 'inset 0 -2px 0 #a87a1f, 0 0 8px rgba(245, 196, 67, 0.5)'
                    : 'inset 0 -2px 0 var(--color-wood-3)',
                  transition: 'all 100ms ease-out',
                }}
              >
                {size === 'max' ? 'MAX' : `×${size}`}
              </button>
            );
          })}
        </div>
      )}

      {/* Body scrollable */}
      <div className="overflow-y-auto pr-1" style={{ maxHeight: 'calc(80vh - 120px)' }}>
        {tab === 'robots' && (
          <div className={breakpoint === 'mobile' ? 'shop-carousel' : 'grid grid-cols-2 gap-2.5'}>
            {visibleTiers.map((type) => {
              const tier = ROBOT_TIERS.find((tt) => tt.type === type);
              if (!tier) return null;
              const owned = holdings[type].owned;
              // Determiner combien on essaie d'acheter selon le bulk.
              const desiredAmount =
                bulk === 'max' ? Math.max(1, maxAffordableRobots(holdings, type, cash)) : bulk;
              // Cost cumule pour bulk N (utile pour x10/x100), single pour x1.
              const totalCost =
                desiredAmount === 1
                  ? nextRobotCost(holdings, type)
                  : bulkRobotCost(holdings, type, desiredAmount);
              const affordableSingle = cash.gte(nextRobotCost(holdings, type));
              const affordableBulk = cash.gte(totalCost);
              const buyableNow =
                bulk === 'max'
                  ? maxAffordableRobots(holdings, type, cash)
                  : affordableBulk
                    ? desiredAmount
                    : 0;
              return (
                <ShopCard
                  key={type}
                  affordable={affordableSingle && buyableNow > 0}
                  badge={owned > 0 ? `×${owned}` : null}
                  art={<RobotArt tier={tier.index} />}
                  name={t(`robotNicknames.${type}`, tier.name)}
                  rate={
                    buyableNow > 1
                      ? `Acheter ×${buyableNow}`
                      : t(`robotPersonalities.${type}`, `+${tier.baseGrassPerSecond}/s`)
                  }
                  cost={buyableNow > 0 ? totalCost : nextRobotCost(holdings, type)}
                  onClick={() => {
                    if (buyableNow > 0) {
                      audio.playPurchase();
                      for (let i = 0; i < buyableNow; i++) {
                        buyRobot(type);
                      }
                    } else {
                      audio.playError();
                    }
                  }}
                />
              );
            })}
          </div>
        )}

        {tab === 'upgrades' && (
          <div className={breakpoint === 'mobile' ? 'shop-carousel' : 'grid grid-cols-2 gap-2.5'}>
            {UPGRADE_DEFINITIONS.map((def) => {
              const level: number = upgrades[def.key as UpgradeKey] ?? 0;
              const locked = def.unlockPrestigeLevel > prestigeLevel;
              const maxed = level >= def.maxLevel;
              const cost = nextUpgradeCost(def.key, level);
              const affordable = !locked && !maxed && cash.gte(cost);
              return (
                <ShopCard
                  key={def.key}
                  affordable={affordable}
                  locked={locked}
                  badge={`niv. ${level}`}
                  art={<UpgradeArt upgradeKey={def.key} />}
                  name={def.name}
                  rate={
                    locked
                      ? `Prestige ${def.unlockPrestigeLevel} requis`
                      : maxed
                        ? 'NIVEAU MAX'
                        : def.description
                  }
                  cost={maxed ? null : cost}
                  onClick={() => {
                    if (affordable) {
                      audio.playPurchase();
                      buyUpgrade(def.key);
                    } else {
                      audio.playError();
                    }
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}

// =====================================================================
// Sous-composants
// =====================================================================

// FilterChip arrondi style RCT-Touch : pill cuivre actif / bois clair inactif.
function FilterChip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count?: number;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      style={{
        padding: '6px 14px',
        minHeight: 32,
        borderRadius: 9999,
        border: '2px solid var(--color-wood-5)',
        cursor: 'pointer',
        fontFamily: 'var(--font-title)',
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: '0.04em',
        color: active ? 'var(--color-paper-1)' : 'var(--color-wood-5)',
        background: active ? 'var(--color-wood-4)' : 'var(--color-paper-1)',
        boxShadow: active
          ? 'inset 0 -2px 0 rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(0, 0, 0, 0.2), 0 0 12px rgba(184, 115, 51, 0.4)'
          : 'inset 0 -2px 0 var(--color-wood-3), 0 1px 0 var(--color-wood-5)',
        transition: 'all 100ms ease-out',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <span>{label}</span>
      {count !== undefined && count > 0 && (
        <span
          style={{
            background: active ? 'var(--color-paper-1)' : 'var(--color-wood-3)',
            color: active ? 'var(--color-wood-5)' : 'var(--color-paper-1)',
            padding: '0 6px',
            borderRadius: 9999,
            fontSize: 10,
            minWidth: 18,
            textAlign: 'center',
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

interface ShopCardProps {
  affordable: boolean;
  locked?: boolean;
  badge?: string | null;
  art: React.ReactNode;
  name: string;
  rate: string;
  cost: { toString(): string } | null;
  onClick: () => void;
}

function ShopCard({ affordable, locked, badge, art, name, rate, cost, onClick }: ShopCardProps) {
  const [wiggle, setWiggle] = useState(false);
  function handleClickWiggle() {
    if (affordable) {
      setWiggle(true);
      setTimeout(() => setWiggle(false), 400);
    }
    onClick();
  }
  return (
    <div
      className={`panel-9 ${wiggle ? 'card-wiggle' : ''}`}
      onClick={handleClickWiggle}
      style={{
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        position: 'relative',
        cursor: affordable ? 'pointer' : 'not-allowed',
        opacity: locked ? 0.6 : 1,
        filter: locked ? 'grayscale(0.5)' : undefined,
      }}
    >
      <span className="nail-bl" />
      <span className="nail-br" />
      {badge && (
        <span
          style={{
            position: 'absolute',
            top: -4,
            right: -4,
            background: affordable ? 'var(--color-grass-5)' : 'var(--color-accent-red)',
            color: 'var(--color-paper-1)',
            fontFamily: 'var(--font-button)',
            fontSize: 9,
            padding: '2px 5px',
            border: `2px solid ${affordable ? '#1d4a18' : '#7a2a2a'}`,
            borderRadius: 3,
            transform: 'rotate(8deg)',
            letterSpacing: '0.05em',
            zIndex: 2,
          }}
        >
          {badge}
        </span>
      )}
      {art}
      <div
        style={{
          fontFamily: 'var(--font-title)',
          fontWeight: 600,
          fontSize: 13,
          color: 'var(--color-text-title)',
          textAlign: 'center',
          lineHeight: 1.1,
          minHeight: 28,
        }}
      >
        {name}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 10,
          color: 'var(--color-text-muted)',
          textAlign: 'center',
          lineHeight: 1.1,
          minHeight: 12,
        }}
      >
        {rate}
      </div>
      <button
        type="button"
        disabled={!affordable}
        onClick={(e) => {
          e.stopPropagation();
          handleClickWiggle();
        }}
        style={{
          background: cost === null ? 'var(--color-wood-3)' : affordable ? 'var(--color-grass-4)' : 'var(--color-paper-3)',
          color: cost === null ? 'var(--color-paper-1)' : affordable ? 'var(--color-paper-1)' : 'var(--color-text-muted)',
          border: '2px solid var(--color-wood-5)',
          borderRadius: 5,
          padding: '8px 10px',
          fontFamily: 'var(--font-title)',
          fontWeight: 600,
          fontSize: 13,
          cursor: affordable ? 'pointer' : 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          boxShadow: affordable ? '0 3px 0 var(--color-grass-7)' : '0 3px 0 var(--color-wood-3)',
          minWidth: 80,
          minHeight: 40,
          justifyContent: 'center',
        }}
      >
        {cost === null ? (
          <span>MAX</span>
        ) : (
          <>
            <CoinIcon size={13} />
            <span>{formatBig(cost as never)}</span>
          </>
        )}
      </button>
    </div>
  );
}

function RobotArt({ tier }: { tier: number }) {
  const SCALE = 2;
  const ROBOT_W = 24;
  const sx = 12 * ROBOT_W; // col 12 = idle frame (row A)
  const sy = tier * 48;
  const [aw, ah] = ATLAS_SIZE.robots;
  return (
    <div
      style={{
        width: 64,
        height: 64,
        background: 'var(--color-paper-2)',
        border: '2px solid var(--color-wood-5)',
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'inset 0 -2px 0 var(--color-wood-3), 0 2px 0 var(--color-wood-5)',
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

function UpgradeArt({ upgradeKey }: { upgradeKey: string }) {
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
      style={{
        width: 64,
        height: 64,
        background: info.bg,
        border: '2px solid var(--color-wood-5)',
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.2), inset 0 2px 0 rgba(255,255,255,0.4), 0 2px 0 var(--color-wood-5)',
      }}
    >
      <Icon size={36} />
    </div>
  );
}

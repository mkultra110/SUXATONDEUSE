// Boutique style proto Claude Design v5 :
// - Sous-tabs Robots / Ameliorations
// - Grid 2-col de cards panel-9 avec clous decoratifs (signature Margaux)
// - Bouton "shop-buy" gold sur chaque card avec CoinIcon

import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ROBOT_TIERS,
  type RobotType,
  UPGRADE_DEFINITIONS,
  type UpgradeKey,
} from '@robomow/shared';
import { useGameStore, nextRobotCost, nextUpgradeCost, bulkRobotCost, maxAffordableRobots, sumUpgradeCosts, maxAffordableUpgradeLevels } from '../../stores/gameStore.js';
import { useUIStore } from '../../stores/uiStore.js';
import { useResponsive } from '../../hooks/useResponsive.js';
import { formatBig } from '../../game/engine/bigNumber.js';
import { ATLAS_URL, ATLAS_SIZE } from '../garden/Sprite.js';
import { audio } from '../../services/audio.js';
import { shineForCount, SHINE_COLOR, SHINE_GLOW, type RobotShine } from '../../utils/playerLevel.js';
import { useEffectsStore } from '../../stores/effectsStore.js';
import { formatEta } from '../../utils/eta.js';
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
  const cashPerSecond = useGameStore((s) => s.cashPerSecond);
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
  const search = useEffectsStore((s) => s.shopSearch);
  const setSearch = useEffectsStore((s) => s.setShopSearch);

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

      {/* Sticky header : filter chips + recherche + bulk size restent visibles
          quand on scroll les shop cards. Idee #356. */}
      <div className="shop-sticky-header flex flex-col gap-2">
        <div className="flex gap-2 px-1" role="tablist" aria-label="Categorie boutique">
          <FilterChip active={tab === 'robots'} onClick={() => setTab('robots')} label="Robots" count={visibleTiers.length} />
          <FilterChip active={tab === 'upgrades'} onClick={() => setTab('upgrades')} label={t('shop.upgrades')} count={UPGRADE_DEFINITIONS.length} />
        </div>

        <input
          type="search"
          placeholder="Rechercher…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '8px 10px',
            margin: '0 4px',
            background: 'var(--color-paper-1)',
            border: '2px solid var(--color-wood-5)',
            borderRadius: 4,
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: 'var(--color-text-body)',
            outline: 'none',
            minHeight: 36,
          }}
          aria-label="Rechercher dans la boutique"
        />
        <UndoButton />
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
            {visibleTiers
              .filter((type) => {
                if (!search) return true;
                const q = search.toLowerCase();
                if (q === 'achetable' || q === 'available') {
                  return cash.gte(nextRobotCost(holdings, type));
                }
                const tierDef = ROBOT_TIERS.find((tt) => tt.type === type);
                if (!tierDef) return false;
                return (
                  tierDef.name.toLowerCase().includes(q) ||
                  type.toLowerCase().includes(q)
                );
              })
              .map((type) => {
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
              const shine = shineForCount(owned);
              const remaining = totalCost.sub(cash);
              const eta = !affordableSingle ? formatEta(remaining, cashPerSecond) : null;
              return (
                <ShopCard
                  key={type}
                  affordable={affordableSingle && buyableNow > 0}
                  badge={owned > 0 ? `×${owned}` : null}
                  shine={shine}
                  eta={eta}
                  art={<RobotArt tier={tier.index} shine={shine} />}
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
            {UPGRADE_DEFINITIONS.filter((def) => {
              if (!search) return true;
              const q = search.toLowerCase();
              if (q === 'achetable' || q === 'available') {
                const lvl = upgrades[def.key as UpgradeKey] ?? 0;
                return lvl < def.maxLevel && cash.gte(nextUpgradeCost(def.key, lvl));
              }
              return def.name.toLowerCase().includes(q) || def.key.toLowerCase().includes(q);
            }).map((def) => {
              const level: number = upgrades[def.key as UpgradeKey] ?? 0;
              const locked = def.unlockPrestigeLevel > prestigeLevel;
              const maxed = level >= def.maxLevel;
              // Multi-buy aussi sur les upgrades : on calcule combien de
              // niveaux on peut monter d'un coup selon le bulk size.
              const desiredLvls =
                bulk === 'max'
                  ? Math.max(1, maxAffordableUpgradeLevels(def.key, level, cash, def.maxLevel))
                  : Math.min(bulk, def.maxLevel - level);
              const totalUpgradeCost =
                desiredLvls === 1 || desiredLvls === 0
                  ? nextUpgradeCost(def.key, level)
                  : sumUpgradeCosts(def.key, level, desiredLvls);
              const affordableSingle = !locked && !maxed && cash.gte(nextUpgradeCost(def.key, level));
              const affordableBulk = !locked && !maxed && cash.gte(totalUpgradeCost);
              const buyableNow =
                bulk === 'max'
                  ? maxAffordableUpgradeLevels(def.key, level, cash, def.maxLevel)
                  : affordableBulk
                    ? desiredLvls
                    : 0;
              return (
                <ShopCard
                  key={def.key}
                  affordable={affordableSingle && buyableNow > 0}
                  locked={locked}
                  badge={`niv. ${level}${maxed ? '' : `/${def.maxLevel}`}`}
                  art={<UpgradeArt upgradeKey={def.key} />}
                  name={def.name}
                  rate={
                    locked
                      ? `Prestige ${def.unlockPrestigeLevel} requis`
                      : maxed
                        ? 'NIVEAU MAX'
                        : buyableNow > 1
                          ? `+${buyableNow} niveaux`
                          : def.description
                  }
                  cost={maxed ? null : buyableNow > 0 ? totalUpgradeCost : nextUpgradeCost(def.key, level)}
                  onClick={() => {
                    if (buyableNow > 0) {
                      audio.playPurchase();
                      for (let i = 0; i < buyableNow; i++) {
                        buyUpgrade(def.key);
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
      </div>
    </aside>
  );
}

// =====================================================================
// Sous-composants
// =====================================================================

// Bouton Undo : reculer la derniere action (5s window).
function UndoButton() {
  const undoStack = useEffectsStore((s) => s.undoStack);
  const popUndo = useEffectsStore((s) => s.popUndo);
  // Cleanup auto les entries expirees toutes les 500ms.
  useRef(setInterval(() => useEffectsStore.getState().cleanUndo(), 500));
  const lastEntry = undoStack[undoStack.length - 1];
  if (!lastEntry) return null;
  const remainingMs = lastEntry.expiresAt - Date.now();
  if (remainingMs <= 0) return null;
  return (
    <button
      type="button"
      onClick={() => {
        const entry = popUndo();
        if (!entry) return;
        // Rollback : restaure le state precedent.
        const state = useGameStore.getState();
        if (entry.kind === 'robot') {
          useGameStore.setState({
            cash: state.cash.add({ toString: () => entry.cashStr } as never),
            holdings: {
              ...state.holdings,
              [entry.key as keyof typeof state.holdings]: {
                type: entry.key as keyof typeof state.holdings,
                owned: entry.previousValue,
              },
            },
          });
        } else if (entry.kind === 'upgrade') {
          useGameStore.setState({
            cash: state.cash.add({ toString: () => entry.cashStr } as never),
            upgrades: {
              ...state.upgrades,
              [entry.key as keyof typeof state.upgrades]: entry.previousValue,
            },
          });
        }
      }}
      style={{
        padding: '4px 10px',
        margin: '0 4px',
        background: 'var(--color-accent-red)',
        color: 'var(--color-paper-1)',
        border: '2px solid var(--color-wood-5)',
        borderRadius: 4,
        fontFamily: 'var(--font-button)',
        fontSize: 10,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        cursor: 'pointer',
      }}
      aria-label={`Annuler ${lastEntry.label}`}
    >
      ↶ Annuler {lastEntry.label}
    </button>
  );
}

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
  shine?: RobotShine;
  eta?: string | null;
  art: React.ReactNode;
  name: string;
  rate: string;
  cost: { toString(): string } | null;
  onClick: () => void;
  onLongPress?: () => void;
}

function ShopCard({ affordable, locked, badge, shine, eta, art, name, rate, cost, onClick, onLongPress }: ShopCardProps) {
  const [wiggle, setWiggle] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  function handleClickWiggle() {
    if (affordable) {
      setWiggle(true);
      setTimeout(() => setWiggle(false), 400);
    }
    onClick();
  }
  function startLongPress() {
    if (!onLongPress) return;
    longPressTimer.current = setTimeout(() => {
      onLongPress();
      longPressTimer.current = null;
    }, 500);
  }
  function cancelLongPress() {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }
  const hasShine = shine && shine !== 'none';
  // Css var consommee par .shop-card-shine pour la couleur du halo.
  const shineStyle = hasShine
    ? ({ ['--shine-color' as string]: SHINE_GLOW[shine!] } as React.CSSProperties)
    : undefined;
  return (
    <div
      className={`panel-9 ${wiggle ? 'card-wiggle' : ''} ${hasShine ? 'shop-card-shine shop-card-sparkle' : ''}`}
      onClick={handleClickWiggle}
      onPointerDown={startLongPress}
      onPointerUp={cancelLongPress}
      onPointerLeave={cancelLongPress}
      onPointerCancel={cancelLongPress}
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
        ...shineStyle,
      }}
    >
      {eta && (
        <span
          className="eta-badge"
          style={{ position: 'absolute', top: 4, left: 4, zIndex: 2 }}
          aria-label={`Achetable dans ${eta}`}
          title={`Achetable dans ${eta}`}
        >
          {eta}
        </span>
      )}
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
          padding: '10px 12px',
          fontFamily: 'var(--font-title)',
          fontWeight: 600,
          fontSize: 13,
          cursor: affordable ? 'pointer' : 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          boxShadow: affordable ? '0 3px 0 var(--color-grass-7)' : '0 3px 0 var(--color-wood-3)',
          minWidth: 80,
          minHeight: 44,
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

function RobotArt({ tier, shine = 'none' }: { tier: number; shine?: RobotShine }) {
  const SCALE = 2;
  const ROBOT_W = 24;
  const sx = 12 * ROBOT_W; // col 12 = idle frame (row A)
  const sy = tier * 48;
  const [aw, ah] = ATLAS_SIZE.robots;
  const hasShine = shine !== 'none';
  return (
    <div
      style={{
        width: 64,
        height: 64,
        background: 'var(--color-paper-2)',
        border: hasShine ? `2px solid ${SHINE_COLOR[shine]}` : '2px solid var(--color-wood-5)',
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: hasShine
          ? `inset 0 -2px 0 var(--color-wood-3), 0 2px 0 var(--color-wood-5), 0 0 12px ${SHINE_GLOW[shine]}`
          : 'inset 0 -2px 0 var(--color-wood-3), 0 2px 0 var(--color-wood-5)',
        overflow: 'hidden',
        position: 'relative',
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
      {hasShine && (
        <span
          style={{
            position: 'absolute',
            top: 2,
            left: 2,
            background: SHINE_COLOR[shine],
            color: '#1a1a1a',
            fontFamily: 'var(--font-button)',
            fontSize: 8,
            padding: '1px 4px',
            borderRadius: 2,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontWeight: 700,
            lineHeight: 1,
            border: '1px solid rgba(0,0,0,0.4)',
            textShadow: '0 1px 0 rgba(255,255,255,0.5)',
          }}
        >
          {shine}
        </span>
      )}
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

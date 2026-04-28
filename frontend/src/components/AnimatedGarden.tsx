// Scene visuelle 100 % CSS : robot qui tond, herbe qui ondule, particules
// au clic, soleil, nuages. Aucune dependance WebGL/Pixi : tourne partout.

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import type { RobotType } from '@robomow/shared';
import { useGameStore } from '../stores/gameStore.js';

interface BladeParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
}

interface CoinParticle {
  id: number;
  x: number;
  y: number;
}

const ROBOT_PALETTE: ReadonlyArray<readonly [string, string]> = [
  ['#c0cbdc', '#fee761'], // HAND_SHEARS
  ['#8b9bb4', '#fee761'], // PUSH_MOWER
  ['#5a6988', '#feae34'], // GAS_MOWER
  ['#fee761', '#e43b44'], // ELECTRIC_MOWER
  ['#e43b44', '#00ffaa'], // ROBOMOW_V1
  ['#0099db', '#fee761'], // NAVIBOT
  ['#feae34', '#a8e66c'], // HELIOCUT
  ['#3a4466', '#ff5577'], // MEGAMOWER
  ['#0099db', '#00ffaa'], // AEROMOW
  ['#ffffff', '#ff5577'], // NANOSWARM
];

export function AnimatedGarden() {
  const { t } = useTranslation();
  const manualTap = useGameStore((s) => s.manualTap);
  const cashPerSecond = useGameStore((s) => s.cashPerSecond);
  const holdings = useGameStore((s) => s.holdings);
  const [blades, setBlades] = useState<BladeParticle[]>([]);
  const [coins, setCoins] = useState<CoinParticle[]>([]);
  const [shake, setShake] = useState(false);
  const idRef = useRef(0);

  // Liste lineaire des robots possedes (un slot par instance, max 8 visibles).
  const visibleRobots: RobotType[] = [];
  for (const holding of Object.values(holdings)) {
    for (let i = 0; i < holding.owned && visibleRobots.length < 8; i++) {
      visibleRobots.push(holding.type);
    }
  }

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newBlades: BladeParticle[] = Array.from({ length: 8 }, () => {
      idRef.current += 1;
      return {
        id: idRef.current,
        x,
        y,
        vx: (Math.random() - 0.5) * 100,
        vy: -50 - Math.random() * 50,
        rotation: Math.random() * 360,
      };
    });
    setBlades((prev) => [...prev, ...newBlades].slice(-40));

    idRef.current += 1;
    setCoins((prev) => [...prev, { id: idRef.current, x, y }].slice(-10));

    setShake(true);
    setTimeout(() => setShake(false), 80);

    manualTap();
  }

  useEffect(() => {
    if (blades.length === 0 && coins.length === 0) return;
    const t1 = setTimeout(() => {
      setBlades((prev) => prev.filter((b) => Date.now() - b.id < 1500));
      setCoins((prev) => prev.filter((c) => Date.now() - c.id < 1500));
    }, 1500);
    return () => clearTimeout(t1);
  }, [blades.length, coins.length]);

  return (
    <div
      onClick={handleClick}
      className={`garden-scene ${shake ? 'animate-shake' : ''}`}
      role="button"
      aria-label="Cliquez pour tondre"
    >
      {/* Ciel + sol via background */}
      <div className="garden-sun" />
      <div className="garden-cloud cloud-1" />
      <div className="garden-cloud cloud-2" />
      <div className="garden-cloud cloud-3" />

      {/* Arbres en arriere-plan */}
      <Tree x="8%" />
      <Tree x="22%" />
      <Tree x="78%" />
      <Tree x="92%" />

      {/* Maison/garage */}
      <div className="garden-house">
        <div className="garden-house-roof" />
        <div className="garden-house-body" />
        <div className="garden-house-door" />
        <div className="garden-house-window" />
      </div>

      {/* Herbe avec brins animes */}
      <div className="garden-grass-layer">
        {Array.from({ length: 60 }).map((_, i) => (
          <Blade key={i} index={i} />
        ))}
      </div>

      {/* Robots */}
      {visibleRobots.length > 0 ? (
        visibleRobots.map((type, i) => (
          <Robot key={i} index={i} type={type} total={visibleRobots.length} />
        ))
      ) : (
        <div className="garden-empty">
          <div className="garden-empty-emoji">🧑‍🌾</div>
          <div className="garden-empty-text">
            {t('game.tapHint')}
          </div>
        </div>
      )}

      {/* Particules de brins coupes */}
      {blades.map((b) => (
        <span
          key={b.id}
          className="garden-blade-particle"
          style={
            {
              left: `${b.x}%`,
              top: `${b.y}%`,
              ['--vx' as string]: `${b.vx}px`,
              ['--vy' as string]: `${b.vy}px`,
              ['--rot' as string]: `${b.rotation}deg`,
            } as CSSProperties
          }
        />
      ))}

      {/* Pieces flottantes */}
      {coins.map((c) => (
        <span
          key={c.id}
          className="garden-coin-particle"
          style={{ left: `${c.x}%`, top: `${c.y}%` }}
        >
          🪙
        </span>
      ))}

      {/* Indicateur de production passive */}
      {cashPerSecond.gt(0) && (
        <div className="garden-prod-indicator">⚙️ Auto-tonte active</div>
      )}
    </div>
  );
}

function Blade({ index }: { index: number }) {
  const x = (index * 1.7) % 100;
  const heights: readonly [number, number, number] = [8, 12, 16];
  const palette: readonly [string, string, string] = ['#a8e66c', '#8fde5d', '#63c74d'];
  const h = heights[index % 3] ?? 10;
  const color = palette[index % 3] ?? '#63c74d';
  const delay = (index % 7) * 0.18;
  return (
    <span
      className="garden-blade"
      style={
        {
          left: `${x}%`,
          height: `${h}px`,
          background: color,
          animationDelay: `${delay}s`,
        } as CSSProperties
      }
    />
  );
}

function Tree({ x }: { x: string }) {
  return (
    <div className="garden-tree" style={{ left: x }}>
      <div className="garden-tree-trunk" />
      <div className="garden-tree-foliage" />
    </div>
  );
}

function Robot({ index, type, total }: { index: number; type: RobotType; total: number }) {
  const tier = ROBOT_TIER_INDEX[type] ?? 0;
  const colors = ROBOT_PALETTE[tier % ROBOT_PALETTE.length] ?? ROBOT_PALETTE[0]!;
  const [body, accent] = colors;
  const lane = (index % 3) * 12 + 12; // % depuis le bas
  const speed = 6 + (index % 4) * 1.5;
  const direction = index % 2 === 0 ? 1 : -1;
  const delay = (index / Math.max(total, 1)) * 2;
  return (
    <div
      className="garden-robot"
      style={
        {
          bottom: `${lane}%`,
          animationDuration: `${speed}s`,
          animationDelay: `${delay}s`,
          animationDirection: direction === 1 ? 'normal' : 'reverse',
        } as CSSProperties
      }
    >
      <div className="garden-robot-body" style={{ background: body }}>
        <div
          className="garden-robot-led"
          style={{ background: accent, boxShadow: `0 0 6px ${accent}` }}
        />
        <div className="garden-robot-panel" />
      </div>
      <div className="garden-robot-wheel garden-robot-wheel-l" />
      <div className="garden-robot-wheel garden-robot-wheel-r" />
      <div className="garden-robot-blades" />
    </div>
  );
}

const ROBOT_TIER_INDEX: Record<RobotType, number> = {
  HAND_SHEARS: 0,
  PUSH_MOWER: 1,
  GAS_MOWER: 2,
  ELECTRIC_MOWER: 3,
  ROBOMOW_V1: 4,
  NAVIBOT: 5,
  HELIOCUT: 6,
  MEGAMOWER: 7,
  AEROMOW: 8,
  NANOSWARM: 9,
};

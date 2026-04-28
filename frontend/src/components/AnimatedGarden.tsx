// Scene top-down style Stardew Valley : tuiles d'herbe, ferme avec parcelles
// cultivees, maison/garage, cloture en bois, puits anime, arbres, papillons,
// robots qui patrouillent. Sprites Claude Design (terrain/robots/decor/fx).

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import type { RobotType } from '@robomow/shared';
import { useGameStore } from '../stores/gameStore.js';
import {
  Sprite,
  ATLAS_URL,
  ATLAS_SIZE,
  TERRAIN,
  DECOR,
  ROBOT_SIZE,
  ROBOT_WALK_FRAMES,
} from './garden/Sprite.js';

// Echelle pixel-art : chaque pixel source = SCALE pixels affiches.
const SCALE = 3;
const TILE = 16 * SCALE; // 48px par tuile
const COLS = 14;
const ROWS = 8;

interface BladeParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  hue: number;
}

interface CoinParticle {
  id: number;
  x: number;
  y: number;
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

// Carte fixe de la ferme : '.' herbe, ',' herbe haute, '#' chemin pierre,
// 'd' terre tondue, 'F' cloture, 'H' maison, 'T' arbre, 'B' buisson,
// 'W' puits, 'S' panneau, '*' fleur.
const FARM_MAP: string[] = [
  '..,..T..,.....',
  '.HHH.,..T.B..,',
  '.HHH...........',
  '..S.dddd...,..',
  '..#.dddd..T..,',
  ',.#.FFFF..B..,',
  '.,#......W...,',
  ',..,.,..,..,..',
];

export function AnimatedGarden() {
  const { t } = useTranslation();
  const manualTap = useGameStore((s) => s.manualTap);
  const cashPerSecond = useGameStore((s) => s.cashPerSecond);
  const holdings = useGameStore((s) => s.holdings);
  const [blades, setBlades] = useState<BladeParticle[]>([]);
  const [coins, setCoins] = useState<CoinParticle[]>([]);
  const [shake, setShake] = useState(false);
  const [zoom, setZoom] = useState(1);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const idRef = useRef(0);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const el = wrapperRef.current;
    const native = COLS * TILE;
    const update = () => {
      const w = el.clientWidth;
      const z = Math.min(1.2, Math.max(0.4, w / native));
      setZoom(z);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const visibleRobots: RobotType[] = [];
  for (const holding of Object.values(holdings)) {
    for (let i = 0; i < holding.owned && visibleRobots.length < 6; i++) {
      visibleRobots.push(holding.type);
    }
  }

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const newBlades: BladeParticle[] = Array.from({ length: 10 }, () => {
      idRef.current += 1;
      return {
        id: idRef.current,
        x,
        y,
        vx: (Math.random() - 0.5) * 100,
        vy: -50 - Math.random() * 50,
        rotation: Math.random() * 360,
        hue: Math.floor(Math.random() * 4),
      };
    });
    setBlades((prev) => [...prev, ...newBlades].slice(-50));
    idRef.current += 1;
    setCoins((prev) => [...prev, { id: idRef.current, x, y }].slice(-12));
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

  // Tuile herbe variant pseudo-aleatoire en fonction de (x,y).
  function grassVariant(x: number, y: number) {
    const idx = (x * 31 + y * 17 + (x % 2) * 3) % 4;
    return TERRAIN.GRASS_VARIANTS[idx]!;
  }

  return (
    <div
      ref={wrapperRef}
      onClick={handleClick}
      className={`farm-scene ${shake ? 'animate-shake' : ''}`}
      style={
        {
          width: '100%',
          maxWidth: COLS * TILE,
          height: ROWS * TILE * zoom,
        } as CSSProperties
      }
      role="button"
      aria-label="Cliquez pour tondre"
    >
      <div
        className="farm-stage"
        style={{
          width: COLS * TILE,
          height: ROWS * TILE,
          transform: `scale(${zoom})`,
        }}
      >
        {/* Couche herbe : tuiles de fond pour toutes les cases. */}
        {Array.from({ length: ROWS }).map((_, y) => (
          <div key={`gr${y}`} style={{ position: 'absolute', top: y * TILE, left: 0, height: TILE, width: COLS * TILE, display: 'flex' }}>
            {Array.from({ length: COLS }).map((_, x) => {
              const v = grassVariant(x, y);
              return (
                <Sprite
                  key={x}
                  atlas="terrain"
                  sx={v.sx}
                  sy={v.sy}
                  sw={v.sw}
                  sh={v.sh}
                  scale={SCALE}
                />
              );
            })}
          </div>
        ))}

        {/* Couche chemin / terre / cloture / herbe haute (depuis FARM_MAP). */}
        {FARM_MAP.map((row, y) =>
          [...row].map((ch, x) => {
            if (ch === '#') return <TileSprite key={`p${x}-${y}`} x={x} y={y} sprite={TERRAIN.STONE_PATH} />;
            if (ch === 'd') return <TileSprite key={`d${x}-${y}`} x={x} y={y} sprite={TERRAIN.DIRT} />;
            if (ch === 'F') return <TileSprite key={`f${x}-${y}`} x={x} y={y} sprite={TERRAIN.FENCE_H} />;
            if (ch === ',') return <TallGrass key={`tg${x}-${y}`} x={x} y={y} />;
            return null;
          }),
        )}

        {/* Maison/garage 48x64 (avec cheminee), centree sur (1,1). */}
        <div
          className="farm-decor"
          style={{
            position: 'absolute',
            left: 0.6 * TILE,
            top: 0.4 * TILE,
            zIndex: 5,
          }}
        >
          <Sprite atlas="decor" {...DECOR.HOUSE} scale={SCALE} />
          <span className="house-smoke" />
        </div>

        {/* Arbres */}
        <DecorAt x={5} y={0.2} sprite={DECOR.TREE_A} z={6} sway />
        <DecorAt x={9} y={1.2} sprite={DECOR.TREE_B} z={6} sway />
        <DecorAt x={11} y={4.0} sprite={DECOR.TREE_C} z={6} sway />
        <DecorAt x={1} y={6.0} sprite={DECOR.TREE_A} z={6} sway />

        {/* Buissons */}
        <DecorAt x={9.5} y={2.2} sprite={DECOR.BUSH_BERRY} z={4} />
        <DecorAt x={10} y={5.2} sprite={DECOR.BUSH_FLOWER} z={4} />

        {/* Panneau a cote du chemin */}
        <DecorAt x={2.2} y={3.4} sprite={DECOR.SIGNPOST} z={5} />

        {/* Puits anime (frame change via CSS) */}
        <AnimatedWell x={7} y={6} />

        {/* Cultures sur les rangees de terre */}
        <CropRow x={4} y={3} count={4} colorIdx={0} />
        <CropRow x={4} y={4} count={4} colorIdx={1} />

        {/* Robots animes */}
        {visibleRobots.length > 0
          ? visibleRobots.map((type, i) => (
              <SpriteRobot key={i} index={i} type={type} total={visibleRobots.length} />
            ))
          : (
            <div className="farm-empty">
              <div className="farm-empty-text">{t('game.tapHint')}</div>
            </div>
          )}

        {/* Papillons flottants */}
        <Butterfly x={6.5} y={1.5} delay={0} variant="PINK" />
        <Butterfly x={4} y={5.5} delay={1.2} variant="YELLOW" />
        <Butterfly x={11} y={2.5} delay={2.5} variant="BLUE" />

        {/* Particules brins coupes */}
        {blades.map((b) => (
          <span
            key={b.id}
            className="farm-blade-particle"
            style={
              {
                left: `${b.x}%`,
                top: `${b.y}%`,
                ['--vx' as string]: `${b.vx}px`,
                ['--vy' as string]: `${b.vy}px`,
                ['--rot' as string]: `${b.rotation}deg`,
                background: ['#a8e66c', '#8fde5d', '#63c74d', '#3e8948'][b.hue],
              } as CSSProperties
            }
          />
        ))}

        {/* Pieces flottantes */}
        {coins.map((c) => (
          <span key={c.id} className="farm-coin-particle" style={{ left: `${c.x}%`, top: `${c.y}%` }}>
            🪙
          </span>
        ))}

        {/* Indicateur production passive */}
        {cashPerSecond.gt(0) && (
          <div className="farm-prod-indicator">⚙ Auto-tonte</div>
        )}
      </div>
    </div>
  );
}

// =====================================================================
// Sous-composants.
// =====================================================================

function TileSprite({ x, y, sprite }: { x: number; y: number; sprite: { sx: number; sy: number; sw: number; sh: number } }) {
  return (
    <div style={{ position: 'absolute', left: x * TILE, top: y * TILE, zIndex: 2 }}>
      <Sprite atlas="terrain" {...sprite} scale={SCALE} />
    </div>
  );
}

function TallGrass({ x, y }: { x: number; y: number }) {
  // Animation sway 4 frames sur ligne 1 de terrain.png.
  const seed = (x * 7 + y * 13) % 4;
  return (
    <div
      style={{
        position: 'absolute',
        left: x * TILE,
        top: y * TILE,
        width: 16 * SCALE,
        height: 16 * SCALE,
        backgroundImage: `url(${ATLAS_URL.terrain})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${ATLAS_SIZE.terrain[0] * SCALE}px ${ATLAS_SIZE.terrain[1] * SCALE}px`,
        backgroundPosition: `-${seed * 16 * SCALE}px -${16 * SCALE}px`,
        imageRendering: 'pixelated',
        animation: `tallgrass-sway 0.7s steps(4) infinite`,
        animationDelay: `${(seed * 0.15).toFixed(2)}s`,
        zIndex: 2,
      }}
    />
  );
}

function DecorAt({
  x, y, sprite, z = 4, sway = false,
}: {
  x: number;
  y: number;
  sprite: { sx: number; sy: number; sw: number; sh: number };
  z?: number;
  sway?: boolean;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x * TILE,
        top: y * TILE,
        zIndex: z,
        transformOrigin: '50% 100%',
        animation: sway ? 'tree-sway 4s ease-in-out infinite' : undefined,
      }}
    >
      <Sprite atlas="decor" {...sprite} scale={SCALE} />
    </div>
  );
}

function AnimatedWell({ x, y }: { x: number; y: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x * TILE,
        top: y * TILE,
        width: DECOR.WELL_W * SCALE,
        height: DECOR.WELL.sh * SCALE,
        backgroundImage: `url(${ATLAS_URL.decor})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${ATLAS_SIZE.decor[0] * SCALE}px ${ATLAS_SIZE.decor[1] * SCALE}px`,
        backgroundPosition: `-${DECOR.WELL.sx * SCALE}px -${DECOR.WELL.sy * SCALE}px`,
        imageRendering: 'pixelated',
        animation: `well-shimmer 1s steps(${DECOR.WELL_FRAMES}) infinite`,
        zIndex: 5,
      }}
    />
  );
}

function CropRow({ x, y, count, colorIdx }: { x: number; y: number; count: number; colorIdx: number }) {
  const flowers = [TERRAIN.FLOWER_RED, TERRAIN.FLOWER_YELLOW, TERRAIN.FLOWER_BLUE];
  const sprite = flowers[colorIdx % flowers.length]!;
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: (x + i) * TILE,
            top: y * TILE,
            zIndex: 3,
          }}
        >
          <Sprite atlas="terrain" {...sprite} scale={SCALE} />
        </div>
      ))}
    </>
  );
}

function Butterfly({ x, y, delay, variant }: { x: number; y: number; delay: number; variant: 'PINK' | 'YELLOW' | 'BLUE' }) {
  const sprites = {
    PINK: DECOR.BUTTERFLY_PINK,
    YELLOW: DECOR.BUTTERFLY_YELLOW,
    BLUE: DECOR.BUTTERFLY_BLUE,
  };
  const sprite = sprites[variant];
  return (
    <div
      className="farm-butterfly"
      style={{
        position: 'absolute',
        left: x * TILE,
        top: y * TILE,
        zIndex: 8,
        animationDelay: `${delay}s`,
      }}
    >
      <div
        style={{
          width: sprite.sw * SCALE,
          height: sprite.sh * SCALE,
          backgroundImage: `url(${ATLAS_URL.decor})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${ATLAS_SIZE.decor[0] * SCALE}px ${ATLAS_SIZE.decor[1] * SCALE}px`,
          backgroundPosition: `-${sprite.sx * SCALE}px -${sprite.sy * SCALE}px`,
          imageRendering: 'pixelated',
          animation: `butterfly-flap 0.3s steps(${DECOR.BUTTERFLY_FRAMES}) infinite`,
        }}
      />
    </div>
  );
}

function SpriteRobot({ index, type, total }: { index: number; type: RobotType; total: number }) {
  const tier = ROBOT_TIER_INDEX[type] ?? 0;
  const lane = (index % 3);
  const dir = index % 2 === 0 ? 'right' : 'left';
  const startY = (3 + lane * 1.2) * TILE;
  const speed = 8 + (index % 4) * 1.5;
  const delay = (index / Math.max(total, 1)) * 2;

  // Pour walk-right : row B, cols 6-11 → bg-position-x 6*24=-144 → -288 (animation 6 steps)
  // Pour walk-left : row B, cols 0-5 → bg-position-x 0 → -144
  const rowY = tier * 48 + 24;
  const startCol = dir === 'right' ? 6 : 0;
  const endCol = startCol + ROBOT_WALK_FRAMES;

  const animX = `robot-walk-${dir}-${tier}`;
  const animMove = `robot-move-${dir}`;

  return (
    <>
      <style>{`
        @keyframes ${animX} {
          0% { background-position: -${startCol * ROBOT_SIZE * SCALE}px -${rowY * SCALE}px; }
          100% { background-position: -${endCol * ROBOT_SIZE * SCALE}px -${rowY * SCALE}px; }
        }
      `}</style>
      <div
        className={`farm-robot farm-robot-${dir}`}
        style={
          {
            position: 'absolute',
            top: startY,
            width: ROBOT_SIZE * SCALE,
            height: ROBOT_SIZE * SCALE,
            backgroundImage: `url(${ATLAS_URL.robots})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${ATLAS_SIZE.robots[0] * SCALE}px ${ATLAS_SIZE.robots[1] * SCALE}px`,
            imageRendering: 'pixelated',
            zIndex: 10,
            animation: `${animX} 0.6s steps(${ROBOT_WALK_FRAMES}) infinite, ${animMove} ${speed}s linear infinite`,
            animationDelay: `${delay}s, ${delay}s`,
          } as CSSProperties
        }
      />
    </>
  );
}

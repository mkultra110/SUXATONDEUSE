// Scene top-down style Stardew Valley avec robots qui tondent vraiment
// l'herbe : un robot par type possede, ciblage des tuiles d'herbe haute,
// animation mow, repousse apres delai.

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import type { RobotType } from '@robomow/shared';
import { useGameStore } from '../stores/gameStore.js';
import { audio } from '../services/audio.js';
import { LadybugIcon } from './icons/PixelIcon.js';
import {
  Sprite,
  ATLAS_URL,
  ATLAS_SIZE,
  TERRAIN,
  DECOR,
  MOWING,
  ROBOT_SIZE,
  ROBOT_WALK_FRAMES,
} from './garden/Sprite.js';

const SCALE = 3;
const TILE = 16 * SCALE;
const COLS = 14;
const ROWS = 8;

const TICK_MS = 80;
const ROBOT_SPEED = 0.05; // tuiles par tick
const MOW_TICKS = 10; // ~800ms d'anim mow
const REGROW_MS = 8000;

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

interface RobotEntity {
  id: string;
  type: RobotType;
  tier: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  state: 'walking' | 'mowing';
  dir: 'left' | 'right' | 'up' | 'down';
  mowTicksLeft: number;
  walkFrame: number;
  speedMul: number;
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

// Carte de la ferme : '.' herbe, ',' herbe haute, '#' chemin, 'd' terre,
// 'F' cloture, 'H' maison, 'T' arbre, 'B' buisson, 'S' panneau, 'W' puits.
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

// Tuiles bloquees pour la nav des robots (maison, arbres, cloture, etc.).
const BLOCKED_CHARS = new Set(['H', 'T', 'B', 'F', 'W', 'S']);

function isBlocked(x: number, y: number): boolean {
  if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return true;
  const ch = FARM_MAP[y]?.[x];
  return !!ch && BLOCKED_CHARS.has(ch);
}

// Liste initiale des tuiles d'herbe haute depuis FARM_MAP.
function initialTallGrass(): Set<string> {
  const set = new Set<string>();
  FARM_MAP.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (ch === ',') set.add(`${x},${y}`);
    });
  });
  return set;
}

function pickRandomTallGrass(set: Set<string>, except?: string): string | null {
  const arr = Array.from(set).filter((k) => k !== except);
  if (arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)] ?? null;
}

function pickRandomFreeTile(): { x: number; y: number } {
  for (let i = 0; i < 30; i++) {
    const x = Math.floor(Math.random() * COLS);
    const y = Math.floor(Math.random() * ROWS);
    if (!isBlocked(x, y)) return { x, y };
  }
  return { x: 6, y: 4 };
}

export function AnimatedGarden() {
  const { t } = useTranslation();
  const manualTap = useGameStore((s) => s.manualTap);
  const cashPerSecond = useGameStore((s) => s.cashPerSecond);
  const holdings = useGameStore((s) => s.holdings);

  const [blades, setBlades] = useState<BladeParticle[]>([]);
  const [coins, setCoins] = useState<CoinParticle[]>([]);
  const [shake, setShake] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [tallGrass, setTallGrass] = useState<Set<string>>(initialTallGrass);
  const [cutGrass, setCutGrass] = useState<Set<string>>(new Set());
  const [robots, setRobots] = useState<RobotEntity[]>([]);
  const [bursts, setBursts] = useState<Array<{ id: number; tileX: number; tileY: number; t0: number }>>([]);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const idRef = useRef(0);

  // Resize observer pour scale.
  useEffect(() => {
    if (!wrapperRef.current) return;
    const el = wrapperRef.current;
    const native = COLS * TILE;
    const update = () => {
      const w = el.clientWidth;
      setZoom(Math.min(1.2, Math.max(0.4, w / native)));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Synchronise les robots avec les types possedes (1 par type owned > 0).
  useEffect(() => {
    setRobots((prev) => {
      const ownedTypes = Object.values(holdings)
        .filter((h) => h.owned > 0)
        .map((h) => h.type);
      // Conserve les robots existants, ajoute les nouveaux types.
      const existing = new Map(prev.map((r) => [r.type, r]));
      const next: RobotEntity[] = [];
      ownedTypes.forEach((type, i) => {
        const ex = existing.get(type);
        if (ex) {
          next.push(ex);
        } else {
          const { x, y } = pickRandomFreeTile();
          const tier = ROBOT_TIER_INDEX[type] ?? 0;
          next.push({
            id: `${type}-${i}`,
            type,
            tier,
            x,
            y,
            targetX: x,
            targetY: y,
            state: 'walking',
            dir: 'right',
            mowTicksLeft: 0,
            walkFrame: 0,
            speedMul: 1 + tier * 0.08,
          });
        }
      });
      return next;
    });
  }, [holdings]);

  // Boucle de simulation : robots se deplacent, tondent, repoussent.
  useEffect(() => {
    if (robots.length === 0) return;
    const interval = setInterval(() => {
      setRobots((prevRobots) => {
        // Snapshot mutable du Set d'herbe haute pour decider des cibles.
        let grassChanged = false;
        const grassRef = new Set(tallGrass);

        const next = prevRobots.map((r) => {
          const robot = { ...r };

          if (robot.state === 'mowing') {
            robot.mowTicksLeft -= 1;
            robot.walkFrame = (robot.walkFrame + 1) % 4;
            if (robot.mowTicksLeft <= 0) {
              // Tonte terminee : tuile cible passe de "tall" a "cut".
              const tx = Math.round(robot.targetX);
              const ty = Math.round(robot.targetY);
              const key = `${tx},${ty}`;
              if (grassRef.has(key)) {
                grassRef.delete(key);
                grassChanged = true;
                audio.playMow();
                // Marque comme tondue (visuel mowing.png cut tile).
                setCutGrass((s) => {
                  const n = new Set(s);
                  n.add(key);
                  return n;
                });
                // Programme la repousse : cut → tall apres delai.
                const regrow = REGROW_MS + Math.random() * 2000;
                setTimeout(() => {
                  setCutGrass((s) => {
                    if (!s.has(key)) return s;
                    const n = new Set(s);
                    n.delete(key);
                    return n;
                  });
                  setTallGrass((s) => {
                    if (s.has(key)) return s;
                    const n = new Set(s);
                    n.add(key);
                    return n;
                  });
                }, regrow);
                // Spawn burst sprite-anime sur la tuile.
                idRef.current += 1;
                const id = idRef.current;
                setBursts((prev) => [...prev, { id, tileX: tx, tileY: ty, t0: Date.now() }]);
                setTimeout(() => {
                  setBursts((prev) => prev.filter((f) => f.id !== id));
                }, 600);
              }
              // Choisit nouvelle cible.
              const nextTarget = pickRandomTallGrass(grassRef);
              if (nextTarget) {
                const [tx, ty] = nextTarget.split(',').map(Number) as [number, number];
                robot.targetX = tx;
                robot.targetY = ty;
              } else {
                const t = pickRandomFreeTile();
                robot.targetX = t.x;
                robot.targetY = t.y;
              }
              robot.state = 'walking';
              robot.walkFrame = 0;
            }
            return robot;
          }

          // Walking : avance vers la cible.
          const dx = robot.targetX - robot.x;
          const dy = robot.targetY - robot.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 0.08) {
            // Arrivee.
            robot.x = robot.targetX;
            robot.y = robot.targetY;
            const key = `${Math.round(robot.x)},${Math.round(robot.y)}`;
            if (grassRef.has(key)) {
              robot.state = 'mowing';
              robot.mowTicksLeft = MOW_TICKS;
              robot.walkFrame = 0;
            } else {
              // Pas d'herbe ici (cible obsolete) : repick.
              const nextTarget = pickRandomTallGrass(grassRef);
              if (nextTarget) {
                const [tx, ty] = nextTarget.split(',').map(Number) as [number, number];
                robot.targetX = tx;
                robot.targetY = ty;
              } else {
                const t = pickRandomFreeTile();
                robot.targetX = t.x;
                robot.targetY = t.y;
              }
            }
            return robot;
          }

          // Avance proportionnelle.
          const step = ROBOT_SPEED * robot.speedMul;
          const move = Math.min(step, dist);
          robot.x += (dx / dist) * move;
          robot.y += (dy / dist) * move;
          // Direction principale.
          if (Math.abs(dx) > Math.abs(dy)) {
            robot.dir = dx > 0 ? 'right' : 'left';
          } else {
            robot.dir = dy > 0 ? 'down' : 'up';
          }
          robot.walkFrame = (robot.walkFrame + 1) % ROBOT_WALK_FRAMES;
          return robot;
        });

        if (grassChanged) {
          setTallGrass(grassRef);
        }
        return next;
      });
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [robots.length, tallGrass]);

  // Si nouveau robot ajoute mais sans cible, l'envoie sur l'herbe haute.
  useEffect(() => {
    setRobots((prev) =>
      prev.map((r) => {
        if (r.targetX === r.x && r.targetY === r.y) {
          const t = pickRandomTallGrass(tallGrass);
          if (t) {
            const [tx, ty] = t.split(',').map(Number) as [number, number];
            return { ...r, targetX: tx, targetY: ty };
          }
        }
        return r;
      }),
    );
  }, [robots.length, tallGrass]);

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
    audio.playTap();
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
        style={{ width: COLS * TILE, height: ROWS * TILE, transform: `scale(${zoom})` }}
      >
        {/* Couche herbe : tuiles de fond. */}
        {Array.from({ length: ROWS }).map((_, y) => (
          <div
            key={`gr${y}`}
            style={{ position: 'absolute', top: y * TILE, left: 0, height: TILE, width: COLS * TILE, display: 'flex' }}
          >
            {Array.from({ length: COLS }).map((_, x) => {
              const v = grassVariant(x, y);
              return <Sprite key={x} atlas="terrain" sx={v.sx} sy={v.sy} sw={v.sw} sh={v.sh} scale={SCALE} />;
            })}
          </div>
        ))}

        {/* Couche statique chemin/terre/cloture depuis FARM_MAP. */}
        {FARM_MAP.map((row, y) =>
          [...row].map((ch, x) => {
            if (ch === '#') return <TileSprite key={`p${x}-${y}`} x={x} y={y} sprite={TERRAIN.STONE_PATH} />;
            if (ch === 'd') return <TileSprite key={`d${x}-${y}`} x={x} y={y} sprite={TERRAIN.DIRT} />;
            if (ch === 'F') return <TileSprite key={`f${x}-${y}`} x={x} y={y} sprite={TERRAIN.FENCE_H} />;
            return null;
          }),
        )}

        {/* Couche herbe tondue (mowing.png cut tiles). */}
        {Array.from(cutGrass).map((key) => {
          const [x, y] = key.split(',').map(Number) as [number, number];
          return <CutGrass key={`cg${key}`} x={x} y={y} />;
        })}

        {/* Couche herbe haute : repoussable. */}
        {Array.from(tallGrass).map((key) => {
          const [x, y] = key.split(',').map(Number) as [number, number];
          return <TallGrass key={`tg${key}`} x={x} y={y} />;
        })}

        {/* Maison */}
        <div style={{ position: 'absolute', left: 0.6 * TILE, top: 0.4 * TILE, zIndex: 5 }}>
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
        <DecorAt x={2.2} y={3.4} sprite={DECOR.SIGNPOST} z={5} />
        <AnimatedWell x={7} y={6} />

        <CropRow x={4} y={3} count={4} colorIdx={0} />
        <CropRow x={4} y={4} count={4} colorIdx={1} />

        {/* Robots dynamiques */}
        {robots.length > 0 ? (
          robots.map((r) => <DynamicRobot key={r.id} robot={r} />)
        ) : (
          <div className="farm-empty">
            <div className="farm-empty-text">{t('game.tapHint')}</div>
          </div>
        )}

        {/* Burst de brins coupes (sprite mowing.png anime 4 frames) */}
        {bursts.map((b) => (
          <BurstSprite key={b.id} tileX={b.tileX} tileY={b.tileY} />
        ))}

        {/* Papillons */}
        <Butterfly x={6.5} y={1.5} delay={0} variant="PINK" />
        <Butterfly x={4} y={5.5} delay={1.2} variant="YELLOW" />
        <Butterfly x={11} y={2.5} delay={2.5} variant="BLUE" />

        {/* Easter egg cozy : coccinelle qui marche tres lentement (Margaux Lefevre signature). */}
        <div className="farm-ladybug" title="Coccinelle">
          <LadybugIcon size={16} />
        </div>

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
        {coins.map((c) => (
          <span key={c.id} className="farm-coin-particle" style={{ left: `${c.x}%`, top: `${c.y}%` }}>
            🪙
          </span>
        ))}
        {cashPerSecond.gt(0) && <div className="farm-prod-indicator">⚙ Auto-tonte</div>}
      </div>
    </div>
  );
}

function TileSprite({ x, y, sprite }: { x: number; y: number; sprite: { sx: number; sy: number; sw: number; sh: number } }) {
  return (
    <div style={{ position: 'absolute', left: x * TILE, top: y * TILE, zIndex: 2 }}>
      <Sprite atlas="terrain" {...sprite} scale={SCALE} />
    </div>
  );
}

function CutGrass({ x, y }: { x: number; y: number }) {
  const seed = (x * 11 + y * 7) % 4;
  const variant = MOWING.CUT_GRASS_VARIANTS[seed]!;
  return (
    <div
      style={{
        position: 'absolute',
        left: x * TILE,
        top: y * TILE,
        width: 16 * SCALE,
        height: 16 * SCALE,
        backgroundImage: `url(${ATLAS_URL.mowing})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${ATLAS_SIZE.mowing[0] * SCALE}px ${ATLAS_SIZE.mowing[1] * SCALE}px`,
        backgroundPosition: `-${variant.sx * SCALE}px -${variant.sy * SCALE}px`,
        imageRendering: 'pixelated',
        zIndex: 2,
        animation: 'cutgrass-fade-in 0.25s ease-out',
      }}
    />
  );
}

function BurstSprite({ tileX, tileY }: { tileX: number; tileY: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: tileX * TILE,
        top: tileY * TILE,
        width: MOWING.BURST_W * SCALE,
        height: MOWING.BURST_H * SCALE,
        backgroundImage: `url(${ATLAS_URL.mowing})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${ATLAS_SIZE.mowing[0] * SCALE}px ${ATLAS_SIZE.mowing[1] * SCALE}px`,
        backgroundPosition: `-${MOWING.BURST_X * SCALE}px -${MOWING.BURST_Y * SCALE}px`,
        imageRendering: 'pixelated',
        zIndex: 25,
        animation: 'mow-burst 0.6s steps(4) forwards',
      }}
    />
  );
}

function TallGrass({ x, y }: { x: number; y: number }) {
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
        animation: 'tallgrass-sway 0.7s steps(4) infinite, tallgrass-grow 0.4s ease-out',
        animationDelay: `${(seed * 0.15).toFixed(2)}s, 0s`,
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
        <div key={i} style={{ position: 'absolute', left: (x + i) * TILE, top: y * TILE, zIndex: 3 }}>
          <Sprite atlas="terrain" {...sprite} scale={SCALE} />
        </div>
      ))}
    </>
  );
}

function Butterfly({ x, y, delay, variant }: { x: number; y: number; delay: number; variant: 'PINK' | 'YELLOW' | 'BLUE' }) {
  const sprites = { PINK: DECOR.BUTTERFLY_PINK, YELLOW: DECOR.BUTTERFLY_YELLOW, BLUE: DECOR.BUTTERFLY_BLUE };
  const sprite = sprites[variant];
  return (
    <div className="farm-butterfly" style={{ position: 'absolute', left: x * TILE, top: y * TILE, zIndex: 8, animationDelay: `${delay}s` }}>
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

function DynamicRobot({ robot }: { robot: RobotEntity }) {
  const tier = robot.tier;
  const rowY = robot.state === 'mowing' ? tier * 48 + 24 : (robot.dir === 'up' || robot.dir === 'down' ? tier * 48 : tier * 48 + 24);
  let colBase: number;
  if (robot.state === 'mowing') {
    colBase = 12;
  } else {
    switch (robot.dir) {
      case 'down': colBase = 0; break;
      case 'up': colBase = 6; break;
      case 'left': colBase = 0; break;
      case 'right': colBase = 6; break;
    }
  }
  const frameMax = robot.state === 'mowing' ? 4 : ROBOT_WALK_FRAMES;
  const frame = robot.walkFrame % frameMax;
  const sx = (colBase + frame) * ROBOT_SIZE;
  const sy = rowY;

  // Centre la sprite sur la tuile (24×24 vs tuile 16×16 → decalage -4 native).
  const left = robot.x * TILE - 4 * SCALE;
  const top = robot.y * TILE - 8 * SCALE;

  // Lame rotative sous le robot (frames mowing.png).
  const bladeFrame = robot.walkFrame % MOWING.BLADE_FRAMES;
  const bladeBgX = (MOWING.BLADE_X + bladeFrame * MOWING.BLADE_W) * SCALE;

  // Indicateur "active" au-dessus du robot pendant la tonte.
  const activeFrame = Math.floor(robot.walkFrame / 2) % MOWING.ACTIVE_FRAMES;
  const activeBgX = (MOWING.ACTIVE_X + activeFrame * MOWING.ACTIVE_W) * SCALE;

  return (
    <>
      {/* Lame rotative metallique sous le robot quand il tond. */}
      {robot.state === 'mowing' && (
        <div
          style={{
            position: 'absolute',
            left: robot.x * TILE,
            top: robot.y * TILE + 14 * SCALE,
            width: MOWING.BLADE_W * SCALE,
            height: MOWING.BLADE_H * SCALE,
            backgroundImage: `url(${ATLAS_URL.mowing})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${ATLAS_SIZE.mowing[0] * SCALE}px ${ATLAS_SIZE.mowing[1] * SCALE}px`,
            backgroundPosition: `-${bladeBgX}px -${MOWING.BLADE_Y * SCALE}px`,
            imageRendering: 'pixelated',
            zIndex: 9,
            transform: 'translateX(-4px)',
            filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.6))',
          }}
        />
      )}

      {/* Robot lui-meme. */}
      <div
        style={{
          position: 'absolute',
          left,
          top,
          width: ROBOT_SIZE * SCALE,
          height: ROBOT_SIZE * SCALE,
          backgroundImage: `url(${ATLAS_URL.robots})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${ATLAS_SIZE.robots[0] * SCALE}px ${ATLAS_SIZE.robots[1] * SCALE}px`,
          backgroundPosition: `-${sx * SCALE}px -${sy * SCALE}px`,
          imageRendering: 'pixelated',
          zIndex: 10,
          transition: 'left 80ms linear, top 80ms linear',
          filter: robot.state === 'mowing' ? 'drop-shadow(0 0 6px rgba(168,230,108,0.8))' : undefined,
        }}
      />

      {/* Indicateur "tonte active" au-dessus du robot. */}
      {robot.state === 'mowing' && (
        <div
          style={{
            position: 'absolute',
            left: robot.x * TILE,
            top: robot.y * TILE - 18 * SCALE,
            width: MOWING.ACTIVE_W * SCALE,
            height: MOWING.ACTIVE_H * SCALE,
            backgroundImage: `url(${ATLAS_URL.mowing})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${ATLAS_SIZE.mowing[0] * SCALE}px ${ATLAS_SIZE.mowing[1] * SCALE}px`,
            backgroundPosition: `-${activeBgX}px -${MOWING.ACTIVE_Y * SCALE}px`,
            imageRendering: 'pixelated',
            zIndex: 11,
            animation: 'active-bob 0.5s ease-in-out infinite',
          }}
        />
      )}
    </>
  );
}

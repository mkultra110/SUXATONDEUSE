// Scene top-down style Stardew Valley avec robots qui tondent vraiment
// l'herbe : un robot par type possede, ciblage des tuiles d'herbe haute,
// animation mow, repousse apres delai.

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import type { RobotType } from '@robomow/shared';
import { weatherForHour } from '@robomow/shared';
import { useGameStore } from '../stores/gameStore.js';
import {
  computePlayerLevel,
  progressionTier,
  TIER_BUTTERFLIES,
  TIER_FLOWERS_COUNT,
} from '../utils/playerLevel.js';
import { themeForMapLevel } from '../utils/mapThemes.js';
import { audio } from '../services/audio.js';
import { LadybugIcon, LanternIcon, PomponIcon, ScarecrowIcon, CoinIcon, IconGear, MailboxIcon, CocotteIcon } from './icons/PixelIcon.js';
import { SpeechBubble } from './hud/SpeechBubble.js';
import i18next from 'i18next';

const MAILBOX_TILE_X = 13.0;
const MAILBOX_TILE_Y = 6.4;
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
// Robots a scale 2 (48px = 1 tuile) au lieu de 3 (72px = 1.5 tuile).
// Plus credible top-down, aligne sur la grille des sprites de terrain.
const ROBOT_SCALE = 2;

const TICK_MS = 80;
const ROBOT_SPEED = 0.05; // tuiles par tick
const MOW_TICKS = 10; // ~800ms d'anim mow
const REGROW_MS_BASE = 8000;
// Timer de transition map (ms).
const MAP_TRANSITION_MS = 1200;

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
  // Waypoints BFS : robot avance d'une tuile a la fois en suivant
  // ce chemin pour eviter les obstacles. Vide quand arrive a destination.
  path: Array<{ x: number; y: number }>;
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
// Layout aere : maison en haut-gauche, parcelles cultivees au centre,
// chemin diagonale, herbe haute repartie sur tous les bords.
const FARM_MAP: string[] = [
  '.,...........,',
  '.HHH..,......,',
  '.HHH.#.....,..',
  '.....#.dddd...',
  '.,...#.dddd..,',
  ',....#.FFFF...',
  '.,...#......,.',
  ',..,.,..,..,..',
];

// Tuiles bloquees pour la nav des robots (maison, arbres, cloture, etc.).
const BLOCKED_CHARS = new Set(['H', 'T', 'B', 'F', 'W', 'S']);

// Tuiles occupees par les decors places en absolu via <DecorAt> ou
// composants dedies. Doit rester synchro avec les positions JSX plus bas.
// Format : [x, y, width, height] en tuiles.
const BLOCKED_DECOR_TILES: ReadonlyArray<readonly [number, number, number, number]> = [
  [5, 0, 1, 2],   // TREE_A en (5.5, 0.0)
  [11, 0, 1, 2],  // TREE_B en (11.4, 0.4)
  [0, 5, 1, 2],   // TREE_C en (0.5, 5.5)
  [2, 6, 1, 2],   // TREE_A en (2.8, 6.6)
  [4, 1, 1, 1],   // BUSH_BERRY en (4.0, 1.8)
  [11, 5, 1, 1],  // BUSH_FLOWER en (11.4, 5.4)
  [6, 2, 1, 2],   // SIGNPOST en (6.0, 2.5)
  [11, 2, 2, 2],  // WELL en (11.5, 2.5) - 32x32 = 2 tuiles
  [12, 4, 1, 2],  // SCARECROW en (12.6, 4.0)
  [13, 6, 1, 2],  // MAILBOX en (13.0, 6.4)
];

function isBlocked(x: number, y: number): boolean {
  if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return true;
  const ch = FARM_MAP[y]?.[x];
  if (ch && BLOCKED_CHARS.has(ch)) return true;
  for (const [bx, by, bw, bh] of BLOCKED_DECOR_TILES) {
    if (x >= bx && x < bx + bw && y >= by && y < by + bh) return true;
  }
  return false;
}

// BFS pathfinding 4-connexe (haut/bas/gauche/droite, pas de diagonales
// pour eviter les coupes a travers les coins de blocs).
// Retourne le chemin de waypoints (excluant start) ou null si pas joignable.
function bfsPath(
  sx: number,
  sy: number,
  tx: number,
  ty: number,
): Array<{ x: number; y: number }> | null {
  if (sx === tx && sy === ty) return [];
  const start = `${sx},${sy}`;
  const target = `${tx},${ty}`;
  const visited = new Set<string>([start]);
  const parent = new Map<string, string>();
  const queue: Array<[number, number]> = [[sx, sy]];
  while (queue.length > 0) {
    const [cx, cy] = queue.shift()!;
    if (cx === tx && cy === ty) break;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const) {
      const nx = cx + dx;
      const ny = cy + dy;
      const key = `${nx},${ny}`;
      if (visited.has(key)) continue;
      if (isBlocked(nx, ny)) continue;
      visited.add(key);
      parent.set(key, `${cx},${cy}`);
      queue.push([nx, ny]);
    }
  }
  if (!parent.has(target) && start !== target) return null;
  // Remonte le chemin.
  const path: Array<{ x: number; y: number }> = [];
  let cur = target;
  while (cur !== start) {
    const [x, y] = cur.split(',').map(Number) as [number, number];
    path.unshift({ x, y });
    const p = parent.get(cur);
    if (!p) return null;
    cur = p;
  }
  return path;
}

// Liste initiale des tuiles d'herbe haute depuis FARM_MAP (cartes de base).
function baseTallGrass(): Set<string> {
  const set = new Set<string>();
  FARM_MAP.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (ch === ',') set.add(`${x},${y}`);
    });
  });
  return set;
}

// Genere une carte d'herbe haute pour un niveau de map donne.
// Plus le niveau est haut, plus il y a de tuiles a tondre. Le prestige
// ajoute des tuiles supplementaires (difficulte croissante).
function generateMap(mapLevel: number, prestigeLevel: number): Set<string> {
  const base = baseTallGrass();
  // Cellules disponibles (non-bloquees, pas deja en tall grass).
  const free: Array<[number, number]> = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (!isBlocked(x, y) && !base.has(`${x},${y}`)) {
        free.push([x, y]);
      }
    }
  }
  // Combien de tuiles supplementaires ? Map 1 = 0 extra, map 5 = 12 extra,
  // map 10 = 22 extra, etc. Cap a free.length pour ne pas deborder.
  // Prestige multiplie la densite : x1.0 a P0, x1.5 a P3, x2.0 a P6+.
  const prestigeMul = 1 + Math.min(1, prestigeLevel / 6);
  const extraCount = Math.min(free.length, Math.round((mapLevel - 1) * 2.5 * prestigeMul));
  // Shuffle deterministic (seed = mapLevel * 31 + prestigeLevel) pour que
  // chaque map soit reproductible mais visuellement differente.
  const seed = mapLevel * 31 + prestigeLevel * 7;
  function rng(i: number) {
    const x = Math.sin(seed + i * 1.7) * 10000;
    return x - Math.floor(x);
  }
  const shuffled = [...free];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng(i) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  const result = new Set(base);
  for (let i = 0; i < extraCount; i++) {
    const tile = shuffled[i];
    if (tile) result.add(`${tile[0]},${tile[1]}`);
  }
  return result;
}

function pickRandomFreeTile(): { x: number; y: number } {
  for (let i = 0; i < 30; i++) {
    const x = Math.floor(Math.random() * COLS);
    const y = Math.floor(Math.random() * ROWS);
    if (!isBlocked(x, y)) return { x, y };
  }
  return { x: 6, y: 4 };
}

// Helper : assigne une nouvelle cible au robot avec chemin BFS.
// Priorite herbe haute reachable, sinon tuile libre random.
function assignNewTarget(robot: RobotEntity, grass: Set<string>): void {
  const sx = Math.round(robot.x);
  const sy = Math.round(robot.y);
  // Cherche une herbe haute reachable.
  const grassList = Array.from(grass);
  // Shuffle pour eviter le pattern "tjs la meme tuile".
  for (let i = grassList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [grassList[i], grassList[j]] = [grassList[j]!, grassList[i]!];
  }
  for (const k of grassList) {
    const [tx, ty] = k.split(',').map(Number) as [number, number];
    if (isBlocked(tx, ty)) continue;
    const path = bfsPath(sx, sy, tx, ty);
    if (path && path.length > 0) {
      robot.targetX = tx;
      robot.targetY = ty;
      robot.path = path;
      return;
    }
    // Si target = current cell et c'est de l'herbe haute, on a deja gagne.
    if (sx === tx && sy === ty) {
      robot.targetX = tx;
      robot.targetY = ty;
      robot.path = [];
      return;
    }
  }
  // Pas d'herbe reachable : marche aleatoire.
  for (let i = 0; i < 12; i++) {
    const t = pickRandomFreeTile();
    const path = bfsPath(sx, sy, t.x, t.y);
    if (path) {
      robot.targetX = t.x;
      robot.targetY = t.y;
      robot.path = path;
      return;
    }
  }
  // Fallback : reste sur place.
  robot.targetX = sx;
  robot.targetY = sy;
  robot.path = [];
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
  // Niveau de map courant : chaque fois qu'on a tondu toute l'herbe haute,
  // on incremente +1 et on regenere une map plus difficile.
  const prestigeLevel = useGameStore((s) => s.prestigeLevel);
  const [mapLevel, setMapLevel] = useState(1);
  const [tallGrass, setTallGrass] = useState<Set<string>>(() => generateMap(1, 0));
  const [cutGrass, setCutGrass] = useState<Set<string>>(new Set());
  const [mapInitialCount, setMapInitialCount] = useState<number>(() => generateMap(1, 0).size);
  const [mapTransition, setMapTransition] = useState<null | 'fade-out' | 'fade-in'>(null);

  // Detecte la completion : quand tallGrass est vide ET il y a eu des tuiles
  // initiales, on declenche la transition vers la map suivante.
  useEffect(() => {
    if (tallGrass.size > 0 || mapTransition !== null || mapInitialCount === 0) return;
    // Map nettoyee : on transitionne.
    setMapTransition('fade-out');
    const t1 = setTimeout(() => {
      setMapLevel((lvl) => {
        const next = lvl + 1;
        const newMap = generateMap(next, prestigeLevel);
        setTallGrass(newMap);
        setCutGrass(new Set());
        setMapInitialCount(newMap.size);
        return next;
      });
      setMapTransition('fade-in');
      // Audio fanfare.
      audio.playPurchase();
    }, MAP_TRANSITION_MS / 2);
    const t2 = setTimeout(() => {
      setMapTransition(null);
    }, MAP_TRANSITION_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [tallGrass, mapTransition, mapInitialCount, prestigeLevel]);

  // Quand prestige change : reset map a 1 + regenere.
  useEffect(() => {
    const fresh = generateMap(1, prestigeLevel);
    setMapLevel(1);
    setTallGrass(fresh);
    setCutGrass(new Set());
    setMapInitialCount(fresh.size);
  }, [prestigeLevel]);

  const tilesMowed = mapInitialCount - tallGrass.size;
  const mapPercent = mapInitialCount > 0 ? Math.round((tilesMowed / mapInitialCount) * 100) : 100;

  // Theme courant : palette + particules + ambiance changent par paliers.
  const mapTheme = useMemo(() => themeForMapLevel(mapLevel), [mapLevel]);

  // Decor density scale avec le player level (signature progression).
  // Plus le joueur monte en niveau, plus le jardin gagne en richesse :
  // butterflies, fleurs bonus, lanternes, etc.
  const totalCash = useGameStore((s) => s.totalCashEarned);
  const playerLevel = computePlayerLevel(totalCash);
  const tier = progressionTier(playerLevel);
  const butterflyCount = TIER_BUTTERFLIES[tier];
  const flowerCount = TIER_FLOWERS_COUNT[tier];
  // Genere les positions des papillons (deterministe par level).
  const butterflies = useMemo(() => {
    const variants: Array<'PINK' | 'YELLOW' | 'BLUE'> = ['PINK', 'YELLOW', 'BLUE'];
    return Array.from({ length: butterflyCount }).map((_, i) => {
      const r1 = ((i * 73 + 17) % 100) / 100;
      const r2 = ((i * 41 + 31) % 100) / 100;
      const r3 = (i * 19) % 3;
      return {
        x: 1 + r1 * (COLS - 2),
        y: 0.5 + r2 * (ROWS - 2),
        delay: (i * 0.7) % 4,
        variant: variants[r3] ?? 'PINK',
      };
    });
  }, [butterflyCount]);
  // Genere les positions de fleurs bonus (sur les bords, deterministe).
  const bonusFlowers = useMemo(() => {
    const variants: Array<'red' | 'yellow' | 'blue'> = ['red', 'yellow', 'blue'];
    return Array.from({ length: flowerCount }).map((_, i) => {
      // Distribue le long du bord bas + bord haut.
      const r1 = ((i * 53 + 11) % 100) / 100;
      const onBottom = i % 2 === 0;
      return {
        x: r1 * (COLS - 1),
        y: onBottom ? ROWS - 1 + ((i % 3) * 0.1) : 0.05 + ((i % 3) * 0.1),
        variant: variants[i % 3] ?? 'red',
      };
    });
  }, [flowerCount]);
  const [robots, setRobots] = useState<RobotEntity[]>([]);
  const [bursts, setBursts] = useState<Array<{ id: number; tileX: number; tileY: number; t0: number }>>([]);
  const [floatingNums, setFloatingNums] = useState<Array<{ id: number; x: number; y: number; n: number; vx: number }>>([]);
  const [scarecrowHeadRot, setScarecrowHeadRot] = useState(0);
  const [bubbles, setBubbles] = useState<Array<{ id: number; x: number; y: number; text: string }>>([]);
  // Easter egg : 7 clics sur la boite aux lettres -> Cocotte pond un oeuf bonus.
  const [mailboxClicks, setMailboxClicks] = useState(0);
  const [mailboxFlag, setMailboxFlag] = useState(false);
  const [cocotteVisible, setCocotteVisible] = useState(false);
  // Meteo dynamique : refresh toutes les minutes, declenche pluie/neige.
  const [currentWeather, setCurrentWeather] = useState(() => weatherForHour(new Date()));
  useEffect(() => {
    const id = setInterval(() => setCurrentWeather(weatherForHour(new Date())), 60_000);
    return () => clearInterval(id);
  }, []);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const idRef = useRef(0);

  // Resize observer pour scale.
  // Le zoom de base s'adapte au container width, mais aussi a la
  // progression : plus de plots unlocked = scale plus genereux (jardin
  // qui s'agrandit visuellement).
  const plotsUnlocked = useGameStore((s) => s.plotsUnlocked);
  const plotsCount = Object.values(plotsUnlocked).filter(Boolean).length;
  // Scale boost : 1.0 a 1 plot, 1.4 a 10 plots (lineaire).
  const plotScaleBoost = 1 + Math.min(0.4, (plotsCount - 1) * 0.044);
  useEffect(() => {
    if (!wrapperRef.current) return;
    const el = wrapperRef.current;
    const native = COLS * TILE;
    const update = () => {
      const w = el.clientWidth;
      // Container max-width × plotScaleBoost = scale final cap a 1.6.
      const containerScale = w / native;
      setZoom(Math.min(1.6, Math.max(0.4, containerScale * plotScaleBoost)));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [plotScaleBoost]);

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
            path: [],
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
                // Difficulty croissante : a chaque prestige le regrow speed
                // accelere de 12% (cap a 50% du base apres 6 prestiges).
                const regrowMul = Math.max(0.5, 1 - prestigeLevel * 0.12);
                const regrow = REGROW_MS_BASE * regrowMul + Math.random() * 2000;
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
                // Floating number = cash reellement gagne pendant la duree
                // de la tonte (MOW_TICKS * TICK_MS / 1000), reparti sur tous
                // les robots qui tondent en parallele. Sync avec cashPerSecond.
                idRef.current += 1;
                const fnId = idRef.current;
                const xPct = ((tx + 0.5) / COLS) * 100;
                const yPct = ((ty + 0.3) / ROWS) * 100;
                const vx = (Math.random() - 0.5) * 30;
                const cps = useGameStore.getState().cashPerSecond;
                const mowDurationSec = (MOW_TICKS * TICK_MS) / 1000;
                const robotShare = Math.max(1, prevRobots.length);
                const earnedDecimal = cps.mul(mowDurationSec).div(robotShare);
                // Format compact pour que l'affichage reste lisible.
                const earned = earnedDecimal.gte(1)
                  ? Math.max(1, Math.round(Number(earnedDecimal.toString())))
                  : Number(earnedDecimal.toString().slice(0, 6));
                setFloatingNums((prev) => [
                  ...prev,
                  { id: fnId, x: xPct, y: yPct, n: earned, vx },
                ].slice(-8));
                setTimeout(() => {
                  setFloatingNums((prev) => prev.filter((f) => f.id !== fnId));
                }, 1100);
              }
              // Choisit nouvelle cible + chemin BFS.
              assignNewTarget(robot, grassRef);
              robot.state = 'walking';
              robot.walkFrame = 0;
            }
            return robot;
          }

          // Walking : avance vers le prochain waypoint du chemin.
          // Si chemin vide ou destination atteinte, repique une cible.
          if (robot.path.length === 0) {
            // Pas de chemin = arrive ou stuck. Si on est sur de l'herbe haute → tonte.
            const key = `${Math.round(robot.x)},${Math.round(robot.y)}`;
            if (grassRef.has(key)) {
              robot.state = 'mowing';
              robot.mowTicksLeft = MOW_TICKS;
              robot.walkFrame = 0;
              robot.targetX = Math.round(robot.x);
              robot.targetY = Math.round(robot.y);
            } else {
              assignNewTarget(robot, grassRef);
            }
            return robot;
          }

          const next = robot.path[0]!;
          const dx = next.x - robot.x;
          const dy = next.y - robot.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 0.08) {
            // Waypoint atteint : on snap et on consomme.
            robot.x = next.x;
            robot.y = next.y;
            robot.path = robot.path.slice(1);
            return robot;
          }

          const step = ROBOT_SPEED * robot.speedMul;
          const move = Math.min(step, dist);
          robot.x += (dx / dist) * move;
          robot.y += (dy / dist) * move;
          // Direction = waypoint suivant (cardinal pur car BFS 4-connexe).
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

  // Si nouveau robot ajoute mais sans cible/path, lui calcule un BFS.
  useEffect(() => {
    setRobots((prev) =>
      prev.map((r) => {
        if (r.path.length === 0 && r.targetX === r.x && r.targetY === r.y) {
          const next = { ...r };
          assignNewTarget(next, tallGrass);
          return next;
        }
        return r;
      }),
    );
  }, [robots.length, tallGrass]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    // Calcule l'angle entre le scarecrow (12, 5.5) et le curseur
    // pour faire tourner sa tete (max ±30deg).
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const sx = (12.5 / COLS) * rect.width;
    const sy = (5.5 / ROWS) * rect.height;
    const dx = mx - sx;
    const dy = my - sy;
    const rad = Math.atan2(dy, dx);
    const deg = (rad * 180) / Math.PI;
    // Limite a ±30deg autour de 90 (tete face au sud).
    const clamped = Math.max(-30, Math.min(30, deg - 90));
    setScarecrowHeadRot(clamped);
  }

  // Spawn une bulle de dialogue a la position (xPx, yPx) en pixels stage.
  function spawnBubble(xPx: number, yPx: number, text: string) {
    idRef.current += 1;
    const id = idRef.current;
    setBubbles((prev) => [...prev, { id, x: xPx, y: yPx, text }].slice(-3));
    setTimeout(() => {
      setBubbles((prev) => prev.filter((b) => b.id !== id));
    }, 3000);
  }

  // Tap sur un robot : spawn une bulle avec quote aleatoire de sa personnalite.
  function handleRobotTap(robot: RobotEntity) {
    const quotes = i18next.t(`robotQuotes.${robot.type}`, { returnObjects: true }) as string[] | string;
    const list = Array.isArray(quotes) ? quotes : [quotes];
    const pick = list[Math.floor(Math.random() * list.length)] ?? '...';
    spawnBubble(robot.x * TILE + ROBOT_SIZE * SCALE / 2 - 4 * SCALE, robot.y * TILE - 4 * SCALE, pick);
    audio.playTap();
  }

  // Tap sur un easter egg : tooltip court avec voice Meme.
  function handleEasterEgg(xPx: number, yPx: number, key: 'ladybug' | 'pompon' | 'scarecrow' | 'lantern') {
    const text = i18next.t(`easterEggs.${key}`, '...');
    spawnBubble(xPx, yPx, text);
  }

  // Tap sur la boite aux lettres : declenche le drapeau + compteur 7 clics.
  function handleMailbox(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    setMailboxFlag(true);
    setTimeout(() => setMailboxFlag(false), 1200);
    setMailboxClicks((prev) => {
      const next = prev + 1;
      if (next === 7) {
        // Cocotte la poule apparait + 50 cash bonus + bulle.
        setCocotteVisible(true);
        spawnBubble(
          MAILBOX_TILE_X * TILE,
          (MAILBOX_TILE_Y - 1.5) * TILE,
          'Cocotte a pondu un œuf bonus ! +50 🪙',
        );
        // Cocotte disparait apres 4s.
        setTimeout(() => setCocotteVisible(false), 4000);
        audio.playPurchase();
        return 0;
      }
      // Petits messages a 3 et 5 clics.
      if (next === 3) {
        spawnBubble(MAILBOX_TILE_X * TILE, MAILBOX_TILE_Y * TILE - 8, 'Quelqu\'un frappe...');
      } else if (next === 5) {
        spawnBubble(MAILBOX_TILE_X * TILE, MAILBOX_TILE_Y * TILE - 8, 'On entend des cris de poule...');
      } else {
        audio.playTap();
      }
      return next;
    });
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
    audio.playTap();
    // Floating number "+1" au tap.
    idRef.current += 1;
    const fnId = idRef.current;
    const vx = (Math.random() - 0.5) * 40;
    setFloatingNums((prev) => [...prev, { id: fnId, x, y, n: 1, vx }].slice(-8));
    setTimeout(() => {
      setFloatingNums((prev) => prev.filter((f) => f.id !== fnId));
    }, 1100);
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
      onMouseMove={handleMouseMove}
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

        {/* Maison + Pompon le chat sur le toit + lanterne suspendue */}
        <div style={{ position: 'absolute', left: 0.6 * TILE, top: 0.4 * TILE, zIndex: 5 }}>
          <Sprite atlas="decor" {...DECOR.HOUSE} scale={SCALE} />
          <span className="house-smoke" />
        </div>
        <div
          className="farm-pompon"
          title="Pompon le chat"
          style={{ left: 1.2 * TILE, top: 0.55 * TILE, cursor: 'pointer', pointerEvents: 'auto' }}
          onClick={(e) => {
            e.stopPropagation();
            handleEasterEgg(1.2 * TILE + 21, 0.55 * TILE, 'pompon');
          }}
        >
          <PomponIcon size={42} />
        </div>
        <div
          className="farm-lantern"
          style={{ left: 3.6 * TILE, top: 1.1 * TILE, transformOrigin: '50% 0', cursor: 'pointer', pointerEvents: 'auto' }}
          onClick={(e) => {
            e.stopPropagation();
            handleEasterEgg(3.6 * TILE + 14, 1.1 * TILE, 'lantern');
          }}
        >
          <LanternIcon size={28} />
        </div>

        {/* Arbres : repartis aux 4 coins/bords */}
        <DecorAt x={5.5} y={0.0} sprite={DECOR.TREE_A} z={6} sway />
        <DecorAt x={11.4} y={0.4} sprite={DECOR.TREE_B} z={6} sway />
        <DecorAt x={0.5} y={5.5} sprite={DECOR.TREE_C} z={6} sway />
        <DecorAt x={2.8} y={6.6} sprite={DECOR.TREE_A} z={6} sway />

        {/* Buissons */}
        <DecorAt x={4.0} y={1.8} sprite={DECOR.BUSH_BERRY} z={4} />
        <DecorAt x={11.4} y={5.4} sprite={DECOR.BUSH_FLOWER} z={4} />
        <DecorAt x={6.0} y={2.5} sprite={DECOR.SIGNPOST} z={5} />
        <AnimatedWell x={11.5} y={2.5} />

        {/* Crops dans les rangees de terre (cols 7-10, rangs 3-4) */}
        <CropRow x={7} y={3} count={4} colorIdx={0} />
        <CropRow x={7} y={4} count={4} colorIdx={1} />

        {/* Robots dynamiques */}
        {robots.length > 0 ? (
          robots.map((r) => <DynamicRobot key={r.id} robot={r} onTap={handleRobotTap} />)
        ) : (
          <div className="farm-empty">
            <div className="farm-empty-text">{t('game.tapHint')}</div>
          </div>
        )}

        {/* Burst de brins coupes (sprite mowing.png anime 4 frames) */}
        {bursts.map((b) => (
          <BurstSprite key={b.id} tileX={b.tileX} tileY={b.tileY} />
        ))}

        {/* Floating numbers "+X coin" qui montent depuis le robot/tap. */}
        {floatingNums.map((f) => (
          <span
            key={f.id}
            className="farm-floating-number"
            style={
              {
                left: `${f.x}%`,
                top: `${f.y}%`,
                ['--vx' as string]: `${f.vx}px`,
              } as CSSProperties
            }
          >
            +{f.n}
            <svg viewBox="0 0 16 16" shapeRendering="crispEdges" style={{ width: 14, height: 14, imageRendering: 'pixelated' }}>
              <rect x="5" y="2" width="6" height="1" fill="#5c3d24" />
              <rect x="3" y="3" width="2" height="1" fill="#5c3d24" />
              <rect x="11" y="3" width="2" height="1" fill="#5c3d24" />
              <rect x="2" y="4" width="1" height="2" fill="#5c3d24" />
              <rect x="13" y="4" width="1" height="2" fill="#5c3d24" />
              <rect x="2" y="10" width="1" height="2" fill="#5c3d24" />
              <rect x="13" y="10" width="1" height="2" fill="#5c3d24" />
              <rect x="3" y="12" width="2" height="1" fill="#5c3d24" />
              <rect x="11" y="12" width="2" height="1" fill="#5c3d24" />
              <rect x="5" y="13" width="6" height="1" fill="#5c3d24" />
              <rect x="3" y="4" width="10" height="8" fill="#f5c443" />
              <rect x="3" y="4" width="10" height="2" fill="#f5e6c8" />
              <rect x="6" y="6" width="4" height="4" fill="#c49b6a" />
              <rect x="7" y="7" width="2" height="2" fill="#f5e6c8" />
            </svg>
          </span>
        ))}

        {/* Papillons : nombre scale avec player level (signature progression). */}
        {butterflies.map((b, i) => (
          <Butterfly key={i} x={b.x} y={b.y} delay={b.delay} variant={b.variant} />
        ))}

        {/* Pierres decoratives (walkable, pas de collision). 3 positions
            fixes pour ne pas casser la lisibilite. */}
        <TileSprite x={1} y={2} sprite={TERRAIN.ROCK_SMALL} />
        <TileSprite x={5} y={5} sprite={TERRAIN.ROCK_SMALL} />
        <TileSprite x={9} y={7} sprite={TERRAIN.ROCK_SMALL} />

        {/* Fleurs supplementaires bonus (scale avec player level). */}
        {bonusFlowers.map((f, i) => (
          <BonusFlower key={i} x={f.x} y={f.y} variant={f.variant} />
        ))}

        {/* Easter egg cozy : coccinelle qui marche tres lentement (Margaux Lefevre signature). */}
        <div
          className="farm-ladybug"
          title="Coccinelle"
          style={{ cursor: 'pointer', pointerEvents: 'auto' }}
          onClick={(e) => {
            e.stopPropagation();
            const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
            const stageRect = (e.currentTarget.parentElement as HTMLDivElement).getBoundingClientRect();
            handleEasterEgg(rect.left - stageRect.left + 8, rect.top - stageRect.top, 'ladybug');
          }}
        >
          <LadybugIcon size={16} />
        </div>

        {/* Epouvantail (Camille v9) : tete qui tourne vers le curseur. Plus
            petit (40px) pour ne pas dominer la scene. */}
        <div
          className="farm-scarecrow"
          style={
            {
              left: 12.6 * TILE,
              top: 4.0 * TILE,
              ['--head-rot' as string]: `${scarecrowHeadRot}deg`,
              cursor: 'pointer',
              pointerEvents: 'auto',
            } as CSSProperties
          }
          title="Épouvantail"
          onClick={(e) => {
            e.stopPropagation();
            handleEasterEgg(12.6 * TILE + 20, 4.0 * TILE, 'scarecrow');
          }}
        >
          <ScarecrowIcon size={40} />
        </div>

        {/* Boite aux lettres rouge francaise (Camille Rousset, easter egg
            7 clics = Cocotte pond un oeuf). Drapeau qui se leve sur clic. */}
        <div
          className={`farm-mailbox ${mailboxFlag ? 'farm-mailbox-flag' : ''}`}
          style={{
            position: 'absolute',
            left: MAILBOX_TILE_X * TILE,
            top: MAILBOX_TILE_Y * TILE,
            zIndex: 6,
            cursor: 'pointer',
            pointerEvents: 'auto',
            filter: 'drop-shadow(0 1px 0 rgba(0,0,0,0.4))',
          }}
          onClick={handleMailbox}
          title="Boite aux lettres"
        >
          <MailboxIcon size={48} />
          {mailboxClicks > 0 && mailboxClicks < 7 && (
            <span
              style={{
                position: 'absolute',
                top: -8,
                right: -8,
                background: 'var(--color-accent-red)',
                color: 'var(--color-paper-1)',
                fontFamily: 'var(--font-button)',
                fontSize: 9,
                padding: '2px 5px',
                border: '2px solid var(--color-wood-5)',
                fontWeight: 700,
              }}
            >
              {mailboxClicks}
            </span>
          )}
        </div>

        {/* Cocotte la poule : apparait apres le 7eme clic. */}
        {cocotteVisible && (
          <div
            className="farm-cocotte"
            style={{
              position: 'absolute',
              left: (MAILBOX_TILE_X - 0.5) * TILE,
              top: (MAILBOX_TILE_Y + 1.2) * TILE,
              zIndex: 7,
              pointerEvents: 'none',
              filter: 'drop-shadow(0 1px 0 rgba(0,0,0,0.5))',
            }}
          >
            <CocotteIcon size={42} />
          </div>
        )}

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
            <CoinIcon size={20} />
          </span>
        ))}
        {cashPerSecond.gt(0) && (
          <div className="farm-prod-indicator">
            <IconGear size={12} />
            <span style={{ marginLeft: 4 }}>Auto-tonte</span>
          </div>
        )}

        {/* Progress map : "Map N · NomTheme · X%" en haut-droite */}
        <div className="farm-map-progress">
          <div className="farm-map-progress-label">
            <span style={{ color: mapTheme.accentColor }}>MAP {mapLevel}</span>
            <span className="numeric" style={{ marginLeft: 6 }}>{mapPercent}%</span>
          </div>
          <div
            className="meme"
            style={{
              fontSize: 10,
              color: mapTheme.accentColor,
              fontStyle: 'italic',
              lineHeight: 1,
              marginTop: 2,
              textAlign: 'center',
            }}
          >
            {mapTheme.name}
          </div>
          <div className="farm-map-progress-bar">
            <div
              className="farm-map-progress-fill"
              style={{
                width: `${mapPercent}%`,
                background: `linear-gradient(90deg, ${mapTheme.accentColor}, var(--color-accent-gold))`,
                boxShadow: `0 0 6px ${mapTheme.accentColor}`,
              }}
            />
          </div>
        </div>

        {/* Theme overlay tint (multiply) au-dessus du jardin pour ambiance. */}
        <div
          className="farm-theme-overlay"
          style={{
            background: mapTheme.skyTint,
            mixBlendMode: 'multiply',
          }}
        />

        {/* Theme particles overlay : sakura / fireflies / embers / etc. */}
        {mapTheme.particleEffect !== 'none' && (
          <div className={`farm-particles farm-particles-${mapTheme.particleEffect}`}>
            {Array.from({ length: 6 + mapTheme.particleDensity * 6 }).map((_, i) => (
              <span
                key={i}
                className={`farm-particle farm-particle-${mapTheme.particleEffect}`}
                style={
                  {
                    left: `${(i * 53) % 100}%`,
                    animationDelay: `${(i * 0.4) % 4}s`,
                    animationDuration: `${4 + (i % 5) * 0.6}s`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
        )}

        {/* Map transition overlay (fade flash) */}
        {mapTransition && (
          <div className={`farm-map-transition farm-map-transition-${mapTransition}`}>
            {mapTransition === 'fade-in' && (
              <div className="farm-map-transition-text">
                <div style={{ fontSize: 13, letterSpacing: '0.15em', color: 'var(--color-paper-3)' }}>
                  NOUVELLE PARCELLE
                </div>
                <div
                  className="numeric"
                  style={{
                    fontSize: 36,
                    fontWeight: 700,
                    color: 'var(--color-accent-gold)',
                    textShadow: '2px 2px 0 var(--color-wood-5)',
                  }}
                >
                  MAP {mapLevel}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Meteo dynamique : pluie ou neige selon currentWeather */}
        {(currentWeather === 'rain' || currentWeather === 'storm') && (
          <div className="farm-weather-overlay">
            {Array.from({ length: 30 }).map((_, i) => (
              <span
                key={`rain${i}`}
                className="farm-rain-drop"
                style={{
                  left: `${(i * 37) % 100}%`,
                  animationDelay: `${(i * 0.07) % 0.8}s`,
                  animationDuration: `${0.6 + (i % 3) * 0.1}s`,
                }}
              />
            ))}
          </div>
        )}
        {currentWeather === 'snow' && (
          <div className="farm-weather-overlay">
            {Array.from({ length: 24 }).map((_, i) => (
              <span
                key={`snow${i}`}
                className="farm-snow-flake"
                style={{
                  left: `${(i * 41) % 100}%`,
                  animationDelay: `${(i * 0.15) % 4}s`,
                  animationDuration: `${3 + (i % 4) * 0.4}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Speech bubbles (robots quotes + easter eggs) */}
        {bubbles.map((b) => (
          <SpeechBubble
            key={b.id}
            x={b.x}
            y={b.y}
            text={b.text}
            durationMs={3000}
            onDone={() => setBubbles((prev) => prev.filter((x) => x.id !== b.id))}
          />
        ))}
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

// BonusFlower : petite fleur 16x16 placee sur les bords pour signaler la
// progression du joueur. Plus le niveau est haut, plus il y en a.
function BonusFlower({ x, y, variant }: { x: number; y: number; variant: 'red' | 'yellow' | 'blue' }) {
  const flowerSprite =
    variant === 'red' ? TERRAIN.FLOWER_RED :
    variant === 'yellow' ? TERRAIN.FLOWER_YELLOW :
    TERRAIN.FLOWER_BLUE;
  return (
    <div
      style={{
        position: 'absolute',
        left: x * TILE,
        top: y * TILE,
        zIndex: 4,
        animation: `bonus-flower-sway ${2 + (x + y) % 3}s ease-in-out infinite`,
        animationDelay: `${(x * 0.3) % 2}s`,
        transformOrigin: '50% 100%',
        pointerEvents: 'none',
      }}
    >
      <Sprite atlas="terrain" {...flowerSprite} scale={SCALE} />
    </div>
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

function DynamicRobot({ robot, onTap }: { robot: RobotEntity; onTap?: (r: RobotEntity) => void }) {
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

  // Centre la sprite robot 24×24 sur la tuile 16×16 :
  // - Robot affiche a ROBOT_SCALE = 2 (48px), tuile a SCALE = 3 (48px).
  // - Decalage horizontal pour centrer : (TILE - 24*ROBOT_SCALE) / 2 = 0px.
  // - Decalage vertical : on remonte la sprite de 4*ROBOT_SCALE pour que les
  //   pieds touchent le sol de la tuile.
  const left = robot.x * TILE;
  const top = robot.y * TILE - 4 * ROBOT_SCALE;

  // Lame rotative sous le robot (frames mowing.png) - aussi a ROBOT_SCALE.
  const bladeFrame = robot.walkFrame % MOWING.BLADE_FRAMES;
  const bladeBgX = (MOWING.BLADE_X + bladeFrame * MOWING.BLADE_W) * ROBOT_SCALE;

  // Indicateur "active" au-dessus du robot pendant la tonte.
  const activeFrame = Math.floor(robot.walkFrame / 2) % MOWING.ACTIVE_FRAMES;
  const activeBgX = (MOWING.ACTIVE_X + activeFrame * MOWING.ACTIVE_W) * ROBOT_SCALE;

  return (
    <>
      {/* Lame rotative metallique sous le robot quand il tond. */}
      {robot.state === 'mowing' && (
        <div
          style={{
            position: 'absolute',
            left: robot.x * TILE,
            top: robot.y * TILE + (ROBOT_SIZE - 4) * ROBOT_SCALE,
            width: MOWING.BLADE_W * ROBOT_SCALE,
            height: MOWING.BLADE_H * ROBOT_SCALE,
            backgroundImage: `url(${ATLAS_URL.mowing})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${ATLAS_SIZE.mowing[0] * ROBOT_SCALE}px ${ATLAS_SIZE.mowing[1] * ROBOT_SCALE}px`,
            backgroundPosition: `-${bladeBgX}px -${MOWING.BLADE_Y * ROBOT_SCALE}px`,
            imageRendering: 'pixelated',
            zIndex: 9,
            filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.6))',
          }}
        />
      )}

      {/* Robot lui-meme. */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onTap?.(robot);
        }}
        style={{
          position: 'absolute',
          left,
          top,
          width: ROBOT_SIZE * ROBOT_SCALE,
          height: ROBOT_SIZE * ROBOT_SCALE,
          backgroundImage: `url(${ATLAS_URL.robots})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${ATLAS_SIZE.robots[0] * ROBOT_SCALE}px ${ATLAS_SIZE.robots[1] * ROBOT_SCALE}px`,
          backgroundPosition: `-${sx * ROBOT_SCALE}px -${sy * ROBOT_SCALE}px`,
          imageRendering: 'pixelated',
          zIndex: 10,
          transition: 'left 80ms linear, top 80ms linear',
          filter: robot.state === 'mowing' ? 'drop-shadow(0 0 6px rgba(168,230,108,0.8))' : undefined,
          cursor: 'pointer',
          pointerEvents: 'auto',
        }}
      />

      {/* Indicateur "tonte active" au-dessus du robot. */}
      {robot.state === 'mowing' && (
        <div
          style={{
            position: 'absolute',
            left: robot.x * TILE,
            top: robot.y * TILE - 12 * ROBOT_SCALE,
            width: MOWING.ACTIVE_W * ROBOT_SCALE,
            height: MOWING.ACTIVE_H * ROBOT_SCALE,
            backgroundImage: `url(${ATLAS_URL.mowing})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${ATLAS_SIZE.mowing[0] * ROBOT_SCALE}px ${ATLAS_SIZE.mowing[1] * ROBOT_SCALE}px`,
            backgroundPosition: `-${activeBgX}px -${MOWING.ACTIVE_Y * ROBOT_SCALE}px`,
            imageRendering: 'pixelated',
            zIndex: 11,
            animation: 'active-bob 0.5s ease-in-out infinite',
          }}
        />
      )}
    </>
  );
}

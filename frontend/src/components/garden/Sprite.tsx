// Sprite atlas helper : decoupe les PNG Claude Design (terrain/robots/decor/ui/fx)
// via background-position. Toutes les coordonnees sont en pixels natifs.

import type { CSSProperties } from 'react';

export type AtlasName = 'terrain' | 'robots' | 'decor' | 'ui' | 'fx';

export const ATLAS_URL: Record<AtlasName, string> = {
  terrain: '/assets/sprites/terrain.png',
  robots: '/assets/sprites/robots.png',
  decor: '/assets/sprites/decor.png',
  ui: '/assets/sprites/ui.png',
  fx: '/assets/sprites/fx.png',
};

export const ATLAS_SIZE: Record<AtlasName, [number, number]> = {
  terrain: [256, 80],
  robots: [384, 480],
  decor: [512, 256],
  ui: [384, 256],
  fx: [256, 128],
};

interface SpriteProps {
  atlas: AtlasName;
  sx: number;
  sy: number;
  sw: number;
  sh: number;
  scale?: number;
  className?: string;
  style?: CSSProperties;
  title?: string;
}

export function Sprite({ atlas, sx, sy, sw, sh, scale = 1, className, style, title }: SpriteProps) {
  const [aw, ah] = ATLAS_SIZE[atlas];
  return (
    <span
      className={className}
      title={title}
      style={{
        display: 'inline-block',
        width: sw * scale,
        height: sh * scale,
        backgroundImage: `url(${ATLAS_URL[atlas]})`,
        backgroundPosition: `-${sx * scale}px -${sy * scale}px`,
        backgroundSize: `${aw * scale}px ${ah * scale}px`,
        backgroundRepeat: 'no-repeat',
        imageRendering: 'pixelated',
        ...style,
      }}
    />
  );
}

// =====================================================================
// Coordonnees des sprites (pixels natifs).
// =====================================================================

export const TERRAIN = {
  GRASS_VARIANTS: [
    { sx: 0, sy: 0, sw: 16, sh: 16 },
    { sx: 16, sy: 0, sw: 16, sh: 16 },
    { sx: 32, sy: 0, sw: 16, sh: 16 },
    { sx: 48, sy: 0, sw: 16, sh: 16 },
  ],
  TALL_GRASS: { sx: 0, sy: 16, sw: 16, sh: 16 },
  DIRT: { sx: 0, sy: 32, sw: 16, sh: 16 },
  STONE_PATH: { sx: 16, sy: 32, sw: 16, sh: 16 },
  FENCE_H: { sx: 0, sy: 48, sw: 16, sh: 16 },
  ROCK_SMALL: { sx: 0, sy: 64, sw: 16, sh: 16 },
  FLOWER_RED: { sx: 64, sy: 64, sw: 16, sh: 16 },
  FLOWER_YELLOW: { sx: 80, sy: 64, sw: 16, sh: 16 },
  FLOWER_BLUE: { sx: 96, sy: 64, sw: 16, sh: 16 },
} as const;

// Decor.png : positions identifiees via scan d'occupance.
export const DECOR = {
  // Garage : corps principal 48x48 a (0,32), avec cheminee qui monte de 16px.
  HOUSE: { sx: 0, sy: 16, sw: 48, sh: 64 },
  // Mature trees (16x48).
  TREE_A: { sx: 96, sy: 0, sw: 16, sh: 48 },
  TREE_B: { sx: 112, sy: 0, sw: 16, sh: 48 },
  TREE_C: { sx: 128, sy: 0, sw: 16, sh: 48 },
  // Bushes (12-14 wide x 16 tall, on Y=16-32).
  BUSH_PLAIN: { sx: 50, sy: 16, sw: 14, sh: 16 },
  BUSH_BERRY: { sx: 67, sy: 16, sw: 14, sh: 16 },
  BUSH_FLOWER: { sx: 81, sy: 16, sw: 14, sh: 16 },
  // Well : 32x32, frame 0 a (192,0). Animation 4 frames.
  WELL: { sx: 192, sy: 0, sw: 32, sh: 32 },
  WELL_FRAMES: 4,
  WELL_W: 32,
  // Signpost : 16x32 a (320,0).
  SIGNPOST: { sx: 320, sy: 0, sw: 16, sh: 32 },
  // Butterflies 8x8, animation 4 frames.
  BUTTERFLY_PINK: { sx: 0, sy: 80, sw: 8, sh: 8 },
  BUTTERFLY_YELLOW: { sx: 32, sy: 80, sw: 8, sh: 8 },
  BUTTERFLY_BLUE: { sx: 64, sy: 80, sw: 8, sh: 8 },
  BUTTERFLY_FRAMES: 4,
  BUTTERFLY_W: 8,
  // Mushrooms 8x8.
  MUSHROOM_RED: { sx: 0, sy: 176, sw: 8, sh: 8 },
} as const;

export const UI = {
  PANEL_PARCHEMIN: { sx: 0, sy: 0, sw: 32, sh: 32 },
  PANEL_WOOD: { sx: 32, sy: 0, sw: 32, sh: 32 },
  COIN: { sx: 0, sy: 32, sw: 16, sh: 16 },
  COIN_FRAMES: 4,
  FUEL: { sx: 64, sy: 32, sw: 16, sh: 16 },
  FUEL_FRAMES: 4,
  SEED: { sx: 128, sy: 32, sw: 16, sh: 16 },
  SEED_FRAMES: 4,
} as const;

// Robot helpers — chaque tier a 2 rangees a Y = t*48 et Y = t*48+24.
// Cols 0-5 = walk principal, 6-11 = walk inverse, 12-15 = idle/mow.
export const ROBOT_SIZE = 24;
export const ROBOT_WALK_FRAMES = 6;

export type RobotDir = 'down' | 'up' | 'left' | 'right';

export function robotFrame(tier: number, dir: RobotDir, frame: number) {
  const t = Math.max(0, Math.min(9, tier));
  const f = ((frame % ROBOT_WALK_FRAMES) + ROBOT_WALK_FRAMES) % ROBOT_WALK_FRAMES;
  let row: 'A' | 'B';
  let colBase: number;
  switch (dir) {
    case 'down': row = 'A'; colBase = 0; break;
    case 'up': row = 'A'; colBase = 6; break;
    case 'left': row = 'B'; colBase = 0; break;
    case 'right': row = 'B'; colBase = 6; break;
  }
  const sy = t * 48 + (row === 'A' ? 0 : 24);
  const sx = (colBase + f) * ROBOT_SIZE;
  return { sx, sy, sw: ROBOT_SIZE, sh: ROBOT_SIZE };
}

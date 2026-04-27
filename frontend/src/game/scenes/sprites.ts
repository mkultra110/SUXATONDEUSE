// Sprites generes programmatiquement via PixiJS Graphics.
// PHASE 1 : pas d'assets externes, on dessine tout en code pour livrer vite
// avec un look pixel art coherent. Les vrais sprites Kenney/Sprout Lands
// arrivent en PHASE 2.

import { Container, Graphics, Texture, RenderTexture, type Renderer } from 'pixi.js';

// Palette synchronisee avec tailwind.config.ts (GDD section 9.3)
export const PALETTE = {
  grass: {
    highlight: 0xa8e66c,
    light: 0x8fde5d,
    base: 0x63c74d,
    medium: 0x3e8948,
    shadow: 0x265c42,
    deep: 0x193c3e,
    outline: 0x1a3d24,
  },
  robot: {
    highlight: 0xffffff,
    chrome: 0xd6d6d6,
    silver: 0xc0cbdc,
    medium: 0x8b9bb4,
    shadow: 0x5a6988,
    deep: 0x3a4466,
  },
  accent: {
    red: 0xe43b44,
    yellow: 0xfee761,
    blue: 0x0099db,
    ledGreen: 0x00ffaa,
    ledAlert: 0xff5577,
  },
  soil: {
    light: 0xe4a672,
    medium: 0xb86f50,
    shadow: 0x733e39,
  },
} as const;

/**
 * Cree la texture d'une tile d'herbe pour un stage de croissance donne.
 * 4 stages (cf. GDD section 9.5) : 0 = ras, 1 = courte, 2 = moyenne, 3 = haute.
 */
export function createGrassTileTexture(renderer: Renderer, stage: 0 | 1 | 2 | 3): Texture {
  const size = 16;
  const g = new Graphics();
  g.rect(0, 0, size, size).fill(PALETTE.grass.shadow);

  const blades = [
    [4, 14],
    [7, 13],
    [10, 14],
    [13, 13],
    [2, 14],
    [12, 13],
  ];

  const heights: readonly [number, number, number, number] = [2, 5, 9, 13];
  const colorByStage: readonly [number, number, number, number] = [
    PALETTE.grass.medium,
    PALETTE.grass.base,
    PALETTE.grass.light,
    PALETTE.grass.highlight,
  ];
  const baseColor = colorByStage[stage];
  const h = heights[stage];

  for (const [x, baseY] of blades) {
    g.rect(x, baseY - h, 1, h).fill(baseColor);
  }

  if (stage === 3) {
    // Petite fleur sur les tiles tres hautes
    g.rect(5, 4, 1, 1).fill(PALETTE.accent.yellow);
    g.rect(11, 6, 1, 1).fill(PALETTE.accent.red);
  }

  const texture = RenderTexture.create({ width: size, height: size });
  renderer.render({ container: g, target: texture });
  g.destroy();
  return texture;
}

/**
 * Cree la texture d'un robot pour un type donne, vue top-down.
 * Forme generique 24x24 dessinee differemment par tier.
 */
export function createRobotTexture(renderer: Renderer, tierIndex: number): Texture {
  const size = 24;
  const g = new Graphics();

  // Couleurs variables par tier
  const bodyColors = [
    PALETTE.robot.silver, // 0 cisaille
    PALETTE.robot.medium, // 1 push
    PALETTE.robot.shadow, // 2 thermique
    PALETTE.accent.yellow, // 3 electrique
    PALETTE.accent.red, // 4 robomow
    PALETTE.accent.blue, // 5 navibot
    PALETTE.accent.yellow, // 6 helio
    PALETTE.robot.deep, // 7 mega
    PALETTE.accent.blue, // 8 aero
    PALETTE.robot.highlight, // 9 nano
  ];
  const body = bodyColors[Math.min(tierIndex, bodyColors.length - 1)];

  // Corps principal
  g.rect(4, 4, size - 8, size - 8).fill(body);
  // Ombre interne
  g.rect(4, size - 6, size - 8, 2).fill(PALETTE.robot.deep);
  // Highlight haut
  g.rect(5, 5, size - 10, 1).fill(PALETTE.robot.highlight);

  // Roues (cotes gauche/droit)
  g.rect(2, 8, 2, 8).fill(PALETTE.robot.deep);
  g.rect(size - 4, 8, 2, 8).fill(PALETTE.robot.deep);

  // LED frontale (couleur change par tier)
  const ledColor = tierIndex >= 4 ? PALETTE.accent.ledGreen : PALETTE.accent.yellow;
  g.rect(11, 6, 2, 2).fill(ledColor);

  // Indicateur de "lames" en bas (cisaille rotative)
  g.rect(8, size - 4, size - 16, 1).fill(PALETTE.robot.chrome);

  const texture = RenderTexture.create({ width: size, height: size });
  renderer.render({ container: g, target: texture });
  g.destroy();
  return texture;
}

/**
 * Conteneur d'une tile de parcelle 96x96 (6x6 tiles d'herbe 16x16).
 * Place aleatoirement les variantes pour eviter le pattern rep. visible.
 */
export function createPlotContainer(renderer: Renderer, stage: 0 | 1 | 2 | 3): Container {
  const container = new Container();
  const tileSize = 16;
  const tilesPerRow = 6;
  const texture = createGrassTileTexture(renderer, stage);

  for (let row = 0; row < tilesPerRow; row++) {
    for (let col = 0; col < tilesPerRow; col++) {
      const sprite = new Graphics();
      sprite.rect(0, 0, tileSize, tileSize).fill(stage === 0 ? PALETTE.grass.shadow : PALETTE.grass.medium);
      // En PHASE 1 on rend les tiles via Graphics direct pour simplifier.
      // (PHASE 2 : Sprite + Texture cache pour perf accrue)
      sprite.x = col * tileSize;
      sprite.y = row * tileSize;
      container.addChild(sprite);
    }
  }

  // Texture cleanup : on l'utilise pas dans cette version simplifiee.
  texture.destroy();
  return container;
}

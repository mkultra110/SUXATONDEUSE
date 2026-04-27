// Scene principale : un jardin residentiel 6x6 tiles, herbe a 4 stages
// qui repousse, robots possedes par tier qui se baladent et tondent.
//
// On evite les sprites externes en PHASE 1 : tout est dessine en Graphics
// pour rester deployable sans gestion d'assets. La fidelite pixel art reste
// correcte car l'affichage est en `image-rendering: pixelated`.

import { Application, Container, Graphics } from 'pixi.js';
import type { RobotType } from '@robomow/shared';
import { useGameStore } from '../../stores/gameStore.js';
import { PALETTE } from './sprites.js';

const PLOT_TILE = 16;
const PLOT_TILES_PER_ROW = 6;
const PLOT_SIZE = PLOT_TILE * PLOT_TILES_PER_ROW;

interface RobotEntity {
  type: RobotType;
  graphic: Graphics;
  x: number;
  y: number;
  vx: number;
  vy: number;
  mowingPhase: number;
}

export class GardenScene {
  private app: Application;
  private root: Container;
  private grassLayer: Container;
  private robotLayer: Container;
  private grassTiles: Graphics[][] = [];
  private grassStages: number[][] = [];
  private grassTimer = 0;
  private robots: RobotEntity[] = [];
  private unsubscribe: (() => void) | null = null;
  private elapsed = 0;

  constructor(app: Application) {
    this.app = app;
    this.root = new Container();
    this.grassLayer = new Container();
    this.robotLayer = new Container();
    this.root.addChild(this.grassLayer);
    this.root.addChild(this.robotLayer);
    this.app.stage.addChild(this.root);

    this.centerScene();
    this.buildGrass();
    this.app.ticker.add(this.update, this);
    this.subscribeToStore();
  }

  destroy(): void {
    this.unsubscribe?.();
    this.app.ticker.remove(this.update, this);
    this.root.destroy({ children: true });
  }

  private centerScene(): void {
    // Centre la parcelle dans le canvas (480x270 ou autre).
    const cx = (this.app.screen.width - PLOT_SIZE) / 2;
    const cy = (this.app.screen.height - PLOT_SIZE) / 2;
    this.root.x = Math.floor(cx);
    this.root.y = Math.floor(cy);
  }

  private buildGrass(): void {
    for (let row = 0; row < PLOT_TILES_PER_ROW; row++) {
      this.grassTiles[row] = [];
      this.grassStages[row] = [];
      for (let col = 0; col < PLOT_TILES_PER_ROW; col++) {
        const tile = new Graphics();
        tile.x = col * PLOT_TILE;
        tile.y = row * PLOT_TILE;
        this.grassLayer.addChild(tile);
        this.grassTiles[row][col] = tile;
        this.grassStages[row][col] = 2; // depart : herbe moyenne
        this.drawTile(tile, 2);
      }
    }
  }

  private drawTile(tile: Graphics, stage: number): void {
    tile.clear();
    // Sol
    tile.rect(0, 0, PLOT_TILE, PLOT_TILE).fill(PALETTE.grass.shadow);

    if (stage === 0) {
      // Tondu : juste le sol
      return;
    }

    const heights = [0, 3, 7, 12];
    const colors = [
      PALETTE.grass.medium,
      PALETTE.grass.medium,
      PALETTE.grass.base,
      PALETTE.grass.light,
    ];
    const h = heights[stage];
    const color = colors[stage];

    // Brins d'herbe stylises
    const blades: Array<[number, number]> = [
      [3, 14],
      [7, 13],
      [11, 14],
      [14, 13],
      [5, 13],
      [9, 14],
    ];
    for (const [x, baseY] of blades) {
      tile.rect(x, baseY - h, 1, h).fill(color);
    }
    if (stage === 3) {
      tile.rect(5, 5, 1, 1).fill(PALETTE.accent.yellow);
      tile.rect(11, 7, 1, 1).fill(PALETTE.accent.red);
    }
  }

  private subscribeToStore(): void {
    const sync = () => {
      const holdings = useGameStore.getState().holdings;
      // Compte total de robots possedes (tous tiers confondus)
      const allRobots: RobotType[] = [];
      for (const holding of Object.values(holdings)) {
        for (let i = 0; i < holding.owned; i++) {
          allRobots.push(holding.type);
        }
      }
      this.reconcileRobots(allRobots);
    };
    sync();
    this.unsubscribe = useGameStore.subscribe(sync);
  }

  private reconcileRobots(target: RobotType[]): void {
    // Ajoute / supprime des entites pour matcher le state.
    while (this.robots.length > target.length) {
      const removed = this.robots.pop();
      if (removed) removed.graphic.destroy();
    }
    while (this.robots.length < target.length) {
      const type = target[this.robots.length];
      this.robots.push(this.spawnRobot(type));
    }
    // Met a jour les types existants si reorder
    for (let i = 0; i < this.robots.length; i++) {
      if (this.robots[i].type !== target[i]) {
        this.robots[i].type = target[i];
        this.repaintRobot(this.robots[i]);
      }
    }
  }

  private spawnRobot(type: RobotType): RobotEntity {
    const graphic = new Graphics();
    this.repaintRobotGraphic(graphic, type);
    const x = Math.random() * (PLOT_SIZE - 24);
    const y = Math.random() * (PLOT_SIZE - 24);
    const angle = Math.random() * Math.PI * 2;
    const speed = 20 + Math.random() * 20;
    const entity: RobotEntity = {
      type,
      graphic,
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      mowingPhase: 0,
    };
    graphic.x = x;
    graphic.y = y;
    this.robotLayer.addChild(graphic);
    return entity;
  }

  private repaintRobot(entity: RobotEntity): void {
    this.repaintRobotGraphic(entity.graphic, entity.type);
  }

  private repaintRobotGraphic(g: Graphics, type: RobotType): void {
    g.clear();
    const tierIndex = ROBOT_TYPE_INDEX[type] ?? 0;
    const bodyColors = [
      PALETTE.robot.silver,
      PALETTE.robot.medium,
      PALETTE.robot.shadow,
      PALETTE.accent.yellow,
      PALETTE.accent.red,
      PALETTE.accent.blue,
      PALETTE.accent.yellow,
      PALETTE.robot.deep,
      PALETTE.accent.blue,
      PALETTE.robot.highlight,
    ];
    const body = bodyColors[Math.min(tierIndex, bodyColors.length - 1)];

    g.rect(4, 4, 16, 16).fill(body);
    g.rect(5, 5, 14, 1).fill(PALETTE.robot.highlight);
    g.rect(4, 18, 16, 2).fill(PALETTE.robot.deep);
    g.rect(2, 8, 2, 8).fill(PALETTE.robot.deep);
    g.rect(20, 8, 2, 8).fill(PALETTE.robot.deep);
    const ledColor = tierIndex >= 4 ? PALETTE.accent.ledGreen : PALETTE.accent.yellow;
    g.rect(11, 6, 2, 2).fill(ledColor);
  }

  private update(): void {
    const dtSec = this.app.ticker.deltaMS / 1000;
    this.elapsed += dtSec;
    this.grassTimer += dtSec;

    // Repousse de l'herbe : avance d'un stage toutes les 8 secondes pour
    // toutes les tiles (visuel uniquement, n'affecte pas la prod).
    if (this.grassTimer >= 4) {
      this.grassTimer = 0;
      this.regrowGrass();
    }

    // Deplacement et bounce des robots
    for (const r of this.robots) {
      r.x += r.vx * dtSec;
      r.y += r.vy * dtSec;
      if (r.x < 0) {
        r.x = 0;
        r.vx = Math.abs(r.vx);
      }
      if (r.y < 0) {
        r.y = 0;
        r.vy = Math.abs(r.vy);
      }
      if (r.x > PLOT_SIZE - 24) {
        r.x = PLOT_SIZE - 24;
        r.vx = -Math.abs(r.vx);
      }
      if (r.y > PLOT_SIZE - 24) {
        r.y = PLOT_SIZE - 24;
        r.vy = -Math.abs(r.vy);
      }
      r.graphic.x = Math.floor(r.x);
      r.graphic.y = Math.floor(r.y);
      r.mowingPhase += dtSec;

      // Quand le robot passe sur une tile, on la coupe (stage--)
      const col = Math.floor((r.x + 12) / PLOT_TILE);
      const row = Math.floor((r.y + 12) / PLOT_TILE);
      if (
        row >= 0 &&
        row < PLOT_TILES_PER_ROW &&
        col >= 0 &&
        col < PLOT_TILES_PER_ROW &&
        this.grassStages[row][col] > 0
      ) {
        this.grassStages[row][col] = 0;
        this.drawTile(this.grassTiles[row][col], 0);
      }
    }

    // Bobbing leger sur les robots (effet idle)
    for (const r of this.robots) {
      const bob = Math.sin(this.elapsed * 4 + r.x) * 0.5;
      r.graphic.y = Math.floor(r.y + bob);
    }
  }

  private regrowGrass(): void {
    for (let row = 0; row < PLOT_TILES_PER_ROW; row++) {
      const stagesRow = this.grassStages[row];
      const tilesRow = this.grassTiles[row];
      if (!stagesRow || !tilesRow) continue;
      for (let col = 0; col < PLOT_TILES_PER_ROW; col++) {
        const stage = stagesRow[col];
        const tile = tilesRow[col];
        if (stage === undefined || tile === undefined) continue;
        if (stage < 3) {
          stagesRow[col] = stage + 1;
          this.drawTile(tile, stage + 1);
        }
      }
    }
  }
}

const ROBOT_TYPE_INDEX: Record<RobotType, number> = {
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

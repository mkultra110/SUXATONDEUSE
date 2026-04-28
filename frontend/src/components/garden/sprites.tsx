// Sprites pixel art SVG inline — chacun rendu en bloc via image-rendering: pixelated.
// Tout est code a la main avec des <rect> pour un look pixel-art authentique.
// Palette : tokens.css (cohérence garantie avec le reste de l'UI).

import type { CSSProperties } from 'react';

const PIXEL_STYLE: CSSProperties = {
  imageRendering: 'pixelated',
  shapeRendering: 'crispEdges',
};

// ===============================================================
// TILES 16x16
// ===============================================================

/** Tile herbe variante 0 (verte uniforme). */
export function GrassTile({ variant = 0 }: { variant?: 0 | 1 | 2 | 3 }) {
  const dots: Array<[number, number, string]> = [];
  // Variations procedurales par variante (deterministe, pas de re-render)
  const patterns: Array<Array<[number, number, string]>> = [
    // 0 : herbe basique
    [
      [3, 5, '#a8d672'], [10, 8, '#a8d672'], [6, 12, '#a8d672'],
      [13, 3, '#6ba53a'], [2, 11, '#6ba53a'],
    ],
    // 1 : herbe avec petite fleur
    [
      [3, 5, '#a8d672'], [10, 8, '#a8d672'], [6, 12, '#a8d672'],
      [12, 3, '#f29bb8'], [13, 3, '#f29bb8'], [12, 4, '#f29bb8'],
      [12, 5, '#f5c443'],
    ],
    // 2 : herbe haute
    [
      [3, 4, '#4a8a2e'], [3, 5, '#a8d672'], [10, 7, '#4a8a2e'], [10, 8, '#a8d672'],
      [6, 11, '#4a8a2e'], [6, 12, '#a8d672'], [13, 2, '#4a8a2e'],
    ],
    // 3 : herbe + caillou
    [
      [3, 5, '#a8d672'], [10, 8, '#a8d672'],
      [11, 11, '#8595a8'], [12, 11, '#b8c4d0'], [11, 12, '#8595a8'], [12, 12, '#556678'],
    ],
  ];
  dots.push(...patterns[variant]);
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" style={PIXEL_STYLE}>
      <rect width="16" height="16" fill="#8fbf4f" />
      <rect x="0" y="0" width="16" height="1" fill="#a8d672" opacity="0.4" />
      <rect x="0" y="15" width="16" height="1" fill="#4a8a2e" opacity="0.5" />
      {dots.map(([x, y, c], i) => (
        <rect key={i} x={x} y={y} width="1" height="1" fill={c} />
      ))}
    </svg>
  );
}

/** Tile terre tondue (apres passage du robot). */
export function DirtTile() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" style={PIXEL_STYLE}>
      <rect width="16" height="16" fill="#a37c4f" />
      <rect x="3" y="2" width="1" height="1" fill="#7a5631" />
      <rect x="9" y="5" width="1" height="1" fill="#7a5631" />
      <rect x="5" y="8" width="1" height="1" fill="#c9a576" />
      <rect x="12" y="11" width="1" height="1" fill="#7a5631" />
      <rect x="2" y="13" width="1" height="1" fill="#c9a576" />
    </svg>
  );
}

/** Tile chemin de pierre (dalles). */
export function StoneTile() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" style={PIXEL_STYLE}>
      <rect width="16" height="16" fill="#8595a8" />
      <rect x="0" y="0" width="16" height="1" fill="#b8c4d0" />
      <rect x="0" y="0" width="1" height="16" fill="#b8c4d0" />
      <rect x="0" y="15" width="16" height="1" fill="#556678" />
      <rect x="15" y="0" width="1" height="16" fill="#556678" />
      <rect x="3" y="4" width="1" height="1" fill="#556678" />
      <rect x="10" y="8" width="1" height="1" fill="#556678" />
      <rect x="6" y="12" width="1" height="1" fill="#556678" />
    </svg>
  );
}

// ===============================================================
// ROBOT 24x24 (sprite anime via CSS)
// ===============================================================

export interface RobotSpriteProps {
  /** 0..9 : palette de couleurs par tier de robot. */
  tier: number;
  /** Direction visuelle (left/right pour effet miroir). */
  direction?: 'left' | 'right';
}

/** Sprite robot pixel art 24x24 — chassis metal + LED + roues + lames qui tournent dessous. */
export function RobotSprite({ tier, direction = 'right' }: RobotSpriteProps) {
  const palettes: Array<[string, string, string, string]> = [
    // [body, body-shadow, accent (LED), trim]
    ['#b8c4d0', '#8595a8', '#d54c4c', '#556678'], // tier 0 cisaille
    ['#8595a8', '#556678', '#d54c4c', '#2f3a4a'], // tier 1 push
    ['#7a5631', '#4d3520', '#feae34', '#3d2f24'], // tier 2 thermique
    ['#f5c443', '#a87a1f', '#ffffff', '#6b4d12'], // tier 3 electrique
    ['#d54c4c', '#8b1f1f', '#fff8e7', '#5c1414'], // tier 4 robomow
    ['#7ec5c5', '#4a96a8', '#fff8e7', '#2f5868'], // tier 5 navibot
    ['#f29bb8', '#c45a83', '#f5c443', '#7c2e4d'], // tier 6 helio
    ['#9b6dc4', '#5c3d7f', '#d8e89a', '#3d1f5c'], // tier 7 mega
    ['#a8d8f0', '#4a96a8', '#fff8e7', '#2f5868'], // tier 8 aero
    ['#fff8e7', '#c49b6a', '#9b6dc4', '#8b6240'], // tier 9 nano
  ];
  const [body, shadow, accent, trim] = palettes[tier % palettes.length] ?? palettes[0]!;
  const flip = direction === 'left' ? 'scale(-1, 1) translate(-24, 0)' : '';

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" style={PIXEL_STYLE}>
      <g transform={flip}>
        {/* Antenne */}
        <rect x="11" y="2" width="2" height="3" fill={trim} />
        <rect x="11" y="1" width="2" height="1" fill={accent} />

        {/* Corps superieur */}
        <rect x="4" y="5" width="16" height="3" fill={shadow} />
        <rect x="5" y="5" width="14" height="1" fill={body} />
        <rect x="5" y="6" width="14" height="2" fill={body} />
        <rect x="4" y="5" width="1" height="3" fill={trim} />
        <rect x="19" y="5" width="1" height="3" fill={trim} />

        {/* Ecran/visage */}
        <rect x="6" y="8" width="12" height="6" fill={trim} />
        <rect x="7" y="9" width="10" height="4" fill={shadow} />
        {/* Yeux LED */}
        <rect x="9" y="10" width="2" height="2" fill={accent} />
        <rect x="13" y="10" width="2" height="2" fill={accent} />
        {/* Bouche */}
        <rect x="10" y="13" width="4" height="1" fill={accent} />

        {/* Corps inferieur */}
        <rect x="4" y="14" width="16" height="6" fill={shadow} />
        <rect x="5" y="14" width="14" height="1" fill={body} />
        <rect x="5" y="15" width="14" height="5" fill={body} />
        <rect x="4" y="14" width="1" height="6" fill={trim} />
        <rect x="19" y="14" width="1" height="6" fill={trim} />

        {/* Detail panneau */}
        <rect x="9" y="16" width="6" height="1" fill={shadow} />
        <rect x="9" y="18" width="6" height="1" fill={shadow} />

        {/* Roues */}
        <rect x="3" y="19" width="3" height="3" fill="#2f3a4a" />
        <rect x="4" y="20" width="1" height="1" fill="#8595a8" />
        <rect x="18" y="19" width="3" height="3" fill="#2f3a4a" />
        <rect x="19" y="20" width="1" height="1" fill="#8595a8" />
      </g>
    </svg>
  );
}

// ===============================================================
// MAISON / GARAGE
// ===============================================================

/** Maison pixel art 48x48 style Stardew (toit rouge, bois). */
export function House() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" style={PIXEL_STYLE}>
      {/* Toit */}
      <polygon points="24,4 8,18 40,18" fill="#d54c4c" />
      <polygon points="24,4 8,18 12,18 24,8" fill="#ee7676" />
      <rect x="6" y="17" width="36" height="2" fill="#8b1f1f" />

      {/* Cheminee */}
      <rect x="32" y="8" width="4" height="8" fill="#5c3d24" />
      <rect x="31" y="7" width="6" height="2" fill="#3d2f24" />

      {/* Murs en bois */}
      <rect x="8" y="18" width="32" height="26" fill="#c49b6a" />
      <rect x="8" y="18" width="32" height="2" fill="#8b6240" />
      {[20, 24, 28, 32, 36, 40].map((y) => (
        <rect key={y} x="8" y={y} width="32" height="1" fill="#8b6240" opacity="0.5" />
      ))}
      <rect x="8" y="18" width="2" height="26" fill="#8b6240" />
      <rect x="38" y="18" width="2" height="26" fill="#8b6240" />

      {/* Porte */}
      <rect x="20" y="30" width="8" height="14" fill="#5c3d24" />
      <rect x="20" y="30" width="8" height="1" fill="#3d2f24" />
      <rect x="20" y="30" width="1" height="14" fill="#3d2f24" />
      <rect x="27" y="30" width="1" height="14" fill="#3d2f24" />
      <rect x="26" y="36" width="1" height="2" fill="#f5c443" />

      {/* Fenetres */}
      <rect x="11" y="22" width="6" height="6" fill="#7ec5c5" />
      <rect x="11" y="22" width="6" height="1" fill="#4a96a8" />
      <rect x="13" y="22" width="1" height="6" fill="#4a96a8" />
      <rect x="11" y="25" width="6" height="1" fill="#4a96a8" />

      <rect x="31" y="22" width="6" height="6" fill="#7ec5c5" />
      <rect x="31" y="22" width="6" height="1" fill="#4a96a8" />
      <rect x="33" y="22" width="1" height="6" fill="#4a96a8" />
      <rect x="31" y="25" width="6" height="1" fill="#4a96a8" />

      {/* Sol devant */}
      <rect x="6" y="44" width="36" height="2" fill="#7a5631" />
    </svg>
  );
}

// ===============================================================
// ARBRE (sway via CSS)
// ===============================================================

export function Tree({ variant = 0 }: { variant?: 0 | 1 }) {
  const foliage = variant === 0 ? '#4a8a2e' : '#6ba53a';
  const foliageDark = variant === 0 ? '#2f6b22' : '#4a8a2e';
  return (
    <svg width="32" height="48" viewBox="0 0 32 48" style={PIXEL_STYLE}>
      {/* Tronc */}
      <rect x="13" y="32" width="6" height="14" fill="#5c3d24" />
      <rect x="13" y="32" width="2" height="14" fill="#7a5631" />
      <rect x="17" y="32" width="2" height="14" fill="#3d2f24" />
      <rect x="13" y="44" width="6" height="2" fill="#3d2f24" />

      {/* Feuillage 3 couches */}
      <circle cx="16" cy="20" r="14" fill={foliageDark} />
      <circle cx="16" cy="18" r="11" fill={foliage} />
      <circle cx="14" cy="14" r="6" fill="#a8d672" opacity="0.8" />

      {/* Detail feuilles */}
      <rect x="8" y="10" width="2" height="2" fill={foliage} />
      <rect x="22" y="13" width="2" height="2" fill={foliage} />
      <rect x="6" y="22" width="2" height="2" fill={foliageDark} />
      <rect x="24" y="24" width="2" height="2" fill={foliageDark} />
    </svg>
  );
}

// ===============================================================
// CLOTURE EN BOIS
// ===============================================================

/** Section de cloture horizontale 16x16 (a aligner cote a cote). */
export function FenceHorizontal() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" style={PIXEL_STYLE}>
      <rect x="0" y="6" width="16" height="2" fill="#8b6240" />
      <rect x="0" y="10" width="16" height="2" fill="#8b6240" />
      <rect x="2" y="2" width="3" height="12" fill="#c49b6a" />
      <rect x="2" y="2" width="3" height="1" fill="#8b6240" />
      <rect x="11" y="2" width="3" height="12" fill="#c49b6a" />
      <rect x="11" y="2" width="3" height="1" fill="#8b6240" />
    </svg>
  );
}

// ===============================================================
// PUITS
// ===============================================================

export function Well() {
  return (
    <svg width="32" height="40" viewBox="0 0 32 40" style={PIXEL_STYLE}>
      {/* Toit du puits */}
      <polygon points="16,2 4,12 28,12" fill="#5c3d24" />
      <polygon points="16,2 4,12 8,12 16,5" fill="#8b6240" />
      <rect x="3" y="11" width="26" height="2" fill="#3d2f24" />

      {/* Poteaux */}
      <rect x="6" y="12" width="3" height="14" fill="#8b6240" />
      <rect x="23" y="12" width="3" height="14" fill="#8b6240" />

      {/* Margelle pierre */}
      <rect x="4" y="22" width="24" height="14" fill="#8595a8" />
      <rect x="4" y="22" width="24" height="2" fill="#b8c4d0" />
      <rect x="4" y="34" width="24" height="2" fill="#556678" />
      {/* Detail pierres */}
      <rect x="8" y="24" width="3" height="3" fill="#7e8d9e" />
      <rect x="14" y="27" width="3" height="3" fill="#7e8d9e" />
      <rect x="20" y="24" width="3" height="3" fill="#7e8d9e" />
      <rect x="11" y="30" width="3" height="3" fill="#7e8d9e" />
      <rect x="17" y="30" width="3" height="3" fill="#7e8d9e" />

      {/* Eau */}
      <rect x="10" y="26" width="12" height="6" fill="#4a96a8" />
      <rect x="11" y="27" width="10" height="2" fill="#7ec5c5" />
      <rect x="12" y="28" width="2" height="1" fill="#c8ecec" />
      <rect x="18" y="29" width="2" height="1" fill="#c8ecec" />
    </svg>
  );
}

// ===============================================================
// FLEURS
// ===============================================================

export function Flower({ color = 'pink' }: { color?: 'pink' | 'yellow' | 'red' | 'purple' }) {
  const palette: Record<string, [string, string]> = {
    pink: ['#f29bb8', '#c45a83'],
    yellow: ['#f5c443', '#a87a1f'],
    red: ['#d54c4c', '#8b1f1f'],
    purple: ['#9b6dc4', '#5c3d7f'],
  };
  const [light, dark] = palette[color] ?? palette.pink!;
  return (
    <svg width="8" height="12" viewBox="0 0 8 12" style={PIXEL_STYLE}>
      {/* Tige */}
      <rect x="3" y="6" width="2" height="6" fill="#4a8a2e" />
      <rect x="1" y="8" width="2" height="2" fill="#6ba53a" />
      <rect x="5" y="9" width="2" height="2" fill="#6ba53a" />
      {/* Petales */}
      <rect x="2" y="2" width="4" height="4" fill={light} />
      <rect x="3" y="1" width="2" height="1" fill={light} />
      <rect x="3" y="6" width="2" height="1" fill={light} />
      <rect x="1" y="3" width="1" height="2" fill={light} />
      <rect x="6" y="3" width="1" height="2" fill={light} />
      {/* Coeur */}
      <rect x="3" y="3" width="2" height="2" fill={dark} />
      <rect x="3" y="3" width="1" height="1" fill="#fff8e7" opacity="0.6" />
    </svg>
  );
}

// ===============================================================
// LEGUMES (cultures)
// ===============================================================

export function Crop({ kind = 'carrot' }: { kind?: 'carrot' | 'tomato' | 'pumpkin' | 'corn' }) {
  if (kind === 'carrot') {
    return (
      <svg width="12" height="14" viewBox="0 0 12 14" style={PIXEL_STYLE}>
        {/* Feuilles */}
        <rect x="3" y="0" width="2" height="3" fill="#4a8a2e" />
        <rect x="6" y="1" width="2" height="2" fill="#4a8a2e" />
        <rect x="2" y="2" width="2" height="2" fill="#6ba53a" />
        <rect x="7" y="2" width="2" height="2" fill="#6ba53a" />
        <rect x="4" y="2" width="3" height="2" fill="#6ba53a" />
        {/* Carotte */}
        <rect x="4" y="4" width="4" height="6" fill="#feae34" />
        <rect x="5" y="4" width="2" height="6" fill="#f5c443" />
        <rect x="4" y="10" width="4" height="2" fill="#a87a1f" />
        <rect x="5" y="12" width="2" height="2" fill="#7a5631" />
      </svg>
    );
  }
  if (kind === 'tomato') {
    return (
      <svg width="12" height="14" viewBox="0 0 12 14" style={PIXEL_STYLE}>
        <rect x="4" y="0" width="4" height="2" fill="#4a8a2e" />
        <rect x="3" y="2" width="6" height="1" fill="#4a8a2e" />
        <rect x="3" y="3" width="6" height="6" fill="#d54c4c" />
        <rect x="2" y="4" width="1" height="4" fill="#d54c4c" />
        <rect x="9" y="4" width="1" height="4" fill="#d54c4c" />
        <rect x="4" y="9" width="4" height="1" fill="#8b1f1f" />
        <rect x="4" y="4" width="2" height="2" fill="#ee7676" />
        <rect x="3" y="10" width="6" height="3" fill="#6ba53a" />
        <rect x="5" y="13" width="2" height="1" fill="#4a8a2e" />
      </svg>
    );
  }
  if (kind === 'pumpkin') {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" style={PIXEL_STYLE}>
        <rect x="6" y="0" width="2" height="2" fill="#4a8a2e" />
        <rect x="2" y="3" width="10" height="9" fill="#feae34" />
        <rect x="3" y="2" width="3" height="1" fill="#feae34" />
        <rect x="8" y="2" width="3" height="1" fill="#feae34" />
        <rect x="3" y="4" width="2" height="7" fill="#f5c443" />
        <rect x="7" y="4" width="2" height="7" fill="#f5c443" />
        <rect x="2" y="11" width="10" height="1" fill="#a87a1f" />
        <rect x="0" y="12" width="14" height="1" fill="#a87a1f" />
      </svg>
    );
  }
  // corn
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" style={PIXEL_STYLE}>
      <rect x="3" y="0" width="4" height="3" fill="#4a8a2e" />
      <rect x="2" y="1" width="2" height="4" fill="#4a8a2e" />
      <rect x="6" y="1" width="2" height="4" fill="#4a8a2e" />
      <rect x="3" y="3" width="4" height="10" fill="#f5c443" />
      <rect x="3" y="4" width="1" height="1" fill="#feae34" />
      <rect x="5" y="6" width="1" height="1" fill="#feae34" />
      <rect x="4" y="8" width="1" height="1" fill="#feae34" />
      <rect x="6" y="10" width="1" height="1" fill="#feae34" />
      <rect x="3" y="13" width="4" height="3" fill="#4a8a2e" />
    </svg>
  );
}

// ===============================================================
// POULE (sprite anime simple)
// ===============================================================

export function Chicken() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" style={PIXEL_STYLE}>
      {/* Corps */}
      <rect x="3" y="6" width="8" height="6" fill="#fff8e7" />
      <rect x="3" y="6" width="8" height="1" fill="#e3c896" />
      {/* Tete */}
      <rect x="8" y="3" width="4" height="4" fill="#fff8e7" />
      {/* Bec */}
      <rect x="12" y="5" width="2" height="1" fill="#feae34" />
      {/* Oeil */}
      <rect x="10" y="4" width="1" height="1" fill="#3d2f24" />
      {/* Crete */}
      <rect x="9" y="2" width="1" height="1" fill="#d54c4c" />
      <rect x="10" y="1" width="1" height="1" fill="#d54c4c" />
      <rect x="11" y="2" width="1" height="1" fill="#d54c4c" />
      {/* Pattes */}
      <rect x="4" y="12" width="1" height="2" fill="#feae34" />
      <rect x="9" y="12" width="1" height="2" fill="#feae34" />
      {/* Aile */}
      <rect x="4" y="8" width="4" height="2" fill="#e3c896" />
    </svg>
  );
}

// ===============================================================
// PAPILLON (anime via CSS)
// ===============================================================

export function Butterfly({ color = 'pink' }: { color?: 'pink' | 'blue' | 'yellow' }) {
  const palette: Record<string, string> = {
    pink: '#f29bb8', blue: '#7ec5c5', yellow: '#f5c443',
  };
  const c = palette[color] ?? palette.pink!;
  return (
    <svg width="10" height="8" viewBox="0 0 10 8" style={PIXEL_STYLE}>
      <rect x="4" y="2" width="2" height="4" fill="#3d2f24" />
      <rect x="0" y="1" width="4" height="3" fill={c} />
      <rect x="0" y="4" width="3" height="2" fill={c} />
      <rect x="6" y="1" width="4" height="3" fill={c} />
      <rect x="7" y="4" width="3" height="2" fill={c} />
      <rect x="1" y="2" width="1" height="1" fill="#fff8e7" opacity="0.6" />
      <rect x="8" y="2" width="1" height="1" fill="#fff8e7" opacity="0.6" />
    </svg>
  );
}

// ===============================================================
// SOLEIL
// ===============================================================

export function Sun() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" style={PIXEL_STYLE}>
      {/* Rayons */}
      <rect x="14" y="0" width="4" height="3" fill="#f5c443" />
      <rect x="14" y="29" width="4" height="3" fill="#f5c443" />
      <rect x="0" y="14" width="3" height="4" fill="#f5c443" />
      <rect x="29" y="14" width="3" height="4" fill="#f5c443" />
      {/* Disque */}
      <circle cx="16" cy="16" r="11" fill="#f5c443" />
      <circle cx="16" cy="16" r="9" fill="#fde08a" />
      <circle cx="13" cy="13" r="2" fill="#fff8e7" opacity="0.7" />
    </svg>
  );
}

// ===============================================================
// NUAGE
// ===============================================================

export function Cloud({ size = 1 }: { size?: 1 | 2 | 3 }) {
  const w = size === 1 ? 32 : size === 2 ? 24 : 18;
  const h = size === 1 ? 14 : size === 2 ? 11 : 8;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={PIXEL_STYLE}>
      <rect x={2} y={Math.floor(h * 0.3)} width={w - 4} height={Math.floor(h * 0.5)} fill="#fff8e7" />
      <rect x={Math.floor(w * 0.2)} y={2} width={Math.floor(w * 0.5)} height={Math.floor(h * 0.6)} fill="#fff8e7" />
      <rect x={0} y={Math.floor(h * 0.4)} width={2} height={Math.floor(h * 0.4)} fill="#fff8e7" opacity="0.8" />
      <rect x={w - 2} y={Math.floor(h * 0.4)} width={2} height={Math.floor(h * 0.4)} fill="#fff8e7" opacity="0.8" />
    </svg>
  );
}

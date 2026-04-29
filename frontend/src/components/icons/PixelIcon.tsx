// PixelIcon : composant React qui expose tous les pictogrammes SVG pixel art
// originaux du bundle Claude Design (shared.js). Aucun emoji dans le projet.
// Tous les sprites sont en pixel art crispEdges, palette tokens.css.

import type { CSSProperties } from 'react';

interface IconProps {
  size?: number;
  className?: string;
  style?: CSSProperties;
  title?: string;
}

function pixelStyle(size: number, style?: CSSProperties): CSSProperties {
  return {
    width: size,
    height: size,
    imageRendering: 'pixelated',
    display: 'inline-block',
    flexShrink: 0,
    ...style,
  };
}

// Currencies =========================================================
export function CoinIcon({ size = 16, className, style, title }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} style={pixelStyle(size, style)} role={title ? 'img' : undefined} aria-label={title}>
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
      <rect x="3" y="10" width="10" height="2" fill="#c49b6a" />
      <rect x="6" y="6" width="4" height="4" fill="#c49b6a" />
      <rect x="7" y="7" width="2" height="2" fill="#f5e6c8" />
    </svg>
  );
}

export function FuelIcon({ size = 16, className, style, title }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} style={pixelStyle(size, style)} role={title ? 'img' : undefined} aria-label={title}>
      <rect x="3" y="3" width="8" height="1" fill="#5c3d24" />
      <rect x="2" y="4" width="1" height="9" fill="#5c3d24" />
      <rect x="11" y="4" width="1" height="9" fill="#5c3d24" />
      <rect x="3" y="13" width="8" height="1" fill="#5c3d24" />
      <rect x="3" y="4" width="8" height="9" fill="#6dbf5c" />
      <rect x="3" y="4" width="8" height="2" fill="#8fbf4f" />
      <rect x="11" y="6" width="3" height="1" fill="#5c3d24" />
      <rect x="13" y="7" width="1" height="3" fill="#5c3d24" />
      <rect x="4" y="7" width="2" height="4" fill="#fff8e7" />
    </svg>
  );
}

export function SeedIcon({ size = 16, className, style, title }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} style={pixelStyle(size, style)} role={title ? 'img' : undefined} aria-label={title}>
      <rect x="6" y="2" width="4" height="1" fill="#5c3d24" />
      <rect x="5" y="3" width="6" height="1" fill="#5c3d24" />
      <rect x="4" y="4" width="8" height="1" fill="#5c3d24" />
      <rect x="4" y="9" width="8" height="1" fill="#5c3d24" />
      <rect x="3" y="5" width="1" height="4" fill="#5c3d24" />
      <rect x="12" y="5" width="1" height="4" fill="#5c3d24" />
      <rect x="4" y="5" width="8" height="4" fill="#9b6dc4" />
      <rect x="4" y="5" width="8" height="1" fill="#c49bdc" />
      <rect x="6" y="6" width="2" height="1" fill="#fff8e7" />
      <rect x="7" y="10" width="2" height="3" fill="#6ba53a" />
      <rect x="6" y="11" width="1" height="2" fill="#8fbf4f" />
      <rect x="9" y="11" width="1" height="2" fill="#8fbf4f" />
    </svg>
  );
}

// Navigation icons (24x24) ===========================================
export function NavLawnIcon({ size = 24, className, style, title }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" shapeRendering="crispEdges" className={className} style={pixelStyle(size, style)} role={title ? 'img' : undefined} aria-label={title}>
      <rect x="0" y="14" width="24" height="2" fill="#4a8a2e" />
      <rect x="0" y="16" width="24" height="6" fill="#6ba53a" />
      <rect x="2" y="10" width="2" height="6" fill="#6ba53a" />
      <rect x="2" y="9" width="2" height="1" fill="#8fbf4f" />
      <rect x="6" y="8" width="2" height="8" fill="#6ba53a" />
      <rect x="6" y="7" width="2" height="1" fill="#8fbf4f" />
      <rect x="10" y="11" width="2" height="5" fill="#6ba53a" />
      <rect x="14" y="9" width="2" height="7" fill="#6ba53a" />
      <rect x="14" y="8" width="2" height="1" fill="#8fbf4f" />
      <rect x="18" y="10" width="2" height="6" fill="#6ba53a" />
      <rect x="18" y="9" width="2" height="1" fill="#b8d672" />
      <rect x="11" y="3" width="6" height="3" fill="#f5c443" />
      <rect x="12" y="6" width="4" height="1" fill="#c49b6a" />
    </svg>
  );
}

export function NavShopIcon({ size = 24, className, style, title }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" shapeRendering="crispEdges" className={className} style={pixelStyle(size, style)} role={title ? 'img' : undefined} aria-label={title}>
      <rect x="3" y="4" width="18" height="3" fill="#c49b6a" />
      <rect x="3" y="4" width="18" height="1" fill="#f5e6c8" />
      <rect x="2" y="7" width="20" height="2" fill="#5c3d24" />
      <rect x="4" y="9" width="16" height="11" fill="#e3c896" />
      <rect x="4" y="9" width="16" height="1" fill="#f5e6c8" />
      <rect x="6" y="11" width="4" height="6" fill="#d54c4c" />
      <rect x="14" y="11" width="4" height="6" fill="#6ba53a" />
      <rect x="3" y="20" width="18" height="2" fill="#5c3d24" />
      <rect x="9" y="2" width="2" height="3" fill="#5c3d24" />
      <rect x="13" y="2" width="2" height="3" fill="#5c3d24" />
    </svg>
  );
}

export function NavMapIcon({ size = 24, className, style, title }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" shapeRendering="crispEdges" className={className} style={pixelStyle(size, style)} role={title ? 'img' : undefined} aria-label={title}>
      <rect x="3" y="4" width="6" height="16" fill="#c9a576" />
      <rect x="9" y="3" width="6" height="17" fill="#e8d2a8" />
      <rect x="15" y="4" width="6" height="16" fill="#a37c4f" />
      <rect x="3" y="4" width="6" height="1" fill="#e8d2a8" />
      <rect x="9" y="3" width="6" height="1" fill="#fff8e7" />
      <rect x="15" y="4" width="6" height="1" fill="#c9a576" />
      <rect x="3" y="19" width="18" height="1" fill="#5c3d24" />
      <rect x="11" y="9" width="2" height="2" fill="#d54c4c" />
      <rect x="11" y="11" width="2" height="3" fill="#5c3d24" />
    </svg>
  );
}

export function NavQuestIcon({ size = 24, className, style, title }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" shapeRendering="crispEdges" className={className} style={pixelStyle(size, style)} role={title ? 'img' : undefined} aria-label={title}>
      <rect x="5" y="3" width="14" height="18" fill="#fff8e7" />
      <rect x="5" y="3" width="14" height="1" fill="#e8d4a3" />
      <rect x="4" y="3" width="1" height="18" fill="#5c3d24" />
      <rect x="19" y="3" width="1" height="18" fill="#5c3d24" />
      <rect x="5" y="2" width="14" height="1" fill="#5c3d24" />
      <rect x="5" y="21" width="14" height="1" fill="#5c3d24" />
      <rect x="7" y="6" width="10" height="1" fill="#3d2f24" />
      <rect x="7" y="9" width="10" height="1" fill="#3d2f24" />
      <rect x="7" y="12" width="7" height="1" fill="#3d2f24" />
      <rect x="7" y="15" width="9" height="1" fill="#3d2f24" />
      <rect x="7" y="18" width="6" height="1" fill="#3d2f24" />
      <rect x="2" y="6" width="3" height="3" fill="#d54c4c" />
    </svg>
  );
}

export function NavCollectionIcon({ size = 24, className, style, title }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" shapeRendering="crispEdges" className={className} style={pixelStyle(size, style)} role={title ? 'img' : undefined} aria-label={title}>
      <rect x="3" y="6" width="6" height="4" fill="#5c3d24" />
      <rect x="4" y="7" width="4" height="2" fill="#c49b6a" />
      <rect x="15" y="6" width="6" height="4" fill="#5c3d24" />
      <rect x="16" y="7" width="4" height="2" fill="#c49b6a" />
      <rect x="9" y="3" width="6" height="4" fill="#5c3d24" />
      <rect x="10" y="4" width="4" height="2" fill="#c49b6a" />
      <rect x="9" y="14" width="6" height="4" fill="#5c3d24" />
      <rect x="10" y="15" width="4" height="2" fill="#c49b6a" />
      <rect x="3" y="14" width="6" height="4" fill="#5c3d24" />
      <rect x="15" y="14" width="6" height="4" fill="#5c3d24" />
      <rect x="4" y="15" width="4" height="2" fill="#c49b6a" />
      <rect x="16" y="15" width="4" height="2" fill="#c49b6a" />
    </svg>
  );
}

export function NavMoreIcon({ size = 24, className, style, title }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" shapeRendering="crispEdges" className={className} style={pixelStyle(size, style)} role={title ? 'img' : undefined} aria-label={title}>
      <rect x="4" y="10" width="4" height="4" fill="#5c3d24" />
      <rect x="10" y="10" width="4" height="4" fill="#5c3d24" />
      <rect x="16" y="10" width="4" height="4" fill="#5c3d24" />
      <rect x="5" y="11" width="2" height="2" fill="#c49b6a" />
      <rect x="11" y="11" width="2" height="2" fill="#c49b6a" />
      <rect x="17" y="11" width="2" height="2" fill="#c49b6a" />
    </svg>
  );
}

// Decor / utility ===================================================
export function TrophyIcon({ size = 16, className, style, title }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} style={pixelStyle(size, style)} role={title ? 'img' : undefined} aria-label={title}>
      <rect x="3" y="2" width="10" height="6" fill="#f5c443" />
      <rect x="3" y="2" width="10" height="2" fill="#fff8e7" />
      <rect x="2" y="3" width="1" height="3" fill="#c49b6a" />
      <rect x="13" y="3" width="1" height="3" fill="#c49b6a" />
      <rect x="6" y="8" width="4" height="2" fill="#c49b6a" />
      <rect x="4" y="10" width="8" height="2" fill="#8b6240" />
      <rect x="3" y="12" width="10" height="2" fill="#5c3d24" />
    </svg>
  );
}

export function StarIcon({ size = 16, className, style, title }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} style={pixelStyle(size, style)} role={title ? 'img' : undefined} aria-label={title}>
      <rect x="7" y="2" width="2" height="2" fill="#f5c443" />
      <rect x="6" y="4" width="4" height="2" fill="#f5c443" />
      <rect x="2" y="6" width="12" height="2" fill="#f5c443" />
      <rect x="3" y="8" width="10" height="2" fill="#f5c443" />
      <rect x="4" y="10" width="3" height="2" fill="#f5c443" />
      <rect x="9" y="10" width="3" height="2" fill="#f5c443" />
      <rect x="2" y="12" width="3" height="2" fill="#f5c443" />
      <rect x="11" y="12" width="3" height="2" fill="#f5c443" />
    </svg>
  );
}

export function HeartIcon({ size = 16, className, style, title }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} style={pixelStyle(size, style)} role={title ? 'img' : undefined} aria-label={title}>
      <rect x="3" y="3" width="3" height="2" fill="#d54c4c" />
      <rect x="10" y="3" width="3" height="2" fill="#d54c4c" />
      <rect x="2" y="4" width="5" height="3" fill="#d54c4c" />
      <rect x="9" y="4" width="5" height="3" fill="#d54c4c" />
      <rect x="2" y="6" width="12" height="3" fill="#d54c4c" />
      <rect x="3" y="9" width="10" height="2" fill="#d54c4c" />
      <rect x="4" y="11" width="8" height="1" fill="#d54c4c" />
      <rect x="5" y="12" width="6" height="1" fill="#d54c4c" />
      <rect x="6" y="13" width="4" height="1" fill="#d54c4c" />
      <rect x="3" y="4" width="2" height="2" fill="#f29bb8" />
      <rect x="4" y="3" width="1" height="1" fill="#f29bb8" />
    </svg>
  );
}

export function LadybugIcon({ size = 16, className, style, title }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} style={pixelStyle(size, style)} role={title ? 'img' : undefined} aria-label={title}>
      <rect x="5" y="6" width="6" height="6" fill="#d54c4c" />
      <rect x="4" y="7" width="8" height="4" fill="#d54c4c" />
      <rect x="7" y="6" width="2" height="6" fill="#2a1f17" />
      <rect x="6" y="8" width="1" height="1" fill="#2a1f17" />
      <rect x="9" y="8" width="1" height="1" fill="#2a1f17" />
      <rect x="6" y="10" width="1" height="1" fill="#2a1f17" />
      <rect x="9" y="10" width="1" height="1" fill="#2a1f17" />
      <rect x="6" y="5" width="4" height="1" fill="#2a1f17" />
      <rect x="3" y="9" width="1" height="1" fill="#2a1f17" />
      <rect x="12" y="9" width="1" height="1" fill="#2a1f17" />
    </svg>
  );
}

// Upgrade category icons (16x16) =====================================
export function IconBlade({ size = 16, className, style, title }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} style={pixelStyle(size, style)} role={title ? 'img' : undefined} aria-label={title}>
      <rect x="7" y="2" width="2" height="11" fill="#5c3d24" />
      <rect x="6" y="3" width="4" height="9" fill="#e8eef2" />
      <rect x="6" y="3" width="4" height="2" fill="#fff8e7" />
      <rect x="5" y="4" width="1" height="6" fill="#8595a8" />
      <rect x="10" y="4" width="1" height="6" fill="#8595a8" />
      <rect x="5" y="13" width="6" height="2" fill="#5c3d24" />
      <rect x="6" y="14" width="4" height="1" fill="#c49b6a" />
    </svg>
  );
}

export function IconGear({ size = 16, className, style, title }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} style={pixelStyle(size, style)} role={title ? 'img' : undefined} aria-label={title}>
      <rect x="7" y="1" width="2" height="2" fill="#5c3d24" />
      <rect x="7" y="13" width="2" height="2" fill="#5c3d24" />
      <rect x="1" y="7" width="2" height="2" fill="#5c3d24" />
      <rect x="13" y="7" width="2" height="2" fill="#5c3d24" />
      <rect x="3" y="3" width="2" height="2" fill="#5c3d24" />
      <rect x="11" y="3" width="2" height="2" fill="#5c3d24" />
      <rect x="3" y="11" width="2" height="2" fill="#5c3d24" />
      <rect x="11" y="11" width="2" height="2" fill="#5c3d24" />
      <rect x="4" y="4" width="8" height="8" fill="#8595a8" />
      <rect x="4" y="4" width="8" height="2" fill="#b8c4d0" />
      <rect x="6" y="6" width="4" height="4" fill="#5c3d24" />
      <rect x="7" y="7" width="2" height="2" fill="#fff8e7" />
    </svg>
  );
}

export function IconBattery({ size = 16, className, style, title }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} style={pixelStyle(size, style)} role={title ? 'img' : undefined} aria-label={title}>
      <rect x="2" y="4" width="11" height="8" fill="#5c3d24" />
      <rect x="3" y="5" width="9" height="6" fill="#e8eef2" />
      <rect x="13" y="6" width="2" height="4" fill="#5c3d24" />
      <rect x="4" y="6" width="3" height="4" fill="#6dbf5c" />
      <rect x="8" y="6" width="3" height="4" fill="#6dbf5c" />
      <rect x="4" y="6" width="3" height="1" fill="#8fbf4f" />
      <rect x="8" y="6" width="3" height="1" fill="#8fbf4f" />
    </svg>
  );
}

export function IconSolar({ size = 16, className, style, title }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} style={pixelStyle(size, style)} role={title ? 'img' : undefined} aria-label={title}>
      <rect x="2" y="3" width="12" height="9" fill="#5c3d24" />
      <rect x="3" y="4" width="5" height="3" fill="#2f3a4a" />
      <rect x="8" y="4" width="5" height="3" fill="#2f3a4a" />
      <rect x="3" y="8" width="5" height="3" fill="#2f3a4a" />
      <rect x="8" y="8" width="5" height="3" fill="#2f3a4a" />
      <rect x="3" y="4" width="5" height="1" fill="#4a96a8" />
      <rect x="8" y="4" width="5" height="1" fill="#4a96a8" />
      <rect x="3" y="8" width="5" height="1" fill="#4a96a8" />
      <rect x="8" y="8" width="5" height="1" fill="#4a96a8" />
      <rect x="6" y="12" width="4" height="2" fill="#5c3d24" />
    </svg>
  );
}

export function IconBrain({ size = 16, className, style, title }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} style={pixelStyle(size, style)} role={title ? 'img' : undefined} aria-label={title}>
      <rect x="4" y="2" width="8" height="2" fill="#5c3d24" />
      <rect x="3" y="3" width="10" height="9" fill="#5c3d24" />
      <rect x="4" y="4" width="8" height="7" fill="#f29bb8" />
      <rect x="4" y="4" width="8" height="1" fill="#fff8e7" />
      <rect x="6" y="6" width="1" height="1" fill="#d54c4c" />
      <rect x="9" y="6" width="1" height="1" fill="#d54c4c" />
      <rect x="5" y="8" width="6" height="1" fill="#d54c4c" />
      <rect x="5" y="12" width="2" height="2" fill="#5c3d24" />
      <rect x="9" y="12" width="2" height="2" fill="#5c3d24" />
    </svg>
  );
}

export function IconWeather({ size = 16, className, style, title }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} style={pixelStyle(size, style)} role={title ? 'img' : undefined} aria-label={title}>
      <rect x="3" y="6" width="10" height="5" fill="#fff8e7" />
      <rect x="4" y="4" width="6" height="2" fill="#fff8e7" />
      <rect x="9" y="5" width="4" height="1" fill="#fff8e7" />
      <rect x="3" y="11" width="10" height="1" fill="#c9b07a" />
      <rect x="4" y="13" width="1" height="2" fill="#7ec5c5" />
      <rect x="7" y="13" width="1" height="2" fill="#7ec5c5" />
      <rect x="10" y="13" width="1" height="2" fill="#7ec5c5" />
    </svg>
  );
}

// Mini robot logo for the title bar (24×24, generic mower silhouette).
export function RobotLogo({ size = 24, className, style, title }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" shapeRendering="crispEdges" className={className} style={pixelStyle(size, style)} role={title ? 'img' : undefined} aria-label={title}>
      <rect x="6" y="10" width="20" height="12" fill="#5c3d24" />
      <rect x="7" y="11" width="18" height="10" fill="#8fbf4f" />
      <rect x="7" y="11" width="18" height="2" fill="#b8d672" />
      <rect x="9" y="14" width="4" height="3" fill="#f5c443" />
      <rect x="19" y="14" width="4" height="3" fill="#f5c443" />
      <rect x="14" y="13" width="4" height="2" fill="#5c3d24" />
      <rect x="4" y="22" width="6" height="4" fill="#5c3d24" />
      <rect x="22" y="22" width="6" height="4" fill="#5c3d24" />
      <rect x="5" y="23" width="4" height="2" fill="#b8c4d0" />
      <rect x="23" y="23" width="4" height="2" fill="#b8c4d0" />
      <rect x="10" y="22" width="12" height="2" fill="#5c3d24" />
      <rect x="12" y="6" width="2" height="4" fill="#5c3d24" />
      <rect x="12" y="4" width="2" height="2" fill="#d54c4c" />
    </svg>
  );
}

// Epouvantail (16×24) : tete (top half) animable separement via une
// classe parent --head-rot. La tete est dans un <g> dedie pour que le
// transform tourne juste la tete autour du cou.
export function ScarecrowIcon({ size = 32, className, style, title }: IconProps) {
  return (
    <svg viewBox="0 0 16 24" shapeRendering="crispEdges" className={className} style={pixelStyle(size, style)} role={title ? 'img' : undefined} aria-label={title}>
      {/* Mat vertical bois */}
      <rect x="7" y="9" width="2" height="14" fill="#6B3710" />
      <rect x="2" y="11" width="12" height="2" fill="#6B3710" />
      <rect x="2" y="11" width="12" height="1" fill="#9B5C24" />
      {/* Vetements (chemise) - en x */}
      <rect x="3" y="13" width="10" height="6" fill="#D32F2F" />
      <rect x="3" y="13" width="10" height="1" fill="#FFD921" />
      <rect x="4" y="14" width="8" height="3" fill="#D32F2F" />
      {/* Brins paille pieds */}
      <rect x="5" y="22" width="1" height="2" fill="#FFD921" />
      <rect x="7" y="22" width="2" height="2" fill="#FFD921" />
      <rect x="10" y="22" width="1" height="2" fill="#FFD921" />
      {/* Tete (sera tournee) */}
      <g className="farm-scarecrow-head">
        {/* Sac toile en jute */}
        <rect x="4" y="2" width="8" height="7" fill="#DDA059" />
        <rect x="4" y="2" width="8" height="1" fill="#FFE4A0" />
        <rect x="4" y="8" width="8" height="1" fill="#95560E" />
        {/* Yeux noirs (boutons) */}
        <rect x="6" y="5" width="1" height="1" fill="#2A1818" />
        <rect x="9" y="5" width="1" height="1" fill="#2A1818" />
        {/* Bouche cousue X */}
        <rect x="7" y="7" width="2" height="1" fill="#5C3D24" />
        {/* Chapeau de paille */}
        <rect x="3" y="0" width="10" height="2" fill="#FFD921" />
        <rect x="2" y="1" width="12" height="1" fill="#E19D1D" />
        <rect x="5" y="0" width="6" height="1" fill="#FFE4A0" />
        {/* Brins de paille qui depassent du sac */}
        <rect x="3" y="3" width="1" height="2" fill="#FFD921" />
        <rect x="12" y="4" width="1" height="2" fill="#FFD921" />
        <rect x="2" y="5" width="2" height="1" fill="#FFD921" />
      </g>
    </svg>
  );
}

// Soleil pixel art (16×16) avec rayons. Ajouter classe sun-rotate pour
// animer la rotation des rayons sans bouger le disque central.
export function SunIcon({ size = 16, className, style, title }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} style={pixelStyle(size, style)} role={title ? 'img' : undefined} aria-label={title}>
      {/* Rayons (cardinaux + diagonaux) */}
      <g>
        <rect x="7" y="0" width="2" height="2" fill="#F4C430" />
        <rect x="7" y="14" width="2" height="2" fill="#F4C430" />
        <rect x="0" y="7" width="2" height="2" fill="#F4C430" />
        <rect x="14" y="7" width="2" height="2" fill="#F4C430" />
        <rect x="2" y="2" width="2" height="2" fill="#F4C430" />
        <rect x="12" y="2" width="2" height="2" fill="#F4C430" />
        <rect x="2" y="12" width="2" height="2" fill="#F4C430" />
        <rect x="12" y="12" width="2" height="2" fill="#F4C430" />
      </g>
      {/* Disque */}
      <rect x="6" y="4" width="4" height="8" fill="#FFD921" />
      <rect x="4" y="6" width="8" height="4" fill="#FFD921" />
      <rect x="5" y="5" width="6" height="6" fill="#FFD921" />
      {/* Highlight clair en haut-gauche */}
      <rect x="6" y="5" width="2" height="2" fill="#FFE4A0" />
      <rect x="5" y="7" width="2" height="2" fill="#FFE4A0" />
    </svg>
  );
}

// Nuage (16×12) avec ombre dessous.
export function CloudIcon({ size = 16, className, style, title }: IconProps) {
  return (
    <svg viewBox="0 0 16 12" shapeRendering="crispEdges" className={className} style={pixelStyle(size, style)} role={title ? 'img' : undefined} aria-label={title}>
      <rect x="4" y="2" width="6" height="3" fill="#FFF8DC" />
      <rect x="2" y="4" width="12" height="5" fill="#FFF8DC" />
      <rect x="3" y="9" width="10" height="1" fill="#C9B380" />
      <rect x="5" y="3" width="4" height="1" fill="#FFFFFF" />
    </svg>
  );
}

// Nuage de pluie (16×16) : nuage gris + 3 gouttes bleues.
export function RainIcon({ size = 16, className, style, title }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} style={pixelStyle(size, style)} role={title ? 'img' : undefined} aria-label={title}>
      <rect x="4" y="1" width="6" height="3" fill="#B8C2CC" />
      <rect x="2" y="3" width="12" height="5" fill="#B8C2CC" />
      <rect x="3" y="8" width="10" height="1" fill="#7A8691" />
      <rect x="3" y="10" width="1" height="2" fill="#4F94CD" />
      <rect x="7" y="11" width="1" height="3" fill="#4F94CD" />
      <rect x="11" y="10" width="1" height="2" fill="#4F94CD" />
      <rect x="3" y="13" width="1" height="2" fill="#4F94CD" />
      <rect x="11" y="13" width="1" height="2" fill="#4F94CD" />
    </svg>
  );
}

// Nuage d'orage (16×16) : nuage sombre + eclair jaune.
export function StormIcon({ size = 16, className, style, title }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} style={pixelStyle(size, style)} role={title ? 'img' : undefined} aria-label={title}>
      <rect x="4" y="1" width="6" height="3" fill="#7A8691" />
      <rect x="2" y="3" width="12" height="5" fill="#7A8691" />
      <rect x="3" y="8" width="10" height="1" fill="#4A5560" />
      <rect x="9" y="9" width="2" height="2" fill="#FFD921" />
      <rect x="7" y="10" width="3" height="2" fill="#FFD921" />
      <rect x="6" y="11" width="3" height="2" fill="#FFD921" />
      <rect x="5" y="12" width="3" height="2" fill="#FFD921" />
      <rect x="6" y="13" width="2" height="2" fill="#FFD921" />
    </svg>
  );
}

// Vent (16×16) : 3 lignes ondulantes.
export function WindIcon({ size = 16, className, style, title }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} style={pixelStyle(size, style)} role={title ? 'img' : undefined} aria-label={title}>
      <rect x="2" y="4" width="9" height="1" fill="#A8D8EE" />
      <rect x="11" y="3" width="2" height="2" fill="#A8D8EE" />
      <rect x="13" y="2" width="1" height="1" fill="#A8D8EE" />
      <rect x="13" y="5" width="1" height="1" fill="#A8D8EE" />
      <rect x="2" y="8" width="11" height="1" fill="#A8D8EE" />
      <rect x="13" y="7" width="2" height="2" fill="#A8D8EE" />
      <rect x="2" y="12" width="7" height="1" fill="#A8D8EE" />
      <rect x="9" y="11" width="2" height="2" fill="#A8D8EE" />
    </svg>
  );
}

// Flocon de neige (16×16) : 6 branches.
export function SnowIcon({ size = 16, className, style, title }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} style={pixelStyle(size, style)} role={title ? 'img' : undefined} aria-label={title}>
      <g fill="#A8D8EE">
        <rect x="7" y="2" width="2" height="12" />
        <rect x="2" y="7" width="12" height="2" />
      </g>
      <g fill="#FFF8DC">
        <rect x="7" y="2" width="2" height="2" />
        <rect x="7" y="12" width="2" height="2" />
        <rect x="2" y="7" width="2" height="2" />
        <rect x="12" y="7" width="2" height="2" />
      </g>
      <rect x="3" y="3" width="2" height="2" fill="#A8D8EE" />
      <rect x="11" y="3" width="2" height="2" fill="#A8D8EE" />
      <rect x="3" y="11" width="2" height="2" fill="#A8D8EE" />
      <rect x="11" y="11" width="2" height="2" fill="#A8D8EE" />
    </svg>
  );
}

// Fleur (16×16) — pour saison printemps.
export function FlowerIcon({ size = 16, className, style, title }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} style={pixelStyle(size, style)} role={title ? 'img' : undefined} aria-label={title}>
      <rect x="6" y="3" width="4" height="4" fill="#F29BB8" />
      <rect x="5" y="4" width="6" height="2" fill="#F29BB8" />
      <rect x="7" y="4" width="2" height="2" fill="#FFD921" />
      <rect x="7" y="7" width="2" height="6" fill="#6BA53A" />
      <rect x="5" y="9" width="2" height="2" fill="#8FBF4F" />
      <rect x="9" y="11" width="2" height="2" fill="#8FBF4F" />
    </svg>
  );
}

// Feuille morte automne.
export function LeafIcon({ size = 16, className, style, title }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} style={pixelStyle(size, style)} role={title ? 'img' : undefined} aria-label={title}>
      <rect x="6" y="2" width="4" height="2" fill="#E67E22" />
      <rect x="4" y="4" width="8" height="6" fill="#E67E22" />
      <rect x="3" y="6" width="10" height="2" fill="#E67E22" />
      <rect x="5" y="10" width="6" height="2" fill="#A22A06" />
      <rect x="7" y="12" width="2" height="3" fill="#5C3D24" />
      <rect x="6" y="6" width="4" height="1" fill="#FFD921" />
    </svg>
  );
}

// Note de musique pixel-art (16×16) avec hampe + drapeau, palette gold
// pour ressembler clairement a un sprite jeu et pas a l'emoji systeme.
export function SoundOnIcon({ size = 16, className, style, title }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} style={pixelStyle(size, style)} role={title ? 'img' : undefined} aria-label={title}>
      {/* Hampe verticale */}
      <rect x="9" y="2" width="2" height="9" fill="#5c3d24" />
      {/* Drapeau de la note */}
      <rect x="11" y="2" width="3" height="2" fill="#5c3d24" />
      <rect x="11" y="3" width="3" height="1" fill="#FFD921" />
      <rect x="13" y="2" width="1" height="4" fill="#5c3d24" />
      <rect x="13" y="3" width="1" height="3" fill="#FFD921" />
      {/* Tete de note (ovale) */}
      <rect x="4" y="9" width="6" height="1" fill="#5c3d24" />
      <rect x="3" y="10" width="8" height="3" fill="#5c3d24" />
      <rect x="4" y="13" width="6" height="1" fill="#5c3d24" />
      <rect x="4" y="10" width="6" height="3" fill="#FFD921" />
      <rect x="5" y="11" width="2" height="1" fill="#fde08a" />
    </svg>
  );
}

// Note de musique barree d'une croix rouge pour 'mute'.
export function SoundOffIcon({ size = 16, className, style, title }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} style={pixelStyle(size, style)} role={title ? 'img' : undefined} aria-label={title}>
      {/* Note grisee */}
      <rect x="9" y="2" width="2" height="9" fill="#5c3d24" />
      <rect x="11" y="2" width="3" height="2" fill="#5c3d24" />
      <rect x="13" y="2" width="1" height="4" fill="#5c3d24" />
      <rect x="11" y="3" width="3" height="1" fill="#A57144" />
      <rect x="13" y="3" width="1" height="3" fill="#A57144" />
      <rect x="4" y="9" width="6" height="1" fill="#5c3d24" />
      <rect x="3" y="10" width="8" height="3" fill="#5c3d24" />
      <rect x="4" y="13" width="6" height="1" fill="#5c3d24" />
      <rect x="4" y="10" width="6" height="3" fill="#A57144" />
      {/* Croix rouge diagonale par-dessus */}
      <rect x="1" y="1" width="2" height="2" fill="#d54c4c" />
      <rect x="3" y="3" width="2" height="2" fill="#d54c4c" />
      <rect x="5" y="5" width="2" height="2" fill="#d54c4c" />
      <rect x="7" y="7" width="2" height="2" fill="#d54c4c" />
      <rect x="9" y="9" width="2" height="2" fill="#d54c4c" />
      <rect x="11" y="11" width="2" height="2" fill="#d54c4c" />
      <rect x="13" y="13" width="2" height="2" fill="#d54c4c" />
    </svg>
  );
}

// Cadenas grand format pour ecran d'invite (32×32).
export function BigLockIcon({ size = 64, className, style, title }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} style={pixelStyle(size, style)} role={title ? 'img' : undefined} aria-label={title}>
      <rect x="5" y="2" width="6" height="2" fill="#5c3d24" />
      <rect x="4" y="3" width="2" height="4" fill="#5c3d24" />
      <rect x="10" y="3" width="2" height="4" fill="#5c3d24" />
      <rect x="3" y="7" width="10" height="7" fill="#c49b6a" />
      <rect x="3" y="7" width="10" height="2" fill="#f5e6c8" />
      <rect x="3" y="13" width="10" height="1" fill="#5c3d24" />
      <rect x="7" y="9" width="2" height="3" fill="#5c3d24" />
      <rect x="7" y="11" width="2" height="2" fill="#FFD921" />
    </svg>
  );
}

// Boite aux lettres rouge francaise (style La Poste) avec drapeau lateral
// qui se leve quand il y a une notif. Le drapeau pivote via CSS var --flag-rot.
export function MailboxIcon({ size = 32, className, style, title }: IconProps) {
  return (
    <svg viewBox="0 0 16 24" shapeRendering="crispEdges" className={className} style={pixelStyle(size, style)} role={title ? 'img' : undefined} aria-label={title}>
      {/* Mat */}
      <rect x="7" y="14" width="2" height="10" fill="#5c3d24" />
      <rect x="6" y="22" width="4" height="2" fill="#3A1F08" />
      {/* Boite rouge */}
      <rect x="2" y="6" width="12" height="9" fill="#B52121" />
      <rect x="2" y="6" width="12" height="2" fill="#D94343" />
      <rect x="2" y="13" width="12" height="2" fill="#5A0E0E" />
      <rect x="1" y="7" width="1" height="7" fill="#5A0E0E" />
      <rect x="14" y="7" width="1" height="7" fill="#5A0E0E" />
      {/* Toit arrondi */}
      <rect x="3" y="5" width="10" height="1" fill="#B52121" />
      <rect x="4" y="4" width="8" height="1" fill="#D94343" />
      {/* Fente courrier */}
      <rect x="5" y="9" width="6" height="1" fill="#3A1F08" />
      {/* Drapeau lateral (cote droit) - pivote via la classe parent */}
      <g
        className="mailbox-flag"
        style={{
          transformOrigin: '14px 11px',
          transformBox: 'fill-box',
        }}
      >
        <rect x="14" y="9" width="1" height="3" fill="#5c3d24" />
        <rect x="15" y="9" width="3" height="2" fill="#FFD921" />
      </g>
      {/* Logo La Poste-style (bandeau jaune) */}
      <rect x="5" y="11" width="6" height="1" fill="#FFD921" />
    </svg>
  );
}

// Cocotte la poule (16×16) - petit corps blanc + creste rouge.
export function CocotteIcon({ size = 32, className, style, title }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} style={pixelStyle(size, style)} role={title ? 'img' : undefined} aria-label={title}>
      {/* Corps blanc */}
      <rect x="3" y="6" width="9" height="6" fill="#FFF8DC" />
      <rect x="2" y="7" width="11" height="4" fill="#FFF8DC" />
      {/* Tete */}
      <rect x="11" y="5" width="3" height="3" fill="#FFF8DC" />
      {/* Creste rouge */}
      <rect x="11" y="3" width="2" height="2" fill="#B52121" />
      <rect x="13" y="4" width="1" height="1" fill="#B52121" />
      {/* Bec orange */}
      <rect x="14" y="6" width="1" height="1" fill="#E67E22" />
      {/* Oeil */}
      <rect x="12" y="6" width="1" height="1" fill="#3A1F08" />
      {/* Pattes */}
      <rect x="5" y="12" width="1" height="2" fill="#E67E22" />
      <rect x="9" y="12" width="1" height="2" fill="#E67E22" />
      {/* Aile */}
      <rect x="5" y="8" width="3" height="2" fill="#FFD921" />
      <rect x="6" y="9" width="2" height="1" fill="#E19D1D" />
      {/* Queue */}
      <rect x="2" y="6" width="2" height="2" fill="#FFD921" />
    </svg>
  );
}

// Carnet de Marcel (icone tab) - petit cahier ferme avec elastique.
export function NotebookIcon({ size = 24, className, style, title }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" shapeRendering="crispEdges" className={className} style={pixelStyle(size, style)} role={title ? 'img' : undefined} aria-label={title}>
      <rect x="4" y="3" width="16" height="18" fill="#5c3d24" />
      <rect x="5" y="4" width="14" height="16" fill="#FFF8DC" />
      <rect x="5" y="4" width="14" height="2" fill="#EBD9A8" />
      <rect x="6" y="8" width="12" height="1" fill="#A8D8EE" />
      <rect x="6" y="11" width="12" height="1" fill="#A8D8EE" />
      <rect x="6" y="14" width="12" height="1" fill="#A8D8EE" />
      <rect x="6" y="17" width="8" height="1" fill="#A8D8EE" />
      {/* Spirale */}
      <rect x="3" y="5" width="2" height="1" fill="#7A8691" />
      <rect x="3" y="9" width="2" height="1" fill="#7A8691" />
      <rect x="3" y="13" width="2" height="1" fill="#7A8691" />
      <rect x="3" y="17" width="2" height="1" fill="#7A8691" />
      {/* Elastique rouge */}
      <rect x="14" y="2" width="1" height="20" fill="#B52121" />
    </svg>
  );
}

// Croix rouge pour items destructifs (deconnexion).
export function CrossIcon({ size = 16, className, style, title }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} style={pixelStyle(size, style)} role={title ? 'img' : undefined} aria-label={title}>
      <rect x="2" y="2" width="2" height="2" fill="#d54c4c" />
      <rect x="12" y="2" width="2" height="2" fill="#d54c4c" />
      <rect x="4" y="4" width="2" height="2" fill="#d54c4c" />
      <rect x="10" y="4" width="2" height="2" fill="#d54c4c" />
      <rect x="6" y="6" width="4" height="4" fill="#d54c4c" />
      <rect x="4" y="10" width="2" height="2" fill="#d54c4c" />
      <rect x="10" y="10" width="2" height="2" fill="#d54c4c" />
      <rect x="2" y="12" width="2" height="2" fill="#d54c4c" />
      <rect x="12" y="12" width="2" height="2" fill="#d54c4c" />
    </svg>
  );
}

// Pompon le chat : chat tigre orange-blanc qui dort, vu de profil (24×12).
// Easter egg cozy a placer sur le toit de la maison.
export function PomponIcon({ size = 32, className, style, title }: IconProps) {
  return (
    <svg viewBox="0 0 24 12" shapeRendering="crispEdges" className={className} style={pixelStyle(size, style)} role={title ? 'img' : undefined} aria-label={title}>
      {/* corps couche - rayures orange/blanc */}
      <rect x="3" y="5" width="14" height="5" fill="#E67E22" />
      <rect x="3" y="6" width="14" height="1" fill="#F5C443" />
      <rect x="5" y="5" width="2" height="5" fill="#FFF8DC" />
      <rect x="9" y="5" width="2" height="5" fill="#FFF8DC" />
      <rect x="13" y="5" width="2" height="5" fill="#FFF8DC" />
      {/* tete (cote droit) */}
      <rect x="17" y="3" width="5" height="5" fill="#E67E22" />
      <rect x="17" y="3" width="5" height="1" fill="#F5C443" />
      {/* oreilles */}
      <rect x="17" y="2" width="2" height="1" fill="#E67E22" />
      <rect x="20" y="2" width="2" height="1" fill="#E67E22" />
      <rect x="17" y="1" width="1" height="1" fill="#5c3d24" />
      <rect x="21" y="1" width="1" height="1" fill="#5c3d24" />
      {/* oeil ferme */}
      <rect x="20" y="5" width="1" height="1" fill="#5c3d24" />
      {/* nez/moustache */}
      <rect x="22" y="5" width="1" height="1" fill="#FFB3C1" />
      {/* pattes */}
      <rect x="4" y="10" width="2" height="2" fill="#E67E22" />
      <rect x="14" y="10" width="2" height="2" fill="#E67E22" />
      {/* queue qui depasse a gauche */}
      <rect x="0" y="6" width="3" height="2" fill="#E67E22" />
      <rect x="1" y="5" width="1" height="1" fill="#E67E22" />
      <rect x="2" y="4" width="1" height="1" fill="#E67E22" />
    </svg>
  );
}

// Lanterne suspendue (16×16) : structure metal + flamme jaune chaud.
// Halo gold via CSS box-shadow + animation flicker irregulier.
export function LanternIcon({ size = 24, className, style, title }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} style={pixelStyle(size, style)} role={title ? 'img' : undefined} aria-label={title}>
      {/* anneau de suspension */}
      <rect x="7" y="0" width="2" height="2" fill="#3A1F08" />
      <rect x="7" y="2" width="2" height="1" fill="#6B3710" />
      {/* chapeau */}
      <rect x="4" y="3" width="8" height="2" fill="#3A1F08" />
      <rect x="5" y="2" width="6" height="1" fill="#6B3710" />
      {/* corps cage */}
      <rect x="3" y="5" width="1" height="7" fill="#3A1F08" />
      <rect x="12" y="5" width="1" height="7" fill="#3A1F08" />
      <rect x="4" y="5" width="8" height="7" fill="#FFE4A0" />
      <rect x="6" y="5" width="1" height="7" fill="#3A1F08" />
      <rect x="9" y="5" width="1" height="7" fill="#3A1F08" />
      {/* flamme jaune chaude */}
      <rect x="7" y="6" width="2" height="4" fill="#FFD921" />
      <rect x="7" y="7" width="2" height="2" fill="#F5F5DC" />
      <rect x="6" y="8" width="1" height="2" fill="#FFD921" />
      <rect x="9" y="8" width="1" height="2" fill="#FFD921" />
      {/* base */}
      <rect x="4" y="12" width="8" height="1" fill="#6B3710" />
      <rect x="5" y="13" width="6" height="1" fill="#3A1F08" />
    </svg>
  );
}

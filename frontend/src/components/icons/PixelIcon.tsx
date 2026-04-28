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

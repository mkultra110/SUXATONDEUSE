// KawaiiSprites : sprites SVG pixel art originaux du design Claude Design.
// Utilises pour preview robots dans le shop, granny portrait dans tutoriel,
// coins, etc. Style chunky kawaii Animal Crossing.

interface RobotProps {
  tier?: number;
  size?: number;
  frame?: number;
}

const ROBOT_TIERS = [
  { body: '#FF6B9D', accent: '#D63378', eye: '#FFFFFF', glow: '#FFC2DD', deco: '#FFD921' },
  { body: '#5EC4FF', accent: '#2A7FB8', eye: '#FFFFFF', glow: '#B4E3FF', deco: '#F4FF61' },
  { body: '#A06CD5', accent: '#5E3A8C', eye: '#FFFF8C', glow: '#D4B0FF', deco: '#FFD921' },
  { body: '#FF8A3D', accent: '#B84F0E', eye: '#00FFD4', glow: '#FFCB94', deco: '#FFFFFF' },
  { body: '#5BD984', accent: '#1F8246', eye: '#FFFFFF', glow: '#A8F0BD', deco: '#FF61C7' },
  { body: '#3D4F8C', accent: '#1F2655', eye: '#FFD921', glow: '#7E92D6', deco: '#FF6B47' },
  { body: '#E63946', accent: '#8B1A24', eye: '#FFFFFF', glow: '#FFA8AF', deco: '#FFD921' },
  { body: '#FFD921', accent: '#B89510', eye: '#7C3AED', glow: '#FFF080', deco: '#FF1493' },
];

/** KawaiiRobot : sprite robot 32x32 pixel art chunky avec gros yeux + blush. */
export function KawaiiRobot({ tier = 0, size = 40, frame = 0 }: RobotProps) {
  const t = ROBOT_TIERS[tier % ROBOT_TIERS.length] ?? ROBOT_TIERS[0]!;
  const wheelOff = frame % 4 < 2 ? 0 : 1;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      style={{ shapeRendering: 'crispEdges', imageRendering: 'pixelated', overflow: 'visible' }}
      aria-hidden
    >
      <ellipse cx="16" cy="29" rx="11" ry="1.6" fill="rgba(0,0,0,.3)" />
      {/* body chunky */}
      <rect x="6" y="14" width="20" height="11" fill={t.body} />
      <rect x="5" y="15" width="22" height="9" fill={t.body} />
      <rect x="4" y="17" width="24" height="5" fill={t.body} />
      {/* highlight */}
      <rect x="6" y="15" width="20" height="2" fill={t.glow} />
      <rect x="5" y="16" width="3" height="6" fill={t.glow} opacity={0.6} />
      {/* outline */}
      <rect x="6" y="13" width="20" height="1" fill={t.accent} />
      <rect x="6" y="25" width="20" height="1" fill={t.accent} />
      <rect x="4" y="17" width="1" height="5" fill={t.accent} />
      <rect x="27" y="17" width="1" height="5" fill={t.accent} />
      {/* face panel */}
      <rect x="9" y="17" width="14" height="5" fill="#1A1A2E" />
      <rect x="9" y="17" width="14" height="1" fill="#0A0A1A" />
      {/* eyes (kawaii sparkly) */}
      <rect x="11" y="18" width="3" height="3" fill={t.eye} />
      <rect x="18" y="18" width="3" height="3" fill={t.eye} />
      <rect x="12" y="18" width="1" height="1" fill="#FFFFFF" />
      <rect x="19" y="18" width="1" height="1" fill="#FFFFFF" />
      {/* blush (rose joues) */}
      <rect x="8" y="21" width="2" height="1" fill="#FFB3D9" opacity={0.8} />
      <rect x="22" y="21" width="2" height="1" fill="#FFB3D9" opacity={0.8} />
      {/* antenna */}
      <rect x="15" y="9" width="2" height="5" fill={t.accent} />
      <rect x="14" y="7" width="4" height="3" fill={t.deco} />
      <rect x="13" y="8" width="6" height="1" fill={t.deco} />
      <rect x="14" y="6" width="4" height="1" fill={t.accent} />
      {frame % 8 < 4 && <rect x="15" y="5" width="2" height="1" fill="#FFFFFF" />}
      {/* wheels (small bob anim) */}
      <rect x="6" y={26 - wheelOff} width="5" height="3" fill="#1A1A2E" />
      <rect x="21" y={26 - wheelOff} width="5" height="3" fill="#1A1A2E" />
      <rect x="7" y={27 - wheelOff} width="3" height="1" fill="#4A4A6E" />
      <rect x="22" y={27 - wheelOff} width="3" height="1" fill="#4A4A6E" />
    </svg>
  );
}

/** KawaiiCoin : sprite piece doree 16x16 avec spin frame. */
export function KawaiiCoin({ size = 16, frame = 0 }: { size?: number; frame?: number }) {
  const spin = Math.abs(Math.sin(frame * 0.15));
  const w = 12 * spin + 2;
  const xOff = (16 - w) / 2;
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ shapeRendering: 'crispEdges' }} aria-hidden>
      <ellipse cx={xOff + w / 2} cy="8" rx={w / 2} ry="6" fill="#FFE066" />
      <ellipse cx={xOff + w / 2 - 1} cy="6" rx={Math.max(1, w / 4)} ry="2" fill="#FFF8DC" opacity={0.7} />
      <ellipse cx={xOff + w / 2} cy="8" rx={w / 2} ry="6" fill="none" stroke="#B89510" strokeWidth="1" />
    </svg>
  );
}

/** KawaiiSun : soleil souriant 32x32 avec rayons rotatifs. */
export function KawaiiSun({ size = 60, frame = 0 }: { size?: number; frame?: number }) {
  const r = (frame * 0.3) % 360;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ shapeRendering: 'crispEdges', overflow: 'visible' }} aria-hidden>
      <g transform={`rotate(${r} 16 16)`}>
        <rect x="15" y="2" width="2" height="3" fill="#FFD921" />
        <rect x="15" y="27" width="2" height="3" fill="#FFD921" />
        <rect x="2" y="15" width="3" height="2" fill="#FFD921" />
        <rect x="27" y="15" width="3" height="2" fill="#FFD921" />
        <rect x="6" y="6" width="2" height="2" fill="#FFD921" />
        <rect x="24" y="6" width="2" height="2" fill="#FFD921" />
        <rect x="6" y="24" width="2" height="2" fill="#FFD921" />
        <rect x="24" y="24" width="2" height="2" fill="#FFD921" />
      </g>
      <rect x="9" y="9" width="14" height="14" fill="#FFD921" />
      <rect x="8" y="10" width="16" height="12" fill="#FFD921" />
      <rect x="10" y="8" width="12" height="16" fill="#FFD921" />
      <rect x="9" y="9" width="14" height="3" fill="#FFF080" />
      <rect x="9" y="9" width="4" height="14" fill="#FFF080" opacity={0.5} />
      <rect x="12" y="14" width="2" height="2" fill="#1A1A2E" />
      <rect x="18" y="14" width="2" height="2" fill="#1A1A2E" />
      <rect x="13" y="18" width="6" height="1" fill="#1A1A2E" />
      <rect x="11" y="16" width="2" height="1" fill="#FF6B9D" opacity={0.7} />
      <rect x="19" y="16" width="2" height="1" fill="#FF6B9D" opacity={0.7} />
    </svg>
  );
}

/** KawaiiMoon : lune endormie 32x32 avec craters. */
export function KawaiiMoon({ size = 60 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ shapeRendering: 'crispEdges' }} aria-hidden>
      <rect x="9" y="6" width="14" height="20" fill="#FFF8DC" />
      <rect x="7" y="9" width="18" height="14" fill="#FFF8DC" />
      <rect x="8" y="7" width="16" height="18" fill="#FFF8DC" />
      <rect x="10" y="7" width="6" height="2" fill="#FFFFFF" />
      <rect x="8" y="9" width="3" height="3" fill="#FFFFFF" />
      <rect x="12" y="13" width="3" height="1" fill="#5A4A8E" />
      <rect x="18" y="13" width="3" height="1" fill="#5A4A8E" />
      <rect x="14" y="17" width="4" height="1" fill="#5A4A8E" />
      <rect x="18" y="11" width="2" height="2" fill="#E0D0A0" />
      <rect x="11" y="20" width="3" height="2" fill="#E0D0A0" />
    </svg>
  );
}

/** KawaiiCloud : nuage cumulus 4-bumps. */
export function KawaiiCloud({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 64 36" style={{ shapeRendering: 'crispEdges' }} aria-hidden>
      <ellipse cx="20" cy="22" rx="14" ry="10" fill="#FFFFFF" />
      <ellipse cx="40" cy="20" rx="16" ry="12" fill="#FFFFFF" />
      <ellipse cx="50" cy="24" rx="10" ry="8" fill="#FFFFFF" />
      <ellipse cx="20" cy="20" rx="10" ry="6" fill="#FFFFFF" opacity={0.7} />
    </svg>
  );
}

/** KawaiiButterfly : papillon 16x16 avec flap animation. */
export function KawaiiButterfly({ size = 16, color = '#FF6B9D', frame = 0 }: { size?: number; color?: string; frame?: number }) {
  const flap = frame % 4 < 2;
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ shapeRendering: 'crispEdges' }} aria-hidden>
      <rect x="7" y="6" width="2" height="5" fill="#1A1A2E" />
      {flap ? (
        <>
          <rect x="2" y="3" width="5" height="6" fill={color} />
          <rect x="9" y="3" width="5" height="6" fill={color} />
          <rect x="3" y="4" width="3" height="4" fill="#fff" opacity={0.4} />
          <rect x="10" y="4" width="3" height="4" fill="#fff" opacity={0.4} />
        </>
      ) : (
        <>
          <rect x="3" y="5" width="4" height="4" fill={color} />
          <rect x="9" y="5" width="4" height="4" fill={color} />
        </>
      )}
      <rect x="6" y="4" width="1" height="1" fill="#1A1A2E" />
      <rect x="9" y="4" width="1" height="1" fill="#1A1A2E" />
    </svg>
  );
}

export function KawaiiGranny({ size = 60, frame = 0 }: { size?: number; frame?: number }) {
  const bob = Math.sin(frame * 0.1) * 1;
  return (
    <svg
      width={size}
      height={size * 1.5}
      viewBox="0 0 24 36"
      style={{ shapeRendering: 'crispEdges', overflow: 'visible' }}
      aria-hidden
    >
      <ellipse cx="12" cy="34" rx="8" ry="1.5" fill="rgba(0,0,0,.3)" />
      <g transform={`translate(0 ${bob})`}>
        {/* legs + shoes */}
        <rect x="9" y="26" width="3" height="8" fill="#5A3A1F" />
        <rect x="13" y="26" width="3" height="8" fill="#5A3A1F" />
        <rect x="8" y="32" width="4" height="2" fill="#1A1A2E" />
        <rect x="13" y="32" width="4" height="2" fill="#1A1A2E" />
        {/* dress red + polka dots */}
        <rect x="6" y="18" width="13" height="10" fill="#A03A3A" />
        <rect x="5" y="20" width="15" height="8" fill="#C44A4A" />
        <rect x="6" y="18" width="13" height="2" fill="#E06060" />
        <rect x="8" y="22" width="2" height="2" fill="#FFFFFF" />
        <rect x="13" y="24" width="2" height="2" fill="#FFFFFF" />
        <rect x="16" y="22" width="2" height="2" fill="#FFFFFF" />
        {/* apron */}
        <rect x="9" y="20" width="7" height="6" fill="#FFE8C2" />
        <rect x="9" y="20" width="7" height="1" fill="#F0D0A0" />
        {/* arms */}
        <rect x="3" y="20" width="3" height="6" fill="#FFD9B3" />
        <rect x="19" y="20" width="3" height="6" fill="#FFD9B3" />
        <rect x="3" y="18" width="4" height="3" fill="#A03A3A" />
        <rect x="18" y="18" width="4" height="3" fill="#A03A3A" />
        {/* head */}
        <rect x="7" y="9" width="11" height="9" fill="#FFD9B3" />
        <rect x="6" y="11" width="13" height="6" fill="#FFD9B3" />
        {/* hair (chignon blanc) */}
        <rect x="7" y="6" width="11" height="5" fill="#FFFFFF" />
        <rect x="6" y="8" width="13" height="3" fill="#FFFFFF" />
        <rect x="10" y="3" width="5" height="4" fill="#FFFFFF" />
        <rect x="9" y="4" width="7" height="3" fill="#F0F0F0" />
        {/* glasses */}
        <rect x="8" y="12" width="3" height="3" fill="#FFFFFF" />
        <rect x="13" y="12" width="3" height="3" fill="#FFFFFF" />
        <rect x="9" y="13" width="1" height="1" fill="#1A1A2E" />
        <rect x="14" y="13" width="1" height="1" fill="#1A1A2E" />
        <rect x="11" y="13" width="2" height="1" fill="#1A1A2E" />
        <rect x="7" y="12" width="1" height="3" fill="#1A1A2E" />
        <rect x="16" y="12" width="1" height="3" fill="#1A1A2E" />
        {/* mouth */}
        <rect x="11" y="16" width="3" height="1" fill="#A03A3A" />
        {/* blush */}
        <rect x="6" y="14" width="2" height="1" fill="#FFB3D9" />
        <rect x="17" y="14" width="2" height="1" fill="#FFB3D9" />
      </g>
    </svg>
  );
}

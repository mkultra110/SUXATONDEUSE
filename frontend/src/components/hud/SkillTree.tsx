// Skill tree prestige : 9 noeuds hexagonaux clusterises (3 lignes x 3),
// connexions illuminees entre prerequis. Cout en graines de prestige.
// Style Camille v9 : hex avec halo dore quand achetable, brillant
// quand achete, terne quand verrouille.

import { useState } from 'react';
import { useGameStore } from '../../stores/gameStore.js';
import { SeedIcon, StarIcon } from '../icons/PixelIcon.js';
import { audio } from '../../services/audio.js';

export interface SkillNode {
  id: string;
  row: number;
  col: number; // 0..2
  name: string;
  description: string;
  cost: number;
  requires?: string;
  effect: string;
}

const SKILL_NODES: SkillNode[] = [
  // Ligne 0 : production
  { id: 'prod-1', row: 0, col: 0, name: '+10% Cash', description: 'Boost permanent cash production', cost: 1, effect: '+10% revenus' },
  { id: 'prod-2', row: 0, col: 1, name: '+25% Cash', description: 'Boost majeur permanent', cost: 3, requires: 'prod-1', effect: '+25% revenus' },
  { id: 'prod-3', row: 0, col: 2, name: '+50% Cash', description: 'Maitrise cash absolue', cost: 5, requires: 'prod-2', effect: '+50% revenus' },
  // Ligne 1 : vitesse
  { id: 'speed-1', row: 1, col: 0, name: '+15% Vitesse', description: 'Robots plus rapides', cost: 1, effect: '+15% vitesse robots' },
  { id: 'speed-2', row: 1, col: 1, name: 'Lames affutees', description: 'Tonte instantanee', cost: 4, requires: 'speed-1', effect: '+30% vitesse tonte' },
  { id: 'speed-3', row: 1, col: 2, name: 'Hyper drive', description: 'Robots fulgurants', cost: 6, requires: 'speed-2', effect: '+60% vitesse globale' },
  // Ligne 2 : offline
  { id: 'offline-1', row: 2, col: 0, name: '+1h Offline', description: 'Plus de gains hors-ligne', cost: 2, effect: '+1h cap offline' },
  { id: 'offline-2', row: 2, col: 1, name: '+50% Offline', description: 'Production offline boostee', cost: 3, requires: 'offline-1', effect: '+50% gains offline' },
  { id: 'offline-3', row: 2, col: 2, name: 'Sentinelle', description: 'Gains offline illimites', cost: 8, requires: 'offline-2', effect: 'Cap offline +∞' },
];

interface SkillTreeProps {
  onClose: () => void;
}

export function SkillTree({ onClose }: SkillTreeProps) {
  const prestigePoints = useGameStore((s) => s.prestigePoints);
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<SkillNode | null>(null);

  const seedsAvailable = Number(prestigePoints.floor().toString());

  function canUnlock(node: SkillNode): boolean {
    if (unlocked.has(node.id)) return false;
    if (node.requires && !unlocked.has(node.requires)) return false;
    return seedsAvailable >= node.cost;
  }

  function unlock(node: SkillNode) {
    if (!canUnlock(node)) return;
    setUnlocked((prev) => {
      const next = new Set(prev);
      next.add(node.id);
      return next;
    });
    audio.playPurchase();
  }

  function nodeState(node: SkillNode): 'locked' | 'available' | 'unlocked' {
    if (unlocked.has(node.id)) return 'unlocked';
    if (canUnlock(node)) return 'available';
    return 'locked';
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 4000,
        background: 'radial-gradient(ellipse at center, #2a3a6b 0%, #151152 70%, #08051f 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}
    >
      {/* Etoiles scintillantes en fond */}
      {Array.from({ length: 40 }).map((_, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            top: `${(i * 37) % 100}%`,
            left: `${(i * 71) % 100}%`,
            width: 2,
            height: 2,
            background: 'var(--color-paper-1)',
            borderRadius: '50%',
            opacity: 0.4 + Math.random() * 0.6,
            animation: `star-twinkle ${2 + (i % 3)}s ease-in-out ${i * 0.1}s infinite`,
            pointerEvents: 'none',
          }}
        />
      ))}

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          background: 'linear-gradient(180deg, rgba(245, 232, 200, 0.95), rgba(232, 212, 163, 0.95))',
          border: '4px solid var(--color-wood-5)',
          borderRadius: 6,
          padding: '24px 28px 28px',
          maxWidth: 560,
          width: '90vw',
          boxShadow: '0 8px 0 var(--color-wood-5), 0 16px 40px rgba(0, 0, 0, 0.6), inset 0 0 0 2px var(--color-wood-3)',
          cursor: 'default',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2
            className="flex items-center gap-2 m-0"
            style={{ fontFamily: 'var(--font-title)', color: 'var(--color-text-title)', fontSize: 22 }}
          >
            <StarIcon size={24} />
            Arbre de Prestige
          </h2>
          <div
            className="flex items-center gap-1.5 px-2 py-1"
            style={{
              background: 'var(--color-wood-5)',
              border: '2px solid var(--color-wood-4)',
              borderRadius: 4,
            }}
          >
            <SeedIcon size={16} />
            <span className="numeric" style={{ color: 'var(--color-accent-purple)', fontSize: 18, lineHeight: 1 }}>
              {seedsAvailable}
            </span>
          </div>
        </div>

        {/* Connexions SVG en arriere-plan */}
        <div style={{ position: 'relative', height: 280, marginBottom: 16 }}>
          <svg
            viewBox="0 0 300 280"
            preserveAspectRatio="none"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          >
            {SKILL_NODES.filter((n) => n.requires).map((node) => {
              const parent = SKILL_NODES.find((p) => p.id === node.requires);
              if (!parent) return null;
              const x1 = parent.col * 100 + 50;
              const y1 = parent.row * 90 + 45;
              const x2 = node.col * 100 + 50;
              const y2 = node.row * 90 + 45;
              const isPath = unlocked.has(parent.id);
              return (
                <line
                  key={node.id}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isPath ? 'var(--color-accent-gold)' : 'var(--color-wood-4)'}
                  strokeWidth={isPath ? 3 : 2}
                  strokeDasharray={isPath ? '0' : '4 3'}
                  style={{
                    filter: isPath ? 'drop-shadow(0 0 4px var(--color-accent-gold))' : 'none',
                  }}
                />
              );
            })}
          </svg>

          {/* Noeuds hexagonaux */}
          {SKILL_NODES.map((node) => {
            const state = nodeState(node);
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => {
                  setSelected(node);
                  if (state === 'available') unlock(node);
                }}
                style={{
                  position: 'absolute',
                  left: `${(node.col * 100 + 50) / 300 * 100}%`,
                  top: `${(node.row * 90 + 45) / 280 * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  width: 56,
                  height: 56,
                  background: 'transparent',
                  border: 'none',
                  cursor: state === 'locked' ? 'not-allowed' : 'pointer',
                  padding: 0,
                  filter:
                    state === 'unlocked'
                      ? 'drop-shadow(0 0 12px var(--color-accent-gold))'
                      : state === 'available'
                        ? 'drop-shadow(0 0 8px rgba(245, 196, 67, 0.5))'
                        : 'none',
                  animation: state === 'available' ? 'hex-pulse 2s ease-in-out infinite' : undefined,
                }}
              >
                <Hexagon state={state} />
              </button>
            );
          })}
        </div>

        {/* Description du noeud selectionne */}
        <div
          className="panel-paper"
          style={{
            padding: 12,
            minHeight: 80,
          }}
        >
          {selected ? (
            <>
              <div
                style={{
                  fontFamily: 'var(--font-title)',
                  fontWeight: 700,
                  fontSize: 14,
                  color: 'var(--color-text-title)',
                  marginBottom: 4,
                }}
              >
                {selected.name}
              </div>
              <div className="meme" style={{ fontSize: 14, color: 'var(--color-text-body)', marginBottom: 6 }}>
                {selected.description}
              </div>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: 11, color: 'var(--color-grass-6)', fontFamily: 'var(--font-button)', letterSpacing: '0.1em' }}>
                  EFFET : {selected.effect}
                </span>
                <span className="flex items-center gap-1">
                  <SeedIcon size={12} />
                  <span className="numeric" style={{ color: 'var(--color-accent-purple)', fontSize: 14 }}>
                    {selected.cost}
                  </span>
                </span>
              </div>
            </>
          ) : (
            <div className="meme" style={{ fontSize: 16, color: 'var(--color-text-muted)', textAlign: 'center', fontStyle: 'italic' }}>
              Choisis une étoile pour voir son pouvoir...
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="pixel-btn pixel-btn-wood"
          style={{ marginTop: 12, width: '100%' }}
        >
          Retour à la ferme
        </button>
      </div>
    </div>
  );
}

function Hexagon({ state }: { state: 'locked' | 'available' | 'unlocked' }) {
  const fill =
    state === 'unlocked' ? 'var(--color-accent-gold)' :
    state === 'available' ? 'var(--color-paper-1)' :
    'var(--color-paper-3)';
  const stroke =
    state === 'unlocked' ? '#a87a1f' :
    state === 'available' ? 'var(--color-accent-gold)' :
    'var(--color-wood-4)';
  const inner =
    state === 'unlocked' ? '#fde08a' :
    state === 'available' ? 'var(--color-accent-gold)' :
    'var(--color-paper-3)';
  return (
    <svg viewBox="0 0 56 56" width="56" height="56" shapeRendering="crispEdges" style={{ imageRendering: 'pixelated' }}>
      {/* Hex outer */}
      <polygon points="14,4 42,4 54,28 42,52 14,52 2,28" fill={stroke} />
      {/* Hex inner */}
      <polygon points="16,8 40,8 50,28 40,48 16,48 6,28" fill={fill} />
      {/* Star ou cadenas selon l'etat */}
      {state === 'locked' ? (
        <g fill="var(--color-wood-5)">
          <rect x="22" y="22" width="12" height="12" />
          <rect x="20" y="24" width="2" height="8" />
          <rect x="34" y="24" width="2" height="8" />
          <rect x="24" y="20" width="8" height="2" />
        </g>
      ) : (
        <g fill={inner}>
          <rect x="26" y="14" width="4" height="4" />
          <rect x="22" y="18" width="12" height="4" />
          <rect x="14" y="22" width="28" height="6" />
          <rect x="18" y="28" width="20" height="6" />
          <rect x="20" y="34" width="6" height="6" />
          <rect x="30" y="34" width="6" height="6" />
          <rect x="14" y="40" width="6" height="4" />
          <rect x="36" y="40" width="6" height="4" />
        </g>
      )}
    </svg>
  );
}

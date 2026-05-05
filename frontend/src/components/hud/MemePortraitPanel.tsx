// MemePortraitPanel : carte cottagecore avec portrait Memé Gisele (SVG
// kawaii) + citation rotative selon l'heure / contexte. Affiche desktop
// sous la timeline.

import { useMemo } from 'react';
import { KawaiiGranny } from './KawaiiSprites.js';
import { useGameStore } from '../../stores/gameStore.js';

const QUOTES = [
  { text: '« La patience est une fleur qui ne pousse pas dans tous les jardins. »', tag: 'sagesse' },
  { text: '« Petit à petit, l\'oiseau fait son nid. »', tag: 'sagesse' },
  { text: '« Marcel disait toujours : qui sème la patience récolte la confiture. »', tag: 'marcel' },
  { text: '« Cocotte vient de pondre. C\'est bon signe. »', tag: 'cocotte' },
  { text: '« Pompon dort sur le clavier, je le pousse pas. »', tag: 'pompon' },
  { text: '« Le tracteur chauffe. Va boire un coup en attendant. »', tag: 'tracteur' },
  { text: '« J\'ai sorti la tarte aux mirabelles du four. Faut que ça repose. »', tag: 'cuisine' },
  { text: '« Mes aïeux, te voilà bien dégourdi ! »', tag: 'feedback' },
  { text: '« Faut pas pousser Mémé dans les orties ! »', tag: 'humeur' },
  { text: '« Le soleil tape fort aujourd\'hui. Pense à ton chapeau. »', tag: 'meteo' },
];

export function MemePortraitPanel() {
  const playTime = useGameStore((s) => s.playTimeSeconds);
  const totalRobots = useGameStore((s) => s.totalRobotsBought);

  // Citation deterministe selon le quart d'heure (rotation lente).
  const quote = useMemo(() => {
    const idx = Math.floor(playTime / 900) % QUOTES.length;
    return QUOTES[idx]!;
  }, [playTime]);

  const frame = Math.floor(Date.now() / 100);

  return (
    <div
      className="panel-paper"
      style={{
        marginTop: 8,
        padding: 14,
        display: 'flex',
        gap: 14,
        alignItems: 'center',
        background: 'linear-gradient(180deg, var(--k-cream, #FFF8DC) 0%, var(--k-cream-warm, #F4D6A8) 100%)',
        border: '3px solid var(--k-ink, #1A1A2E)',
        boxShadow: 'var(--k-shadow-8bit-lg, 4px 4px 0 #1A1A2E)',
      }}
    >
      <div style={{ flexShrink: 0 }}>
        <KawaiiGranny size={70} frame={frame} />
      </div>
      <div style={{ flex: 1, minWidth: 0, color: 'var(--k-ink, #1A1A2E)' }}>
        <div
          style={{
            fontFamily: 'Press Start 2P, monospace',
            fontSize: 9,
            color: 'var(--k-red, #B52121)',
            letterSpacing: '0.1em',
            marginBottom: 4,
          }}
        >
          MÉMÉ GISÈLE
        </div>
        <p
          style={{
            fontFamily: 'Patrick Hand, cursive',
            fontSize: 16,
            color: 'var(--k-ink, #1A1A2E)',
            fontStyle: 'italic',
            lineHeight: 1.3,
            margin: 0,
          }}
        >
          {quote.text}
        </p>
        {totalRobots >= 10 && (
          <div
            style={{
              fontSize: 11,
              color: 'var(--k-wood-warm, #6B3F1F)',
              marginTop: 4,
              fontFamily: 'Patrick Hand, cursive',
            }}
          >
            (Mémé a {totalRobots} robots à elle.)
          </div>
        )}
      </div>
    </div>
  );
}

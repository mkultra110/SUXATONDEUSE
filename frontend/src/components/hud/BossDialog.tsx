// BossDialog : speech bubble qui apparait quand on entre sur un boss
// level. Se ferme apres 4s ou click utilisateur.

import { useEffect, useState } from 'react';
import type { BossDef } from '../../utils/bossMaps.js';

const BOSS_QUOTES: Record<string, string[]> = {
  'tournesol-geant': [
    '« Tu crois m\'avoir avec ta tondeuse de petite ?? »',
    '« Mémé l\'a planté en 1972, j\'ai rien à craindre. »',
  ],
  'champignon-mauve': [
    '« Spoilers : je repousse plus vite que tu ne tonds. »',
    '« Ne me mange pas, je suis hallucinogène. »',
  ],
  'cactus-titan': [
    '« Touche-moi pour voir. »',
    '« J\'ai des piques pour toi, ma poule. »',
  ],
  'arbre-ancien': [
    '« J\'étais là avant ta grand-mère. »',
    '« Mes racines te connaissent par cœur. »',
  ],
  'cristal-pur': [
    '« Tellement pur que j\'aveugle Marcel. »',
    '« Mémé m\'a confondu avec un diamant. »',
  ],
  'taupe-geante': [
    '« Tu m\'entends ? Non, j\'suis sourde de naissance. »',
    '« Mes tunnels passent sous ta cuisine, attention. »',
  ],
  'corbeau-noir': [
    '« Croak ! Je vais te piquer toutes tes pieces. »',
    '« On dit "noir comme un corbeau", mais j\'ai du goût. »',
  ],
  'sanglier': [
    '« Charge ! Pousse-toi mon coco. »',
    '« Mes defenses ont fait l\'affaire de plus d\'un robot. »',
  ],
  'mante-religieuse': [
    '« Je prie pour toi. Mais juste avant l\'attaque. »',
    '« Mon mari m\'a dit "non merci" une fois. Une seule. »',
  ],
  'citrouille-mere': [
    '« Boo ! Mes enfants vont tous te grignoter. »',
    '« Joyeux Halloween, mon petit fermier. »',
  ],
  'krampus': [
    '« Ho ho ho... la liste rouge cette annee, c\'est toi. »',
    '« Je brule les sapins. C\'est ma signature. »',
  ],
  'tournesol-mutant': [
    '« Mon cousin t\'a echappé. Pas moi. »',
    '« Mes graines explosent au contact. Bonne chance. »',
  ],
  'arbre-foudre': [
    '« Mille foudres m\'ont rendu plus fort. Mille. »',
    '« Je suis plus electrique que le voisin. »',
  ],
  'robot-anti': [
    '« Je suis ta version corrompue. »',
    '« 01001000 01001001 - bonjour, en binaire. »',
  ],
  'pelouse-sentiente': [
    '« Tu m\'as tonde une fois de trop. »',
    '« Chaque tuile est mon doigt. »',
  ],
  'loup-garou': [
    '« Awooooo ! La pleine lune m\'appelle. »',
    '« J\'etais Marcel le voisin... avant. »',
  ],
  'voisin-robert': [
    '« Vous faites trop de bruit avec vos robots ! »',
    '« Je vais appeler la mairie ! »',
  ],
  'liane-etrangleuse': ['« Viens dans mes bras... »', '« Je serre par amour. »'],
  'fougere-prehistorique': ['« Je suis ne avant ton ancetre. »', '« 4 millions d\'annees. »'],
  'mauve-hypnotique': ['« Regarde dans mes yeux... pas dans mes yeux... »', '« Tu vas oublier... »'],
  'lavande-endormante': ['« Une petite sieste ? »', '« Tres parfumee, je sais. »'],
  'ortie-brulante': ['« Approche pour voir. »', '« Pas de gants, ho ho. »'],
  'limace-monstre': ['« Plus tu tapes, plus je grossis. »', '« Slurp. »'],
  'pomme-vehicule': ['« Vroum vroum... pousse-toi. »', '« Pas de freins ! »'],
  'crapaud-geant': ['« Glouglou. *recrache une tuile* »', '« Mes papilles sont des aimants. »'],
  'mille-pattes': ['« Mille pattes, mille problemes. »', '« Compte-les si tu peux. »'],
  'maman-frelon': ['« Mes petits ont faim ! »', '« BzzzzzzZZZ ! »'],
};

export function BossDialog({ boss, onDismiss }: { boss: BossDef; onDismiss: () => void }) {
  const quotes = BOSS_QUOTES[boss.kind] ?? [boss.tagline];
  const [quoteIdx] = useState(() => Math.floor(Math.random() * quotes.length));
  const quote = quotes[quoteIdx] ?? boss.tagline;

  useEffect(() => {
    const t = setTimeout(onDismiss, 4500);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div
      onClick={onDismiss}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1450,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          maxWidth: 420,
          background: 'var(--color-paper-1)',
          border: `4px solid ${boss.color}`,
          padding: 18,
          textAlign: 'center',
          boxShadow: `0 8px 24px ${boss.color}55, 0 0 32px ${boss.color}88`,
          animation: 'speech-pop 280ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-button)',
            fontSize: 10,
            color: boss.color,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          BOSS
        </div>
        <div
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--color-text-title)',
            textShadow: `2px 2px 0 ${boss.color}`,
            marginBottom: 8,
          }}
        >
          {boss.name}
        </div>
        <p
          className="meme"
          style={{
            fontSize: 16,
            color: 'var(--color-text-body)',
            fontStyle: 'italic',
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          {quote}
        </p>
        <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 10 }}>
          Tap pour passer
        </p>
      </div>
    </div>
  );
}

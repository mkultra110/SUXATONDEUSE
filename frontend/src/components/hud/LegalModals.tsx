// LegalModals : Help / Privacy / Terms / Contact (idees #445 #446 #447 #448).
// Composant reutilisable accepte 'kind' prop.

import { CrossIcon } from '../icons/PixelIcon.js';

export type LegalKind = 'help' | 'privacy' | 'terms' | 'contact';

interface LegalContent {
  title: string;
  body: string[];
}

const CONTENT: Record<LegalKind, LegalContent> = {
  help: {
    title: 'Aide & FAQ',
    body: [
      'Q : Comment gagner du cash ?',
      'R : Achete des robots, ils tondront automatiquement. Tape les tuiles d\'herbe haute pour un bonus manuel.',
      'Q : C\'est quoi le prestige ?',
      'R : Reset ton progres pour gagner des graines de printemps qui boostent ta production future.',
      'Q : Pourquoi mon robot ne bouge pas ?',
      'R : Il a peut-etre une tuile reservee (boss / pierre / arbre). Verifie aussi le BFS path.',
      'Q : C\'est quoi les boss ?',
      'R : Ennemis tous les 10 niveaux de map, HP eleve, recompense en cash.',
      'Q : Mes sauvegardes sont OK ?',
      'R : Auto-save toutes les 30s en localStorage. Exporte-les en JSON depuis Reglages > Sauvegarde.',
      'Q : J\'ai trouve un bug ?',
      'R : Bisous Memé.',
    ],
  },
  privacy: {
    title: 'Politique de confidentialite',
    body: [
      'La Ferme des Tournesols stocke ta progression UNIQUEMENT en localStorage de ton navigateur.',
      'Aucune donnee personnelle n\'est envoyee a un serveur tiers.',
      'Aucun cookie de suivi, aucune publicite, aucun pixel de tracking.',
      'Tu peux exporter ou supprimer ta sauvegarde a tout moment depuis Reglages > Sauvegarde.',
      'Mémé Gisèle respecte ton anonymat.',
    ],
  },
  terms: {
    title: 'Conditions d\'utilisation',
    body: [
      'Ce jeu est un projet pédagogique gratuit.',
      'Il est fourni "tel quel" sans garantie d\'aucune sorte.',
      'L\'auteur n\'est pas responsable de la perte de progression suite a un bug navigateur ou un effacement de donnees.',
      'Pas de revente, pas de crypto, pas de NFT, pas de battle pass paywall.',
      'Soyez gentils avec Marcel.',
    ],
  },
  contact: {
    title: 'Nous contacter',
    body: [
      'Pour toute question, suggestion, ou souvenir d\'une recette de famille :',
      'github.com/anthropics/claude-code/issues',
      '(non-officiel, on va dire que c\'est la boite aux lettres rouge devant la grange)',
      'Mémé repond entre deux fournees de tarte.',
    ],
  },
};

export function LegalModal({ kind, onClose }: { kind: LegalKind | null; onClose: () => void }) {
  if (!kind) return null;
  const c = CONTENT[kind];
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1700,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        cursor: 'pointer',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 480,
          background: 'var(--color-paper-1)',
          border: '4px solid var(--color-wood-5)',
          padding: 18,
          maxHeight: '85vh',
          overflow: 'auto',
          cursor: 'default',
        }}
      >
        <header className="flex items-center justify-between" style={{ marginBottom: 12 }}>
          <h2
            style={{ fontFamily: 'var(--font-title)', fontSize: 18, fontWeight: 700, color: 'var(--color-text-title)', margin: 0 }}
          >
            {c.title}
          </h2>
          <button type="button" onClick={onClose} className="pixel-btn pixel-btn-wood" style={{ padding: 6 }} aria-label="Fermer">
            <CrossIcon size={14} />
          </button>
        </header>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {c.body.map((line, i) => (
            <p key={i} style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0, lineHeight: 1.5 }}>
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

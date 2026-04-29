// MemeGiselePopup : popup cottagecore qui apparait toutes les ~60min
// (avec jitter ±15min) avec une citation rotative de Memé Gisele.
// Auto-dismiss 8s, click pour fermer, max 1 popup a la fois.

import { useEffect, useState } from 'react';
import { audio } from '../../services/audio.js';

const QUOTES = [
  "Bienvenue chez Mémé Gisèle ! Tu vas voir, c'est cosy ici…",
  "Te revoilà, mon p'tit ! J'ai gardé un peu de soupe au chaud.",
  "Ho là là, quelle belle récolte ! Faut bien arroser tout ça.",
  "Mes aïeux, te voilà bien dégourdi ! Continue comme ça, ma poulette.",
  "Couvre-toi bien si tu sors, il fait frisquet dehors !",
  "Tiens, v'là la pluie. Un bon temps pour un chocolat chaud, hein ?",
  "La nuit tombe, mon p'tit. Les étoiles se mettent leurs habits du dimanche.",
  "Allez, on plante avec amour. La terre te le rendra, va.",
  "Eh ben dis donc ! Faut que j'note ça dans mon carnet.",
  "Faut pas pousser Mémé dans les orties !",
  "Petit à petit, l'oiseau fait son nid.",
  "T'sais ce qui ferait du bien ? Une bonne tasse de tisane.",
  "La patience est une fleur qui ne pousse pas dans tous les jardins.",
  "Marcel disait toujours : qui sème la patience récolte la confiture.",
  "J'ai sorti la tarte aux mirabelles du four, viens voir un peu.",
  "Pompon dort encore, mais il t'envoie un ronron.",
];

function MemePortrait({ size = 64 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" shapeRendering="crispEdges" style={{ width: size, height: size, imageRendering: 'pixelated', flexShrink: 0 }}>
      <rect x="8" y="4" width="16" height="3" fill="#7A8691" />
      <rect x="6" y="5" width="20" height="3" fill="#9AA0A6" />
      <rect x="6" y="6" width="2" height="6" fill="#9AA0A6" />
      <rect x="24" y="6" width="2" height="6" fill="#9AA0A6" />
      <rect x="9" y="8" width="14" height="11" fill="#FFD9B5" />
      <rect x="8" y="9" width="16" height="9" fill="#FFD9B5" />
      <rect x="10" y="11" width="4" height="3" fill="#3A1F08" />
      <rect x="11" y="12" width="2" height="1" fill="#A8D8EE" />
      <rect x="18" y="11" width="4" height="3" fill="#3A1F08" />
      <rect x="19" y="12" width="2" height="1" fill="#A8D8EE" />
      <rect x="14" y="12" width="4" height="1" fill="#3A1F08" />
      <rect x="9" y="14" width="2" height="2" fill="#F29BB8" />
      <rect x="21" y="14" width="2" height="2" fill="#F29BB8" />
      <rect x="13" y="16" width="6" height="1" fill="#A22A06" />
      <rect x="14" y="17" width="4" height="1" fill="#A22A06" />
      <rect x="6" y="19" width="20" height="6" fill="#B52121" />
      <rect x="6" y="19" width="20" height="1" fill="#FFD921" />
      <rect x="9" y="21" width="2" height="2" fill="#FFD921" />
      <rect x="14" y="22" width="2" height="2" fill="#FFD921" />
      <rect x="20" y="21" width="2" height="2" fill="#FFD921" />
      <rect x="8" y="25" width="16" height="7" fill="#EBD9A8" />
      <rect x="8" y="25" width="16" height="1" fill="#C9B380" />
    </svg>
  );
}

interface PopupState {
  id: number;
  quote: string;
  visible: boolean;
}

const MIN_INTERVAL_MS = 45 * 60 * 1000;
const MAX_INTERVAL_MS = 75 * 60 * 1000;
const FIRST_DELAY_MS = 60 * 1000;

export function MemeGiselePopup() {
  const [popup, setPopup] = useState<PopupState | null>(null);

  useEffect(() => {
    let cancelled = false;
    let nextTimer: ReturnType<typeof setTimeout> | null = null;

    function schedule(delayMs: number) {
      if (cancelled) return;
      nextTimer = setTimeout(() => {
        if (cancelled) return;
        const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)] ?? QUOTES[0]!;
        const id = Date.now();
        setPopup({ id, quote, visible: true });
        audio.playPurchase();
        setTimeout(() => {
          if (cancelled) return;
          setPopup((p) => (p && p.id === id ? { ...p, visible: false } : p));
          setTimeout(() => {
            if (cancelled) return;
            setPopup((p) => (p && p.id === id ? null : p));
          }, 400);
        }, 8000);
        const nextDelay = MIN_INTERVAL_MS + Math.random() * (MAX_INTERVAL_MS - MIN_INTERVAL_MS);
        schedule(nextDelay);
      }, delayMs);
    }

    schedule(FIRST_DELAY_MS);

    // Listener global "meme-dialogue" emis par GameEffectsLayer pour
    // afficher un dialogue conditionnel (ex: premier prestige, anniversaire).
    function onCustomDialogue(e: Event) {
      const detail = (e as CustomEvent<{ id: string; text: string }>).detail;
      if (!detail) return;
      const id = Date.now();
      setPopup({ id, quote: detail.text, visible: true });
      audio.playPurchase();
      setTimeout(() => {
        if (cancelled) return;
        setPopup((p) => (p && p.id === id ? { ...p, visible: false } : p));
        setTimeout(() => {
          if (cancelled) return;
          setPopup((p) => (p && p.id === id ? null : p));
        }, 400);
      }, 8000);
    }
    window.addEventListener('meme-dialogue', onCustomDialogue);

    return () => {
      cancelled = true;
      if (nextTimer) clearTimeout(nextTimer);
      window.removeEventListener('meme-dialogue', onCustomDialogue);
    };
  }, []);

  if (!popup) return null;

  return (
    <div
      onClick={() => setPopup(null)}
      style={{
        position: 'fixed',
        // 96px = au-dessus de la bottom nav mobile (72px) + 24px de marge.
        // Sur tablet/desktop il n'y a pas de bottom nav, mais cette marge
        // reste cosmetiquement OK.
        bottom: 'calc(96px + env(safe-area-inset-bottom, 0px))',
        left: 'calc(env(safe-area-inset-left, 0px) + 12px)',
        right: 'calc(env(safe-area-inset-right, 0px) + 12px)',
        maxWidth: 340,
        zIndex: 900,
        cursor: 'pointer',
        opacity: popup.visible ? 1 : 0,
        transform: popup.visible ? 'translateX(0)' : 'translateX(-110%)',
        transition: 'transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 400ms ease-out',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
          background: 'var(--color-paper-1)',
          border: '3px solid var(--color-wood-5)',
          padding: 10,
          boxShadow: '0 6px 0 var(--color-wood-5), 0 12px 24px rgba(92, 61, 36, 0.4)',
        }}
      >
        <MemePortrait size={56} />
        <div style={{ flex: 1, position: 'relative' }}>
          <div
            style={{
              fontFamily: 'var(--font-button)',
              fontSize: 9,
              color: 'var(--color-text-muted)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 4,
            }}
          >
            Mémé Gisèle
          </div>
          <p
            className="meme"
            style={{
              fontSize: 16,
              color: 'var(--color-text-body)',
              lineHeight: 1.25,
              margin: 0,
            }}
          >
            « {popup.quote} »
          </p>
        </div>
      </div>
    </div>
  );
}

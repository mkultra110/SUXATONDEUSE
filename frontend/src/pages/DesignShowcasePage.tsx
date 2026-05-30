// Vitrine vivante du design system « Jardin de Poche ».
// Recréation fidèle du handoff Claude Design (Design System.html + app.js),
// scopée sous .jardin pour ne pas impacter le jeu. Route /design.
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import '../design/jardin/jardin.css';

type Theme = 'jour' | 'nuit' | 'sakura' | 'mars';
const THEME_KEY = 'suxa_theme';

const THEMES: Array<{ id: Theme; label: string; sw: string }> = [
  { id: 'jour', label: 'Jour', sw: 'oklch(70% 0.13 138)' },
  { id: 'nuit', label: 'Nuit', sw: 'oklch(40% 0.10 250)' },
  { id: 'sakura', label: 'Sakura', sw: 'oklch(80% 0.14 348)' },
  { id: 'mars', label: 'Mars', sw: 'oklch(64% 0.13 55)' },
];

const NAV: Array<{ id: string; dot: string; label: string }> = [
  { id: 'direction', dot: '🎨', label: 'Direction' },
  { id: 'tokens', dot: '🎟️', label: 'Tokens' },
  { id: 'type', dot: '🔤', label: 'Typographie' },
  { id: 'components', dot: '🧩', label: 'Composants' },
  { id: 'screens', dot: '📱', label: 'Écrans' },
  { id: 'juice', dot: '✨', label: 'Motion & Juice' },
  { id: 'sprites', dot: '👾', label: 'Sprites' },
];

const ROLES: Array<[string, string]> = [
  ['Canvas', '--bg'],
  ['Surface', '--surface'],
  ['Surface sunk', '--surface-2'],
  ['Cadre bois', '--frame'],
  ['Encre', '--ink'],
  ['Encre 2', '--ink-2'],
  ['Ligne', '--line'],
  ['Grass (1°)', '--grass'],
  ['Grass deep', '--grass-deep'],
  ['Sky (2°)', '--sky'],
  ['Coin (récomp)', '--coin'],
  ['Petal (accent)', '--petal'],
  ['Berry (danger)', '--berry'],
  ['Leafglow', '--leafglow'],
  ['Punaise', '--pin'],
];

const SPACES: Array<[string, number]> = [
  ['1', 4],
  ['2', 8],
  ['3', 12],
  ['4', 16],
  ['5', 24],
  ['6', 32],
  ['7', 48],
  ['8', 64],
];
const RADII: Array<[string, string]> = [
  ['xs', '--radius-xs'],
  ['sm', '--radius-sm'],
  ['md', '--radius-md'],
  ['lg', '--radius-lg'],
  ['xl', '--radius-xl'],
  ['pill', '--radius-pill'],
];
const SHADOWS: Array<[string, string]> = [
  ['sm', '--shadow-sm'],
  ['md', '--shadow-md'],
  ['lg', '--shadow-lg'],
];
const CONFETTI_COLORS = ['--grass', '--coin', '--sky', '--petal', '--berry', '--leafglow'];

let uid = 0;
const nextId = () => ++uid;

/* ---------- Démos « juice » ---------- */
interface Floater {
  id: number;
  left: number;
  delay: number;
  text: string;
}
interface Confetti {
  id: number;
  left: number;
  color: string;
  delay: number;
}

function useFloaters() {
  const [items, setItems] = useState<Floater[]>([]);
  const spawn = (text: string, n: number) => {
    const batch: Floater[] = Array.from({ length: n }, (_, i) => ({
      id: nextId(),
      left: 15 + Math.random() * 60,
      delay: i * 60,
      text,
    }));
    setItems((prev) => [...prev, ...batch]);
    batch.forEach((b) =>
      window.setTimeout(
        () => setItems((prev) => prev.filter((x) => x.id !== b.id)),
        1300 + b.delay,
      ),
    );
  };
  return { items, spawn };
}

function useConfetti() {
  const [items, setItems] = useState<Confetti[]>([]);
  const burst = (n: number) => {
    const batch: Confetti[] = Array.from({ length: n }, (_, i) => ({
      id: nextId(),
      left: 40 + (Math.random() - 0.5) * 50,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length]!,
      delay: Math.random() * 120,
    }));
    setItems((prev) => [...prev, ...batch]);
    batch.forEach((b) =>
      window.setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== b.id)), 1100),
    );
  };
  return { items, burst };
}

function FloaterLayer({ items }: { items: Floater[] }) {
  return (
    <>
      {items.map((f) => (
        <span
          key={f.id}
          className="floater"
          style={{ left: `${f.left}%`, bottom: '30%', animationDelay: `${f.delay}ms` }}
        >
          {f.text}
        </span>
      ))}
    </>
  );
}
function ConfettiLayer({ items }: { items: Confetti[] }) {
  return (
    <>
      {items.map((c) => (
        <span
          key={c.id}
          className="confetti"
          style={{
            left: `${c.left}%`,
            top: '30%',
            background: `var(${c.color})`,
            animationDelay: `${c.delay}ms`,
          }}
        />
      ))}
    </>
  );
}

function CoinDemo() {
  const { items, spawn } = useFloaters();
  return (
    <div
      className="cell"
      style={{ cursor: 'pointer', minHeight: 170, overflow: 'hidden' }}
      onClick={() => spawn('+5🪙', 6)}
    >
      <div style={{ fontSize: 40 }}>🪙</div>
      <div style={{ fontWeight: 900 }}>Pluie de pièces</div>
      <div className="cell__label">CLIC · float-up</div>
      <FloaterLayer items={items} />
    </div>
  );
}
function ConfettiDemo() {
  const { items, burst } = useConfetti();
  return (
    <div
      className="cell"
      style={{ cursor: 'pointer', minHeight: 170, overflow: 'hidden' }}
      onClick={() => burst(16)}
    >
      <div style={{ fontSize: 40 }}>🎉</div>
      <div style={{ fontWeight: 900 }}>Célébration</div>
      <div className="cell__label">CLIC · confetti</div>
      <ConfettiLayer items={items} />
    </div>
  );
}
function WiggleDemo() {
  const [k, setK] = useState(0);
  return (
    <div
      className="cell"
      style={{ cursor: 'pointer', minHeight: 170 }}
      onClick={() => setK((v) => v + 1)}
    >
      <div key={k} className={k > 0 ? 'juice-wiggle' : undefined} style={{ fontSize: 40 }}>
        🐞
      </div>
      <div style={{ fontWeight: 900 }}>Wiggle perso</div>
      <div className="cell__label">CLIC · spring</div>
    </div>
  );
}

function PhoneHud() {
  const floaters = useFloaters();
  const confetti = useConfetti();
  const mow = () => {
    floaters.spawn('+45🪙', 4);
    confetti.burst(10);
  };
  return (
    <div className="stack" style={{ gap: 'var(--space-3)', alignItems: 'center' }}>
      <div className="phone">
        <div className="phone__notch" />
        <div className="phone__screen">
          <FloaterLayer items={floaters.items} />
          <ConfettiLayer items={confetti.items} />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: 'var(--space-4) var(--space-3) var(--space-2)',
            }}
          >
            <span className="chip chip--coin">🪙 12 480</span>
            <span className="chip chip--sky">💧 64</span>
          </div>
          <div
            className="scene"
            style={{ margin: '0 var(--space-3)', borderRadius: 'var(--radius-md)' }}
          >
            <div className="scene__sun" />
            <div className="scene__ground" />
            <div
              className="scene__sprite anim-flutter"
              style={{ left: '20%', top: '26%', fontSize: 26 }}
            >
              🦋
            </div>
            <div
              className="scene__sprite anim-hop"
              style={{ left: '34%', bottom: '30%', fontSize: 26 }}
            >
              🐞
            </div>
            <div className="scene__sprite" style={{ left: '64%', bottom: '29%', fontSize: 26 }}>
              🌻
            </div>
            <div className="scene__sprite" style={{ left: '14%', bottom: '30%', fontSize: 24 }}>
              🌷
            </div>
          </div>
          <div style={{ padding: 'var(--space-3)' }}>
            <div className="bar" style={{ marginBottom: 'var(--space-3)' }}>
              <div className="bar__fill" style={{ width: '72%' }} />
              <div className="bar__label">CROISSANCE 72%</div>
            </div>
            <button className="btn btn--block btn--lg" onClick={mow}>
              Tondre 🌿
            </button>
          </div>
        </div>
      </div>
      <span className="cell__label">HUD JARDIN</span>
    </div>
  );
}

function Section({
  id,
  kicker,
  title,
  lead,
  children,
}: {
  id: string;
  kicker: string;
  title: string;
  lead: string;
  children: ReactNode;
}) {
  return (
    <section className="section" id={id}>
      <div className="section__kicker">{kicker}</div>
      <h2 className="section__title">{title}</h2>
      <p className="section__lead">{lead}</p>
      {children}
    </section>
  );
}

const strong: CSSProperties = { color: 'var(--ink)' };

export function DesignShowcasePage() {
  const [theme, setTheme] = useState<Theme>('jour');
  const [active, setActive] = useState('direction');
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY) as Theme | null;
      if (saved) setTheme(saved);
    } catch {
      /* localStorage indisponible */
    }
  }, []);

  const pickTheme = (t: Theme) => {
    setTheme(t);
    try {
      localStorage.setItem(THEME_KEY, t);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    const root = mainRef.current;
    if (!root) return;
    const sections = NAV.map((n) => root.querySelector(`#${n.id}`)).filter(
      (el): el is Element => el !== null,
    );
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) setActive(en.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    sections.forEach((s) => spy.observe(s));
    return () => spy.disconnect();
  }, []);

  return (
    <div className="jardin app" data-theme={theme}>
      {/* ===== SIDEBAR ===== */}
      <aside className="side">
        <div className="brand">
          <div className="brand__logo">🌱</div>
          <div className="brand__name">
            SUXA
            <br />
            TONDEUSE
            <small>Jardin de Poche · DS v1</small>
          </div>
        </div>

        <nav className="nav">
          {NAV.map((n) => (
            <a
              key={n.id}
              className={`nav__link${active === n.id ? ' is-active' : ''}`}
              href={`#${n.id}`}
            >
              <span className="nav__dot">{n.dot}</span> {n.label}
            </a>
          ))}
        </nav>

        <div className="themes">
          <span className="themes__label">THÈME DE CARTE</span>
          <div className="theme-grid">
            {THEMES.map((t) => (
              <button
                key={t.id}
                className={`theme-btn${theme === t.id ? ' is-active' : ''}`}
                onClick={() => pickTheme(t.id)}
              >
                <span className="theme-btn__sw" style={{ background: t.sw }} />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* ===== MAIN ===== */}
      <main className="main" ref={mainRef}>
        <Section
          id="direction"
          kicker="DIRECTION ARTISTIQUE"
          title="Jardin de Poche"
          lead="Un jardin pixel sous cloche, présenté comme un album artisanal. Premium en surface, déconne dans les détails. Marcel la coccinelle et Gisèle le papillon tiennent la boutique."
        >
          <div className="grid grid--2">
            <div className="card">
              <h3 className="card__title">LE PITCH VISUEL</h3>
              <div
                className="stack"
                style={{ fontWeight: 600, color: 'var(--ink-2)', lineHeight: 1.55 }}
              >
                <p style={{ margin: 0 }}>
                  <strong style={strong}>Papier &amp; bois.</strong> Tout vit sur du kraft chaud,
                  dans des cadres bois à grosse bordure. Les souvenirs s'épinglent comme des
                  polaroids.
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={strong}>Le hero respire.</strong> Une scène pixel jour/nuit/météo,
                  le seul endroit « plein écran ». Le reste documente.
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={strong}>Le juice est roi.</strong> Chaque action pop, gicle des
                  pièces, fait wiggle un perso. La célébration est un composant, pas un hasard.
                </p>
              </div>
            </div>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div
                className="scene"
                style={{ border: 0, borderRadius: 0, boxShadow: 'none', aspectRatio: '16/11' }}
              >
                <div className="scene__sun" />
                <div className="scene__ground" />
                <div className="scene__sprite anim-flutter" style={{ left: '18%', top: '30%' }}>
                  🦋
                </div>
                <div className="scene__sprite" style={{ left: '60%', top: '24%' }}>
                  ☁️
                </div>
                <div className="scene__sprite anim-hop" style={{ left: '30%', bottom: '34%' }}>
                  🐞
                </div>
                <div className="scene__sprite" style={{ left: '62%', bottom: '33%' }}>
                  🌻
                </div>
                <div className="scene__sprite" style={{ left: '74%', bottom: '34%' }}>
                  🌷
                </div>
                <div className="scene__sprite" style={{ left: '12%', bottom: '34%' }}>
                  🌱
                </div>
              </div>
            </div>
          </div>

          <h3 className="h3">LES 5 SIGNATURES</h3>
          <div className="grid grid--3">
            {[
              ['🌻', 'Jardin vivant', 'HERO · JOUR/NUIT'],
              ['📌', 'Album scrapbook', 'CADRES · POLAROIDS'],
              ['🐞', 'Robots-animaux', 'MARCEL · GISÈLE'],
              ['🎉', 'Juice & pièces', 'POP · CONFETTIS'],
              ['🏡', 'Maison de mémé', 'PERSOS MEME'],
            ].map(([e, t, l]) => (
              <div className="cell" key={t}>
                <div style={{ fontSize: 30 }}>{e}</div>
                <div style={{ fontWeight: 800 }}>{t}</div>
                <div className="cell__label">{l}</div>
              </div>
            ))}
            <div
              className="cell"
              style={{ background: 'var(--grass-soft)', borderColor: 'var(--grass)' }}
            >
              <div style={{ fontSize: 30 }}>🎚️</div>
              <div style={{ fontWeight: 800, color: 'var(--grass-deep)' }}>Change de thème →</div>
              <div className="cell__label">TESTE NUIT / MARS</div>
            </div>
          </div>
        </Section>

        <Section
          id="tokens"
          kicker="FONDATIONS"
          title="Tokens"
          lead="Une seule couche sémantique. Les 4 thèmes ne réécrivent que les rôles de couleur — type, espace, rayons et motion restent constants."
        >
          <h3 className="h3">COULEURS — RÔLES</h3>
          <div className="swatches">
            {ROLES.map(([name, v]) => (
              <div className="swatch" key={v}>
                <div className="swatch__chip" style={{ background: `var(${v})` }} />
                <div className="swatch__meta">
                  <div className="swatch__name">{name}</div>
                  <div className="swatch__var">{v}</div>
                </div>
              </div>
            ))}
          </div>

          <h3 className="h3">ESPACEMENTS — base 8pt</h3>
          <div className="card">
            <div className="space-demo">
              {SPACES.map(([n, px]) => (
                <div key={n}>
                  <div className="space-demo__bar" style={{ height: px }} />
                  <div className="space-demo__label">
                    {n}
                    <br />
                    {px}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <h3 className="h3">RAYONS</h3>
          <div className="row">
            {RADII.map(([n, v]) => (
              <div className="demo-box" key={n} style={{ borderRadius: `var(${v})` }}>
                {n}
              </div>
            ))}
          </div>

          <h3 className="h3">OMBRES — décalage net « papier découpé »</h3>
          <div className="row" style={{ gap: 'var(--space-6)' }}>
            {SHADOWS.map(([n, v]) => (
              <div
                className="demo-box"
                key={n}
                style={{ boxShadow: `var(${v})`, borderRadius: 'var(--radius-md)' }}
              >
                {n}
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="type"
          kicker="FONDATIONS"
          title="Typographie"
          lead="Silkscreen pour tout ce qui « crie » (titres, HUD, prix). Nunito pour tout ce qui se lit (corps, dialogues, tooltips). Deux familles, deux jobs."
        >
          <div className="grid grid--2">
            <div className="card">
              <h3 className="card__title">SILKSCREEN — DISPLAY</h3>
              <div style={{ fontFamily: 'var(--font-pixel)', lineHeight: 1.4 }}>
                <div style={{ fontSize: 'var(--text-2xl)' }}>+1 250 🪙</div>
                <div style={{ fontSize: 'var(--text-lg)', marginTop: 8 }}>NIVEAU 7</div>
                <div style={{ fontSize: 'var(--text-sm)', marginTop: 8, color: 'var(--ink-2)' }}>
                  BOUTIQUE DE MÉMÉ
                </div>
              </div>
              <p className="muted-note" style={{ marginTop: 'var(--space-4)' }}>
                Pixel net, lisible. Remplace Press Start 2P : moins « cheap », meilleure densité.
              </p>
            </div>
            <div className="card">
              <h3 className="card__title">NUNITO — CORPS</h3>
              <p style={{ fontWeight: 800, fontSize: 'var(--text-lg)', margin: '0 0 8px' }}>
                Marcel a encore tondu le mauvais gazon.
              </p>
              <p style={{ fontWeight: 600, color: 'var(--ink-2)', margin: 0, lineHeight: 1.55 }}>
                Ses terminaisons arrondies prolongent le côté kawaii sans casser la lisibilité à
                14px sur mobile. Gisèle approuve, en battant des ailes.
              </p>
              <p className="muted-note" style={{ marginTop: 'var(--space-4)' }}>
                2 familles, 6 graisses au total. Léger à charger, gros caractère.
              </p>
            </div>
          </div>

          <h3 className="h3">ÉCHELLE — ratio ~1.25</h3>
          <div className="card">
            {(
              [
                ['4XL/49', 'var(--text-4xl)', 'SUXA', 'var(--font-pixel)'],
                ['2XL/31', 'var(--text-2xl)', 'Prestige', 'var(--font-pixel)'],
                ['XL/25', 'var(--text-xl)', 'Titre de carte', undefined],
                ['LG/20', 'var(--text-lg)', 'Sous-titre lead', undefined],
                ['MD/16', 'var(--text-md)', 'Corps par défaut — la base du jeu.', undefined],
                ['SM/14', 'var(--text-sm)', 'Texte secondaire, tooltips, légendes.', undefined],
              ] as Array<[string, string, string, string | undefined]>
            ).map(([tag, size, text, font]) => (
              <div className="type-row" key={tag}>
                <span className="type-row__tag">{tag}</span>
                <span
                  style={{ fontSize: size, fontFamily: font, fontWeight: font ? undefined : 800 }}
                >
                  {text}
                </span>
              </div>
            ))}
            <div className="type-row" style={{ border: 0 }}>
              <span className="type-row__tag">XS/12</span>
              <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 'var(--text-xs)' }}>
                LABELS PIXEL · CHIPS
              </span>
            </div>
          </div>
        </Section>

        <Section
          id="components"
          kicker="BIBLIOTHÈQUE"
          title="Composants & états"
          lead="Chaque pièce avec ses états réels : repos, survol, pressé, désactivé. Le bouton s'enfonce de 3px sur tap — c'est le tactile signature."
        >
          <h3 className="h3">BOUTONS</h3>
          <div className="card">
            <div className="row" style={{ marginBottom: 'var(--space-5)' }}>
              <button className="btn">Tondre 🌿</button>
              <button className="btn btn--coin">
                Acheter <span className="btn__badge">250🪙</span>
              </button>
              <button className="btn btn--sky">Infos</button>
              <button className="btn btn--berry">Reset</button>
              <button className="btn btn--ghost">Annuler</button>
              <button className="btn" disabled>
                Verrouillé 🔒
              </button>
            </div>
            <div className="row">
              <button className="btn btn--lg">Grand CTA</button>
              <button className="btn">Défaut</button>
              <button className="btn btn--sm">Petit</button>
            </div>
          </div>

          <h3 className="h3">CHIPS & TAGS — ressources et statuts</h3>
          <div className="card">
            <div className="row" style={{ marginBottom: 'var(--space-4)' }}>
              <span className="chip chip--coin">🪙 12 480</span>
              <span className="chip chip--sky">💧 64</span>
              <span className="chip chip--petal">🌸 8</span>
              <span className="chip">⭐ Niv 7</span>
            </div>
            <div className="row">
              <span className="tag">Possédé</span>
              <span className="tag tag--new">Nouveau</span>
              <span className="tag tag--rare">Rare</span>
              <span className="tag tag--locked">🔒 Verrouillé</span>
            </div>
          </div>

          <h3 className="h3">BARRES DE PROGRESSION</h3>
          <div className="card stack" style={{ gap: 'var(--space-4)' }}>
            <div className="bar">
              <div className="bar__fill" style={{ width: '72%' }} />
              <div className="bar__label">CROISSANCE 72%</div>
            </div>
            <div className="bar">
              <div className="bar__fill bar__fill--xp" style={{ width: '45%' }} />
              <div className="bar__label">XP 45/100</div>
            </div>
            <div className="bar bar--xl">
              <div className="bar__fill bar__fill--coin" style={{ width: '90%' }} />
              <div className="bar__label">COFFRE 90%</div>
            </div>
          </div>

          <h3 className="h3">CARTES & POLAROIDS — l'album</h3>
          <div className="grid grid--4">
            {[
              ['🐞', 'Marcel', undefined],
              [
                '🦋',
                'Gisèle',
                'radial-gradient(circle at 35% 30%,oklch(85% 0.1 250),oklch(60% 0.2 250))',
              ],
              [
                '🐌',
                'Robert',
                'radial-gradient(circle at 35% 30%,oklch(88% 0.1 130),oklch(60% 0.18 140))',
              ],
              ['🏡', 'Chez mémé', undefined],
            ].map(([emoji, cap, pinBg]) => (
              <div className="polaroid" key={cap}>
                <span className="pin" style={pinBg ? { background: pinBg } : undefined} />
                <div
                  className="polaroid__img"
                  style={{ display: 'grid', placeItems: 'center', fontSize: 48 }}
                >
                  {emoji}
                </div>
                <div className="polaroid__cap">{cap}</div>
              </div>
            ))}
          </div>

          <h3 className="h3">TOASTS & FEEDBACK</h3>
          <div className="grid grid--2">
            <div className="toast">
              <span className="toast__emoji">🌿</span>
              <div>
                <div>Gazon tondu !</div>
                <div className="toast__sub">+45 🪙 · joli travail</div>
              </div>
            </div>
            <div className="toast toast--coin">
              <span className="toast__emoji">💰</span>
              <div>
                <div>Coffre plein</div>
                <div className="toast__sub">Récupère 1 200 🪙</div>
              </div>
            </div>
            <div className="toast toast--berry">
              <span className="toast__emoji">🐞</span>
              <div>
                <div>Marcel s'est perdu</div>
                <div className="toast__sub">Va le chercher au potager</div>
              </div>
            </div>
            <div className="toast toast--sky">
              <span className="toast__emoji">🌧️</span>
              <div>
                <div>Il pleut sur le jardin</div>
                <div className="toast__sub">Croissance ×2 pendant 30s</div>
              </div>
            </div>
          </div>
        </Section>

        <Section
          id="screens"
          kicker="EN CONDITIONS"
          title="Aperçu écrans"
          lead="Les composants assemblés, dans un vrai cadre mobile. Tout réagit au thème actif — change-le pour voir le jardin passer en Nuit ou sur Mars."
        >
          <div className="row" style={{ gap: 'var(--space-7)', alignItems: 'flex-start' }}>
            <PhoneHud />

            <div className="stack" style={{ gap: 'var(--space-3)', alignItems: 'center' }}>
              <div className="phone">
                <div className="phone__notch" />
                <div className="phone__screen">
                  <div
                    className="panel"
                    style={{
                      border: 0,
                      borderRadius: 0,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <div className="panel__head">
                      BOUTIQUE 🛒<span style={{ fontSize: 'var(--text-xs)' }}>🪙 12 480</span>
                    </div>
                    <div
                      className="panel__body stack"
                      style={{ gap: 'var(--space-3)', overflow: 'auto' }}
                    >
                      {[
                        ['🐞', 'Marcel Pro', 'new', 'Nouveau', '250🪙', false],
                        ['🦋', 'Gisèle Or', 'rare', 'Rare', '900🪙', false],
                        ['🛸', 'Tondeuse Mars', 'locked', '🔒 Niv 12', '🔒', true],
                      ].map(([emoji, name, tagCls, tagTxt, price, locked]) => (
                        <div
                          key={name as string}
                          className="card card--inset"
                          style={{
                            display: 'flex',
                            gap: 'var(--space-3)',
                            alignItems: 'center',
                            padding: 'var(--space-3)',
                            opacity: locked ? 0.7 : 1,
                          }}
                        >
                          <div style={{ fontSize: 34 }}>{emoji}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 900 }}>{name}</div>
                            <span className={`tag tag--${tagCls}`}>{tagTxt}</span>
                          </div>
                          <button
                            className={`btn btn--sm${locked ? '' : ' btn--coin'}`}
                            disabled={locked as boolean}
                          >
                            {price}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <span className="cell__label">BOUTIQUE DE MÉMÉ</span>
            </div>

            <div className="stack" style={{ gap: 'var(--space-3)', alignItems: 'center' }}>
              <div className="phone">
                <div className="phone__notch" />
                <div
                  className="phone__screen"
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 'var(--space-5)',
                    textAlign: 'center',
                    gap: 'var(--space-4)',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-pixel)',
                      fontSize: 'var(--text-lg)',
                      color: 'var(--grass-deep)',
                    }}
                  >
                    PRESTIGE
                  </div>
                  <div style={{ fontSize: 64 }} className="anim-hop">
                    🏆
                  </div>
                  <p style={{ fontWeight: 800, margin: 0 }}>
                    Recommence le jardin pour des{' '}
                    <strong style={{ color: 'var(--coin-deep)' }}>graines d'or</strong> permanentes.
                  </p>
                  <div className="bar bar--xl" style={{ width: '100%' }}>
                    <div className="bar__fill bar__fill--coin" style={{ width: '90%' }} />
                    <div className="bar__label">+18 🌟 GRAINES</div>
                  </div>
                  <button className="btn btn--lg btn--block">Renaître 🌱</button>
                  <p className="muted-note" style={{ margin: 0 }}>
                    « Mémé dit que c'est bon pour le sol. »
                  </p>
                </div>
              </div>
              <span className="cell__label">PRESTIGE</span>
            </div>
          </div>
        </Section>

        <Section
          id="juice"
          kicker="SENSATIONS"
          title="Motion & Juice"
          lead="Le ressenti du jeu vit ici. Clique pour déclencher — chaque démo est le vrai timing et la vraie courbe d'animation utilisés en jeu."
        >
          <div className="grid grid--3">
            <CoinDemo />
            <ConfettiDemo />
            <WiggleDemo />
          </div>

          <h3 className="h3">VOCABULAIRE D'ANIMATION</h3>
          <div className="card stack" style={{ gap: 'var(--space-3)' }}>
            {[
              ['--dur-1 90ms', 'tap / enfoncement bouton'],
              ['--dur-2 160ms', "survol & changements d'état"],
              ['--dur-3 280ms', 'apparition (pop-in, toast)'],
              ['--dur-4 480ms', 'célébration & remplissage de barre'],
              ['--ease-spring', 'rebond/overshoot — la courbe « juice » signature'],
              ['--ease-out', 'mouvements calmes et naturels (scène, barres)'],
            ].map(([code, desc]) => (
              <div className="spec" key={code}>
                <code>{code}</code> {desc}
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="sprites"
          kicker="PRODUCTION"
          title="Specs sprites pixel-art"
          lead="On dessine les sprites nous-mêmes (génération IA + retouche). Voici la grille, les tailles et le nommage à respecter pour que tout s'aligne au pixel près."
        >
          <div className="grid grid--2">
            <div className="card">
              <h3 className="card__title">GRILLE & TAILLES</h3>
              <div
                className="stack"
                style={{ gap: 'var(--space-3)', fontWeight: 700, color: 'var(--ink-2)' }}
              >
                {[
                  ['BASE 16×16', 'tuiles de sol, items de boutique'],
                  ['32×32', 'persos (Marcel, Gisèle, Robert)'],
                  ['48×48', 'héros / boss de jardin'],
                  ['SCALE ×3', 'rendu écran (image-rendering: pixelated)'],
                  ['PALETTE ≤ 16', 'couleurs par sprite, issues des tokens'],
                ].map(([code, desc]) => (
                  <div className="spec" key={code}>
                    <code>{code}</code> {desc}
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <h3 className="card__title">SPRITE SHEETS</h3>
              <div
                className="stack"
                style={{ gap: 'var(--space-3)', fontWeight: 700, color: 'var(--ink-2)' }}
              >
                {[
                  ['marcel_idle.png', '4 frames · 32×128'],
                  ['marcel_walk.png', '6 frames · 32×192'],
                  ['gisele_fly.png', '4 frames · 32×128'],
                  ['fx_coinpop.png', '5 frames · 16×80'],
                  ['fx_confetti.png', '8 frames · 16×128'],
                ].map(([code, desc]) => (
                  <div className="spec" key={code}>
                    <code>{code}</code> {desc}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <h3 className="h3">CONVENTION DE NOMMAGE</h3>
          <div className="card">
            <div className="spec" style={{ fontSize: 'var(--text-sm)' }}>
              <code>{'{sujet}_{action}_{variante}.png'}</code>
            </div>
            <p className="muted-note" style={{ marginTop: 'var(--space-3)' }}>
              minuscules · snake_case · une feuille par animation · frames empilées verticalement ·
              fond transparent · ancrage bas-centre.
            </p>
          </div>

          <div
            className="card"
            style={{
              marginTop: 'var(--space-5)',
              background: 'var(--grass-soft)',
              borderColor: 'var(--grass)',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: 'var(--text-sm)',
                color: 'var(--grass-deep)',
                margin: '0 0 var(--space-2)',
              }}
            >
              FIN DE LA VITRINE 🌱
            </p>
            <p className="muted-note" style={{ margin: 0 }}>
              Change de thème dans la barre latérale · clique les démos de juice · enfonce les
              boutons.
            </p>
          </div>
        </Section>
      </main>
    </div>
  );
}

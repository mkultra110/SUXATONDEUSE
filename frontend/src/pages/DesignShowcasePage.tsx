// Vitrine vivante du design system SUXA TONDEUSE.
// Tokens + composants + états, cliquable. Route /design.
// Auto-contenue (scope .ds-root) : n'altère pas le rendu du jeu.
import { useState } from 'react';
import type { ReactNode } from 'react';
import '../design/design-system.css';
import { Button, Card, Chip, Panel, ProgressBar, Stat, Toast, cx } from '../design/ui/index.js';
import type { CardShine } from '../design/ui/index.js';

const COLOR_GROUPS: Array<{ title: string; vars: string[] }> = [
  {
    title: 'Herbe',
    vars: [
      '--color-grass-1',
      '--color-grass-2',
      '--color-grass-3',
      '--color-grass-4',
      '--color-grass-5',
      '--color-grass-6',
      '--color-grass-7',
    ],
  },
  {
    title: 'Bois / papier',
    vars: [
      '--color-paper-1',
      '--color-paper-2',
      '--color-wood-2',
      '--color-wood-3',
      '--color-wood-4',
      '--color-wood-5',
    ],
  },
  {
    title: 'Métal robot',
    vars: [
      '--color-metal-1',
      '--color-metal-2',
      '--color-metal-3',
      '--color-metal-4',
      '--color-metal-5',
    ],
  },
  {
    title: 'Accents',
    vars: ['--ds-accent', '--ds-danger', '--ds-success', '--ds-premium', '--ds-info'],
  },
];

const TYPE_SCALE: Array<{ token: string; size: string }> = [
  { token: '--text-3xl', size: '40px' },
  { token: '--text-2xl', size: '32px' },
  { token: '--text-xl', size: '24px' },
  { token: '--text-lg', size: '20px' },
  { token: '--text-base', size: '16px' },
  { token: '--text-sm', size: '14px' },
  { token: '--text-xs', size: '12px' },
];

const SPACES = ['--space-1', '--space-2', '--space-3', '--space-4', '--space-5', '--space-6'];
const RADII = ['--radius-sm', '--radius-md', '--radius-lg', '--radius-xl', '--radius-pill'];
const ELEVATIONS = ['--elev-1', '--elev-2', '--elev-3'];
const SHINES: CardShine[] = ['none', 'bronze', 'silver', 'gold', 'diamond'];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: 'var(--space-7)' }}>
      <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)' }}>{title}</h2>
      {children}
    </section>
  );
}

export function DesignShowcasePage() {
  const [coins, setCoins] = useState(1234);
  const [pop, setPop] = useState(false);
  const [progress, setProgress] = useState(0.45);
  const [toasts, setToasts] = useState<Array<{ id: number; tone: 'success' | 'danger' | 'info' }>>(
    [],
  );

  const earn = () => {
    setCoins((c) => c + Math.floor(50 + Math.random() * 500));
    setPop(true);
    window.setTimeout(() => setPop(false), 220);
  };

  const spawnToast = (tone: 'success' | 'danger' | 'info') => {
    const id = Date.now();
    setToasts((t) => [...t, { id, tone }].slice(-4));
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  };

  return (
    <div
      className="ds-root"
      style={{ minHeight: '100vh', padding: 'var(--space-5)', boxSizing: 'border-box' }}
    >
      <header style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)' }}>SUXA TONDEUSE — Design System</h1>
        <p
          className="ds-handwritten"
          style={{ fontSize: 'var(--text-lg)', color: 'var(--ds-text-muted)' }}
        >
          Vitrine vivante des tokens, composants et états. Tout est piloté par les tokens CSS.
        </p>
      </header>

      <Section title="Couleurs">
        {COLOR_GROUPS.map((group) => (
          <div key={group.title} style={{ marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-2)' }}>
              {group.title}
            </h3>
            <div
              className="ds-grid"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))' }}
            >
              {group.vars.map((v) => (
                <div key={v} className="ds-swatch">
                  <div className="ds-swatch__chip" style={{ background: `var(${v})` }} />
                  <span className="ds-swatch__label">
                    {v.replace('--color-', '').replace('--ds-', '')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Section>

      <Section title="Typographie">
        {TYPE_SCALE.map((t) => (
          <div
            key={t.token}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 'var(--space-4)',
              marginBottom: 'var(--space-2)',
            }}
          >
            <span className="ds-numeric" style={{ width: 110, color: 'var(--ds-text-muted)' }}>
              {t.token} · {t.size}
            </span>
            <span className="ds-title" style={{ fontSize: `var(${t.token})` }}>
              Tondeuse {t.size}
            </span>
          </div>
        ))}
        <p style={{ marginTop: 'var(--space-3)' }}>
          Corps <strong>Nunito</strong> (lisible, premium-cozy) ·{' '}
          <span className="ds-numeric">chiffres VT323 1 234 567</span> ·{' '}
          <span className="ds-handwritten">légende manuscrite Patrick Hand</span>
        </p>
      </Section>

      <Section title="Espacements · Rayons · Élévations">
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-3)',
            flexWrap: 'wrap',
            marginBottom: 'var(--space-4)',
          }}
        >
          {SPACES.map((s) => (
            <div key={s} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: `var(${s})`,
                  height: `var(${s})`,
                  background: 'var(--ds-accent)',
                  borderRadius: 2,
                }}
              />
              <span className="ds-numeric" style={{ fontSize: 11 }}>
                {s.replace('--space-', 'sp')}
              </span>
            </div>
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-4)',
            flexWrap: 'wrap',
            marginBottom: 'var(--space-4)',
          }}
        >
          {RADII.map((r) => (
            <div key={r} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: 56,
                  height: 40,
                  background: 'var(--color-wood-3)',
                  borderRadius: `var(${r})`,
                  border: '2px solid var(--ds-panel-edge)',
                }}
              />
              <span className="ds-numeric" style={{ fontSize: 11 }}>
                {r.replace('--radius-', '')}
              </span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          {ELEVATIONS.map((e) => (
            <div
              key={e}
              style={{
                width: 80,
                height: 48,
                background: 'var(--ds-surface)',
                borderRadius: 4,
                boxShadow: `var(${e})`,
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <span className="ds-numeric" style={{ fontSize: 11 }}>
                {e.replace('--', '')}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Boutons (variantes · tailles · états)">
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-3)',
            flexWrap: 'wrap',
            marginBottom: 'var(--space-3)',
          }}
        >
          <Button variant="primary">Acheter</Button>
          <Button variant="secondary">Secondaire</Button>
          <Button variant="premium">Premium 💎</Button>
          <Button variant="danger">Reset</Button>
          <Button variant="ghost">Fantôme</Button>
          <Button variant="primary" disabled>
            Indisponible
          </Button>
        </div>
        <div
          style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}
        >
          <Button variant="primary" size="sm">
            Petit
          </Button>
          <Button variant="primary" size="md">
            Moyen
          </Button>
          <Button variant="primary" size="lg">
            Grand
          </Button>
        </div>
      </Section>

      <Section title="Panneaux & cartes">
        <div
          className="ds-grid"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}
        >
          <Panel nailed>
            <h3 style={{ fontSize: 'var(--text-lg)' }}>Panneau épinglé</h3>
            <p>Papier cottage + clous rouges aux coins (signature).</p>
          </Panel>
          {SHINES.map((shine) => (
            <Card key={shine} shine={shine}>
              <h3 style={{ fontSize: 'var(--text-base)', textTransform: 'capitalize' }}>
                Robot {shine}
              </h3>
              <p className="ds-numeric">brillance : {shine}</p>
              <Button variant="primary" size="sm" className="ds-btn--block">
                Acheter
              </Button>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Chips & barres de progression">
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-2)',
            flexWrap: 'wrap',
            marginBottom: 'var(--space-4)',
          }}
        >
          <Chip>Neutre</Chip>
          <Chip tone="accent">Niveau 12</Chip>
          <Chip tone="success">+1 200/s</Chip>
          <Chip tone="danger">Hors-ligne</Chip>
          <Chip tone="premium">Légendaire</Chip>
        </div>
        <div
          style={{ maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}
        >
          <ProgressBar value={progress} label="XP" />
          <ProgressBar value={progress} gold label="Prestige" />
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Button size="sm" onClick={() => setProgress((p) => Math.max(0, p - 0.1))}>
              −10%
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => setProgress((p) => Math.min(1, p + 0.1))}
            >
              +10%
            </Button>
          </div>
        </div>
      </Section>

      <Section title="Juice — compteur & toasts (cliquable)">
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-4)',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginBottom: 'var(--space-4)',
          }}
        >
          <Stat label="Cash" value={`${coins.toLocaleString('fr-FR')} €`} pop={pop} />
          <Button variant="primary" size="lg" onClick={earn}>
            Tondre ! 🌱
          </Button>
        </div>
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-2)',
            flexWrap: 'wrap',
            marginBottom: 'var(--space-3)',
          }}
        >
          <Button size="sm" onClick={() => spawnToast('success')}>
            Toast succès
          </Button>
          <Button size="sm" onClick={() => spawnToast('info')}>
            Toast info
          </Button>
          <Button size="sm" variant="danger" onClick={() => spawnToast('danger')}>
            Toast erreur
          </Button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {toasts.map((t) => (
            <Toast
              key={t.id}
              tone={t.tone}
              icon={t.tone === 'success' ? '✅' : t.tone === 'danger' ? '⚠️' : 'ℹ️'}
            >
              {t.tone === 'success'
                ? 'Succès débloqué : Première tonte !'
                : t.tone === 'danger'
                  ? 'Sauvegarde refusée par l’anti-cheat.'
                  : 'Nouveau thème de carte : Sakura 🌸'}
            </Toast>
          ))}
          {toasts.length === 0 && (
            <span className={cx('ds-numeric')} style={{ color: 'var(--ds-text-muted)' }}>
              (clique un bouton ci-dessus)
            </span>
          )}
        </div>
      </Section>

      <footer
        style={{
          marginTop: 'var(--space-7)',
          color: 'var(--ds-text-muted)',
          fontSize: 'var(--text-sm)',
        }}
      >
        Design system v2 · tokens uniques dans <code>styles/tokens.css</code> · composants dans{' '}
        <code>design/ui</code>. Respecte <code>prefers-reduced-motion</code>.
      </footer>
    </div>
  );
}

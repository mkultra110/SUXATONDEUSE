// Panel prestige : hero centre avec rayons solaires + halo gold
// + 3 KPI cards + projection de graines + bouton rouge confirmation.

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { calculatePrestigeSeeds, FIRST_PRESTIGE_THRESHOLD_CASH } from '@robomow/shared';
import { useGameStore } from '../../stores/gameStore.js';
import { formatBig } from '../../game/engine/bigNumber.js';
import { SeedIcon, StarIcon } from '../icons/PixelIcon.js';
import { PrestigeCutscene } from './PrestigeCutscene.js';

export function PrestigePanel() {
  const { t } = useTranslation();
  const totalCash = useGameStore((s) => s.totalCashEarned);
  const prestigePoints = useGameStore((s) => s.prestigePoints);
  const prestigeLevel = useGameStore((s) => s.prestigeLevel);
  const totalPrestiges = useGameStore((s) => s.totalPrestiges);
  const triggerPrestige = useGameStore((s) => s.triggerPrestige);
  const [confirming, setConfirming] = useState(false);
  const [cutscene, setCutscene] = useState<{ seeds: bigint; prestigeNum: number } | null>(null);

  const totalCashBigInt = BigInt(totalCash.floor().toString());
  const seedsAlreadySpent = BigInt(prestigePoints.floor().toString());
  const projectedSeeds = calculatePrestigeSeeds(totalCashBigInt, seedsAlreadySpent);
  const eligible = totalCashBigInt >= FIRST_PRESTIGE_THRESHOLD_CASH;

  function handlePrestige() {
    const gained = triggerPrestige();
    if (gained > 0n) {
      setConfirming(false);
      setCutscene({ seeds: gained, prestigeNum: totalPrestiges + 1 });
    }
  }

  return (
    <aside className="flex flex-col gap-3 max-h-[80vh]">
      <div className="overflow-y-auto pr-1 flex flex-col gap-3" style={{ maxHeight: 'calc(80vh)' }}>
        {/* Hero gold avec rayons rotatifs derriere le titre */}
        <div
          style={{
            position: 'relative',
            background: 'var(--color-paper-1)',
            border: '3px solid var(--color-wood-5)',
            borderRadius: 6,
            padding: '24px 16px',
            textAlign: 'center',
            overflow: 'hidden',
            boxShadow:
              'inset 0 0 0 1px var(--color-paper-3), 0 4px 0 var(--color-wood-5), 0 6px 12px rgba(92,61,36,0.4)',
          }}
        >
          {/* Rayons solaires SVG en fond */}
          <svg
            viewBox="0 0 200 200"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 200,
              height: 200,
              transform: 'translate(-50%, -50%)',
              opacity: 0.18,
              animation: 'sun-rays-spin 60s linear infinite',
              pointerEvents: 'none',
            }}
            aria-hidden
          >
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const x = 100 + Math.cos(angle) * 90;
              const y = 100 + Math.sin(angle) * 90;
              return (
                <line
                  key={i}
                  x1="100"
                  y1="100"
                  x2={x}
                  y2={y}
                  stroke="var(--color-accent-gold)"
                  strokeWidth="3"
                  strokeLinecap="square"
                />
              );
            })}
          </svg>

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <SeedIcon size={48} />
            <h2
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: 22,
                fontWeight: 700,
                color: 'var(--color-text-title)',
                margin: 0,
                textShadow: '2px 2px 0 var(--color-paper-2), 4px 4px 0 var(--color-accent-gold)',
              }}
            >
              {t('prestige.title')}
            </h2>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, maxWidth: 240 }}>
              {t('prestige.subtitle')}
            </p>
          </div>
        </div>

        {/* 3 KPI cards */}
        <div className="grid grid-cols-2 gap-2">
          <KpiCard label={t('prestige.level')} value={prestigeLevel} accent="var(--color-accent-purple)" />
          <KpiCard label={t('prestige.totalPrestiges')} value={totalPrestiges} accent="var(--color-grass-5)" />
          <div className="col-span-2 panel-9" style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="nail-bl" />
            <span className="nail-br" />
            <SeedIcon size={32} />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: 'var(--font-button)',
                  fontSize: 10,
                  color: 'var(--color-text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                {t('prestige.seedsBank')}
              </div>
              <div
                className="numeric"
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: 'var(--color-accent-purple)',
                  textShadow: '1px 1px 0 var(--color-wood-5)',
                }}
              >
                {formatBig(prestigePoints)}
              </div>
            </div>
          </div>
        </div>

        {/* Projection */}
        <div
          className="panel-paper"
          style={{ padding: 14, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 4 }}
        >
          <span
            style={{
              fontFamily: 'var(--font-button)',
              fontSize: 10,
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            {t('prestige.preview')}
          </span>
          <div className="flex items-center justify-center gap-2">
            <SeedIcon size={28} />
            <span
              className="numeric"
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: 'var(--color-accent-gold)',
                textShadow: '2px 2px 0 var(--color-wood-5)',
              }}
            >
              +{formatBig(projectedSeeds.toString())}
            </span>
          </div>
        </div>

        {!eligible && (
          <p style={{ fontSize: 11, color: 'var(--color-text-muted)', textAlign: 'center', fontStyle: 'italic' }}>
            {t('prestige.notEligible', {
              target: formatBig(FIRST_PRESTIGE_THRESHOLD_CASH.toString()),
              current: formatBig(totalCash),
            })}
          </p>
        )}

        {!confirming ? (
          <button
            type="button"
            disabled={!eligible || projectedSeeds <= 0n}
            onClick={() => setConfirming(true)}
            className="pixel-btn pixel-btn-danger"
            style={{ fontSize: 14, padding: '14px 16px' }}
          >
            <StarIcon size={16} />
            {t('prestige.action')}
          </button>
        ) : (
          <div className="panel-9" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10, borderColor: 'var(--color-accent-red)' }}>
            <span className="nail-bl" />
            <span className="nail-br" />
            <p style={{ fontSize: 12, fontWeight: 700, textAlign: 'center', color: 'var(--color-text-title)', margin: 0 }}>
              {t('prestige.confirmWarning')}
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={handlePrestige} className="pixel-btn pixel-btn-danger" style={{ flex: 1, fontSize: 12 }}>
                {t('prestige.confirm')}
              </button>
              <button type="button" onClick={() => setConfirming(false)} className="pixel-btn pixel-btn-wood" style={{ flex: 1, fontSize: 12 }}>
                {t('common.cancel')}
              </button>
            </div>
          </div>
        )}
      </div>

      {cutscene && (
        <PrestigeCutscene
          seedsGained={cutscene.seeds}
          totalPrestiges={cutscene.prestigeNum}
          onComplete={() => setCutscene(null)}
        />
      )}
    </aside>
  );
}

function KpiCard({ label, value, accent }: { label: string; value: number | string; accent: string }) {
  return (
    <div className="panel-9" style={{ padding: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <span className="nail-bl" />
      <span className="nail-br" />
      <span
        style={{
          fontFamily: 'var(--font-button)',
          fontSize: 9,
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          textAlign: 'center',
        }}
      >
        {label}
      </span>
      <span
        className="numeric"
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: accent,
          textShadow: '1px 1px 0 var(--color-wood-5)',
        }}
      >
        {value}
      </span>
    </div>
  );
}

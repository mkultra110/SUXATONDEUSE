// AchievementBanner : banner descend du haut a chaque achievement
// debloque (idee #111). Distinct du AchievementToast existant.

import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../../stores/gameStore.js';
import { ACHIEVEMENTS } from '@robomow/shared';
import { TrophyIcon } from '../icons/PixelIcon.js';
import { KawaiiCoin } from './KawaiiSprites.js';

interface Banner {
  id: number;
  name: string;
}

export function AchievementBanner() {
  const achievements = useGameStore((s) => s.achievementsUnlocked);
  const lastRef = useRef<Set<string>>(new Set());
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    const newKeys: string[] = [];
    for (const k of achievements) {
      if (k.endsWith(':claimed')) continue;
      if (!lastRef.current.has(k)) {
        newKeys.push(k);
      }
    }
    lastRef.current = new Set(achievements);
    if (newKeys.length === 0) return;
    const newBanners: Banner[] = newKeys.map((k, i) => {
      const def = ACHIEVEMENTS.find((a) => a.key === k);
      return { id: Date.now() + i, name: def?.name ?? k };
    });
    setBanners((b) => [...b, ...newBanners]);
    setTimeout(() => {
      setBanners((b) => b.filter((x) => !newBanners.find((nb) => nb.id === x.id)));
    }, 4200);
  }, [achievements]);

  if (banners.length === 0) return null;
  const frame = Math.floor(Date.now() / 80);
  return (
    <>
      {banners.map((b, i) => (
        <div
          key={b.id}
          className="ach-banner"
          style={{
            top: `calc(110px + env(safe-area-inset-top, 0px) + ${i * 90}px)`,
            transform: `translate(-50%, 0) rotate(${i % 2 === 0 ? -2 : 2}deg)`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 6 }}>
            <KawaiiCoin size={22} frame={frame} />
            <TrophyIcon size={20} />
            <span
              style={{
                fontFamily: 'Press Start 2P, monospace',
                fontSize: 9,
                color: 'var(--k-red, #B52121)',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
              }}
            >
              Succès débloqué !
            </span>
          </div>
          <div
            style={{
              fontFamily: 'Patrick Hand, cursive',
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--k-ink, #1A1A2E)',
              textAlign: 'center',
            }}
          >
            « {b.name} »
          </div>
          <div
            style={{
              fontSize: 11,
              color: 'var(--k-wood-warm, #6B3F1F)',
              textAlign: 'center',
              marginTop: 4,
              fontStyle: 'italic',
              fontFamily: 'Patrick Hand, cursive',
            }}
          >
            — Mémé Gisèle est fière de toi
          </div>
        </div>
      ))}
    </>
  );
}

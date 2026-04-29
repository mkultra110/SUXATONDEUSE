// AchievementBanner : banner descend du haut a chaque achievement
// debloque (idee #111). Distinct du AchievementToast existant.

import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../../stores/gameStore.js';
import { ACHIEVEMENTS } from '@robomow/shared';
import { TrophyIcon } from '../icons/PixelIcon.js';

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
  return (
    <>
      {banners.map((b, i) => (
        <div
          key={b.id}
          className="ach-banner"
          style={{ top: `${80 + i * 80}px` }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
            <TrophyIcon size={20} />
            <span
              style={{
                fontFamily: 'var(--font-button)',
                fontSize: 10,
                color: 'var(--color-text-muted)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              Succes debloque
            </span>
          </div>
          <div
            style={{
              fontFamily: 'var(--font-title)',
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--color-accent-gold)',
              textShadow: '1px 1px 0 var(--color-wood-5)',
            }}
          >
            {b.name}
          </div>
        </div>
      ))}
    </>
  );
}

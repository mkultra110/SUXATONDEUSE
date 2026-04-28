// Badge meteo + saison anime avec sprites SVG pixel art (signature
// Camille v9). Soleil tourne ses rayons, nuages drift, gouttes de
// pluie tombent en cascade.

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { combinedMultiplier, currentSeason, weatherForHour } from '@robomow/shared';
import {
  SunIcon,
  CloudIcon,
  RainIcon,
  StormIcon,
  WindIcon,
  SnowIcon,
  FlowerIcon,
  LeafIcon,
} from '../icons/PixelIcon.js';

const SEASON_ICON: Record<string, React.ComponentType<{ size?: number }>> = {
  spring: FlowerIcon,
  summer: SunIcon,
  autumn: LeafIcon,
  winter: SnowIcon,
};

const WEATHER_ICON: Record<string, React.ComponentType<{ size?: number }>> = {
  sun: SunIcon,
  cloud: CloudIcon,
  rain: RainIcon,
  storm: StormIcon,
  wind: WindIcon,
  snow: SnowIcon,
};

const WEATHER_ANIM: Record<string, string> = {
  sun: 'weather-sun-spin',
  cloud: 'weather-cloud-drift',
  rain: 'weather-rain-shake',
  storm: 'weather-storm-flash',
  wind: 'weather-wind-blow',
  snow: 'weather-snow-fall',
};

export function WeatherBadge() {
  const { t } = useTranslation();
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const season = currentSeason(now);
  const weather = weatherForHour(now);
  const mult = combinedMultiplier(now);

  const WeatherIco = WEATHER_ICON[weather] ?? SunIcon;
  const SeasonIco = SEASON_ICON[season] ?? SunIcon;
  const animClass = WEATHER_ANIM[weather] ?? '';

  // Couleur du multiplier : vert si > 1, rouge si < 1, gold sinon.
  const multColor =
    mult > 1.05 ? 'var(--color-grass-5)' :
    mult < 0.95 ? 'var(--color-accent-red)' :
    'var(--color-accent-gold)';

  return (
    <div
      className="flex items-center gap-1.5 px-2 py-1 rounded"
      style={{
        background: 'var(--color-wood-5)',
        border: '2px solid var(--color-wood-4)',
        boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.3)',
      }}
      title={`${t(`weather.${weather}`)} · ${t(`season.${season}`)}`}
    >
      <span className={animClass} style={{ display: 'inline-flex' }}>
        <WeatherIco size={16} />
      </span>
      <span style={{ display: 'inline-flex' }}>
        <SeasonIco size={14} />
      </span>
      <span className="numeric" style={{ color: multColor, fontSize: 14, lineHeight: 1, fontWeight: 700 }}>
        ×{mult.toFixed(2)}
      </span>
    </div>
  );
}

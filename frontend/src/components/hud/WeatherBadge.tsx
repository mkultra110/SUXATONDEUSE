// Badge meteo + saison affiche dans la TopBar.

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { combinedMultiplier, currentSeason, weatherForHour } from '@robomow/shared';

const WEATHER_EMOJI: Record<string, string> = {
  sun: '☀️',
  cloud: '⛅',
  rain: '🌧️',
  storm: '⛈️',
  wind: '💨',
  snow: '❄️',
};

const SEASON_EMOJI: Record<string, string> = {
  spring: '🌸',
  summer: '☀️',
  autumn: '🍂',
  winter: '❄️',
};

export function WeatherBadge() {
  const { t } = useTranslation();
  // Re-render toutes les minutes pour suivre les changements horaires.
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const season = currentSeason(now);
  const weather = weatherForHour(now);
  const mult = combinedMultiplier(now);

  return (
    <div className="flex items-center gap-2 px-2 py-1 panel bg-grass-shadow text-panel-base text-xs">
      <span title={t(`weather.${weather}`)}>{WEATHER_EMOJI[weather]}</span>
      <span title={t(`season.${season}`)}>{SEASON_EMOJI[season]}</span>
      <span className="font-bold">×{mult.toFixed(2)}</span>
    </div>
  );
}

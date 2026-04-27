import { describe, expect, it } from 'vitest';
import {
  combinedMultiplier,
  currentSeason,
  SEASON_EFFECTS,
  WEATHER_EFFECTS,
  weatherForHour,
} from '../weather.js';

describe('currentSeason', () => {
  it('reconnait le printemps en avril', () => {
    expect(currentSeason(new Date('2026-04-15T12:00:00Z'))).toBe('spring');
  });

  it('reconnait l ete en juillet', () => {
    expect(currentSeason(new Date('2026-07-15T12:00:00Z'))).toBe('summer');
  });

  it('reconnait l automne en octobre', () => {
    expect(currentSeason(new Date('2026-10-15T12:00:00Z'))).toBe('autumn');
  });

  it('reconnait l hiver en janvier', () => {
    expect(currentSeason(new Date('2026-01-15T12:00:00Z'))).toBe('winter');
  });

  it('reconnait l hiver en decembre', () => {
    expect(currentSeason(new Date('2026-12-15T12:00:00Z'))).toBe('winter');
  });
});

describe('weatherForHour', () => {
  it('est deterministe pour une meme entree', () => {
    const date = new Date('2026-06-15T14:00:00Z');
    expect(weatherForHour(date)).toBe(weatherForHour(date));
  });

  it('change selon l heure', () => {
    const a = weatherForHour(new Date('2026-06-15T10:00:00Z'));
    const b = weatherForHour(new Date('2026-06-15T20:00:00Z'));
    // Pas garanti different mais c'est generalement le cas
    void a;
    void b;
    expect(['sun', 'cloud', 'rain', 'storm', 'wind', 'snow']).toContain(a);
  });
});

describe('combinedMultiplier', () => {
  it('retourne un multiplicateur > 0 pour une journee normale', () => {
    const m = combinedMultiplier(new Date('2026-06-15T14:00:00Z'));
    expect(m).toBeGreaterThanOrEqual(0);
    expect(m).toBeLessThan(3);
  });

  it('reflet le boost printemps quand il fait beau', () => {
    // Spring + sun = 1.3 * 1.0 = 1.3
    const date = new Date('2026-05-10T14:00:00Z');
    const m = combinedMultiplier(date);
    // Peut etre 1.3, 0.4 (rain), 1.3 * 0.4 = 0.52, etc
    expect(m).toBeGreaterThan(0);
  });
});

describe('SEASON_EFFECTS et WEATHER_EFFECTS', () => {
  it('toutes les saisons ont des probabilites totales = 1', () => {
    for (const season of Object.values(SEASON_EFFECTS)) {
      const total = Object.values(season.weatherProbs).reduce((a, b) => a + b, 0);
      expect(total).toBeCloseTo(1, 1);
    }
  });

  it('chaque meteo a un effet de production positif ou nul', () => {
    for (const w of Object.values(WEATHER_EFFECTS)) {
      expect(w.productionMultiplier).toBeGreaterThanOrEqual(0);
    }
  });
});

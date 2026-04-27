// Systeme meteo et saisons (cf. GDD sections 3.5 et 3.6).

export type Weather = 'sun' | 'cloud' | 'rain' | 'storm' | 'wind' | 'snow';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export interface WeatherEffect {
  productionMultiplier: number;
  /** Booster de regrowth de l'herbe (visuel). */
  grassGrowthMultiplier: number;
  /** Booster du solaire pour les robots HelioCut. */
  solarMultiplier: number;
}

export const WEATHER_EFFECTS: Record<Weather, WeatherEffect> = {
  sun: { productionMultiplier: 1.0, grassGrowthMultiplier: 1.0, solarMultiplier: 1.5 },
  cloud: { productionMultiplier: 1.0, grassGrowthMultiplier: 1.0, solarMultiplier: 1.0 },
  rain: { productionMultiplier: 0.4, grassGrowthMultiplier: 2.0, solarMultiplier: 0.5 },
  storm: { productionMultiplier: 0.0, grassGrowthMultiplier: 1.5, solarMultiplier: 0.0 },
  wind: { productionMultiplier: 0.9, grassGrowthMultiplier: 1.0, solarMultiplier: 1.0 },
  snow: { productionMultiplier: 0.0, grassGrowthMultiplier: 0.0, solarMultiplier: 0.5 },
};

export interface SeasonEffect {
  productionMultiplier: number;
  grassGrowthMultiplier: number;
  /** Probabilites de meteo pour cette saison. */
  weatherProbs: Record<Weather, number>;
  signatureEvent: string;
}

export const SEASON_EFFECTS: Record<Season, SeasonEffect> = {
  spring: {
    productionMultiplier: 1.3,
    grassGrowthMultiplier: 2.0,
    weatherProbs: {
      sun: 0.3,
      cloud: 0.3,
      rain: 0.3,
      storm: 0.05,
      wind: 0.05,
      snow: 0.0,
    },
    signatureEvent: 'floraison',
  },
  summer: {
    productionMultiplier: 1.0,
    grassGrowthMultiplier: 0.5,
    weatherProbs: {
      sun: 0.6,
      cloud: 0.2,
      rain: 0.05,
      storm: 0.05,
      wind: 0.1,
      snow: 0.0,
    },
    signatureEvent: 'canicule',
  },
  autumn: {
    productionMultiplier: 1.15,
    grassGrowthMultiplier: 1.0,
    weatherProbs: {
      sun: 0.2,
      cloud: 0.3,
      rain: 0.25,
      storm: 0.1,
      wind: 0.15,
      snow: 0.0,
    },
    signatureEvent: 'halloween',
  },
  winter: {
    productionMultiplier: 0.8,
    grassGrowthMultiplier: 0.3,
    weatherProbs: {
      sun: 0.2,
      cloud: 0.3,
      rain: 0.05,
      storm: 0.05,
      wind: 0.1,
      snow: 0.3,
    },
    signatureEvent: 'noel',
  },
};

/**
 * Determine la saison courante a partir d'une date (hemisphere nord).
 * Calendrier civil :
 * - Printemps : mars (3) - mai (5)
 * - Ete : juin (6) - aout (8)
 * - Automne : septembre (9) - novembre (11)
 * - Hiver : decembre (12) - fevrier (2)
 */
export function currentSeason(date: Date): Season {
  const month = date.getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}

/**
 * Selectionne une meteo pseudo-aleatoire pour une heure donnee
 * en fonction des probabilites de la saison.
 * Deterministe : meme entree = meme sortie (utile pour synchroniser
 * client et serveur sans communication continue).
 */
export function weatherForHour(date: Date, seed = 0): Weather {
  const season = currentSeason(date);
  const probs = SEASON_EFFECTS[season].weatherProbs;
  // Hash deterministe sur (annee, mois, jour, heure, seed)
  const key =
    date.getFullYear() * 100_000 +
    (date.getMonth() + 1) * 1_000 +
    date.getDate() * 100 +
    date.getHours() +
    seed;
  // Generateur lineaire congruentiel simple
  const hash = ((key * 1664525 + 1013904223) & 0x7fffffff) / 0x7fffffff;

  let cumulative = 0;
  for (const [weather, prob] of Object.entries(probs) as Array<[Weather, number]>) {
    cumulative += prob;
    if (hash <= cumulative) return weather;
  }
  return 'cloud';
}

/** Multiplicateur de production combinant saison + meteo. */
export function combinedMultiplier(date: Date, seed = 0): number {
  const season = currentSeason(date);
  const weather = weatherForHour(date, seed);
  return SEASON_EFFECTS[season].productionMultiplier * WEATHER_EFFECTS[weather].productionMultiplier;
}

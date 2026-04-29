// Themes visuels appliques au jardin selon le niveau de map.
// Chaque palier change palette + particules + ambiance pour marquer la
// progression visuellement.

export type ParticleEffect =
  | 'none'
  | 'sakura'
  | 'fireflies'
  | 'embers'
  | 'snowflakes'
  | 'aurora'
  | 'gold-sparkles'
  | 'leaves';

export interface MapTheme {
  name: string;
  description: string;
  // Tint color (rgba) appliquee en overlay multiply au-dessus du jardin.
  skyTint: string;
  // Couleur dominante d'accent pour la barre de progression et UI.
  accentColor: string;
  // Couleur du brouillard ambient (overlay leger).
  fogColor: string;
  // Effet de particules par-dessus le jardin.
  particleEffect: ParticleEffect;
  // Densite particles 1-3.
  particleDensity: number;
  // Glow color autour du frame (RGBA).
  frameGlow: string;
}

// 9 themes ordonnes par level. Le calcul retourne le theme courant +
// transition smooth entre 2 themes adjacents.
const THEMES: ReadonlyArray<{ from: number; theme: MapTheme }> = [
  {
    from: 1,
    theme: {
      name: 'Classique',
      description: 'Le bon vieux pré ensoleillé',
      skyTint: 'rgba(255, 255, 255, 0)',
      accentColor: '#8FBF4F',
      fogColor: 'rgba(255, 248, 231, 0)',
      particleEffect: 'none',
      particleDensity: 0,
      frameGlow: 'rgba(245, 196, 67, 0.3)',
    },
  },
  {
    from: 5,
    theme: {
      name: 'Crépuscule',
      description: 'Soleil orange du soir',
      skyTint: 'rgba(255, 138, 92, 0.18)',
      accentColor: '#F4A261',
      fogColor: 'rgba(244, 162, 97, 0.08)',
      particleEffect: 'fireflies',
      particleDensity: 1,
      frameGlow: 'rgba(244, 162, 97, 0.4)',
    },
  },
  {
    from: 10,
    theme: {
      name: 'Nuit étoilée',
      description: 'Ferme sous les étoiles',
      skyTint: 'rgba(58, 42, 94, 0.42)',
      accentColor: '#A8D8EE',
      fogColor: 'rgba(168, 216, 238, 0.12)',
      particleEffect: 'fireflies',
      particleDensity: 2,
      frameGlow: 'rgba(168, 216, 238, 0.5)',
    },
  },
  {
    from: 20,
    theme: {
      name: 'Sakura',
      description: 'Cerisiers en fleur',
      skyTint: 'rgba(242, 155, 184, 0.18)',
      accentColor: '#F29BB8',
      fogColor: 'rgba(242, 155, 184, 0.1)',
      particleEffect: 'sakura',
      particleDensity: 2,
      frameGlow: 'rgba(242, 155, 184, 0.5)',
    },
  },
  {
    from: 30,
    theme: {
      name: 'Aurore boréale',
      description: 'Lumières du Nord',
      skyTint: 'rgba(74, 150, 168, 0.32)',
      accentColor: '#7EC5C5',
      fogColor: 'rgba(126, 197, 197, 0.15)',
      particleEffect: 'aurora',
      particleDensity: 3,
      frameGlow: 'rgba(126, 197, 197, 0.6)',
    },
  },
  {
    from: 50,
    theme: {
      name: 'Volcanique',
      description: 'Terre rouge des dieux',
      skyTint: 'rgba(213, 76, 76, 0.32)',
      accentColor: '#E67E22',
      fogColor: 'rgba(213, 76, 76, 0.18)',
      particleEffect: 'embers',
      particleDensity: 3,
      frameGlow: 'rgba(213, 76, 76, 0.7)',
    },
  },
  {
    from: 80,
    theme: {
      name: 'Cristal',
      description: 'Hiver éternel',
      skyTint: 'rgba(168, 216, 238, 0.42)',
      accentColor: '#FFFFFF',
      fogColor: 'rgba(255, 255, 255, 0.2)',
      particleEffect: 'snowflakes',
      particleDensity: 3,
      frameGlow: 'rgba(255, 255, 255, 0.7)',
    },
  },
  {
    from: 100,
    theme: {
      name: 'Légendaire',
      description: 'Or pur, royaume divin',
      skyTint: 'rgba(245, 196, 67, 0.32)',
      accentColor: '#FFD921',
      fogColor: 'rgba(245, 196, 67, 0.2)',
      particleEffect: 'gold-sparkles',
      particleDensity: 3,
      frameGlow: 'rgba(255, 217, 33, 1)',
    },
  },
  {
    from: 150,
    theme: {
      name: 'Cosmique',
      description: 'Au-delà des étoiles',
      skyTint: 'rgba(155, 109, 196, 0.5)',
      accentColor: '#A855F7',
      fogColor: 'rgba(155, 109, 196, 0.22)',
      particleEffect: 'gold-sparkles',
      particleDensity: 3,
      frameGlow: 'rgba(155, 109, 196, 1)',
    },
  },
];

export function themeForMapLevel(mapLevel: number): MapTheme {
  // Trouve le theme dont 'from' est <= mapLevel, en prenant le plus haut.
  let current = THEMES[0]!.theme;
  for (const entry of THEMES) {
    if (mapLevel >= entry.from) current = entry.theme;
    else break;
  }
  return current;
}

export function nextThemeAt(mapLevel: number): { mapLevel: number; theme: MapTheme } | null {
  for (const entry of THEMES) {
    if (entry.from > mapLevel) return { mapLevel: entry.from, theme: entry.theme };
  }
  return null;
}

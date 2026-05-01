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
  // === Themes etendus (idees #552 #553 #561 #563 #570 #571) ===
  {
    from: 200,
    theme: {
      name: 'Lavande de Provence',
      description: 'Champs violets parfumés',
      skyTint: 'rgba(167, 139, 250, 0.28)',
      accentColor: '#A78BFA',
      fogColor: 'rgba(167, 139, 250, 0.15)',
      particleEffect: 'gold-sparkles',
      particleDensity: 2,
      frameGlow: 'rgba(167, 139, 250, 0.7)',
    },
  },
  {
    from: 250,
    theme: {
      name: 'Vignoble Bourgogne',
      description: 'Grappes mûres au soleil',
      skyTint: 'rgba(124, 58, 78, 0.28)',
      accentColor: '#7C3A4E',
      fogColor: 'rgba(124, 58, 78, 0.15)',
      particleEffect: 'embers',
      particleDensity: 1,
      frameGlow: 'rgba(124, 58, 78, 0.7)',
    },
  },
  {
    from: 300,
    theme: {
      name: 'Alpes neigeuses',
      description: 'Sommets éternels',
      skyTint: 'rgba(229, 240, 250, 0.4)',
      accentColor: '#E5F0FA',
      fogColor: 'rgba(229, 240, 250, 0.2)',
      particleEffect: 'snowflakes',
      particleDensity: 3,
      frameGlow: 'rgba(229, 240, 250, 0.8)',
    },
  },
  {
    from: 400,
    theme: {
      name: 'Volcan d\'Auvergne',
      description: 'Terre rouge brûlante',
      skyTint: 'rgba(239, 68, 68, 0.4)',
      accentColor: '#EF4444',
      fogColor: 'rgba(239, 68, 68, 0.18)',
      particleEffect: 'embers',
      particleDensity: 3,
      frameGlow: 'rgba(239, 68, 68, 0.9)',
    },
  },
  {
    from: 500,
    theme: {
      name: 'Sous la Lune',
      description: 'La ferme entre les cratères',
      skyTint: 'rgba(0, 0, 30, 0.65)',
      accentColor: '#C0C0E0',
      fogColor: 'rgba(0, 0, 30, 0.3)',
      particleEffect: 'fireflies',
      particleDensity: 3,
      frameGlow: 'rgba(192, 192, 224, 1)',
    },
  },
  {
    from: 750,
    theme: {
      name: 'Mars rouge',
      description: 'La planète tonde',
      skyTint: 'rgba(220, 38, 38, 0.5)',
      accentColor: '#DC2626',
      fogColor: 'rgba(220, 38, 38, 0.25)',
      particleEffect: 'embers',
      particleDensity: 2,
      frameGlow: 'rgba(220, 38, 38, 1)',
    },
  },
  {
    from: 1000,
    theme: {
      name: 'Trou Noir',
      description: 'Le prestige absolu',
      skyTint: 'rgba(0, 0, 0, 0.85)',
      accentColor: '#FFFFFF',
      fogColor: 'rgba(255, 255, 255, 0.1)',
      particleEffect: 'gold-sparkles',
      particleDensity: 3,
      frameGlow: 'rgba(255, 255, 255, 1)',
    },
  },
  // === Themes regionaux France (idees #554-#566) ===
  { from: 350, theme: { name: 'Plage normande', description: 'Falaises craie + galets', skyTint: 'rgba(184, 196, 208, 0.25)', accentColor: '#B8C4D0', fogColor: 'rgba(184, 196, 208, 0.2)', particleEffect: 'snowflakes', particleDensity: 1, frameGlow: 'rgba(184, 196, 208, 0.7)' } },
  { from: 380, theme: { name: 'Foret des Vosges', description: 'Sapins enneiges', skyTint: 'rgba(74, 138, 46, 0.3)', accentColor: '#4A8A2E', fogColor: 'rgba(74, 138, 46, 0.15)', particleEffect: 'fireflies', particleDensity: 2, frameGlow: 'rgba(74, 138, 46, 0.7)' } },
  { from: 420, theme: { name: 'Marais Poitevin', description: 'Le Venise verte', skyTint: 'rgba(126, 197, 197, 0.28)', accentColor: '#7EC5C5', fogColor: 'rgba(126, 197, 197, 0.18)', particleEffect: 'fireflies', particleDensity: 2, frameGlow: 'rgba(126, 197, 197, 0.7)' } },
  { from: 460, theme: { name: 'Mont Saint-Michel', description: 'Maree montante', skyTint: 'rgba(255, 230, 128, 0.3)', accentColor: '#FFE680', fogColor: 'rgba(255, 230, 128, 0.18)', particleEffect: 'sakura', particleDensity: 1, frameGlow: 'rgba(255, 230, 128, 0.8)' } },
  { from: 480, theme: { name: 'Camargue rose', description: 'Flamants et chevaux', skyTint: 'rgba(244, 172, 186, 0.32)', accentColor: '#F4ACBA', fogColor: 'rgba(244, 172, 186, 0.18)', particleEffect: 'sakura', particleDensity: 2, frameGlow: 'rgba(244, 172, 186, 0.8)' } },
  { from: 540, theme: { name: 'Foret de chataigniers', description: 'Bogues et muguet', skyTint: 'rgba(165, 113, 68, 0.28)', accentColor: '#A57144', fogColor: 'rgba(165, 113, 68, 0.18)', particleEffect: 'embers', particleDensity: 1, frameGlow: 'rgba(165, 113, 68, 0.7)' } },
  { from: 580, theme: { name: 'Champ de tournesols infini', description: 'Or solaire', skyTint: 'rgba(255, 217, 33, 0.4)', accentColor: '#FFD921', fogColor: 'rgba(255, 217, 33, 0.18)', particleEffect: 'gold-sparkles', particleDensity: 3, frameGlow: 'rgba(255, 217, 33, 1)' } },
  { from: 620, theme: { name: 'Ferme abandonnee', description: 'Eglise tordue', skyTint: 'rgba(64, 64, 76, 0.5)', accentColor: '#A0A0B0', fogColor: 'rgba(64, 64, 76, 0.25)', particleEffect: 'fireflies', particleDensity: 1, frameGlow: 'rgba(160, 160, 176, 0.6)' } },
  { from: 660, theme: { name: 'Manoir hante', description: 'Halloween perpetuel', skyTint: 'rgba(95, 53, 138, 0.5)', accentColor: '#5F358A', fogColor: 'rgba(95, 53, 138, 0.25)', particleEffect: 'fireflies', particleDensity: 3, frameGlow: 'rgba(95, 53, 138, 0.8)' } },
  { from: 700, theme: { name: 'Sous l\'eau (lac)', description: 'Bulles et reflets', skyTint: 'rgba(74, 150, 168, 0.5)', accentColor: '#4A96A8', fogColor: 'rgba(74, 150, 168, 0.3)', particleEffect: 'sakura', particleDensity: 2, frameGlow: 'rgba(74, 150, 168, 0.9)' } },
  { from: 720, theme: { name: 'Mine sous-terraine', description: 'Cristaux et torche', skyTint: 'rgba(40, 30, 20, 0.7)', accentColor: '#A57144', fogColor: 'rgba(40, 30, 20, 0.35)', particleEffect: 'embers', particleDensity: 2, frameGlow: 'rgba(255, 200, 100, 1)' } },
  { from: 800, theme: { name: 'Royaume des Fees', description: 'Magie et papillons', skyTint: 'rgba(244, 172, 186, 0.4)', accentColor: '#F4ACBA', fogColor: 'rgba(244, 172, 186, 0.22)', particleEffect: 'sakura', particleDensity: 3, frameGlow: 'rgba(244, 172, 186, 1)' } },
  { from: 850, theme: { name: 'Royaume Glace', description: 'Cristal pur ad infinitum', skyTint: 'rgba(168, 216, 238, 0.45)', accentColor: '#A8D8EE', fogColor: 'rgba(168, 216, 238, 0.22)', particleEffect: 'snowflakes', particleDensity: 3, frameGlow: 'rgba(168, 216, 238, 1)' } },
  { from: 900, theme: { name: 'Royaume Feu', description: 'Lave et phenix', skyTint: 'rgba(220, 38, 38, 0.5)', accentColor: '#DC2626', fogColor: 'rgba(220, 38, 38, 0.25)', particleEffect: 'embers', particleDensity: 3, frameGlow: 'rgba(220, 38, 38, 1)' } },
  { from: 950, theme: { name: 'Royaume Foudre', description: 'Eclairs perpetuels', skyTint: 'rgba(168, 85, 247, 0.5)', accentColor: '#A855F7', fogColor: 'rgba(168, 85, 247, 0.25)', particleEffect: 'gold-sparkles', particleDensity: 3, frameGlow: 'rgba(168, 85, 247, 1)' } },
  { from: 1500, theme: { name: 'Multivers', description: 'Au-dela du trou noir', skyTint: 'rgba(255, 0, 255, 0.4)', accentColor: '#FF00FF', fogColor: 'rgba(255, 0, 255, 0.2)', particleEffect: 'gold-sparkles', particleDensity: 3, frameGlow: 'rgba(255, 0, 255, 1)' } },
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

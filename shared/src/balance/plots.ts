// Definition des 10 parcelles (cf. GDD section 3.3).

import type { PlotDefinition, PlotType } from '../types/plot.js';

export const PLOT_DEFINITIONS: readonly PlotDefinition[] = [
  {
    type: 'RESIDENTIAL_GARDEN',
    index: 0,
    name: 'Petit jardin residentiel',
    unlockCost: 0n,
    globalMultiplier: 1.0,
    surfaceM2: 50,
  },
  {
    type: 'PAVILION_GARDEN',
    index: 1,
    name: 'Jardin pavillonnaire',
    unlockCost: 5_000n,
    globalMultiplier: 1.5,
    surfaceM2: 200,
  },
  {
    type: 'SUBDIVISION',
    index: 2,
    name: 'Lotissement',
    unlockCost: 250_000n,
    globalMultiplier: 2.5,
    surfaceM2: 1_000,
  },
  {
    type: 'MUNICIPAL_PARK',
    index: 3,
    name: 'Parc municipal',
    unlockCost: 5_000_000n,
    globalMultiplier: 4.0,
    surfaceM2: 10_000,
  },
  {
    type: 'CEMETERY',
    index: 4,
    name: 'Cimetiere paysager',
    unlockCost: 80_000_000n,
    globalMultiplier: 6.0,
    surfaceM2: 30_000,
  },
  {
    type: 'GOLF_COURSE',
    index: 5,
    name: 'Terrain de golf',
    unlockCost: 2_000_000_000n,
    globalMultiplier: 10.0,
    surfaceM2: 500_000,
  },
  {
    type: 'STADIUM',
    index: 6,
    name: 'Stade pro',
    unlockCost: 50_000_000_000n,
    globalMultiplier: 18.0,
    surfaceM2: 7_200,
  },
  {
    type: 'HIPPODROME',
    index: 7,
    name: 'Hippodrome',
    unlockCost: 800_000_000_000n,
    globalMultiplier: 30.0,
    surfaceM2: 300_000,
  },
  {
    type: 'CITY',
    index: 8,
    name: 'Ville entiere',
    unlockCost: 25_000_000_000_000n,
    globalMultiplier: 60.0,
    surfaceM2: 1_000_000,
  },
  {
    type: 'MEGALOPOLIS',
    index: 9,
    name: 'Megalopole / Continent',
    unlockCost: 1_000_000_000_000_000n,
    globalMultiplier: 100.0,
    surfaceM2: 100_000_000,
  },
];

const PLOT_BY_TYPE: Record<PlotType, PlotDefinition> = PLOT_DEFINITIONS.reduce(
  (acc, plot) => {
    acc[plot.type] = plot;
    return acc;
  },
  {} as Record<PlotType, PlotDefinition>,
);

export function getPlot(type: PlotType): PlotDefinition {
  return PLOT_BY_TYPE[type];
}

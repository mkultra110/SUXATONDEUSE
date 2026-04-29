// Boss system : tous les 10 niveaux de map, le joueur arrive sur une
// map vierge avec un boss au centre. Le boss a un HP egal a un nombre
// de coups de tonte ; chaque tuile coupee = 1 degat. Quand HP = 0, on
// passe a la map suivante avec un bonus.

export type BossKind = 'tournesol-geant' | 'champignon-mauve' | 'cactus-titan' | 'arbre-ancien' | 'cristal-pur';

export interface BossDef {
  kind: BossKind;
  name: string;
  hp: number;
  tagline: string;
  // Couleur dominante pour effets visuels (halo, particules de degats).
  color: string;
}

export const BOSSES: ReadonlyArray<BossDef> = [
  {
    kind: 'tournesol-geant',
    name: 'Tournesol Géant',
    hp: 25,
    tagline: 'Mémé l\'a planté en 1972, il refuse de mourir.',
    color: '#FFD921',
  },
  {
    kind: 'champignon-mauve',
    name: 'Champignon Mauve',
    hp: 50,
    tagline: 'Il pousse plus vite qu\'on ne le tond.',
    color: '#9B6DC4',
  },
  {
    kind: 'cactus-titan',
    name: 'Cactus Titan',
    hp: 100,
    tagline: 'Pique-toi, on rira ensuite.',
    color: '#E67E22',
  },
  {
    kind: 'arbre-ancien',
    name: 'Arbre Ancien',
    hp: 200,
    tagline: 'Plus vieux que la ferme elle-même.',
    color: '#5C3A1F',
  },
  {
    kind: 'cristal-pur',
    name: 'Cristal Pur',
    hp: 400,
    tagline: 'Tellement pur qu\'il ferait pâlir les diamants.',
    color: '#A8D8EE',
  },
];

// Retourne le boss du niveau si c'est un boss level (multiple de 10),
// sinon null. Les boss commencent a Map 10. Apres Map 50, cycle.
export function bossForMapLevel(mapLevel: number): BossDef | null {
  if (mapLevel < 10 || mapLevel % 10 !== 0) return null;
  const idx = Math.floor((mapLevel - 10) / 10) % BOSSES.length;
  return BOSSES[idx]!;
}

// Bonus cash recompense pour avoir battu un boss (multiplicateur du
// niveau de prestige).
export function bossRewardMultiplier(mapLevel: number, prestigeLevel: number): number {
  return Math.pow(2, Math.floor(mapLevel / 10)) * (1 + prestigeLevel * 0.5);
}

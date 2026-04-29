// Boss system : tous les 10 niveaux de map, le joueur arrive sur une
// map vierge avec un boss au centre. Le boss a un HP egal a un nombre
// de coups de tonte ; chaque tuile coupee = 1 degat. Quand HP = 0, on
// passe a la map suivante avec un bonus.

export type BossKind =
  | 'tournesol-geant'
  | 'champignon-mauve'
  | 'cactus-titan'
  | 'arbre-ancien'
  | 'cristal-pur'
  | 'taupe-geante'
  | 'corbeau-noir'
  | 'sanglier'
  | 'mante-religieuse'
  | 'citrouille-mere'
  | 'krampus'
  | 'tournesol-mutant'
  | 'arbre-foudre'
  | 'robot-anti'
  | 'pelouse-sentiente'
  | 'loup-garou'
  | 'voisin-robert';

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
  {
    kind: 'taupe-geante',
    name: 'Taupe Géante',
    hp: 600,
    tagline: 'Elle creuse plus vite qu\'elle ne réfléchit.',
    color: '#5C3A1F',
  },
  {
    kind: 'corbeau-noir',
    name: 'Corbeau Noir',
    hp: 750,
    tagline: 'Vole, esquive, ricane. Adore voler les pièces.',
    color: '#1a1a1a',
  },
  {
    kind: 'sanglier',
    name: 'Sanglier des Bois',
    hp: 1000,
    tagline: 'Charge en ligne droite, casse tout sur son chemin.',
    color: '#3A1F08',
  },
  {
    kind: 'mante-religieuse',
    name: 'Mante Religieuse',
    hp: 1500,
    tagline: 'Phase prière, phase attaque. Mefie-toi des deux.',
    color: '#8FBF4F',
  },
  {
    kind: 'citrouille-mere',
    name: 'Citrouille Mère',
    hp: 2000,
    tagline: 'Crache du feu d\'Halloween. Pop ses petites citrouilles.',
    color: '#E67E22',
  },
  {
    kind: 'krampus',
    name: 'Krampus',
    hp: 3000,
    tagline: 'L\'anti-Père Noël. Il brûle ton sapin.',
    color: '#A22A06',
  },
  {
    kind: 'tournesol-mutant',
    name: 'Tournesol Mutant',
    hp: 4500,
    tagline: 'Tire des graines explosives, plus mauvais que son cousin.',
    color: '#FFD921',
  },
  {
    kind: 'arbre-foudre',
    name: 'Arbre de la Foudre',
    hp: 6500,
    tagline: 'Touché par mille éclairs, il en redemande.',
    color: '#A855F7',
  },
  {
    kind: 'robot-anti',
    name: 'Robot Anti-Robot',
    hp: 9000,
    tagline: 'Version corrompue du robot beta. Connais tous tes points faibles.',
    color: '#1a1a1a',
  },
  {
    kind: 'pelouse-sentiente',
    name: 'Pelouse Sentiente',
    hp: 12_000,
    tagline: 'La map elle-meme. Elle ne pardonnera pas.',
    color: '#6BA53A',
  },
  {
    kind: 'loup-garou',
    name: 'Loup-Garou des Bocages',
    hp: 15_000,
    tagline: 'Sort uniquement les nuits de pleine lune.',
    color: '#5C3A1F',
  },
  {
    kind: 'voisin-robert',
    name: 'Voisin Robert (engagé)',
    hp: 20_000,
    tagline: 'Il vient se plaindre du bruit. Tres fortement.',
    color: '#A22A06',
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

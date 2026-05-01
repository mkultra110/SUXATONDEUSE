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
  | 'voisin-robert'
  | 'liane-etrangleuse'
  | 'fougere-prehistorique'
  | 'mauve-hypnotique'
  | 'lavande-endormante'
  | 'ortie-brulante'
  | 'limace-monstre'
  | 'pomme-vehicule'
  | 'crapaud-geant'
  | 'mille-pattes'
  | 'maman-frelon'
  | 'sorciere-bocage'
  | 'vampire-vignes'
  | 'fantome-marcel'
  | 'limace-royale'
  | 'taupe-cyborg'
  | 'asticot-geant'
  | 'chataigne-volante'
  | 'sapin-vivant'
  | 'bambou-imperial'
  | 'rocher-eveille'
  | 'epouvantail-maudit'
  | 'tracteur-rouille'
  | 'pelouse-finale';

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
  { kind: 'liane-etrangleuse', name: 'Liane Etrangleuse', hp: 28_000, tagline: 'Elle enserre, elle serre, elle etrangle.', color: '#3A6B2A' },
  { kind: 'fougere-prehistorique', name: 'Fougere Prehistorique', hp: 36_000, tagline: 'Plus vieille que le crayon a papier.', color: '#4A8A2E' },
  { kind: 'mauve-hypnotique', name: 'Mauve Hypnotique', hp: 50_000, tagline: 'Tu vas oublier pourquoi tu es ici.', color: '#A78BFA' },
  { kind: 'lavande-endormante', name: 'Lavande Endormante', hp: 65_000, tagline: 'Tres parfumee. Trop, peut-etre.', color: '#C4B5FD' },
  { kind: 'ortie-brulante', name: 'Ortie Brulante', hp: 85_000, tagline: 'Pas de gants ? Mauvaise idee.', color: '#6BA53A' },
  { kind: 'limace-monstre', name: 'Limace Monstre', hp: 120_000, tagline: 'Elle grossit a chaque coup. Ne tape pas.', color: '#9B6DC4' },
  { kind: 'pomme-vehicule', name: 'Pomme Vehicule', hp: 160_000, tagline: 'Roule avec inertie. Pousse, ca freine pas.', color: '#FF6B6B' },
  { kind: 'crapaud-geant', name: 'Crapaud Geant', hp: 220_000, tagline: 'Il avale et regurgite des tuiles. Charmant.', color: '#5C7C3A' },
  { kind: 'mille-pattes', name: 'Mille-Pattes', hp: 300_000, tagline: 'Mille pattes a tondre. Une par une.', color: '#A57144' },
  { kind: 'maman-frelon', name: 'Maman Frelon', hp: 420_000, tagline: 'Elle invoque ses petits. Beaucoup.', color: '#FFD921' },
  { kind: 'sorciere-bocage', name: 'Sorciere du Bocage', hp: 600_000, tagline: 'Elle invoque des minions. Au pluriel.', color: '#9B6DC4' },
  { kind: 'vampire-vignes', name: 'Vampire des Vignes', hp: 850_000, tagline: 'Aspire ta production cash. Plus fort.', color: '#7C3A4E' },
  { kind: 'fantome-marcel', name: 'Fantome de Marcel', hp: 1_200_000, tagline: 'Marcel reviens... Il a 50% en phase 2.', color: '#A0A0B0' },
  { kind: 'limace-royale', name: 'Limace Royale', hp: 1_700_000, tagline: 'Trainee toxique 60s.', color: '#6BA53A' },
  { kind: 'taupe-cyborg', name: 'Taupe Cyborg', hp: 2_400_000, tagline: 'Armure robotique, vue x-ray.', color: '#5C3A1F' },
  { kind: 'asticot-geant', name: 'Asticot Geant', hp: 3_400_000, tagline: 'Creuse des trous-pieges.', color: '#FFE680' },
  { kind: 'chataigne-volante', name: 'Chataigne Volante', hp: 4_700_000, tagline: 'Pluie de chataignes piquantes.', color: '#A57144' },
  { kind: 'sapin-vivant', name: 'Sapin Vivant', hp: 6_500_000, tagline: 'Projettes ses pommes de pin.', color: '#4A8A2E' },
  { kind: 'bambou-imperial', name: 'Bambou Imperial', hp: 9_000_000, tagline: 'Pousse vite et bloque.', color: '#8FBF4F' },
  { kind: 'rocher-eveille', name: 'Rocher Eveille', hp: 12_500_000, tagline: 'Pierre eveillee, immobile, tank pur.', color: '#6E7280' },
  { kind: 'epouvantail-maudit', name: 'Epouvantail Maudit', hp: 17_000_000, tagline: 'Se libere et marche. Jamais bon.', color: '#A22A06' },
  { kind: 'tracteur-rouille', name: 'Tracteur Rouille', hp: 23_000_000, tagline: 'Vieux mais tete dure. Phase mecha.', color: '#A57144' },
  { kind: 'pelouse-finale', name: 'Pelouse Finale', hp: 100_000_000, tagline: 'La fin de toutes choses. La pelouse triomphe.', color: '#FFFFFF' },
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

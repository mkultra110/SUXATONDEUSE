// Pets : compagnons cosmetiques avec bonus passif (cf. GDD).

export type PetRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface PetDefinition {
  key: string;
  name: string;
  emoji: string;
  rarity: PetRarity;
  /** Bonus de production global. */
  productionBonus: number;
  /** Bonus de vitesse global (pour la sensation visuelle). */
  speedBonus: number;
  /** Description narrative. */
  description: string;
}

export const PETS: readonly PetDefinition[] = [
  // Common (8)
  { key: 'ladybug', name: 'Coccinelle', emoji: '🐞', rarity: 'common', productionBonus: 0.02, speedBonus: 0, description: 'Porte-bonheur du jardin.' },
  { key: 'butterfly', name: 'Papillon', emoji: '🦋', rarity: 'common', productionBonus: 0.02, speedBonus: 0, description: 'Volette dans l\'herbe.' },
  { key: 'snail', name: 'Escargot', emoji: '🐌', rarity: 'common', productionBonus: 0.01, speedBonus: -0.01, description: 'Lent mais persistant.' },
  { key: 'bee', name: 'Abeille', emoji: '🐝', rarity: 'common', productionBonus: 0.03, speedBonus: 0.01, description: 'Polleinise au passage.' },
  { key: 'ant', name: 'Fourmi', emoji: '🐜', rarity: 'common', productionBonus: 0.02, speedBonus: 0.02, description: 'Travaille dur.' },
  { key: 'frog', name: 'Grenouille', emoji: '🐸', rarity: 'common', productionBonus: 0.02, speedBonus: 0, description: 'Chante apres la pluie.' },
  { key: 'mouse', name: 'Souris', emoji: '🐭', rarity: 'common', productionBonus: 0.02, speedBonus: 0.02, description: 'Curieuse et rapide.' },
  { key: 'spider', name: 'Araignee', emoji: '🕷️', rarity: 'common', productionBonus: 0.02, speedBonus: 0, description: 'Tisse en silence.' },

  // Uncommon (8)
  { key: 'rabbit', name: 'Lapin', emoji: '🐰', rarity: 'uncommon', productionBonus: 0.05, speedBonus: 0.05, description: 'Bondit avec joie.' },
  { key: 'squirrel', name: 'Ecureuil', emoji: '🐿️', rarity: 'uncommon', productionBonus: 0.04, speedBonus: 0.05, description: 'Stocke des graines.' },
  { key: 'hedgehog', name: 'Herisson', emoji: '🦔', rarity: 'uncommon', productionBonus: 0.05, speedBonus: 0, description: 'Discret et utile.' },
  { key: 'duck', name: 'Canard', emoji: '🦆', rarity: 'uncommon', productionBonus: 0.04, speedBonus: 0.02, description: 'Aime les flaques.' },
  { key: 'cat', name: 'Chat', emoji: '🐈', rarity: 'uncommon', productionBonus: 0.05, speedBonus: 0.03, description: 'Independant.' },
  { key: 'dog', name: 'Chien', emoji: '🐕', rarity: 'uncommon', productionBonus: 0.05, speedBonus: 0.03, description: 'Le meilleur ami.' },
  { key: 'chicken', name: 'Poule', emoji: '🐓', rarity: 'uncommon', productionBonus: 0.04, speedBonus: 0.01, description: 'Picore l\'herbe coupee.' },
  { key: 'goat', name: 'Chevre', emoji: '🐐', rarity: 'uncommon', productionBonus: 0.06, speedBonus: 0.02, description: 'Mange tout sur son passage.' },

  // Rare (6)
  { key: 'fox', name: 'Renard', emoji: '🦊', rarity: 'rare', productionBonus: 0.08, speedBonus: 0.05, description: 'Ruse et rapide.' },
  { key: 'owl', name: 'Hibou', emoji: '🦉', rarity: 'rare', productionBonus: 0.07, speedBonus: 0.03, description: 'Travailleur de nuit.' },
  { key: 'badger', name: 'Blaireau', emoji: '🦡', rarity: 'rare', productionBonus: 0.08, speedBonus: 0.02, description: 'Force tranquille.' },
  { key: 'deer', name: 'Cerf', emoji: '🦌', rarity: 'rare', productionBonus: 0.08, speedBonus: 0.05, description: 'Royal du sous-bois.' },
  { key: 'horse', name: 'Cheval', emoji: '🐎', rarity: 'rare', productionBonus: 0.09, speedBonus: 0.07, description: 'Galoppe dans le pre.' },
  { key: 'sheep', name: 'Mouton', emoji: '🐑', rarity: 'rare', productionBonus: 0.08, speedBonus: 0.01, description: 'Tond aussi l\'herbe.' },

  // Epic (5)
  { key: 'wolf', name: 'Loup', emoji: '🐺', rarity: 'epic', productionBonus: 0.12, speedBonus: 0.08, description: 'Maitre du jardin sauvage.' },
  { key: 'eagle', name: 'Aigle', emoji: '🦅', rarity: 'epic', productionBonus: 0.12, speedBonus: 0.1, description: 'Plane au-dessus.' },
  { key: 'tiger', name: 'Tigre', emoji: '🐅', rarity: 'epic', productionBonus: 0.13, speedBonus: 0.07, description: 'Force et grace.' },
  { key: 'panda', name: 'Panda', emoji: '🐼', rarity: 'epic', productionBonus: 0.12, speedBonus: 0.04, description: 'Ado le bambou (meme dans l\'herbe).' },
  { key: 'lion', name: 'Lion', emoji: '🦁', rarity: 'epic', productionBonus: 0.14, speedBonus: 0.05, description: 'Roi du gazon.' },

  // Legendary (3)
  { key: 'dragon', name: 'Dragon', emoji: '🐉', rarity: 'legendary', productionBonus: 0.25, speedBonus: 0.15, description: 'Fait pousser l\'herbe magique.' },
  { key: 'unicorn', name: 'Licorne', emoji: '🦄', rarity: 'legendary', productionBonus: 0.25, speedBonus: 0.2, description: 'Mythique et lumineuse.' },
  { key: 'phoenix', name: 'Phoenix', emoji: '🔥', rarity: 'legendary', productionBonus: 0.3, speedBonus: 0.1, description: 'Renait de l\'herbe brulee.' },
];

const RARITY_WEIGHTS: Record<PetRarity, number> = {
  common: 60,
  uncommon: 25,
  rare: 10,
  epic: 4,
  legendary: 1,
};

/** Tirage aleatoire d'un pet, pondere par rarete. */
export function rollRandomPet(seed?: number): PetDefinition {
  const random = seed !== undefined ? Math.abs(Math.sin(seed) * 10000) % 1 : Math.random();
  const totalWeight = Object.values(RARITY_WEIGHTS).reduce((acc, w) => acc + w, 0);
  let cumul = 0;
  let chosenRarity: PetRarity = 'common';
  for (const [rarity, weight] of Object.entries(RARITY_WEIGHTS) as Array<[PetRarity, number]>) {
    cumul += weight / totalWeight;
    if (random <= cumul) {
      chosenRarity = rarity;
      break;
    }
  }
  const candidates = PETS.filter((p) => p.rarity === chosenRarity);
  if (candidates.length === 0) return PETS[0]!;
  const index = Math.floor((random * 1000) % candidates.length);
  return candidates[index] ?? candidates[0]!;
}

/** Bonus total cumulés des pets equipes. */
export function totalPetBonus(equippedKeys: ReadonlySet<string>): {
  productionBonus: number;
  speedBonus: number;
} {
  let production = 0;
  let speed = 0;
  for (const key of equippedKeys) {
    const pet = PETS.find((p) => p.key === key);
    if (pet) {
      production += pet.productionBonus;
      speed += pet.speedBonus;
    }
  }
  return { productionBonus: production, speedBonus: speed };
}

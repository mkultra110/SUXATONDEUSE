import { describe, expect, it } from 'vitest';
import { PETS, rollRandomPet, totalPetBonus } from '../pets.js';

describe('PETS', () => {
  it('contient au moins 30 pets', () => {
    expect(PETS.length).toBeGreaterThanOrEqual(30);
  });

  it('chaque pet a une key unique', () => {
    const keys = new Set(PETS.map((p) => p.key));
    expect(keys.size).toBe(PETS.length);
  });

  it('contient au moins une legendaire', () => {
    expect(PETS.filter((p) => p.rarity === 'legendary').length).toBeGreaterThan(0);
  });
});

describe('rollRandomPet', () => {
  it('retourne un pet existant', () => {
    for (let i = 0; i < 50; i++) {
      const p = rollRandomPet(i);
      expect(PETS.find((x) => x.key === p.key)).toBeDefined();
    }
  });
});

describe('totalPetBonus', () => {
  it('retourne 0 si aucun pet equipe', () => {
    const bonus = totalPetBonus(new Set());
    expect(bonus.productionBonus).toBe(0);
    expect(bonus.speedBonus).toBe(0);
  });

  it('cumule les bonus des pets equipes', () => {
    const bonus = totalPetBonus(new Set(['ladybug', 'butterfly']));
    expect(bonus.productionBonus).toBeCloseTo(0.04);
  });

  it('ignore les pets inexistants', () => {
    const bonus = totalPetBonus(new Set(['unknown_pet']));
    expect(bonus.productionBonus).toBe(0);
  });
});

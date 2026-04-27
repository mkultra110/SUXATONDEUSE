import { describe, expect, it } from 'vitest';
import { milestoneMultiplier, nextMilestone } from '../milestones.js';

describe('milestoneMultiplier', () => {
  it('retourne 1 si aucune unite', () => {
    expect(milestoneMultiplier(0)).toBe(1);
  });

  it('retourne 1 sous le 1er palier', () => {
    expect(milestoneMultiplier(24)).toBe(1);
  });

  it('retourne 2 a exactement 25 unites', () => {
    expect(milestoneMultiplier(25)).toBe(2);
  });

  it('retourne 4 (2*2) a 50 unites', () => {
    expect(milestoneMultiplier(50)).toBe(4);
  });

  it('retourne 12 (2*2*3) a 100 unites', () => {
    expect(milestoneMultiplier(100)).toBe(12);
  });

  it('retourne 36 a 200 unites', () => {
    expect(milestoneMultiplier(200)).toBe(36);
  });
});

describe('nextMilestone', () => {
  it('retourne le 1er palier pour 0 unite', () => {
    expect(nextMilestone(0)).toEqual({ threshold: 25, multiplier: 2 });
  });

  it('retourne le 2eme palier pour 25 unites', () => {
    expect(nextMilestone(25)).toEqual({ threshold: 50, multiplier: 2 });
  });

  it('retourne null si tous les paliers sont atteints', () => {
    expect(nextMilestone(10_000)).toBeNull();
  });
});

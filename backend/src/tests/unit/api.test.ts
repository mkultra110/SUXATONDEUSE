import { describe, expect, it } from 'vitest';
import { AppError } from '../../utils/api.js';

describe('AppError', () => {
  it('expose code, status et message', () => {
    const err = new AppError('NOT_FOUND', 'Pas trouve', 404);
    expect(err.code).toBe('NOT_FOUND');
    expect(err.status).toBe(404);
    expect(err.message).toBe('Pas trouve');
  });

  it('a un status par defaut a 400', () => {
    const err = new AppError('VALIDATION_ERROR', 'Bad');
    expect(err.status).toBe(400);
  });

  it('peut porter des details', () => {
    const err = new AppError('VALIDATION_ERROR', 'Bad', 400, { field: 'x' });
    expect(err.details).toEqual({ field: 'x' });
  });
});

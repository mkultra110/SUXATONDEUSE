// Tests unitaires des controllers /api/save (service mocke, req/res factices).
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Request, Response } from 'express';

const { loadSave, persistSave } = vi.hoisted(() => ({
  loadSave: vi.fn(),
  persistSave: vi.fn(),
}));

vi.mock('../../services/save.service.js', () => ({ loadSave, persistSave }));

import { getSave, postSave, postSaveBeacon } from '../../controllers/save.controller.js';

function mockRes() {
  const res = {} as Response & {
    statusCode?: number;
    body?: unknown;
  };
  res.status = vi.fn((code: number) => {
    res.statusCode = code;
    return res;
  }) as never;
  res.json = vi.fn((payload: unknown) => {
    res.body = payload;
    return res;
  }) as never;
  res.send = vi.fn(() => res) as never;
  return res;
}

beforeEach(() => vi.clearAllMocks());

describe('getSave', () => {
  it('repond 401 sans utilisateur authentifie', async () => {
    const res = mockRes();
    const next = vi.fn();
    await getSave({ user: undefined } as Request, res, next);
    expect(res.statusCode).toBe(401);
    expect(loadSave).not.toHaveBeenCalled();
  });

  it('renvoie le save de l utilisateur', async () => {
    loadSave.mockResolvedValue({ payload: { cash: '10' }, payloadVersion: 1 });
    const res = mockRes();
    const next = vi.fn();
    await getSave({ user: { id: 'u1' } } as Request, res, next);
    expect(loadSave).toHaveBeenCalledWith('u1');
    expect(res.body).toMatchObject({ success: true });
    expect(next).not.toHaveBeenCalled();
  });

  it('delegue les erreurs au middleware via next', async () => {
    const boom = new Error('db down');
    loadSave.mockRejectedValue(boom);
    const res = mockRes();
    const next = vi.fn();
    await getSave({ user: { id: 'u1' } } as Request, res, next);
    expect(next).toHaveBeenCalledWith(boom);
  });
});

describe('postSave', () => {
  it('repond 401 sans utilisateur', async () => {
    const res = mockRes();
    await postSave({ user: undefined, body: {} } as Request, res, vi.fn());
    expect(res.statusCode).toBe(401);
    expect(persistSave).not.toHaveBeenCalled();
  });

  it('persiste et renvoie le resultat', async () => {
    persistSave.mockResolvedValue({ saved: true, serverTime: 'now' });
    const res = mockRes();
    await postSave(
      {
        user: { id: 'u1' },
        body: { payload: {}, payloadVersion: 2, hmac: 'h' },
      } as Request,
      res,
      vi.fn(),
    );
    expect(persistSave).toHaveBeenCalledWith('u1', {}, 2, 'h');
    expect(res.body).toMatchObject({ success: true, data: { saved: true } });
  });
});

describe('postSaveBeacon', () => {
  it('repond toujours 204 immediatement', async () => {
    const res = mockRes();
    await postSaveBeacon({ user: { id: 'u1' }, body: { payload: null } } as Request, res, vi.fn());
    expect(res.statusCode).toBe(204);
  });
});

// Test d'integration health endpoint.
// Ne touche pas la DB : on attend simplement que la route reponde,
// avec un statut "degraded" si la DB n'est pas joignable.

import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../../app.js';

describe('GET /api/health', () => {
  it('retourne 200 ou 503 avec un payload structure', async () => {
    const app = createApp();
    const res = await request(app).get('/api/health');
    expect([200, 503]).toContain(res.status);
    expect(res.body).toHaveProperty('data.status');
    expect(res.body).toHaveProperty('data.uptime');
    expect(res.body).toHaveProperty('data.db');
    expect(res.body).toHaveProperty('data.timestamp');
  });
});

describe('GET /api/version', () => {
  it('retourne la version de l API et du jeu', async () => {
    const app = createApp();
    const res = await request(app).get('/api/version');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.api).toBe('0.1.0');
    expect(res.body.data.game).toBe('0.1.0');
  });
});

describe('GET /api/inexistant', () => {
  it('retourne 404 avec format uniforme', async () => {
    const app = createApp();
    const res = await request(app).get('/api/inexistant');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});

// Tests du store auth.

import { beforeEach, describe, expect, it } from 'vitest';
import { useAuthStore } from '../stores/authStore.js';

beforeEach(() => {
  useAuthStore.getState().clear();
  useAuthStore.setState({ isInitialized: false });
});

describe('useAuthStore', () => {
  it('demarre vide', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.isInitialized).toBe(false);
  });

  it('setAuth pose user + token', () => {
    useAuthStore.getState().setAuth(
      {
        id: 'u1',
        username: 'alice',
        role: 'PLAYER',
        createdAt: new Date().toISOString(),
        emailVerified: false,
      },
      'tok',
    );
    const state = useAuthStore.getState();
    expect(state.user?.username).toBe('alice');
    expect(state.accessToken).toBe('tok');
  });

  it('clear remet a vide', () => {
    useAuthStore.getState().setAuth(
      {
        id: 'u1',
        username: 'alice',
        role: 'PLAYER',
        createdAt: new Date().toISOString(),
        emailVerified: false,
      },
      'tok',
    );
    useAuthStore.getState().clear();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().accessToken).toBeNull();
  });

  it('setInitialized passe a true', () => {
    useAuthStore.getState().setInitialized();
    expect(useAuthStore.getState().isInitialized).toBe(true);
  });
});

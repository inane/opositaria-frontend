import { describe, expect, it, beforeEach } from 'vitest';
import { LocalStorageTokenAdapter } from './LocalStorageTokenAdapter';
import { SessionStorageTokenAdapter } from './SessionStorageTokenAdapter';
import { TokenStorageService } from './TokenStorageService';

describe('The LocalStorageTokenAdapter', () => {
  const STORAGE_KEY = 'opositaria_token';

  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);
  });

  it('saves and reads a token from localStorage', () => {
    const adapter = new LocalStorageTokenAdapter();

    adapter.save('test-token');
    expect(adapter.read()).toBe('test-token');
  });

  it('returns null when no token is stored', () => {
    const adapter = new LocalStorageTokenAdapter();

    expect(adapter.read()).toBeNull();
  });

  it('clears the stored token', () => {
    const adapter = new LocalStorageTokenAdapter();
    adapter.save('test-token');

    adapter.clear();

    expect(adapter.read()).toBeNull();
  });
});

describe('The SessionStorageTokenAdapter', () => {
  const STORAGE_KEY = 'opositaria_token';

  beforeEach(() => {
    sessionStorage.removeItem(STORAGE_KEY);
  });

  it('saves and reads a token from sessionStorage', () => {
    const adapter = new SessionStorageTokenAdapter();

    adapter.save('test-token');
    expect(adapter.read()).toBe('test-token');
  });

  it('returns null when no token is stored', () => {
    const adapter = new SessionStorageTokenAdapter();

    expect(adapter.read()).toBeNull();
  });

  it('clears the stored token', () => {
    const adapter = new SessionStorageTokenAdapter();
    adapter.save('test-token');

    adapter.clear();

    expect(adapter.read()).toBeNull();
  });
});

describe('The TokenStorageService', () => {
  const STORAGE_KEY = 'opositaria_token';

  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  });

  it('stores a persistent token in localStorage only', () => {
    const service = new TokenStorageService();

    service.save('persistent-token', 'persistent');

    expect(localStorage.getItem(STORAGE_KEY)).toBe('persistent-token');
    expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('stores a session token in sessionStorage only', () => {
    const service = new TokenStorageService();

    service.save('session-token', 'session');

    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(sessionStorage.getItem(STORAGE_KEY)).toBe('session-token');
  });

  it('clears persistent and session token storage', () => {
    const service = new TokenStorageService();
    localStorage.setItem(STORAGE_KEY, 'persistent-token');
    sessionStorage.setItem(STORAGE_KEY, 'session-token');

    service.clear();

    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});

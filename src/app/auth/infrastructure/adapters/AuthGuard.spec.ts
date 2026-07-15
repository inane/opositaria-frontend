import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './AuthGuard';
import { TokenStorageService } from './TokenStorageService';

describe('The AuthGuard', () => {
  let guard: AuthGuard;
  let storage: TokenStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard, TokenStorageService, { provide: Router, useValue: { parseUrl: vi.fn((url) => url) } }],
    });
    guard = TestBed.inject(AuthGuard);
    storage = TestBed.inject(TokenStorageService);
    storage.clear();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('allows access when a token exists', () => {
    localStorage.setItem('opositaria_token', 'test-token');

    expect(guard.canActivate()).toBe(true);
  });

  it('redirects to /login when no token exists', () => {
    storage.clear();

    expect(guard.canActivate()).toBe('/login');
  });
});

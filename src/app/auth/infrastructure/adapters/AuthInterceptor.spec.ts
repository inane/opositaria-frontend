import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { AuthInterceptor } from './AuthInterceptor';
import { TokenStorageService } from './TokenStorageService';

describe('The AuthInterceptor', () => {
  let interceptor: AuthInterceptor;
  let storage: TokenStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthInterceptor, TokenStorageService],
    });
    interceptor = TestBed.inject(AuthInterceptor);
    storage = TestBed.inject(TokenStorageService);
    storage.clear();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('adds an Authorization Bearer header when a token exists', () => {
    localStorage.setItem('opositaria_token', 'test-token');
    const req = new HttpRequest('GET', '/api/test');
    const next = { handle: vi.fn() };

    interceptor.intercept(req, next);

    const intercepted = next.handle.mock.calls[0][0];
    expect(intercepted.headers.get('Authorization')).toBe('Bearer test-token');
  });

  it('does not add an Authorization header when no token exists', () => {
    storage.clear();
    const req = new HttpRequest('GET', '/api/test');
    const next = { handle: vi.fn() };

    interceptor.intercept(req, next);

    const intercepted = next.handle.mock.calls[0][0];
    expect(intercepted.headers.has('Authorization')).toBe(false);
  });
});

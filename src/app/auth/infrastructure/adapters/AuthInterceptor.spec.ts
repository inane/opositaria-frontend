import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, HttpRequest, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom, of, throwError } from 'rxjs';
import { AuthInterceptor } from './AuthInterceptor';
import { TokenStorageService } from './TokenStorageService';

describe('The AuthInterceptor', () => {
  let interceptor: AuthInterceptor;
  let storage: TokenStorageService;
  let router: { navigateByUrl: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    router = { navigateByUrl: vi.fn() };
    TestBed.configureTestingModule({
      providers: [AuthInterceptor, TokenStorageService, { provide: Router, useValue: router }],
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
    const intercepted: HttpRequest<unknown>[] = [];
    const next = {
      handle: vi.fn((request: HttpRequest<unknown>) => {
        intercepted.push(request);
        return of(new HttpResponse({ status: 200 }));
      }),
    };

    interceptor.intercept(req, next);

    expect(intercepted[0]?.headers.get('Authorization')).toBe('Bearer test-token');
  });

  it('does not add an Authorization header when no token exists', () => {
    storage.clear();
    const req = new HttpRequest('GET', '/api/test');
    const intercepted: HttpRequest<unknown>[] = [];
    const next = {
      handle: vi.fn((request: HttpRequest<unknown>) => {
        intercepted.push(request);
        return of(new HttpResponse({ status: 200 }));
      }),
    };

    interceptor.intercept(req, next);

    expect(intercepted[0]?.headers.has('Authorization')).toBe(false);
  });

  it('clears the token and redirects to login when the backend returns 401', async () => {
    localStorage.setItem('opositaria_token', 'stale-token');
    const req = new HttpRequest('GET', '/study-spaces');
    const next = {
      handle: vi.fn(() =>
        throwError(() => new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' })),
      ),
    };

    await expect(firstValueFrom(interceptor.intercept(req, next))).rejects.toBeInstanceOf(HttpErrorResponse);

    expect(storage.read()).toBeNull();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });
});

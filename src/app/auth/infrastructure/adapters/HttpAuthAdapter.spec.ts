import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpAuthAdapter } from './HttpAuthAdapter';
import { AuthError } from '../../domain/entities/AuthError';

describe('The HttpAuthAdapter', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [],
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('posts credentials to the backend login endpoint', async () => {
    const adapter = TestBed.inject(HttpAuthAdapter);

    const promise = adapter.login({ email: 'user@example.com', password: 'secret123' });

    const req = httpMock.expectOne('/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'user@example.com', password: 'secret123' });

    req.flush({ access_token: 'abc123', token_type: 'bearer', user: { id: '1', email: 'user@example.com', created_at: '', updated_at: '' } });
    httpMock.verify();

    const token = await promise;
    expect(token.accessToken).toBe('abc123');
  });

  it('maps backend authentication failures to an auth error', async () => {
    const adapter = TestBed.inject(HttpAuthAdapter);

    const promise = adapter.login({ email: 'user@example.com', password: 'wrongpassword' });

    const req = httpMock.expectOne('/auth/login');
    req.flush({ detail: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
    httpMock.verify();

    await expect(promise).rejects.toEqual(AuthError.createUnauthorized('Invalid credentials'));
  });

  it('maps backend connectivity failures to an unknown auth error', async () => {
    const adapter = TestBed.inject(HttpAuthAdapter);

    const promise = adapter.login({ email: 'user@example.com', password: 'secret123' });

    const req = httpMock.expectOne('/auth/login');
    req.flush({ detail: 'Backend unavailable' }, { status: 500, statusText: 'Server Error' });
    httpMock.verify();

    await expect(promise).rejects.toEqual(AuthError.create('Login service unavailable'));
  });

  it('maps malformed backend login responses to an unknown auth error', async () => {
    const adapter = TestBed.inject(HttpAuthAdapter);

    const promise = adapter.login({ email: 'user@example.com', password: 'secret123' });

    const req = httpMock.expectOne('/auth/login');
    req.flush({ access_token: '', token_type: 'bearer' });
    httpMock.verify();

    await expect(promise).rejects.toEqual(AuthError.create('Invalid login response'));
  });
});

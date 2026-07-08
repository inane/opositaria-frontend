import {describe, it, expect, beforeEach, afterEach} from 'vitest';
import {TestBed} from '@angular/core/testing';
import {provideRouter, Router} from '@angular/router';
import {routes} from './app.routes';

describe('The application routes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('navigates to the source ingestion screen', async () => {
    const router = TestBed.inject(Router);

    await router.navigate(['source-ingestion']);

    expect(router.url).toBe('/source-ingestion');
  });

  it('redirects the root path to the source ingestion screen', async () => {
    const router = TestBed.inject(Router);

    await router.navigate(['']);

    expect(router.url).toBe('/source-ingestion');
  });
});

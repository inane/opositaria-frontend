import { afterEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideRouter, Router } from '@angular/router';

import { routes } from './app.routes';
import { AuthGuard } from './auth/infrastructure/adapters/AuthGuard';
import { TokenStorageService } from './auth/infrastructure/adapters/TokenStorageService';
import { StudySpacesDashboardComponent } from './dashboard/infrastructure/ui/study-spaces-dashboard.component';
import { SOURCE_INGESTION_PORT } from './source-ingestion/infrastructure/tokens/source-ingestion-port.token';
import { FakeSourceIngestionAdapter } from './source-ingestion/infrastructure/adapters/FakeSourceIngestionAdapter';
import { DASHBOARD_STORE } from './dashboard/infrastructure/tokens/dashboard-store.token';
import { DashboardStore } from './dashboard/infrastructure/store/dashboard-store.service';

const dashboardProviders = [
  { provide: SOURCE_INGESTION_PORT, useClass: FakeSourceIngestionAdapter },
  { provide: DASHBOARD_STORE, useValue: {} as DashboardStore },
];

describe('The app routes', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('authenticated root redirects to dashboard', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        AuthGuard,
        TokenStorageService,
        ...dashboardProviders,
      ],
    });
    const storage = TestBed.inject(TokenStorageService);
    storage.clear();
    localStorage.setItem('opositaria_token', 'test-token');

    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/');
    const router = TestBed.inject(Router);

    expect(router.url).toContain('/dashboard');
  });

  it('unauthenticated root redirects to login', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes), AuthGuard, TokenStorageService, ...dashboardProviders],
    });
    TestBed.inject(TokenStorageService).clear();

    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/');
    const router = TestBed.inject(Router);

    expect(router.url).toBe('/login');
  });

  it('unauthenticated dashboard redirects to login', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes), AuthGuard, TokenStorageService, ...dashboardProviders],
    });
    TestBed.inject(TokenStorageService).clear();

    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/dashboard');
    const router = TestBed.inject(Router);

    expect(router.url).toBe('/login');
  });

  it('renders the dashboard home shell when authenticated', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        AuthGuard,
        TokenStorageService,
        ...dashboardProviders,
      ],
    });
    const storage = TestBed.inject(TokenStorageService);
    storage.clear();
    localStorage.setItem('opositaria_token', 'test-token');

    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/dashboard', StudySpacesDashboardComponent);
    const root = harness.fixture.nativeElement as HTMLElement;

    expect(root.querySelector('header')).toBeTruthy();
    expect(root.querySelector('main')).toBeTruthy();
    expect(root.querySelector('.study-spaces-dashboard')).toBeTruthy();
  });
});

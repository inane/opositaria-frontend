import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { DashboardComponent } from './dashboard/infrastructure/ui/dashboard-component';
import { SOURCE_INGESTION_PORT } from './source-ingestion/infrastructure/tokens/source-ingestion-port.token';
import { FakeSourceIngestionAdapter } from './source-ingestion/infrastructure/adapters/FakeSourceIngestionAdapter';

describe('The application routes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        { provide: SOURCE_INGESTION_PORT, useClass: FakeSourceIngestionAdapter },
      ],
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('redirects the root path to the dashboard screen', async () => {
    const router = TestBed.inject(Router);

    await router.navigate(['']);

    expect(router.url).toBe('/dashboard');
  });

  it('does not expose source-ingestion as a standalone route', async () => {
    const router = TestBed.inject(Router);

    const navigation = router.navigate(['source-ingestion']);

    await expect(navigation).rejects.toThrow();
  });

  it('renders the dashboard home shell at /dashboard', async () => {
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/dashboard', DashboardComponent);

    const root = harness.fixture.nativeElement as HTMLElement;

    expect(root.querySelector('header')).toBeTruthy();
    expect(root.querySelector('main')).toBeTruthy();
    expect(root.querySelector('footer')).toBeTruthy();
  });
});

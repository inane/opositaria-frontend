import { describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { dashboardRoutes } from './dashboard.routes';
import { StudySpacesDashboardComponent } from './infrastructure/ui/study-spaces-dashboard.component';
import { DASHBOARD_STORE } from './infrastructure/tokens/dashboard-store.token';
import { DashboardStore } from './infrastructure/store/dashboard-store.service';

describe('The dashboard routes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: DASHBOARD_STORE, useValue: {} as DashboardStore },
      ],
    });
  });

  it('renders the study-spaces dashboard as the dashboard home', () => {
    const homeRoute = dashboardRoutes[0];

    expect(homeRoute.path).toBe('');
    expect(homeRoute.component).toBe(StudySpacesDashboardComponent);
  });

  it('does not expose source ingestion as an implicit dashboard child route', () => {
    const homeRoute = dashboardRoutes[0];

    expect(homeRoute.children?.some((route) => route.path === '' && route.loadChildren)).toBe(false);
  });

  it('provides a fallback route for unknown dashboard paths', () => {
    const homeRoute = dashboardRoutes[0];
    const fallbackRoute = homeRoute.children?.find((r) => r.path === '**');

    expect(fallbackRoute).toBeDefined();
    expect(fallbackRoute?.redirectTo).toBe('');
  });

  it('has a detail route for /dashboard/spaces/:spaceId', () => {
    const homeRoute = dashboardRoutes[0];
    const detailRoute = homeRoute.children?.find((r) => r.path === 'spaces/:spaceId');

    expect(detailRoute).toBeDefined();
    expect(detailRoute?.loadComponent).toBeDefined();
  });
});

import { describe, expect, it, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { dashboardRoutes } from './dashboard.routes';
import { StudySpacesDashboardComponent } from './infrastructure/ui/study-spaces-dashboard.component';

describe('The dashboard routes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
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
});

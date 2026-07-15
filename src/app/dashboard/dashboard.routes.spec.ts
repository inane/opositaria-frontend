import { describe, expect, it } from 'vitest';
import { dashboardRoutes } from './dashboard.routes';
import { StudySpacesDashboardComponent } from './infrastructure/ui/study-spaces-dashboard.component';

describe('The dashboard routes', () => {
  it('renders the study-spaces dashboard as the dashboard home', () => {
    const homeRoute = dashboardRoutes[0];

    expect(homeRoute.path).toBe('');
    expect(homeRoute.component).toBe(StudySpacesDashboardComponent);
  });

  it('resolves source ingestion as a child route inside the dashboard', async () => {
    const homeRoute = dashboardRoutes[0];
    const childRoute = homeRoute.children?.[0];

    const childRoutes = await childRoute?.loadChildren?.();

    expect(childRoute?.path).toBe('');
    expect(childRoutes).toEqual([{ path: '', component: expect.any(Function) }]);
  });

  it('provides a fallback route for unknown dashboard paths', () => {
    const homeRoute = dashboardRoutes[0];
    const fallbackRoute = homeRoute.children?.find((r) => r.path === '**');

    expect(fallbackRoute).toBeDefined();
    expect(fallbackRoute?.redirectTo).toBe('');
  });
});
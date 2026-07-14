import { describe, expect, it } from 'vitest';
import { dashboardRoutes } from './dashboard.routes';
import { DashboardComponent } from './infrastructure/ui/dashboard-component';

describe('The dashboard routes', () => {
  it('renders the dashboard shell as the dashboard home', () => {
    const homeRoute = dashboardRoutes[0];

    expect(homeRoute.path).toBe('');
    expect(homeRoute.component).toBe(DashboardComponent);
  });

  it('loads source ingestion inside the dashboard home', async () => {
    const homeRoute = dashboardRoutes[0];
    const childRoute = homeRoute.children?.[0];

    const childRoutes = await childRoute?.loadChildren?.();

    expect(childRoute?.path).toBe('');
    expect(childRoutes).toEqual([{ path: '', component: expect.any(Function) }]);
  });
});

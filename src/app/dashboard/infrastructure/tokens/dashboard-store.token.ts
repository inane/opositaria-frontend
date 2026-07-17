import { InjectionToken } from '@angular/core';
import { DashboardStore } from '../store/dashboard-store.service';

export const DASHBOARD_STORE = new InjectionToken<DashboardStore>(
  'DASHBOARD_STORE',
);

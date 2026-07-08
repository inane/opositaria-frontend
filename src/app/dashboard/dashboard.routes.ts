import { Routes } from '@angular/router';
import { DashboardShellComponent } from './infrastructure/ui/dashboard-shell.component';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardShellComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../source-ingestion/source-ingestion.routes').then(
            (m) => m.sourceIngestionRoutes,
          ),
      },
    ],
  },
];

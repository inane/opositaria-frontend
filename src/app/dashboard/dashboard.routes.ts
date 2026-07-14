import { Routes } from '@angular/router';
import { DashboardComponent } from './infrastructure/ui/dashboard-component';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
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

import { Routes } from '@angular/router';
import { StudySpacesDashboardComponent } from './infrastructure/ui/study-spaces-dashboard.component';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: StudySpacesDashboardComponent,
    children: [
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];

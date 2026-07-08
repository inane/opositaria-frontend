import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'source-ingestion' },
  {
    path: 'source-ingestion',
    loadComponent: () =>
      import('./source-ingestion/infrastructure/ui/source-ingestion.component').then(
        (m) => m.SourceIngestionComponent,
      ),
  },
];

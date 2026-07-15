import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./infrastructure/ui/login.component').then((m) => m.LoginComponent),
  },
];

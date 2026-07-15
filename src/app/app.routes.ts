import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuard } from './auth/infrastructure/adapters/AuthGuard';
import { TokenStorageService } from './auth/infrastructure/adapters/TokenStorageService';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [() => {
      const storage = inject(TokenStorageService);
      const router = inject(Router);
      return storage.read() ? router.parseUrl('/dashboard') : router.parseUrl('/login');
    }],
    children: [],
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.routes').then((m) => m.dashboardRoutes),
    canActivate: [AuthGuard],
  },
];

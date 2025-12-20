import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth/login',
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'features/event-hub',
    loadComponent: () => import('./features/event-hub/event-hub').then((m) => m.EventHub),
    canActivate: [authGuard],
  },
  {
    path: 'features/event-management',
    loadComponent: () =>
      import('./features/features-management/event-management/event-management').then(
        (m) => m.EventManagement
      ),
    canActivate: [authGuard],
  },
];

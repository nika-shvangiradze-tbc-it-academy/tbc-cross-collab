import { Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: SignInComponent,
  },

  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
];

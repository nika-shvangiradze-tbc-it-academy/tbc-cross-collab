import { Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in';
import { SignUp } from './components/sign-up/sign-up';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: SignInComponent,
  },
  {
    path: 'register',
    component: SignUp,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
];

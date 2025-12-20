import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthMockService } from '../services/auth-mock.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthMockService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/auth/login'], {
    queryParams: { returnUrl: state.url },
  });
  return false;
};

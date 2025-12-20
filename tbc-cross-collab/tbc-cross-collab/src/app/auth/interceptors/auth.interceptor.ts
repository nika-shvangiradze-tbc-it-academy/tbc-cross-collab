import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthMockService } from '../services/auth-mock.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthMockService);
  const token = authService.getToken();

  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(clonedReq);
  }

  return next(req);
};

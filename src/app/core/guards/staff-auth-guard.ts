import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { StaffAuthService } from '../services/staff-auth.service';

export const staffAuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const staffAuthService = inject(StaffAuthService);
  const router = inject(Router);

  const isAuthenticated = staffAuthService.isAuthenticated();

  if (!isAuthenticated) {
    const returnUrl = route.url.map(segment => segment.path).join('/');
    router.navigate(['/staff/login'], {
      queryParams: { returnUrl: `${returnUrl}`}
    });
    return false;
  }

  return true;
};

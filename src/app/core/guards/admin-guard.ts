import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StaffAuthService } from '../services/staff-auth.service';

export const adminGuard: CanActivateFn = () => {
  const staffAuthService = inject(StaffAuthService);
  const router = inject(Router);

  const isAuthenticated = staffAuthService.isAuthenticated();
  const isAdmin = staffAuthService.isAdmin();

  if (!isAuthenticated) {
    router.navigate(['/staff/login']);
    return false;
  }

  if (!isAdmin) {
    router.navigate(['/staff/dashboard']);
    return false;
  }

  return true;
};

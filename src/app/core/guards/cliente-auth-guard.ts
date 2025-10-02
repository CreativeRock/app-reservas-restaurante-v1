import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { ClienteAuthService } from '../services/cliente-auth.service';
import { inject } from '@angular/core';

export const clienteAuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const clienteAuthService = inject(ClienteAuthService);
  const router = inject(Router);

  const isAuthenticated = clienteAuthService.isAuthenticated()

  if (!isAuthenticated) {
    const returnUrl = route.url.map(segment => segment.path).join('/');
    router.navigate(['/login'], {
      queryParams: {returnUrl: `${returnUrl}`}
    })

    return false;
  }

  return true;
};

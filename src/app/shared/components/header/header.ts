import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ClienteAuthService } from 'src/app/core/services/cliente-auth.service';
import { StaffAuthService } from 'src/app/core/services/staff-auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.html',
})
export class Header {
  private router = inject(Router);
  private clienteAuthService = inject(ClienteAuthService);
  private staffAuthService = inject(StaffAuthService);

  isClienteLoggedIn = false;
  isStaffLoggedIn = false;
  currentUser: any = null;
  navbarOpen = false;

  ngOnInit(): void {
    this.isClienteLoggedIn = this.clienteAuthService.isAuthenticated();
    this.isStaffLoggedIn = this.staffAuthService.isAuthenticated();

    if (this.isClienteLoggedIn) {
      this.currentUser = this.clienteAuthService.getCurrentClienteValue();
    } else if (this.isStaffLoggedIn) {
      this.currentUser = this.staffAuthService.getCurrentUsuarioValue();
    }
  }

  toggleNavbar(): void {
    this.navbarOpen = !this.navbarOpen;
  }

  logout(): void {
    if (this.isClienteLoggedIn) {
      this.clienteAuthService.logout().subscribe(() => {
        this.router.navigate(['/']);
      });
    } else if (this.isStaffLoggedIn) {
      this.staffAuthService.logout().subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }

  goToDashboard(): void {
    if (this.isClienteLoggedIn) {
      this.router.navigate(['/cliente/dashboard']);
    } else if (this.isStaffLoggedIn) {
      this.router.navigate(['/staff/dashboard']);
    }
  }
}

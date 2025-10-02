import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClienteAuthService } from 'src/app/core/services/cliente-auth.service';

@Component({
  selector: 'app-cliente-login',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './cliente-login.html',
})

export class ClienteLogin {
  private fb = inject(FormBuilder);
  private clienteAuthService = inject(ClienteAuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm: FormGroup;
  loading = false;
  error = '';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = '';

      const credentials = this.loginForm.value;

      this.clienteAuthService.login(credentials).subscribe({
        next: (response) => {
          this.loading = false;

          if (response.success) {
            const returUrl = this.route.snapshot.queryParams['returUrl'] || '/cliente/dashboard';
            this.router.navigateByUrl(returUrl);
          } else {
            this.error = response.message || 'Error al iniciar sesión';
          }
        },
        error: (error) => {
          this.loading = false;
          this.error = error.message || 'Error de conexión';
        }
      });
    }
  }
}

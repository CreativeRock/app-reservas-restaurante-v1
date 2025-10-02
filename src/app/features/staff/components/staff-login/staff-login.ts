import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StaffAuthService } from 'src/app/core/services/staff-auth.service';

@Component({
  selector: 'app-staff-login',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './staff-login.html',
})

export class StaffLogin {
  private fb = inject(FormBuilder);
  private staffAuthService = inject(StaffAuthService);
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

      this.staffAuthService.login(credentials).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/staff/dashboard';
            this.router.navigateByUrl(returnUrl);
          } else {
            this.error = response.message || 'Error al iniciar sesión';
          }
        },
        error: (error) => {
          this.loading = false;
          this.error = error.message || 'Error de conexión';
        }
      });
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }
}

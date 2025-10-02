import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ClienteAuthService } from 'src/app/core/services/cliente-auth.service';

@Component({
  selector: 'app-cliente-register',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './cliente-register.html',
})
export class ClienteRegister {
  private fb = inject(FormBuilder);
  private clienteAuthService = inject(ClienteAuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  loading = false;
  error = '';

  constructor() {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      preferencias: ['']
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.error = '';

      const registerData = {
        nombre: this.registerForm.value.nombre,
        apellido: this.registerForm.value.apellido,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        telefono: this.registerForm.value.telefono,
        preferencias: this.registerForm.value.preferencias
      };

      this.clienteAuthService.register(registerData).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            this.router.navigate(['/cliente/dashboard']);
          } else {
            this.error = response.message || 'Error al crear la cuenta';
          }
        },
        error: (error) => {
          this.loading = false;
          this.error = error.message || 'Error de conexión';
        }
      });
    } else {
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
    }
  }
}

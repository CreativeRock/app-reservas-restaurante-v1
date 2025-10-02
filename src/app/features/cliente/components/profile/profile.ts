import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ClienteAuthService } from 'src/app/core/services/cliente-auth.service';
import { ErrorMessage } from 'src/app/shared/components/error-message/error-message';
import { Footer } from 'src/app/shared/components/footer/footer';
import { Header } from 'src/app/shared/components/header/header';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, RouterModule, Header, Footer, ErrorMessage],
  templateUrl: './profile.html',
})
export class Profile implements OnInit {
  private clienteAuthService = inject(ClienteAuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  profileForm!: FormGroup;
  loading = false;
  error = '';
  success = '';

  ngOnInit(): void {
    const currentCliente = this.clienteAuthService.getCurrentClienteValue();

    this.profileForm = this.fb.group({
      nombre: [currentCliente?.nombre || '', Validators.required],
      apellido: [currentCliente?.apellido || '', Validators.required],
      email: [currentCliente?.email || '', [Validators.required, Validators.email]],
      telefono: [currentCliente?.telefono || '', Validators.required],
      preferencias: [currentCliente?.preferencias || '']
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.loading = true;
      this.error = '';
      this.success = '';

      // En una implementación real, aquí llamarías al servicio para actualizar el perfil
      setTimeout(() => {
        this.loading = false;
        this.success = 'Perfil actualizado correctamente';
      }, 1000);
    } else {
      Object.keys(this.profileForm.controls).forEach(key => {
        this.profileForm.get(key)?.markAsTouched();
      });
    }
  }

  navigateToDashboard(): void {
    this.router.navigate(['/cliente/dashboard']);
  }
}

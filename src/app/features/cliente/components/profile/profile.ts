// profile.ts
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ClienteAuthService } from 'src/app/core/services/cliente-auth.service';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { ErrorMessage } from 'src/app/shared/components/error-message/error-message';
import { Footer } from 'src/app/shared/components/footer/footer';
import { Header } from 'src/app/shared/components/header/header';
import { Cliente } from 'src/app/shared/models/cliente';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, RouterModule, Header, Footer, ErrorMessage],
  templateUrl: './profile.html',
})
export class Profile implements OnInit {
  private clienteAuthService = inject(ClienteAuthService);
  private clienteService = inject(ClienteService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  profileForm!: FormGroup;
  loading = false;
  error = '';
  success = '';

  ngOnInit(): void {
    const currentCliente = this.clienteAuthService.getCurrentClienteValue();

    if (!currentCliente) {
      this.router.navigate(['/login']);
      return;
    }

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

      const currentCliente = this.clienteAuthService.getCurrentClienteValue();

      if (!currentCliente) {
        this.error = 'No se pudo obtener la información del cliente';
        this.loading = false;
        return;
      }

      // Usar el servicio para actualizar el perfil
      this.clienteService.updateProfile(this.profileForm.value).subscribe({
        next: (response) => {
          this.loading = false;
          this.success = 'Perfil actualizado correctamente';

          // Actualizar los datos en el servicio de autenticación
          this.updateAuthServiceData(response);
        },
        error: (error) => {
          this.loading = false;
          this.error = error.message;
        }
      });
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.profileForm.controls).forEach(key => {
        this.profileForm.get(key)?.markAsTouched();
      });
    }
  }

  private updateAuthServiceData(updatedCliente: Cliente): void {
    // Actualizar el cliente en el servicio de autenticación
    // Esto depende de cómo tengas implementado tu ClienteAuthService
    const currentCliente = this.clienteAuthService.getCurrentClienteValue();

    if (currentCliente) {
      const updatedData = {
        ...currentCliente,
        nombre: updatedCliente.nombre,
        apellido: updatedCliente.apellido,
        email: updatedCliente.email,
        telefono: updatedCliente.telefono,
        preferencias: updatedCliente.preferencias
      };

      // Si tu ClienteAuthService tiene un método para actualizar el cliente, úsalo aquí
      // Por ejemplo: this.clienteAuthService.updateCurrentCliente(updatedData);
    }
  }

  navigateToDashboard(): void {
    this.router.navigate(['/cliente/dashboard']);
  }
}

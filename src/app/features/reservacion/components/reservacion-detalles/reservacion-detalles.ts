import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClienteAuthService } from 'src/app/core/services/cliente-auth.service';
import { MesaService } from 'src/app/core/services/mesa.service';
import { ReservaService } from 'src/app/core/services/reserva.service';
import { Footer } from 'src/app/shared/components/footer/footer';
import { Header } from 'src/app/shared/components/header/header';
import { Mesa } from 'src/app/shared/models/mesa';
import { ReservaRequest } from 'src/app/shared/models/reserva';

@Component({
  selector: 'app-reservacion-detalles',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, Header, Footer],
  templateUrl: './reservacion-detalles.html',
})

export class ReservacionDetalles {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private mesaService = inject(MesaService);
  private reservaService = inject(ReservaService);
  private clienteAuthService = inject(ClienteAuthService);
  private fb = inject(FormBuilder);

  mesa: Mesa | null = null;
  searchParams: any = {};
  reservationForm!: FormGroup;
  loading = false;
  error = '';
  isClienteLoggedIn = false;

  ngOnInit(): void {
    const tableId = this.route.snapshot.paramMap.get('tableId');
    this.route.queryParams.subscribe(params => {
      this.searchParams = params;
      if (tableId) {
        this.loadMesa(parseInt(tableId));
      }
    });

    this.isClienteLoggedIn = this.clienteAuthService.isAuthenticated();

    this.reservationForm = this.fb.group({
      nombre_completo: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      notas: ['']
    });

    // Si el cliente está logueado, precargar sus datos
    if (this.isClienteLoggedIn) {
      const currentCliente = this.clienteAuthService.getCurrentClienteValue();
      if (currentCliente) {
        this.reservationForm.patchValue({
          nombre_completo: `${currentCliente.nombre} ${currentCliente.apellido}`,
          email: currentCliente.email,
          telefono: currentCliente.telefono
        });
      }
    }
  }

  loadMesa(id: number): void {
    this.mesaService.getMesaById(id).subscribe({
      next: (mesa) => {
        this.mesa = mesa;
      },
      error: (error) => {
        this.error = error.message;
      }
    });
  }

  onSubmit(): void {
    if (this.reservationForm.valid && this.mesa) {
      this.loading = true;
      this.error = '';

      const currentCliente = this.clienteAuthService.getCurrentClienteValue();

      const reserva: ReservaRequest = {
        id_mesa: this.mesa.id_mesa,
        fecha_reserva: this.searchParams.fecha,
        hora_reserva: this.searchParams.hora,
        numero_personas: this.searchParams.capacidad,
        tipo_reserva: 'online',
        notas: this.reservationForm.get('notas')?.value,
        estado: 'pendiente'
      };

      // Si el cliente está logueado, asociar la reserva
      if (currentCliente) {
        reserva.id_cliente = currentCliente.id_cliente;
      }

      this.reservaService.createReserva(reserva).subscribe({
        next: (reservaCreada) => {
          this.loading = false;
          this.router.navigate(['/reservacion/confirmacion', reservaCreada.id_reserva]);
        },
        error: (error) => {
          this.loading = false;
          this.error = error.message;
        }
      });
    } else {
      Object.keys(this.reservationForm.controls).forEach(key => {
        this.reservationForm.get(key)?.markAsTouched();
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/disponibilidad'], {
      queryParams: this.searchParams
    });
  }
}

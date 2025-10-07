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
  today = new Date().toISOString().split('T')[0]

  ngOnInit(): void {
    const mesaId = this.route.snapshot.paramMap.get('mesaId');

    // PRIMERO: Crear el formulario con TODOS los controles
    this.reservationForm = this.fb.group({
      nombre_completo: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      fecha: ['', Validators.required],  // ← Control fecha
      hora: ['', Validators.required],    // ← Control hora
      notas: ['']
    });

    this.isClienteLoggedIn = this.clienteAuthService.isAuthenticated();

    // SEGUNDO: Suscribirse a queryParams y cargar mesa
    this.route.queryParams.subscribe(params => {
      this.searchParams = params;
      console.log('Params recibidos:', this.searchParams);

      // Pre-cargar valores si vienen de disponibilidad
      if (this.searchParams.fecha && this.searchParams.hora) {
        this.reservationForm.patchValue({
          fecha: this.searchParams.fecha,
          hora: this.searchParams.hora
        });
      }

      if (mesaId) {
        this.loadMesa(parseInt(mesaId));
      }
    });

    // Pre-cargar datos de cliente si está logueado
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
        numero_personas: this.searchParams.capacidad || this.mesa.capacidad,
        tipo_reserva: 'online',
        fecha_reserva: this.reservationForm.get('fecha')?.value,
        hora_reserva: this.reservationForm.get('hora')?.value,
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

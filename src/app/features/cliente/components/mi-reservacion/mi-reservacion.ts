import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ClienteAuthService } from 'src/app/core/services/cliente-auth.service';
import { ClienteReservaService } from 'src/app/core/services/cliente-reserva.service';
import { ErrorMessage } from 'src/app/shared/components/error-message/error-message';
import { Footer } from 'src/app/shared/components/footer/footer';
import { Header } from 'src/app/shared/components/header/header';
import { LoadingSpinner } from 'src/app/shared/components/loading-spinner/loading-spinner';
import { Reserva } from 'src/app/shared/models/reserva';

@Component({
  selector: 'app-mi-reservacion',
  imports: [RouterModule, Header, Footer, LoadingSpinner, ErrorMessage, DatePipe],
  templateUrl: './mi-reservacion.html',
})
export class MiReservacion implements OnInit {
  private clienteAuthService = inject(ClienteAuthService);
  private clienteReservaService = inject(ClienteReservaService);
  private router = inject(Router);

  cliente: any = null;
  reservas: Reserva[] = [];
  loading = false;
  error = '';
  cancelandoReserva: number | null = null;

  ngOnInit(): void {
    this.cliente = this.clienteAuthService.getCurrentClienteValue();
    if (!this.cliente) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadReservas();
  }

  loadReservas(): void {
    this.loading = true;
    this.error = '';

    this.clienteReservaService.getReservasByCliente().subscribe({
      next: (reservas) => {
        // Ordenar por fecha más reciente primero
        this.reservas = reservas.sort((a, b) =>
          new Date(b.fecha_reserva + ' ' + b.hora_reserva).getTime() -
          new Date(a.fecha_reserva + ' ' + a.hora_reserva).getTime()
        );
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }

  cancelReserva(reserva: Reserva): void {
    if (!this.canCancel(reserva)) {
      return;
    }

    const confirmar = confirm(`¿Estás seguro de que quieres cancelar la reserva ${reserva.codigo_reserva}?`);
    if (!confirmar) return;

    this.cancelandoReserva = reserva.id_reserva;

    this.clienteReservaService.cancelReserva(reserva.id_reserva).subscribe({
      next: (reservaActualizada) => {
        const index = this.reservas.findIndex(r => r.id_reserva === reserva.id_reserva);
        if (index !== -1) {
          this.reservas[index] = reservaActualizada;
        }
        this.cancelandoReserva = null;
      },
      error: (error) => {
        this.error = error.message;
        this.cancelandoReserva = null;
      }
    });
  }

  canCancel(reserva: Reserva): boolean {
    const fechaReserva = new Date(reserva.fecha_reserva + ' ' + reserva.hora_reserva);
    const ahora = new Date();

    // Permitir cancelar solo si la reserva es en más de 2 horas
    const diferenciaHoras = (fechaReserva.getTime() - ahora.getTime()) / (1000 * 60 * 60);

    return (reserva.estado === 'pendiente' || reserva.estado === 'confirmada') && diferenciaHoras > 2;
  }

  getStatusBadgeClass(estado: string): string {
    const classes: { [key: string]: string } = {
      'pendiente': 'bg-yellow-100 text-yellow-800',
      'confirmada': 'bg-green-100 text-green-800',
      'cancelada': 'bg-red-100 text-red-800',
      'no_show': 'bg-gray-100 text-gray-800'
    };
    return classes[estado] || 'bg-gray-100 text-gray-800';
  }

  getStatusText(estado: string): string {
    const texts: { [key: string]: string } = {
      'pendiente': 'Pendiente de Confirmación',
      'confirmada': 'Confirmada',
      'cancelada': 'Cancelada',
      'no_show': 'No Show'
    };
    return texts[estado] || estado;
  }

  navigateToDashboard(): void {
    this.router.navigate(['/cliente/dashboard']);
  }

  makeNewReservation(): void {
    this.router.navigate(['/mesas']);
  }
}

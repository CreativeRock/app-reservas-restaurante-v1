import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ClienteAuthService } from 'src/app/core/services/cliente-auth.service';
import { ReservaService } from 'src/app/core/services/reserva.service';
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
  private reservaService = inject(ReservaService);
  private router = inject(Router);

  cliente: any = null;
  reservas: Reserva[] = [];
  loading = false;
  error = '';
  cancelandoReserva: number | null = null;

  ngOnInit(): void {
    this.cliente = this.clienteAuthService.getCurrentClienteValue();
    this.loadReservas();
  }

  loadReservas(): void {
    this.loading = true;

    if (this.cliente) {
      this.reservaService.getReservasByCliente(this.cliente.id_cliente).subscribe({
        next: (reservas) => {
          this.reservas = reservas;
          this.loading = false;
        },
        error: (error) => {
          this.error = error.message;
          this.loading = false;
        }
      });
    }
  }

  cancelReserva(reserva: Reserva): void {
    if (reserva.estado === 'pendiente' || reserva.estado === 'confirmada') {
      this.cancelandoReserva = reserva.id_reserva;

      this.reservaService.cancelReserva(reserva.id_reserva).subscribe({
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
  }

  canCancel(reserva: Reserva): boolean {
    return (reserva.estado === 'pendiente' || reserva.estado === 'confirmada');
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
    this.router.navigate(['/']);
  }
}

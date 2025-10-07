import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { StaffReservaService } from 'src/app/core/services/staff-reserva.service';
import { ErrorMessage } from 'src/app/shared/components/error-message/error-message';
import { Footer } from 'src/app/shared/components/footer/footer';
import { Header } from 'src/app/shared/components/header/header';
import { LoadingSpinner } from 'src/app/shared/components/loading-spinner/loading-spinner';
import { Reserva } from 'src/app/shared/models/reserva';

@Component({
  selector: 'app-reservas',
  imports: [RouterModule, Header, Footer, LoadingSpinner, ErrorMessage, DatePipe, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './reservas.html',
})

export class Reservas {
  private reservaService = inject(StaffReservaService);
  private router = inject(Router);

  reservas: Reserva[] = [];
  loading = false;
  error = '';
  filtroEstado: string = 'todas';

  ngOnInit(): void {
    this.loadReservas();
  }

  loadReservas(): void {
    this.loading = true;

    this.reservaService.getAllReservas().subscribe({
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

  get reservasFiltradas(): Reserva[] {
    if (this.filtroEstado === 'todas') {
      return this.reservas;
    }
    return this.reservas.filter(reserva => reserva.estado === this.filtroEstado);
  }

  confirmarReserva(reserva: Reserva): void {
    this.reservaService.updateReserva(reserva.id_reserva, { estado: 'confirmada' }).subscribe({
      next: (reservaActualizada) => {
        const index = this.reservas.findIndex(r => r.id_reserva === reserva.id_reserva);
        if (index !== -1) {
          this.reservas[index] = reservaActualizada;
        }
      },
      error: (error) => {
        this.error = error.message;
      }
    });
  }

  cancelarReserva(reserva: Reserva): void {
    this.reservaService.cancelReserva(reserva.id_reserva).subscribe({
      next: (reservaActualizada) => {
        const index = this.reservas.findIndex(r => r.id_reserva === reserva.id_reserva);
        if (index !== -1) {
          this.reservas[index] = reservaActualizada;
        }
      },
      error: (error) => {
        this.error = error.message;
      }
    });
  }

  canConfirm(reserva: Reserva): boolean {
    return reserva.estado === 'pendiente';
  }

  canCancel(reserva: Reserva): boolean {
    return reserva.estado === 'pendiente' || reserva.estado === 'confirmada';
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
      'pendiente': 'Pendiente',
      'confirmada': 'Confirmada',
      'cancelada': 'Cancelada',
      'no_show': 'No Show'
    };
    return texts[estado] || estado;
  }

  navigateToDashboard(): void {
    this.router.navigate(['/staff/dashboard']);
  }
}

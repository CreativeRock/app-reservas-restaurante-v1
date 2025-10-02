import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MesaService } from 'src/app/core/services/mesa.service';
import { ReservaService } from 'src/app/core/services/reserva.service';
import { StaffAuthService } from 'src/app/core/services/staff-auth.service';
import { ErrorMessage } from 'src/app/shared/components/error-message/error-message';
import { Footer } from 'src/app/shared/components/footer/footer';
import { Header } from 'src/app/shared/components/header/header';
import { LoadingSpinner } from 'src/app/shared/components/loading-spinner/loading-spinner';
import { Mesa } from 'src/app/shared/models/mesa';
import { Reserva } from 'src/app/shared/models/reserva';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule, Header, Footer, LoadingSpinner, ErrorMessage],
  templateUrl: './dashboard.html',
})

export class Dashboard {
  private staffAuthService = inject(StaffAuthService);
  private reservaService = inject(ReservaService);
  private mesaService = inject(MesaService);
  private router = inject(Router);

  usuario: any = null;
  reservasHoy: Reserva[] = [];
  mesas: Mesa[] = [];
  loading = false;
  error = '';

  ngOnInit(): void {
    this.usuario = this.staffAuthService.getCurrentUsuarioValue();
    this.loadDatosDashboard();
  }

  loadDatosDashboard(): void {
    this.loading = true;

    // Cargar reservas de hoy
    const hoy = new Date().toISOString().split('T')[0];
    this.reservaService.getReservasByFecha(hoy).subscribe({
      next: (reservas) => {
        this.reservasHoy = reservas;
        this.loadMesas();
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }

  loadMesas(): void {
    this.mesaService.getAllMesas().subscribe({
      next: (mesas) => {
        this.mesas = mesas;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }

  getTotalMesas(): number {
    return this.mesas.length;
  }

  getMesasDisponibles(): number {
    return this.mesas.filter(mesa => mesa.estado === 'disponible').length;
  }

  getReservasConfirmadas(): number {
    return this.reservasHoy.filter(reserva => reserva.estado === 'confirmada').length;
  }

  getReservasPendientes(): number {
    return this.reservasHoy.filter(reserva => reserva.estado === 'pendiente').length;
  }

  navigateToReservas(): void {
    this.router.navigate(['/staff/reservas']);
  }

  navigateToMesas(): void {
    this.router.navigate(['/staff/mesas']);
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
}

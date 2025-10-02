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
  selector: 'app-dashboard',
  imports: [RouterModule, Header, Footer, LoadingSpinner, ErrorMessage],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private clienteAuthService = inject(ClienteAuthService);
  private reservaService = inject(ReservaService);
  private router = inject(Router);

  cliente: any = null;
  reservasRecientes: Reserva[] = []
  loading = false;
  error = '';
  confirmadasCount: any;
  pendientesCount: any;

  ngOnInit(): void {
    this.cliente = this.clienteAuthService.getCurrentClienteValue();
    this.loadReservasRecientes();
  }

  loadReservasRecientes(): void {
    this.loading = true;

    if (this.cliente) {
      this.reservaService.getReservasByCliente(this.cliente.id_cliente).subscribe({
        next: (reservas) => {
          this.reservasRecientes = reservas.slice(0, 3);
          this.loading = false;
        },
        error: (error) => {
          this.error = error.message;
          this.loading = false;
        }
      });
    }
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

  navigateToReservations(): void {
    this.router.navigate(['/cliente/mis-reservas']);
  }

  navigateToProfile(): void {
    this.router.navigate(['/cliente/perfil']);
  }

  makeNewReservation(): void {
    this.router.navigate(['/']);
  }
}

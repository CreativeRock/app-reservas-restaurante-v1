import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservaService } from 'src/app/core/services/reserva.service';
import { Footer } from 'src/app/shared/components/footer/footer';
import { Header } from 'src/app/shared/components/header/header';
import { Reserva } from 'src/app/shared/models/reserva';

@Component({
  selector: 'app-reservacion-confirmacion',
  imports: [CommonModule, Header, Footer],
  templateUrl: './reservacion-confirmacion.html'
})

export class ReservacionConfirmacion {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private reservaService = inject(ReservaService);

  reserva: Reserva | null = null;
  loading = true;

  ngOnInit(): void {
    const reservaId = this.route.snapshot.paramMap.get('reservaId');
    if (reservaId) {
      this.loadReserva(parseInt(reservaId));
    }
  }

  loadReserva(id: number): void {
    this.reservaService.getReservaById(id).subscribe({
      next: (reserva) => {
        this.reserva = reserva;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading reservation:', error);
        this.loading = false;
      }
    });
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

  goToHome(): void {
    this.router.navigate(['/']);
  }

  goToMyReservations(): void {
    this.router.navigate(['/cliente/mis-reservas']);
  }
}

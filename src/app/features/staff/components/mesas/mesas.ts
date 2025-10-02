import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MesaService } from 'src/app/core/services/mesa.service';
import { Mesa } from 'src/app/shared/models/mesa';
import { Header } from "src/app/shared/components/header/header";
import { LoadingSpinner } from "src/app/shared/components/loading-spinner/loading-spinner";
import { ErrorMessage } from "src/app/shared/components/error-message/error-message";
import { Footer } from "src/app/shared/components/footer/footer";

@Component({
  selector: 'app-mesas',
  imports: [Header, LoadingSpinner, ErrorMessage, Footer],
  templateUrl: './mesas.html',
  styles: ``
})
export class Mesas {
  private mesaService = inject(MesaService);
  private router = inject(Router);

  mesas: Mesa[] = [];
  loading = false;
  error = '';

  ngOnInit(): void {
    this.loadMesas();
  }

  loadMesas(): void {
    this.loading = true;

    this.mesaService.getAllMesas().subscribe({
      next: (mesas) => {
        this.mesas = mesas;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }

  //TODO: Implementacion en API y Debug
  // cambiarEstadoMesa(mesa: Mesa, nuevoEstado: string): void {
  //   this.mesaService.cambiarEstadoMesa(mesa.id_mesa, nuevoEstado).subscribe({
  //     next: (mesaActualizada: Mesa) => {
  //       const index = this.mesas.findIndex(m => m.id_mesa === mesa.id_mesa);
  //       if (index !== -1) {
  //         this.mesas[index] = mesaActualizada;
  //       }
  //     },
  //     error: (error: any) => {
  //       this.error = error.message;
  //     }
  //   });
  // }

  getBadgeClass(tipo: string): string {
    const badgeClasses: { [key: string]: string } = {
      'Vip': 'bg-purple-100 text-purple-800',
      'Premium': 'bg-yellow-100 text-yellow-800',
      'Standard': 'bg-blue-100 text-blue-800'
    };
    return badgeClasses[tipo] || 'bg-gray-100 text-gray-800';
  }

  getEstadoBadgeClass(estado: string): string {
    const classes: { [key: string]: string } = {
      'disponible': 'bg-green-100 text-green-800',
      'reservada': 'bg-yellow-100 text-yellow-800',
      'fuera_servicio': 'bg-red-100 text-red-800'
    };
    return classes[estado] || 'bg-gray-100 text-gray-800';
  }

  getEstadoText(estado: string): string {
    const texts: { [key: string]: string } = {
      'disponible': 'Disponible',
      'reservada': 'Reservada',
      'fuera_servicio': 'Fuera de Servicio'
    };
    return texts[estado] || estado;
  }

  navigateToDashboard(): void {
    this.router.navigate(['/staff/dashboard']);
  }
}

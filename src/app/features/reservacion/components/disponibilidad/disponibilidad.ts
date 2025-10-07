import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MesaService } from 'src/app/core/services/mesa.service';
import { ErrorMessage } from 'src/app/shared/components/error-message/error-message';
import { Footer } from 'src/app/shared/components/footer/footer';
import { Header } from 'src/app/shared/components/header/header';
import { LoadingSpinner } from 'src/app/shared/components/loading-spinner/loading-spinner';
import { Mesa } from 'src/app/shared/models/mesa';
import { SearchParams } from '../../../../shared/models/mesa';

@Component({
  selector: 'app-disponibilidad',
  imports: [RouterModule, Header, Footer, LoadingSpinner, ErrorMessage,],
  templateUrl: './disponibilidad.html',
})

export class Disponibilidad implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private mesaService = inject(MesaService);

  mesas: Mesa[] = [];
  searchParams: SearchParams | null = null;
  loading = false;
  error = '';

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchParams = {
        fecha: params['fecha'],
        hora: params['hora'],
        capacidad: +params['capacidad']
      };
      console.log('Params recibidos:', this.searchParams); // DEBUG
      this.loadAvailability();
    });
  }

  loadAvailability(): void {
    if (!this.searchParams) return;

    this.loading = true;
    this.error = '';

    console.log('Llamando a getMesasDisponibles con:', this.searchParams); // DEBUG

    this.mesaService.getMesasDisponibles(this.searchParams).subscribe({
      next: (mesas) => {
        console.log('Respuesta recibida:', mesas); // DEBUG
        console.log('Tipo de respuesta:', typeof mesas); // DEBUG
        console.log('Es array?', Array.isArray(mesas)); // DEBUG
        this.mesas = mesas;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error en suscripción:', error); // DEBUG
        this.error = error.message;
        this.loading = false;
      }
    });
  }

  reserveTable(mesaId: number): void {
    if (this.searchParams) {
      this.router.navigate(['/reservacion', mesaId], {
        queryParams: this.searchParams
      });
    }
  }

  viewAllTables(): void {
    this.router.navigate(['/mesas']);
  }

  goBack(): void {
    this.router.navigate(['/'])
  }

  getMesaImage(mesa: Mesa): string {
  // Usar SVG embebido como data URI para evitar requests externos
  const imageMap: { [key: string]: string } = {
    'Vip': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNmI0NmMxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5NZXNhIFZJUDwvdGV4dD48L3N2Zz4=',
    'Premium': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjZhZDU1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5NZXNhIFByZW1pdW08L3RleHQ+PC9zdmc+',
    'Standard': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNDI5OWUxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5NZXNhIFN0YW5kYXJkPC90ZXh0Pjwvc3ZnPg=='
  };
  return imageMap[mesa.tipo] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNzE4MDk2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9jPSJtaWRkbGUiIGR5PSIuM2VtIj5NZXNhPC90ZXh0Pjwvc3ZnPg==';
}

  getBadgeClass(tipo: string): string {
    const badgeClasses: { [key: string]: string } = {
      'Vip': 'bg-purple-100 text-purple-800',
      'Premium': 'bg-yellow-100 text-yellow-800',
      'Standard': 'bg-blue-100 text-blue-800'
    };
    return badgeClasses[tipo] || 'bg-gray-100 text-gray-800';
  }
}

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
    });
  }

  loadAvailability(): void {
    if (!this.searchParams) return;

    this.loading = true;
    this.error = ''

    this.mesaService.getMesasDisponibles(this.searchParams).subscribe({
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
    const imageMap: { [key: string]: string } = {
      'Vip': '/assets/images/tables/vip-table.jpg',
      'Premium': '/assets/images/tables/premium-table.jpg',
      'Standard': '/assets/images/tables/standard-table.jpg'
    };
    return imageMap[mesa.tipo] || '/assets/images/tables/default-table.jpg';
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

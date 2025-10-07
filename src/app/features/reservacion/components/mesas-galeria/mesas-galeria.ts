import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MesaService } from 'src/app/core/services/mesa.service';
import { ErrorMessage } from 'src/app/shared/components/error-message/error-message';
import { Footer } from 'src/app/shared/components/footer/footer';
import { Header } from 'src/app/shared/components/header/header';
import { LoadingSpinner } from 'src/app/shared/components/loading-spinner/loading-spinner';
import { Mesa } from 'src/app/shared/models/mesa';

@Component({
  selector: 'app-mesas-galeria',
  imports: [RouterModule, Header, Footer, LoadingSpinner, ErrorMessage],
  templateUrl: './mesas-galeria.html',
})
export class MesasGaleria implements OnInit {
  private mesaService = inject(MesaService)
  private router = inject(Router)

  mesas: Mesa[] = [];
  loading = false;
  error = '';

  ngOnInit(): void {
    this.loadAllMesas();
  }

  loadAllMesas(): void {
    this.loading = true;
    this.error = '';

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

reserveTable(mesaId: number): void {
  // Navegar con queryParams para mantener consistencia
  const mesa = this.mesas.find(m => m.id_mesa === mesaId);

  this.router.navigate(['/reservacion', mesaId], {
    queryParams: {
      fecha: '',
      hora: '',
      capacidad: mesa?.capacidad || 2
    }
  });
}

  getMesaImage(mesa: Mesa): string {
    const imageMap: { [key: string]: string } = {
      'Vip': '/assets/img/mesas/mesa-vip.avif',
      'Premium': '/assets/img/mesas/mesa-premium.avif',
      'Standard': '/assets/img/mesas/mesa-estandar.avif'
    };
    return imageMap[mesa.tipo] || '/assets/img/mesas/mesa-default.avif';
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

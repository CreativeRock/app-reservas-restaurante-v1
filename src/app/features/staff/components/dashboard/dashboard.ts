// dashboard.ts
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MesaService } from 'src/app/core/services/mesa.service';
import { StaffReservaService } from 'src/app/core/services/staff-reserva.service';
import { StaffAuthService } from 'src/app/core/services/staff-auth.service';
import { ErrorMessage } from 'src/app/shared/components/error-message/error-message';
import { Footer } from 'src/app/shared/components/footer/footer';
import { Header } from 'src/app/shared/components/header/header';
import { LoadingSpinner } from 'src/app/shared/components/loading-spinner/loading-spinner';
import { Mesa } from 'src/app/shared/models/mesa';
import { Reserva } from 'src/app/shared/models/reserva';
import { ChartService } from 'src/app/core/services/chart.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule, Header, Footer, LoadingSpinner, ErrorMessage],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit, OnDestroy {
  private staffAuthService = inject(StaffAuthService);
  private staffReservaService = inject(StaffReservaService);
  private mesaService = inject(MesaService);
  private router = inject(Router);
  private chartService = inject(ChartService);

  usuario: any = null;
  reservasHoy: Reserva[] = [];
  mesas: Mesa[] = [];
  loading = false;
  sessionChecking = true;
  error = '';
  stats: any = null;

  async ngOnInit(): Promise<void> {
    await this.verifySessionAndLoadData();
  }

  async verifySessionAndLoadData(): Promise<void> {
    this.sessionChecking = true;

    try {
      const sessionResponse = await this.staffAuthService.checkSession().toPromise();
      this.sessionChecking = false;

      if (sessionResponse?.success) {
        this.usuario = this.staffAuthService.getCurrentUsuarioValue();
        this.loadDatosDashboard();
      } else {
        this.router.navigate(['/staff/login']);
      }
    } catch (error) {
      this.sessionChecking = false;
      console.error('Error verificando sesión:', error);
      this.router.navigate(['/staff/login']);
    }
  }

  loadDatosDashboard(): void {
    this.loading = true;

    // Cargar reservas de hoy
    const hoy = new Date().toISOString().split('T')[0];
    this.staffReservaService.getReservasByFecha(hoy).subscribe({
      next: (reservas) => {
        this.reservasHoy = reservas;
        this.loadMesas();
        this.loadStats();
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
        // Inicializar gráficos después de cargar mesas
        this.initCharts();
      },
      error: (error) => {
        console.error('Error cargando mesas:', error);
        // Inicializar gráficos incluso si hay error
        this.initCharts();
      }
    });
  }

  loadStats(): void {
    const hoy = new Date().toISOString().split('T')[0];
    const haceUnMes = new Date();
    haceUnMes.setMonth(haceUnMes.getMonth() - 1);
    const fechaDesde = haceUnMes.toISOString().split('T')[0];

    this.staffReservaService.getStats(fechaDesde, hoy).subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loading = false;
        // Actualizar gráficos con estadísticas
        this.updateChartsWithStats();
      },
      error: (error) => {
        console.error('Error cargando estadísticas:', error);
        this.loading = false;
        // Inicializar gráficos básicos incluso sin stats
        this.initCharts();
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

  // Inicializar gráficos
  private initCharts(): void {
    setTimeout(() => {
      // Gráfico de mesas
      const mesasCtx = document.getElementById('mesasChart') as HTMLCanvasElement;
      if (mesasCtx) {
        const mesasDisponibles = this.getMesasDisponibles();
        const mesasReservadas = this.mesas.filter(m => m.estado === 'reservada').length;
        const mesasFueraServicio = this.mesas.filter(m => m.estado === 'fuera_servicio').length;

        this.chartService.createChart(mesasCtx, {
          type: 'doughnut',
          data: {
            labels: ['Disponibles', 'Reservadas', 'Fuera de Servicio'],
            datasets: [{
              data: [mesasDisponibles, mesasReservadas, mesasFueraServicio],
              backgroundColor: [
                'rgb(34, 197, 94)',
                'rgb(249, 115, 22)',
                'rgb(239, 68, 68)'
              ],
              hoverOffset: 4
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom'
              },
              title: {
                display: true,
                text: 'Estado de Mesas'
              }
            }
          }
        });
      }

      // Gráfico básico de reservas (sin stats)
      const reservasCtx = document.getElementById('reservasChart') as HTMLCanvasElement;
      if (reservasCtx) {
        this.createBasicReservasChart(reservasCtx);
      }
    }, 100);
  }

  // Actualizar gráficos con estadísticas
  private updateChartsWithStats(): void {
    if (!this.stats) return;

    setTimeout(() => {
      const reservasCtx = document.getElementById('reservasChart') as HTMLCanvasElement;
      if (reservasCtx) {
        this.chartService.createReservasStatsChart(reservasCtx, this.stats);
      }
    }, 100);
  }

  // Crear gráfico básico de reservas (cuando no hay stats)
  private createBasicReservasChart(ctx: HTMLCanvasElement): void {
    const reservasConfirmadas = this.getReservasConfirmadas();
    const reservasPendientes = this.getReservasPendientes();
    const reservasCanceladas = this.reservasHoy.filter(r => r.estado === 'cancelada').length;
    const reservasNoShow = this.reservasHoy.filter(r => r.estado === 'no_show').length;

    this.chartService.createChart(ctx, {
      type: 'bar',
      data: {
        labels: ['Confirmadas', 'Pendientes', 'Canceladas', 'No Show'],
        datasets: [{
          label: 'Reservas de Hoy',
          data: [reservasConfirmadas, reservasPendientes, reservasCanceladas, reservasNoShow],
          backgroundColor: [
            'rgba(75, 192, 192, 0.5)',
            'rgba(255, 205, 86, 0.5)',
            'rgba(255, 99, 132, 0.5)',
            'rgba(201, 203, 207, 0.5)'
          ],
          borderColor: [
            'rgb(75, 192, 192)',
            'rgb(255, 205, 86)',
            'rgb(255, 99, 132)',
            'rgb(201, 203, 207)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Reservas de Hoy'
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.chartService.destroyAllCharts();
  }
}

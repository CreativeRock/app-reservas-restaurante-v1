// chart.service.ts
import { Injectable } from '@angular/core';
import Chart from 'chart.js/auto';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  private charts: Map<string, Chart> = new Map();

  createChart(ctx: string | HTMLCanvasElement, config: any): Chart {
    // Obtener el ID del canvas o generar uno
    const canvas = typeof ctx === 'string'
      ? document.getElementById(ctx) as HTMLCanvasElement
      : ctx;

    if (!canvas) {
      throw new Error('Canvas element not found');
    }

    // Destruir gráfico existente si hay uno
    const existingChart = this.charts.get(canvas.id);
    if (existingChart) {
      existingChart.destroy();
    }

    const chart = new Chart(canvas, config);
    this.charts.set(canvas.id, chart);
    return chart;
  }

  destroyChart(chartId: string): void {
    const chart = this.charts.get(chartId);
    if (chart) {
      chart.destroy();
      this.charts.delete(chartId);
    }
  }

  destroyAllCharts(): void {
    this.charts.forEach((chart, id) => {
      chart.destroy();
      this.charts.delete(id);
    });
  }

  // Método específico para gráfico de estadísticas de reservas (como espera tu dashboard)
  createReservasStatsChart(ctx: HTMLCanvasElement, stats: any): Chart {
    // Asegurarse de que ctx es un HTMLCanvasElement
    if (!(ctx instanceof HTMLCanvasElement)) {
      ctx = document.getElementById(ctx as string) as HTMLCanvasElement;
    }

    if (!stats?.reservasPorDia) {
      // Si no hay stats, crear gráfico básico
      return this.createChart(ctx, {
        type: 'bar',
        data: {
          labels: ['Total', 'Pendientes', 'Confirmadas', 'Canceladas', 'No Shows'],
          datasets: [{
            label: 'Estadísticas de Reservas',
            data: [
              stats?.total_reservas || 0,
              stats?.pendientes || 0,
              stats?.confirmadas || 0,
              stats?.canceladas || 0,
              stats?.no_shows || 0
            ],
            backgroundColor: [
              'rgba(54, 162, 235, 0.5)',
              'rgba(255, 205, 86, 0.5)',
              'rgba(75, 192, 192, 0.5)',
              'rgba(255, 99, 132, 0.5)',
              'rgba(201, 203, 207, 0.5)'
            ],
            borderColor: [
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(255, 99, 132)',
              'rgb(201, 203, 207)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Estadísticas de Reservas'
            }
          }
        }
      });
    }

    // Si hay datos de tendencia, crear gráfico de línea
    return this.createChart(ctx, {
      type: 'line',
      data: {
        labels: stats.reservasPorDia.map((item: any) => {
          const date = new Date(item.fecha);
          return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit'
          });
        }),
        datasets: [{
          label: 'Reservas por Día',
          data: stats.reservasPorDia.map((item: any) => item.cantidad),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Tendencia de Reservas'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Número de Reservas'
            }
          }
        }
      }
    });
  }

  // Método para gráfico de estado de mesas (doughnut)
  createMesasEstadoChart(ctx: HTMLCanvasElement, data: number[]): Chart {
    return this.createChart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Disponibles', 'Reservadas', 'Fuera de Servicio'],
        datasets: [{
          data: data,
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
        maintainAspectRatio: false,
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
}

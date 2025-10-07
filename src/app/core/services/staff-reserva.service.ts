import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Reserva, ReservaRequest, ReservaResponse } from 'src/app/shared/models/reserva';

@Injectable({
  providedIn: 'root'
})

export class StaffReservaService {
  private http = inject(HttpClient)
  private baseUrl = `${environment.baseUrl}/staff/reservas`;

  // Obtener todas las reservas
  getAllReservas(): Observable<Reserva[]> {
    return this.http.get<{ success: boolean, message: string, data: Reserva[] }>(this.baseUrl)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message);
          }
        }),
        catchError(this.handleError)
      );
  }

  // Obtener reserva por ID
  getReservaById(idReserva: number): Observable<Reserva> {
    return this.http.get<{ success: boolean, message: string, data: Reserva }>(`${this.baseUrl}/${idReserva}`)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message);
          }
        }),
        catchError(this.handleError)
      );
  }

  // Crear reserva
  createReserva(reserva: ReservaRequest): Observable<Reserva> {
    return this.http.post<ReservaResponse>(this.baseUrl, reserva)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message);
          }
        }),
        catchError(this.handleError)
      );
  }

  // Actualizar reserva
  updateReserva(idReserva: number, updates: Partial<Reserva>): Observable<Reserva> {
    return this.http.put<ReservaResponse>(`${this.baseUrl}/${idReserva}`, updates)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message);
          }
        }),
        catchError(this.handleError)
      );
  }

  // Cambiar estado de reserva
  changeStatus(idReserva: number, estado: string): Observable<Reserva> {
    return this.http.put<ReservaResponse>(`${this.baseUrl}/${idReserva}/estado`, { estado })
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message);
          }
        }),
        catchError(this.handleError)
      );
  }

  // Cancelar reserva
  cancelReserva(idReserva: number): Observable<Reserva> {
    return this.http.put<ReservaResponse>(`${this.baseUrl}/${idReserva}/cancelar`, {})
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message);
          }
        }),
        catchError(this.handleError)
      );
  }

  // Eliminar reserva (solo admin)
  deleteReserva(idReserva: number): Observable<void> {
    return this.http.delete<{ success: boolean, message: string }>(`${this.baseUrl}/${idReserva}`)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message);
          }
        }),
        catchError(this.handleError)
      );
  }

  // Obtener reservas por cliente
  getReservasByCliente(idCliente: number): Observable<Reserva[]> {
    return this.http.get<{ success: boolean, message: string, data: Reserva[] }>(`${this.baseUrl}/cliente/${idCliente}`)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message);
          }
        }),
        catchError(this.handleError)
      );
  }

  // Obtener reservas por fecha
  getReservasByFecha(fecha: string): Observable<Reserva[]> {
    return this.http.get<{ success: boolean, message: string, data: Reserva[] }>(`${this.baseUrl}/fecha/${fecha}`)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message);
          }
        }),
        catchError(this.handleError)
      );
  }

  // Obtener reservas por estado
  getReservasByEstado(estado: string): Observable<Reserva[]> {
    return this.http.get<{ success: boolean, message: string, data: Reserva[] }>(`${this.baseUrl}/estado/${estado}`)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message);
          }
        }),
        catchError(this.handleError)
      );
  }

  // Obtener estadísticas
  getStats(fechaDesde?: string, fechaHasta?: string): Observable<any> {
    let url = `${this.baseUrl}/estadisticas`;
    if (fechaDesde && fechaHasta) {
      url += `?fecha_desde=${fechaDesde}&fecha_hasta=${fechaHasta}`;
    }
    return this.http.get<{ success: boolean, message: string, data: any }>(url)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message);
          }
        }),
        catchError(this.handleError)
      );
  }

  // Obtener reservas próximas
  getUpcoming(horas: number = 24): Observable<Reserva[]> {
    return this.http.get<{ success: boolean, message: string, data: Reserva[] }>(`${this.baseUrl}/proximas?horas=${horas}`)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message);
          }
        }),
        catchError(this.handleError)
      );
  }

  // Obtener reservas pendientes de confirmación
  getPendingConfirmation(horasLimite: number = 2): Observable<Reserva[]> {
    return this.http.get<{ success: boolean, message: string, data: Reserva[] }>(`${this.baseUrl}/pendientes-confirmacion?horas_limite=${horasLimite}`)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message);
          }
        }),
        catchError(this.handleError)
      );
  }

  // Verificar disponibilidad
  checkDisponibilidad(mesaId: number, fecha: string, hora: string): Observable<{ disponible: boolean }> {
    return this.http.get<{ success: boolean, message: string, data: { disponible: boolean } }>(
      `${this.baseUrl}/disponibilidad?mesa=${mesaId}&fecha=${fecha}&hora=${hora}`
    ).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        } else {
          throw new Error(response.message);
        }
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('StaffReserva API Error:', error);
    let errorMessage = 'Error de conexión con el servidor';

    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.status === 0) {
      errorMessage = 'No se pudo conectar al servidor. Verifica que esté ejecutándose.';
    } else if (error.status === 404) {
      errorMessage = 'Endpoint no encontrado. Verifica la URL de la API.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return throwError(() => new Error(errorMessage));
  }

}

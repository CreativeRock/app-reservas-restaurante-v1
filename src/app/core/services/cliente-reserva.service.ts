// cliente-reserva.service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Reserva, ReservaRequest, ReservaResponse } from '../../shared/models/reserva';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteReservaService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.baseUrl}/cliente/reservas`;

  getReservasByCliente(): Observable<Reserva[]> {
    return this.http.get<{success: boolean, message: string, data: Reserva[]}>(this.baseUrl)
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

  getReservaById(idReserva: number): Observable<Reserva> {
    return this.http.get<{success: boolean, message: string, data: Reserva}>(`${this.baseUrl}/${idReserva}`)
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

  private handleError(error: any) {
    console.error('ClienteReserva API Error:', error);

    // El interceptor ya maneja el error 401 globalmente
    if (error.status === 401) {
      return throwError(() => new Error('No autorizado. Por favor, inicia sesión nuevamente.'));
    }

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

// core/services/cliente.service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Cliente } from '../../shared/models/cliente';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.baseUrl}/clientes`;

  // Obtener perfil del cliente actual
  getProfile(): Observable<Cliente> {
    return this.http.get<{ success: boolean, message: string, data: Cliente }>(`${this.baseUrl}/perfil`)
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

  // Actualizar perfil del cliente
  updateProfile(profileData: any): Observable<Cliente> {
    return this.http.put<{ success: boolean, message: string, data: Cliente }>(`${this.baseUrl}/perfil`, profileData)
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

  // Actualizar datos específicos del cliente
  updateCliente(id: number, updates: Partial<Cliente>): Observable<Cliente> {
    return this.http.put<{ success: boolean, message: string, data: Cliente }>(`${this.baseUrl}/${id}`, updates)
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

  // Cambiar contraseña
  changePassword(passwordData: { currentPassword: string; newPassword: string }): Observable<any> {
    return this.http.put<{ success: boolean, message: string }>(`${this.baseUrl}/cambiar-password`, passwordData)
      .pipe(
        map(response => {
          if (response.success) {
            return response;
          } else {
            throw new Error(response.message);
          }
        }),
        catchError(this.handleError)
      );
  }

  // Obtener historial de reservas (si necesitas)
  getReservationHistory(): Observable<any[]> {
    return this.http.get<{ success: boolean, message: string, data: any[] }>(`${this.baseUrl}/reservas/historial`)
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
    console.error('Cliente API Error:', error);
    let errorMessage = 'Error de conexión con el servidor';

    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.status === 0) {
      errorMessage = 'No se pudo conectar al servidor. Verifica que esté ejecutándose.';
    } else if (error.status === 401) {
      errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return throwError(() => new Error(errorMessage));
  }
}

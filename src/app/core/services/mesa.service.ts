import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Mesa, MesaDisponibilidadResponse, SearchParams } from '../../shared/models/mesa';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MesaService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost/api-sistema-restaurante-g2-v1/public/mesas';

  getMesasDisponibles(searchParams: SearchParams): Observable<Mesa[]> {
    const params = new HttpParams()
      .set('action', 'disponibilidad')
      .set('fecha', searchParams.fecha)
      .set('hora', searchParams.hora)
      .set('capacidad', searchParams.capacidad.toString());

    return this.http.get<MesaDisponibilidadResponse>(this.baseUrl, { params })
      .pipe(
        map(response => {
          if (response.success) {
            return response.data.mesas_disponibles;
          } else {
            throw new Error(response.message);
          }
        }),
        catchError(this.handleError)
      );
  }

  getMesaById(id: number): Observable<Mesa> {
    return this.http.get<{success: boolean, message: string, data: Mesa}>(`${this.baseUrl}/${id}`)
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

  getAllMesas(): Observable<Mesa[]> {
    return this.http.get<{success: boolean, message: string, data: Mesa[]}>(this.baseUrl)
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

  getMesasByTipo(tipo: string): Observable<Mesa[]> {
    return this.http.get<{success: boolean, message: string, data: Mesa[]}>(`${this.baseUrl}/tipo/${tipo}`)
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

  getMesasByEstado(estado: string): Observable<Mesa[]> {
    return this.http.get<{success: boolean, message: string, data: Mesa[]}>(`${this.baseUrl}/estado/${estado}`)
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
    console.error('Mesa API Error:', error);
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

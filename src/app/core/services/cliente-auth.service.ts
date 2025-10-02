import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { Cliente, ClienteAuthResponse, ClienteLoginRequest, ClienteRegisterRequest } from '../../shared/models/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteAuthService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost/api-sistema-restaurante-g2-v1/public/clientes/auth';

  private currentClienteSubject = new BehaviorSubject<Cliente | null>(null);
  public currntCliente$ = this.currentClienteSubject.asObservable();

  constructor() {
    this.loadStoredCliente();
  }

  login(credentials: ClienteLoginRequest): Observable<ClienteAuthResponse> {
    return this.http.post<ClienteAuthResponse>(`${this.baseUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success) {
            // Transformar la respuesta a Cliente
            const cliente: Cliente = {
              id_cliente: response.data.id,
              nombre: response.data.nombre,
              apellido: '', //TODO: No viene en la respuesta, ajustar el endpoint
              email: response.data.email,
              telefono: '', //TODO: No viene en la respuesta, ajustar el endpoint
              preferencias: '',
              fecha_registro: '',
              fecha_actualizacion: ''
            };
            this.setCurrentCliente(cliente);
          }
        }),
        catchError(this.handleError)
      );
  }

  register(registerData: ClienteRegisterRequest): Observable<ClienteAuthResponse> {
    return this.http.post<ClienteAuthResponse>(`${this.baseUrl}/register`, registerData)
      .pipe(
        tap(response => {
          if (response.success) {
            const cliente: Cliente = {
              id_cliente: response.data.id,
              nombre: response.data.nombre,
              apellido: '', // No viene en la respuesta
              email: response.data.email,
              telefono: '', // No viene en la respuesta
              preferencias: '',
              fecha_registro: '',
              fecha_actualizacion: ''
            };
            this.setCurrentCliente(cliente);
          }
        }),
        catchError(this.handleError)
      );
  }

  getCurrentCliente(): Observable<ClienteAuthResponse> {
    return this.http.get<ClienteAuthResponse>(`${this.baseUrl}/me`);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem('currentCliente');
        this.currentClienteSubject.next(null);
      })
    );
  }

  isAuthenticated(): boolean {
    return !!this.currentClienteSubject.value;
  }

  getCurrentClienteValue(): Cliente | null {
    return this.currentClienteSubject.value;
  }

  private setCurrentCliente(cliente: Cliente): void {
    localStorage.setItem('currentCliente', JSON.stringify(cliente));
    this.currentClienteSubject.next(cliente);
  }

  private loadStoredCliente(): void {
    const storedCliente = localStorage.getItem('currentCliente');
    if (storedCliente) {
      try {
        const cliente = JSON.parse(storedCliente);
        this.currentClienteSubject.next(cliente);
      } catch (error) {
        console.error('Error loading stored cliente:', error);
        localStorage.removeItem('currentCliente');
      }
    }
  }

  private handleError(error: any) {
    console.error('Cliente Auth API Error:', error);
    let errorMessage = 'Error de conexión';

    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.status === 0) {
      errorMessage = 'No se pudo conectar al servidor';
    } else if (error.status === 401) {
      errorMessage = 'Credenciales incorrectas';
    }

    return throwError(() => new Error(errorMessage));
  }
}

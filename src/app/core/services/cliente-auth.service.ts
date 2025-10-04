// core/services/cliente-auth.service.ts
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
  public currentCliente$ = this.currentClienteSubject.asObservable();

  constructor() {
    this.loadStoredCliente();
  }

  login(credentials: ClienteLoginRequest): Observable<ClienteAuthResponse> {
    return this.http.post<ClienteAuthResponse>(
      `${this.baseUrl}/login`,
      credentials,
      { withCredentials: true }
    ).pipe(
      tap(response => {
        if (response.success) {
          const nombreCompleto = response.data.nombre.split(' ');
          const nombre = nombreCompleto[0] || '';
          const apellido = nombreCompleto.slice(1).join(' ') || '';

          const cliente: Cliente = {
            id_cliente: response.data.id,
            nombre: nombre,
            apellido: apellido,
            email: response.data.email,
            telefono: '',
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
    return this.http.post<ClienteAuthResponse>(
      `${this.baseUrl}/register`,
      registerData,
      { withCredentials: true }
    ).pipe(
      tap(response => {
        if (response.success) {
          this.login({
            email: registerData.email,
            password: registerData.password
          }).subscribe();
        }
      }),
      catchError(this.handleError)
    );
  }

  getCurrentCliente(): Observable<ClienteAuthResponse> {
    return this.http.get<ClienteAuthResponse>(
      `${this.baseUrl}/me`,
      { withCredentials: true }
    ).pipe(
      tap(response => {
        if (response.success) {
          const nombreCompleto = response.data.nombre.split(' ');
          const nombre = nombreCompleto[0] || '';
          const apellido = nombreCompleto.slice(1).join(' ') || '';

          const cliente: Cliente = {
            id_cliente: response.data.id,
            nombre: nombre,
            apellido: apellido,
            email: response.data.email,
            telefono: '',
            preferencias: '',
            fecha_registro: '',
            fecha_actualizacion: ''
          };
          this.setCurrentCliente(cliente);
        }
      }),
      catchError(error => {
        if (error.status === 401) {
          this.clearCurrentCliente(); // Ahora es público
        }
        return throwError(() => error);
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/logout`,
      {},
      { withCredentials: true }
    ).pipe(
      tap(() => {
        this.clearCurrentCliente(); // Ahora es público
      }),
      catchError(this.handleError)
    );
  }

  checkSession(): Observable<ClienteAuthResponse> {
    return this.getCurrentCliente();
  }

  isAuthenticated(): boolean {
    return !!this.currentClienteSubject.value;
  }

  getCurrentClienteValue(): Cliente | null {
    return this.currentClienteSubject.value;
  }

  // 🔥 CAMBIO: Hacer este método público
  clearCurrentCliente(): void {
    localStorage.removeItem('currentCliente');
    this.currentClienteSubject.next(null);
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
        this.clearCurrentCliente(); // Ahora es público
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
      errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
      this.clearCurrentCliente(); // Ahora es público
    }

    return throwError(() => new Error(errorMessage));
  }
}

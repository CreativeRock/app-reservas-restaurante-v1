// staff-auth.service.ts - VERSIÓN CORREGIDA
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { Usuario, UsuarioAuthResponse, UsuarioLoginRequest } from '../../shared/models/usuario';

@Injectable({
  providedIn: 'root'
})
export class StaffAuthService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost/api-sistema-restaurante-g2-v1/public/auth';

  private currentUsuarioSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUsuario$ = this.currentUsuarioSubject.asObservable();

  constructor() {
    this.loadStoredUsuario();
  }

  login(credentials: UsuarioLoginRequest): Observable<UsuarioAuthResponse> {
    return this.http.post<UsuarioAuthResponse>(
      `${this.baseUrl}/login`,
      credentials,
      { withCredentials: true } // IMPORTANTE
    ).pipe(
      tap(response => {
        console.log('Login response:', response); // DEBUG
        if (response.success) {
          const usuario: Usuario = {
            id_usuario: response.data.id,
            nombre: response.data.nombre,
            apellido: '', //TODO: No viene en la respuesta, ajustar el endpoint
            email: response.data.email,
            telefono: '', //TODO: No viene en la respuesta, ajustar el endpoint
            fecha_creacion: '',
            fecha_actualizacion: '',
            nombre_rol: response.data.rol,
            id_rol: this.mapRolToId(response.data.rol)
          };
          this.setCurrentUsuario(usuario);
          console.log('Usuario almacenado en localStorage:', localStorage.getItem('currentUsuario')); // DEBUG
        }
      }),
      catchError(this.handleError.bind(this)) // FIX: Bind this context
    );
  }

  getCurrentUsuario(): Observable<UsuarioAuthResponse> {
    console.log('Solicitando usuario actual...'); // DEBUG
    return this.http.get<UsuarioAuthResponse>(
      `${this.baseUrl}/me`,
      { withCredentials: true } // IMPORTANTE
    ).pipe(
      tap(response => {
        console.log('Respuesta /me:', response); // DEBUG
        if (response.success) {
          const usuario: Usuario = {
            id_usuario: response.data.id,
            nombre: response.data.nombre,
            apellido: '',
            email: response.data.email,
            telefono: '',
            fecha_creacion: '',
            fecha_actualizacion: '',
            nombre_rol: response.data.rol,
            id_rol: this.mapRolToId(response.data.rol)
          };
          this.setCurrentUsuario(usuario);
        }
      }),
      catchError((error) => { // FIX: Usar arrow function para mantener this
        console.error('Error en getCurrentUsuario:', error); // DEBUG
        if (error.status === 401) {
          this.clearCurrentUsuario();
        }
        return throwError(() => error);
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/logout`,
      {},
      { withCredentials: true } // IMPORTANTE
    ).pipe(
      tap(() => {
        this.clearCurrentUsuario();
        console.log('Logout exitoso, localStorage limpiado'); // DEBUG
      }),
      catchError(this.handleError.bind(this)) // FIX: Bind this context
    );
  }

  // Verificar sesión en el servidor
  checkSession(): Observable<UsuarioAuthResponse> {
    return this.getCurrentUsuario();
  }

  getCurrentUsuarioValue(): Usuario | null {
    return this.currentUsuarioSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.currentUsuarioSubject.value;
  }

  isAdmin(): boolean {
    const usuario = this.currentUsuarioSubject.value;
    return usuario ? usuario.nombre_rol === 'Admin' : false;
  }

  isGerente(): boolean {
    const usuario = this.currentUsuarioSubject.value;
    return usuario ? usuario.nombre_rol === 'Gerente' : false;
  }

  isMesero(): boolean {
    const usuario = this.currentUsuarioSubject.value;
    return usuario ? usuario.nombre_rol === 'Mesero' : false;
  }

  private mapRolToId(rol: string): number {
    const rolMap: { [key: string]: number } = {
      'Admin': 1,
      'Gerente': 2,
      'Mesero': 3
    };
    return rolMap[rol] || 3;
  }

  private setCurrentUsuario(usuario: Usuario): void {
    localStorage.setItem('currentUsuario', JSON.stringify(usuario));
    this.currentUsuarioSubject.next(usuario);
  }

  clearCurrentUsuario(): void {
    localStorage.removeItem('currentUsuario');
    this.currentUsuarioSubject.next(null);
    console.log('Usuario limpiado de localStorage y subject'); // DEBUG
  }

  private loadStoredUsuario(): void {
    const storedUsuario = localStorage.getItem('currentUsuario');
    console.log('Usuario almacenado encontrado:', storedUsuario); // DEBUG
    if (storedUsuario) {
      try {
        const usuario = JSON.parse(storedUsuario);
        this.currentUsuarioSubject.next(usuario);
        console.log('Usuario cargado desde localStorage:', usuario); // DEBUG
      } catch (error) {
        console.error('Error loading stored usuario:', error);
        this.clearCurrentUsuario();
      }
    }
  }

  private handleError(error: any) {
    console.error('Staff Auth API Error:', error);
    let errorMessage = 'Error de conexión';

    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.status === 0) {
      errorMessage = 'No se pudo conectar al servidor';
    } else if (error.status === 401) {
      errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
      this.clearCurrentUsuario(); // FIX: Ahora this está correctamente bindeado
    }

    return throwError(() => new Error(errorMessage));
  }
}

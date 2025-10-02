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

  constructor () {
    this.loadStoredUsuario();
  }

  login(credentials: UsuarioLoginRequest): Observable<UsuarioAuthResponse> {
    return this.http.post<UsuarioAuthResponse>(`${this.baseUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success) {
            // Transformar la respuesta a Usuario
            const usuario: Usuario = {
              id_usuario: response.data.id,
              nombre: response.data.nombre,
              apellido: '', // No viene en la respuesta
              email: response.data.email,
              telefono: '', // No viene en la respuesta
              fecha_creacion: '',
              fecha_actualizacion: '',
              nombre_rol: response.data.rol,
              id_rol: this.mapRolToId(response.data.rol)
            };
            this.setCurrentUsuario(usuario);
          }
        }),
        catchError(this.handleError)
      );
  }

getCurrentUsuario(): Observable<UsuarioAuthResponse> {
    return this.http.get<UsuarioAuthResponse>(`${this.baseUrl}/me`);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem('currentUsuario');
        this.currentUsuarioSubject.next(null);
      })
    );
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

  private loadStoredUsuario(): void {
    const storedUsuario = localStorage.getItem('currentUsuario');
    if (storedUsuario) {
      try {
        const usuario = JSON.parse(storedUsuario);
        this.currentUsuarioSubject.next(usuario);
      } catch (error) {
        console.error('Error loading stored usuario:', error);
        localStorage.removeItem('currentUsuario');
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
      errorMessage = 'Credenciales incorrectas';
    }

    return throwError(() => new Error(errorMessage));
  }
}

export interface Usuario {
  id_usuario: number;
  id_rol: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
  nombre_rol: string;
}

export interface UsuarioLoginRequest {
  email: string;
  password: string;
}

export interface UsuarioAuthResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    nombre: string;
    email: string;
    rol: string;
  };
}

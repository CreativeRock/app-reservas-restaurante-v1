export interface Cliente {
  id_cliente: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  preferencias: string;
  fecha_registro: string;
  fecha_actualizacion: string;
}

export interface ClienteLoginRequest {
  email: string;
  password: string;
}

export interface ClienteRegisterRequest {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono: string;
  preferencias: string;
}

export interface ClienteAuthResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    nombre: string;
    email: string;
  };
}

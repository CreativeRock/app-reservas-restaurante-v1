export interface Reserva {
  id_reserva: number;
  codigo_reserva: string;
  id_mesa: number;
  id_cliente: number | null;
  id_usuario: number | null;
  fecha_reserva: string;
  hora_reserva: string;
  numero_personas: number;
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'no_show';
  tipo_reserva: 'online' | 'telefono' | 'sin-reserva';
  notas: string | null;
  fecha_creacion: string;
  fecha_actualizacion: string;
  numero_mesa?: string;
  capacidad_mesa?: number;
  ubicacion_mesa?: string;
  nombre_completo?: string;
  telefono?: string;
  email?: string;
}

export interface ReservaRequest {
  id_cliente?: number;
  id_mesa: number;
  fecha_reserva: string;
  hora_reserva: string;
  numero_personas: number;
  tipo_reserva: 'online';
  notas?: string;
  estado?: 'pendiente';
}

export interface ReservaResponse {
  success: boolean;
  message: string;
  data: Reserva;
}

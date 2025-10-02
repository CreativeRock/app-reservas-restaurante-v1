export interface Mesa {
  id_mesa: number;
  numero_mesa: string;
  nombre_mesa: string;
  caracteristicas: string;
  capacidad: number;
  ubicacion: string;
  estado: 'disponible' | 'reservada' | 'fuera_servicio';
  tipo: 'Standard' | 'Premium' | 'Vip';
}

export interface MesaDisponibilidadResponse {
  success: boolean;
  message: string;
  data: {
    mesas_disponibles: Mesa[];
    total: number;
    fecha: string;
    hora: string;
  };
}

export interface SearchParams {
  fecha: string;
  hora: string;
  capacidad: number;
}

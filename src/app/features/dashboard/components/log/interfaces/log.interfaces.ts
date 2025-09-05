export interface Log {
  id: string;
  tipoOperacion: string;
  entidadId: string;
  tipoEntidad: string;
  idCliente: string;
  detalles: string;
  fechaMovimiento: string;
}

export interface LogResponse {
  logs: Log[];
  total: number;
}

export interface LogState {
  logs: Log[];
  cargando: boolean;
  error: string | null;
}
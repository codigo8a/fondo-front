import { Producto } from './producto.interface';
import { Sucursal } from './sucursal.interface';

export interface Inscripcion {
  id: string;
  idCliente: string;
  producto: Producto;
  sucursal: Sucursal;
  montoInvertido: number;
  fechaTransaccion: string;
}

// Nueva interfaz para la petición POST
export interface InscripcionRequest {
  idCliente: string;
  idProducto: string;
  idSucursal: string;
  montoInvertido: number;
  fechaTransaccion: string;
}
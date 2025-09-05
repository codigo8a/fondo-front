export interface InscripcionRequest {
  id: string;
  idCliente: string;
  idProducto: string;
  idSucursal: string;
  montoInvertido: number;
  fechaTransaccion: string;
}
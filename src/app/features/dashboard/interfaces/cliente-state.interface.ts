import { Cliente } from './cliente.interface';

export interface IClienteState {
  cliente: Cliente | null;
  cargando: boolean;
  error: boolean;
  esIdMongoValido: boolean;
}
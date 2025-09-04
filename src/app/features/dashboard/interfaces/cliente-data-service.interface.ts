import { Observable } from 'rxjs';
import { Cliente } from './cliente.interface';

export interface IClienteDataService {
  obtenerClientePorId(id: string): Observable<Cliente>;
}
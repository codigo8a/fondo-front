import { Injectable, inject } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';
import { Cliente } from '../interfaces/cliente.interface';
import { ClienteService } from './cliente.service';
import { RandomSelectionService, IRandomSelectionService } from './random-selection.service';

export interface IClienteRandomService {
  obtenerClienteAleatorio(): Observable<string>;
  reiniciarHistorial(): void;
}

@Injectable({
  providedIn: 'root'
})
export class ClienteRandomService implements IClienteRandomService {
  private readonly clienteService = inject(ClienteService);
  private readonly randomService: IRandomSelectionService<Cliente> = inject(RandomSelectionService);
  private readonly idsUtilizados: Set<string> = new Set();

  obtenerClienteAleatorio(): Observable<string> {
    return this.clienteService.obtenerClientes().pipe(
      map(clientes => {
        const clienteSeleccionado = this.randomService.seleccionarElementoAleatorio(
          clientes,
          this.idsUtilizados,
          (cliente: Cliente) => cliente.id
        );
        
        return clienteSeleccionado ? clienteSeleccionado.id : 'No hay clientes disponibles';
      }),
      catchError(error => {
        console.error('Error al obtener cliente aleatorio:', error);
        return of('Error al cargar');
      })
    );
  }

  reiniciarHistorial(): void {
    this.randomService.reiniciarHistorial(this.idsUtilizados);
  }
}
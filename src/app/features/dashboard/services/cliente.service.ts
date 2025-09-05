import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../interfaces/cliente.interface';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'https://fondo-back-af12d1147ad0.herokuapp.com/api/clientes';

  obtenerClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.API_URL);
  }

  obtenerClientePorId(id: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.API_URL}/${id}`);
  }

  actualizarMonto(clienteId: string, nuevoMonto: number): Observable<any> {
    return this.http.patch(`${this.API_URL}/${clienteId}/monto`, {
      monto: nuevoMonto
    });
  }
}
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../interfaces/cliente.interface';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/clientes';

  obtenerClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.API_URL);
  }

  obtenerClientePorId(id: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.API_URL}/${id}`);
  }
}
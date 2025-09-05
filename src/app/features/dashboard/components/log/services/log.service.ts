import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Log } from '../interfaces/log.interfaces';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private readonly baseUrl = 'https://fondo-back-af12d1147ad0.herokuapp.com/api/logs';

  constructor(private http: HttpClient) {}

  obtenerLogsPorCliente(clienteId: string): Observable<Log[]> {
    return this.http.get<Log[]>(`${this.baseUrl}/cliente/${clienteId}`);
  }
}
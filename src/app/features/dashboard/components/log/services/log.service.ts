import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Log } from '../interfaces/log.interfaces';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private readonly baseUrl = 'http://localhost:8080/api/logs';

  constructor(private http: HttpClient) {}

  obtenerLogsPorCliente(clienteId: string): Observable<Log[]> {
    return this.http.get<Log[]>(`${this.baseUrl}/cliente/${clienteId}`);
  }
}
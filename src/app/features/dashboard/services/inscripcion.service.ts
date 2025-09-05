import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inscripcion } from '../interfaces/inscripcion.interface';

@Injectable({
  providedIn: 'root'
})
export class InscripcionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/inscripcion';

  obtenerInscripcionesPorCliente(clienteId: string): Observable<Inscripcion[]> {
    return this.http.get<Inscripcion[]>(`${this.baseUrl}/cliente/${clienteId}`);
  }

  eliminarInscripcion(inscripcionId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${inscripcionId}`);
  }
}
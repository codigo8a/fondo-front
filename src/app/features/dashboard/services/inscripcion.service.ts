import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inscripcion } from '../interfaces/inscripcion.interface';

@Injectable({
  providedIn: 'root'
})
export class InscripcionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://fondo-back-af12d1147ad0.herokuapp.com/api/inscripcion';

  obtenerInscripcionesPorCliente(clienteId: string): Observable<Inscripcion[]> {
    return this.http.get<Inscripcion[]>(`${this.baseUrl}/cliente/${clienteId}`);
  }

  crearInscripcion(inscripcion: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, inscripcion);
  }

  eliminarInscripcion(inscripcionId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${inscripcionId}`);
  }
}
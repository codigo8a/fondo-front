import { Injectable } from '@angular/core';

export interface IRandomSelectionService<T> {
  seleccionarElementoAleatorio(elementos: T[], elementosUsados: Set<any>, obtenerClave: (elemento: T) => any): T | null;
  reiniciarHistorial(elementosUsados: Set<any>): void;
}

@Injectable({
  providedIn: 'root'
})
export class RandomSelectionService<T> implements IRandomSelectionService<T> {
  
  seleccionarElementoAleatorio(
    elementos: T[], 
    elementosUsados: Set<any>, 
    obtenerClave: (elemento: T) => any
  ): T | null {
    if (!elementos || elementos.length === 0) {
      return null;
    }

    // Si ya se usaron todos los elementos, reiniciar el historial
    if (elementosUsados.size >= elementos.length) {
      elementosUsados.clear();
    }

    // Filtrar elementos no utilizados
    const elementosDisponibles = elementos.filter(elemento => 
      !elementosUsados.has(obtenerClave(elemento))
    );

    if (elementosDisponibles.length > 0) {
      const indiceAleatorio = Math.floor(Math.random() * elementosDisponibles.length);
      const elementoSeleccionado = elementosDisponibles[indiceAleatorio];
      elementosUsados.add(obtenerClave(elementoSeleccionado));
      return elementoSeleccionado;
    }

    // Fallback: si no hay disponibles, tomar cualquiera
    const indiceAleatorio = Math.floor(Math.random() * elementos.length);
    return elementos[indiceAleatorio];
  }

  reiniciarHistorial(elementosUsados: Set<any>): void {
    elementosUsados.clear();
  }
}
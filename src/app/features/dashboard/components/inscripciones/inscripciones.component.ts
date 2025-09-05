import { Component, Input, OnInit, OnChanges, SimpleChanges, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { InscripcionService } from '../../services/inscripcion.service';
import { Inscripcion } from '../../interfaces/inscripcion.interface';
import { AlertDialogService } from '../alert-dialog/services/alert-dialog.service';

// Interface para el estado del componente (ISP)
interface InscripcionesComponentState {
  inscripciones: Inscripcion[];
  cargando: boolean;
  error: boolean;
  esIdMongoValido: boolean;
  eliminando: string | null; // ID de la inscripción que se está eliminando
}

// Clase para validación (SRP)
class InscripcionValidator {
  static validarIdMongo(id: string): boolean {
    if (!id) return false;
    const mongoIdRegex = /^[0-9a-fA-F]{24}$/;
    return mongoIdRegex.test(id);
  }
}

@Component({
  selector: 'app-inscripciones',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatProgressSpinnerModule, 
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatListModule,
    MatButtonModule
  ],
  templateUrl: './inscripciones.component.html',
  styleUrls: ['./inscripciones.component.scss']
})
export class InscripcionesComponent implements OnInit, OnChanges {
  @Input() clienteId: string = '';
  
  // Inyección de dependencias (DIP)
  private readonly inscripcionService = inject(InscripcionService);
  private readonly alertDialogService = inject(AlertDialogService);
  private readonly cdr = inject(ChangeDetectorRef);
  
  // Estado del componente
  state: InscripcionesComponentState = {
    inscripciones: [],
    cargando: false,
    error: false,
    esIdMongoValido: true,
    eliminando: null
  };

  ngOnInit(): void {
    if (this.clienteId) {
      this.validarYCargarInscripciones();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clienteId']) {
      this.resetearEstados();
      
      if (changes['clienteId'].currentValue) {
        this.validarYCargarInscripciones();
      }
    }
  }

  // Método para resetear estados (SRP)
  private resetearEstados(): void {
    this.state = {
      inscripciones: [],
      cargando: false,
      error: false,
      esIdMongoValido: true,
      eliminando: null
    };
    this.cdr.detectChanges();
  }

  // Método para validar y cargar inscripciones (SRP)
  private validarYCargarInscripciones(): void {
    if (!this.clienteId) {
      this.state.esIdMongoValido = false;
      this.cdr.detectChanges();
      return;
    }

    // Usar la clase de validación (SRP)
    this.state.esIdMongoValido = InscripcionValidator.validarIdMongo(this.clienteId);

    if (this.state.esIdMongoValido) {
      this.cargarInscripciones();
    } else {
      this.state.inscripciones = [];
      this.state.cargando = false;
      this.state.error = false;
      this.cdr.detectChanges();
    }
  }

  // Método para cargar datos de inscripciones (SRP)
  private cargarInscripciones(): void {
    this.state.cargando = true;
    this.state.error = false;
    this.state.inscripciones = [];
    this.cdr.detectChanges();
    
    this.inscripcionService.obtenerInscripcionesPorCliente(this.clienteId).subscribe({
      next: (inscripciones) => {
        this.state.inscripciones = inscripciones;
        this.state.cargando = false;
        this.state.error = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener inscripciones:', error);
        this.state.inscripciones = [];
        this.state.error = true;
        this.state.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }
  
  // Método público para recargar inscripciones desde componente padre
  public recargarInscripciones(): void {
    if (this.clienteId && this.state.esIdMongoValido) {
      this.cargarInscripciones();
    }
  }

  // Método para eliminar inscripción con confirmación
  eliminarInscripcion(inscripcionId: string): void {
    const inscripcion = this.state.inscripciones.find(i => i.id === inscripcionId);
    const nombreProducto = inscripcion?.producto.nombre || 'esta inscripción';
    
    this.alertDialogService.openConfirmDialog(
      'Confirmar eliminación',
      `¿Está seguro de que desea eliminar la inscripción del producto "${nombreProducto}"? Esta acción no se puede deshacer.`,
      'Eliminar',
      'Cancelar'
    ).subscribe(confirmed => {
      if (confirmed) {
        this.ejecutarEliminacion(inscripcionId);
      }
    });
  }

  // Método privado para ejecutar la eliminación
  private ejecutarEliminacion(inscripcionId: string): void {
    this.state.eliminando = inscripcionId;
    this.cdr.detectChanges();

    this.inscripcionService.eliminarInscripcion(inscripcionId).subscribe({
      next: () => {
        // Remover la inscripción del array local
        this.state.inscripciones = this.state.inscripciones.filter(
          inscripcion => inscripcion.id !== inscripcionId
        );
        this.state.eliminando = null;
        this.cdr.detectChanges();
        
        // Mostrar mensaje de éxito
        this.alertDialogService.openSuccessAlert(
          'Eliminación exitosa',
          'La inscripción ha sido eliminada correctamente.'
        );
      },
      error: (error) => {
        console.error('Error al eliminar inscripción:', error);
        this.state.eliminando = null;
        this.cdr.detectChanges();
        
        // Mostrar mensaje de error
        this.alertDialogService.openErrorAlert(
          'Error al eliminar',
          'No se pudo eliminar la inscripción. Por favor, inténtelo de nuevo.'
        );
      }
    });
  }

  // Método para verificar si una inscripción se está eliminando
  estaEliminando(inscripcionId: string): boolean {
    return this.state.eliminando === inscripcionId;
  }
}
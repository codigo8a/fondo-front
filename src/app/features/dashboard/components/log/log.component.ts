import { Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { LogService } from './services/log.service';
import { Log, LogState } from './interfaces/log.interfaces';

@Component({
  selector: 'app-log',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit, OnChanges {
  @Input() clienteId!: string;

  state: LogState = {
    logs: [],
    cargando: false,
    error: null
  };

  constructor(
    private logService: LogService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.clienteId) {
      this.cargarLogs();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clienteId'] && changes['clienteId'].currentValue) {
      this.cargarLogs();
    }
  }

  cargarLogs(): void {
    if (!this.clienteId) return;

    this.state.cargando = true;
    this.state.error = null;
    this.cdr.detectChanges();

    this.logService.obtenerLogsPorCliente(this.clienteId).subscribe({
      next: (logs) => {
        // Ordenar por fecha más reciente y tomar solo los últimos 4
        this.state.logs = logs
          .sort((a, b) => new Date(b.fechaMovimiento).getTime() - new Date(a.fechaMovimiento).getTime())
          .slice(0, 4);
        this.state.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar logs:', error);
        this.state.error = 'Error al cargar el historial de operaciones';
        this.state.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  obtenerIconoOperacion(tipoOperacion: string): string {
    const iconos: { [key: string]: string } = {
      'CREAR_INSCRIPCION': 'add_circle',
      'ELIMINAR_INSCRIPCION': 'remove_circle',
      'ACTUALIZAR_CLIENTE': 'edit',
      'CREAR_CLIENTE': 'person_add',
      'ELIMINAR_CLIENTE': 'person_remove'
    };
    return iconos[tipoOperacion] || 'info';
  }

  obtenerColorOperacion(tipoOperacion: string): string {
    const colores: { [key: string]: string } = {
      'CREAR_INSCRIPCION': 'primary',
      'ELIMINAR_INSCRIPCION': 'warn',
      'ACTUALIZAR_CLIENTE': 'accent',
      'CREAR_CLIENTE': 'primary',
      'ELIMINAR_CLIENTE': 'warn'
    };
    return colores[tipoOperacion] || 'primary';
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatearTipoOperacion(tipoOperacion: string): string {
    const nombres: { [key: string]: string } = {
      'CREAR_INSCRIPCION': 'Crear Inscripción',
      'ELIMINAR_INSCRIPCION': 'Cancelar Inscripción',
      'ACTUALIZAR_CLIENTE': 'Actualizar Cliente',
      'CREAR_CLIENTE': 'Crear Cliente',
      'ELIMINAR_CLIENTE': 'Eliminar Cliente'
    };
    return nombres[tipoOperacion] || tipoOperacion;
  }
}
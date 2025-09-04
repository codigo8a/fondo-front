import { Component, Input, OnInit, OnChanges, SimpleChanges, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { InscripcionService } from '../../services/inscripcion.service';
import { Inscripcion } from '../../interfaces/inscripcion.interface';

// Interface para el estado del componente (ISP)
interface InscripcionesComponentState {
  inscripciones: Inscripcion[];
  cargando: boolean;
  error: boolean;
  esIdMongoValido: boolean;
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
    MatListModule
  ],
  template: `
    <mat-card class="inscripciones-card">
      <mat-card-header>
        <mat-card-title>
          <mat-icon>assignment</mat-icon>
          Inscripciones
        </mat-card-title>
      </mat-card-header>
      <mat-card-content>
        @if (state.cargando) {
          <div class="loading-container">
            <mat-spinner diameter="40"></mat-spinner>
            <p>Cargando inscripciones...</p>
          </div>
        } @else if (state.error) {
          <div class="error-container">
            <mat-icon color="warn">error</mat-icon>
            <p>Error al cargar las inscripciones</p>
          </div>
        } @else if (!state.esIdMongoValido) {
          <div class="no-data">
            <mat-icon>info</mat-icon>
            <p>ID de cliente no válido</p>
          </div>
        } @else if (state.inscripciones.length > 0) {
          <div class="inscripciones-list">
            @for (inscripcion of state.inscripciones; track inscripcion.id) {
              <mat-card class="inscripcion-item">
                <mat-card-header>
                  <mat-card-title class="producto-nombre">
                    {{ inscripcion.producto.nombre }}
                  </mat-card-title>
                  <mat-card-subtitle>
                    <mat-chip color="primary" selected>
                      {{ inscripcion.producto.tipoProducto }}
                    </mat-chip>
                  </mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <div class="inscripcion-details">
                    <div class="detail-row">
                      <mat-icon>account_balance</mat-icon>
                      <span><strong>Sucursal:</strong> {{ inscripcion.sucursal.nombre }}</span>
                    </div>
                    <div class="detail-row">
                      <mat-icon>location_city</mat-icon>
                      <span><strong>Ciudad:</strong> {{ inscripcion.sucursal.ciudad }}</span>
                    </div>
                    <div class="detail-row monto">
                      <mat-icon>attach_money</mat-icon>
                      <span><strong>Monto Invertido:</strong> 
                        <span class="monto-value">{{ inscripcion.montoInvertido | currency:'USD':'symbol':'1.2-2' }}</span>
                      </span>
                    </div>
                    <div class="detail-row">
                      <mat-icon>schedule</mat-icon>
                      <span><strong>Fecha:</strong> {{ inscripcion.fechaTransaccion | date:'dd/MM/yyyy HH:mm' }}</span>
                    </div>
                    <div class="detail-row">
                      <mat-icon>trending_up</mat-icon>
                      <span><strong>Monto Mínimo:</strong> {{ inscripcion.producto.montoMinimo | currency:'USD':'symbol':'1.2-0' }}</span>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
              @if (!$last) {
                <mat-divider></mat-divider>
              }
            }
          </div>
        } @else {
          <div class="no-data">
            <mat-icon>info</mat-icon>
            <p>No hay inscripciones para este cliente</p>
          </div>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .inscripciones-card {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    }
    
    mat-card-header {
      background-color: #f5f5f5;
      margin: -16px -16px 16px -16px;
      padding: 16px;
      width: calc(100% + 32px);
      box-sizing: border-box;
      flex-shrink: 0;
    }
    
    mat-card-content {
      flex: 1;
      width: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      min-height: 0;
    }
    
    mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
    }
    
    .loading-container,
    .error-container,
    .no-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      text-align: center;
      width: 100%;
      box-sizing: border-box;
      flex: 1;
    }
    
    .inscripciones-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      flex: 1;
      overflow-y: auto;
      width: 100%;
      box-sizing: border-box;
      min-height: 0;
      padding-right: 4px;
    }
    
    .inscripcion-item {
      margin: 0;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      width: 100%;
      box-sizing: border-box;
      flex-shrink: 0;
    }
    
    .inscripcion-item mat-card-header {
      background-color: #fafafa;
      margin: 0;
      padding: 12px;
      width: 100%;
      box-sizing: border-box;
    }
    
    .inscripcion-item mat-card-content {
      width: 100%;
      box-sizing: border-box;
      flex: none;
    }
    
    .producto-nombre {
      font-size: 1.1rem;
      color: #1976d2;
      margin: 0;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .inscripcion-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
    }
    
    .detail-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9rem;
      width: 100%;
      flex-wrap: wrap;
    }
    
    .detail-row mat-icon {
      color: #666;
      font-size: 18px;
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }
    
    .detail-row span {
      flex: 1;
      min-width: 0;
      word-break: break-word;
    }
    
    .monto {
      background-color: #e8f5e8;
      padding: 8px;
      border-radius: 4px;
      border-left: 4px solid #4caf50;
      width: 100%;
      box-sizing: border-box;
    }
    
    .monto-value {
      font-weight: bold;
      color: #2e7d32;
    }
    
    mat-chip {
      font-size: 0.8rem;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    mat-divider {
      margin: 8px 0;
      width: 100%;
    }
    
    /* Scrollbar personalizado para la lista */
    .inscripciones-list::-webkit-scrollbar {
      width: 6px;
    }
    
    .inscripciones-list::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }
    
    .inscripciones-list::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 3px;
    }
    
    .inscripciones-list::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8;
    }
  `]
})
export class InscripcionesComponent implements OnInit, OnChanges {
  @Input() clienteId: string = '';
  
  // Inyección de dependencias (DIP)
  private readonly inscripcionService = inject(InscripcionService);
  private readonly cdr = inject(ChangeDetectorRef);
  
  // Estado del componente
  state: InscripcionesComponentState = {
    inscripciones: [],
    cargando: false,
    error: false,
    esIdMongoValido: true
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
      esIdMongoValido: true
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
}
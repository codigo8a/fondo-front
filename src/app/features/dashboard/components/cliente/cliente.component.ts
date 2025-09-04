import { Component, Input, OnInit, OnChanges, SimpleChanges, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../interfaces/cliente.interface';

// Interface para el estado del componente (ISP)
interface ClienteComponentState {
  cliente: Cliente | null;
  cargando: boolean;
  error: boolean;
  esIdMongoValido: boolean;
}

// Clase para validación (SRP)
class ClienteValidator {
  static validarIdMongo(id: string): boolean {
    if (!id) return false;
    const mongoIdRegex = /^[0-9a-fA-F]{24}$/;
    return mongoIdRegex.test(id);
  }
}

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatProgressSpinnerModule, 
    MatIconModule,
    MatChipsModule
  ],
  template: `
    <mat-card class="cliente-card">
      <mat-card-header>
        <mat-card-title>
          <mat-icon>person</mat-icon>
          Cliente
        </mat-card-title>
      </mat-card-header>
      <mat-card-content>
        @if (state.cargando) {
          <div class="loading-container">
            <mat-spinner diameter="40"></mat-spinner>
            <p>Cargando datos del cliente...</p>
          </div>
        } @else if (state.error) {
          <div class="error-container">
            <mat-icon color="warn">error</mat-icon>
            <p>Error al cargar los datos del cliente</p>
          </div>
        } @else if (!state.esIdMongoValido) {
          <div class="no-data">
            <mat-icon>info</mat-icon>
            <p>No hay datos del cliente</p>
          </div>
        } @else if (state.cliente) {
          <div class="cliente-info">
            <div class="info-row">
              <mat-chip-set>
                <mat-chip color="primary" selected>
                  <mat-icon matChipAvatar>badge</mat-icon>
                  ID: {{ state.cliente.id }}
                </mat-chip>
              </mat-chip-set>
            </div>
            <div class="info-row">
              <h3>{{ state.cliente.nombre }} {{ state.cliente.apellidos }}</h3>
            </div>
            <div class="info-row">
              <mat-icon>location_city</mat-icon>
              <span>{{ state.cliente.ciudad }}</span>
            </div>
            <div class="info-row monto">
              <mat-icon>attach_money</mat-icon>
              <span class="monto-value">{{ state.cliente.monto | currency:'USD':'symbol':'1.2-2' }}</span>
            </div>
          </div>
        } @else {
          <div class="no-data">
            <mat-icon>info</mat-icon>
            <p>No hay datos para mostrar</p>
          </div>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .cliente-card {
      width: 100%;
      min-height: 250px;
      display: flex;
      flex-direction: column;
    }
    
    mat-card-header {
      background-color: #f5f5f5;
      margin: -16px -16px 16px -16px;
      padding: 16px;
    }
    
    mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
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
    }
    
    .cliente-info {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .info-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .info-row h3 {
      margin: 0;
      color: #1976d2;
      font-weight: 500;
    }
    
    .info-row mat-icon {
      color: #666;
    }
    
    .monto {
      background-color: #e8f5e8;
      padding: 8px;
      border-radius: 4px;
      border-left: 4px solid #4caf50;
    }
    
    .monto-value {
      font-weight: bold;
      color: #2e7d32;
      font-size: 1.1rem;
    }
    
    mat-chip-set {
      margin: 0;
    }
  `]
})
export class ClienteComponent implements OnInit, OnChanges {
  @Input() clienteId: string = '';
  
  // Inyección de dependencias (DIP)
  private readonly clienteService = inject(ClienteService);
  private readonly cdr = inject(ChangeDetectorRef);
  
  // Estado del componente
  state: ClienteComponentState = {
    cliente: null,
    cargando: false,
    error: false,
    esIdMongoValido: true
  };

  ngOnInit(): void {
    if (this.clienteId) {
      this.validarYCargarCliente();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clienteId']) {
      this.resetearEstados();
      
      if (changes['clienteId'].currentValue) {
        this.validarYCargarCliente();
      }
    }
  }

  // Método para resetear estados (SRP)
  private resetearEstados(): void {
    this.state = {
      cliente: null,
      cargando: false,
      error: false,
      esIdMongoValido: true
    };
    this.cdr.detectChanges();
  }

  // Método para validar y cargar cliente (SRP)
  private validarYCargarCliente(): void {
    if (!this.clienteId) {
      this.state.esIdMongoValido = false;
      this.cdr.detectChanges();
      return;
    }

    // Usar la clase de validación (SRP)
    this.state.esIdMongoValido = ClienteValidator.validarIdMongo(this.clienteId);

    if (this.state.esIdMongoValido) {
      this.cargarCliente();
    } else {
      this.state.cliente = null;
      this.state.cargando = false;
      this.state.error = false;
      this.cdr.detectChanges();
    }
  }

  // Método para cargar datos del cliente (SRP)
  private cargarCliente(): void {
    this.state.cargando = true;
    this.state.error = false;
    this.state.cliente = null;
    this.cdr.detectChanges();
    
    this.clienteService.obtenerClientePorId(this.clienteId).subscribe({
      next: (cliente) => {
        this.state.cliente = cliente;
        this.state.cargando = false;
        this.state.error = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener cliente:', error);
        this.state.cliente = null;
        this.state.error = true;
        this.state.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }
}
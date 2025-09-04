import { Component, Input, OnInit, OnChanges, SimpleChanges, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../interfaces/cliente.interface';

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
        @if (cargando) {
          <div class="loading-container">
            <mat-spinner diameter="40"></mat-spinner>
            <p>Cargando datos del cliente...</p>
          </div>
        } @else if (error) {
          <div class="error-container">
            <mat-icon color="warn">error</mat-icon>
            <p>Error al cargar los datos del cliente</p>
          </div>
        } @else if (!esIdMongoValido) {
          <div class="no-data">
            <mat-icon>info</mat-icon>
            <p>No hay datos del cliente</p>
          </div>
        } @else if (cliente) {
          <div class="cliente-info">
            <div class="info-row">
              <mat-chip-set>
                <mat-chip color="primary" selected>
                  <mat-icon matChipAvatar>badge</mat-icon>
                  ID: {{ cliente.id }}
                </mat-chip>
              </mat-chip-set>
            </div>
            <div class="info-row">
              <h3>{{ cliente.nombre }} {{ cliente.apellidos }}</h3>
            </div>
            <div class="info-row">
              <mat-icon>location_city</mat-icon>
              <span>{{ cliente.ciudad }}</span>
            </div>
            <div class="info-row monto">
              <mat-icon>attach_money</mat-icon>
              <span class="monto-value">{{ cliente.monto | currency:'USD':'symbol':'1.2-2' }}</span>
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
  
  private readonly clienteService = inject(ClienteService);
  private readonly cdr = inject(ChangeDetectorRef);
  
  cliente: Cliente | null = null;
  cargando = false;
  error = false;
  esIdMongoValido = true;

  ngOnInit(): void {
    if (this.clienteId) {
      this.validarYCargarCliente();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clienteId']) {
      // Resetear estados al cambiar el ID
      this.resetearEstados();
      
      if (changes['clienteId'].currentValue) {
        this.validarYCargarCliente();
      }
    }
  }

  private resetearEstados(): void {
    this.cliente = null;
    this.cargando = false;
    this.error = false;
    this.esIdMongoValido = true;
    this.cdr.detectChanges();
  }

  private validarYCargarCliente(): void {
    if (!this.clienteId) {
      this.esIdMongoValido = false;
      this.cdr.detectChanges();
      return;
    }

    // Validar formato de ObjectId de MongoDB (24 caracteres hexadecimales)
    const mongoIdRegex = /^[0-9a-fA-F]{24}$/;
    this.esIdMongoValido = mongoIdRegex.test(this.clienteId);

    if (this.esIdMongoValido) {
      this.cargarCliente();
    } else {
      // Resetear estados si el ID no es válido
      this.cliente = null;
      this.cargando = false;
      this.error = false;
      this.cdr.detectChanges();
    }
  }

  private cargarCliente(): void {
    this.cargando = true;
    this.error = false;
    this.cliente = null;
    this.cdr.detectChanges();
    
    this.clienteService.obtenerClientePorId(this.clienteId).subscribe({
      next: (cliente) => {
        this.cliente = cliente;
        this.cargando = false;
        this.error = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener cliente:', error);
        this.cliente = null;
        this.error = true;
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }
}
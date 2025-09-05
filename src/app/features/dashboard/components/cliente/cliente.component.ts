import { Component, Input, OnInit, OnChanges, SimpleChanges, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
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

// Componente del modal de ejemplo
@Component({
  selector: 'app-modal-ejemplo',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatIconModule],
  template: `
    <div class="modal-header">
      <h2 mat-dialog-title>
        <mat-icon>info</mat-icon>
        Modal de Ejemplo
      </h2>
    </div>
    <div mat-dialog-content class="modal-content">
      <p>Este es un modal genérico de ejemplo.</p>
      <p>Aquí puedes agregar cualquier contenido que necesites mostrar.</p>
      <div class="ejemplo-info">
        <mat-icon>lightbulb</mat-icon>
        <span>Este modal se puede personalizar según tus necesidades.</span>
      </div>
    </div>
    <div mat-dialog-actions class="modal-actions">
      <button mat-button mat-dialog-close>Cerrar</button>
      <button mat-raised-button color="primary" mat-dialog-close>Aceptar</button>
    </div>
  `,
  styles: [`
    .modal-header {
      padding: 20px 24px 0;
    }
    
    .modal-header h2 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      color: #1976d2;
    }
    
    .modal-content {
      padding: 20px 24px;
      min-width: 300px;
    }
    
    .ejemplo-info {
      display: flex;
      align-items: center;
      gap: 8px;
      background-color: #f5f5f5;
      padding: 12px;
      border-radius: 4px;
      margin-top: 16px;
    }
    
    .ejemplo-info mat-icon {
      color: #ff9800;
    }
    
    .modal-actions {
      padding: 8px 24px 20px;
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
  `]
})
export class ModalEjemploComponent {}

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatProgressSpinnerModule, 
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent implements OnInit, OnChanges {
  @Input() clienteId: string = '';
  
  // Inyección de dependencias (DIP)
  private readonly clienteService = inject(ClienteService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly dialog = inject(MatDialog);
  
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

  // Método para abrir el modal (SRP)
  abrirModal(): void {
    const dialogRef = this.dialog.open(ModalEjemploComponent, {
      width: '400px',
      disableClose: false,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Modal cerrado:', result);
    });
  }
}
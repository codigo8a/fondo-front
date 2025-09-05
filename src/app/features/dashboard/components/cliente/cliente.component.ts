import { Component, Input, OnInit, OnChanges, SimpleChanges, inject, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../interfaces/cliente.interface';
import { SucursalesComponent } from '../sucursales/sucursales.component';

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
    MatChipsModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent implements OnInit, OnChanges {
  @Input() clienteId: string = '';
  @Output() inscripcionCreada = new EventEmitter<void>();
  @Output() logActualizado = new EventEmitter<void>();
  
  private readonly clienteService = inject(ClienteService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly dialog = inject(MatDialog);

  // Estado del componente usando la interface (ISP)
  state: ClienteComponentState = {
    cliente: null,
    cargando: false,
    error: false,
    esIdMongoValido: true
  };

  // Propiedad computed para el estado del botón (independiente del spinner)
  get botonHabilitado(): boolean {
    return !!(this.clienteId && this.clienteId.trim() !== '' && !this.state.cargando && !this.state.error);
  }

  ngOnInit(): void {
    if (this.clienteId) {
      this.validarYCargarCliente();
    }
  }

  // Estado separado para el botón
  botonDeshabilitado: boolean = true;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clienteId']) {
      this.resetearEstados();
      this.actualizarEstadoBoton();
      
      // Usar currentValue del change para asegurar que tenemos el valor más reciente
      const nuevoClienteId = changes['clienteId'].currentValue;
      
      if (nuevoClienteId && nuevoClienteId.trim() !== '') {
        // Forzar la actualización en el siguiente ciclo
        setTimeout(() => {
          this.validarYCargarCliente();
        }, 0);
      }
    }
  }

  private actualizarEstadoBoton(): void {
    this.botonDeshabilitado = !(this.clienteId && this.clienteId.trim() !== '');
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
      this.state.cargando = false;
      this.state.error = false;
      this.state.cliente = null;
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
  public cargarCliente(): void {
    if (!this.clienteId) {
      this.resetearEstados();
      return;
    }

    this.state.esIdMongoValido = ClienteValidator.validarIdMongo(this.clienteId);
    
    if (!this.state.esIdMongoValido) {
      this.resetearEstados();
      return;
    }

    this.state.cargando = true;
    this.state.error = false;
    this.cdr.detectChanges();

    this.clienteService.obtenerClientePorId(this.clienteId).subscribe({
      next: (cliente) => {
        this.state.cliente = cliente;
        this.state.cargando = false;
        this.state.error = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar cliente:', error);
        this.state.cliente = null;
        this.state.error = true;
        this.state.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Método para abrir el modal de sucursales (SRP)
  abrirModal(): void {
    const dialogRef = this.dialog.open(SucursalesComponent, {
      width: '600px',
      disableClose: false,
      autoFocus: true,
      data: { clienteId: this.clienteId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        this.inscripcionCreada.emit();
        this.logActualizado.emit();       
        // Si se recibió el cliente actualizado, actualizar los datos locales
        if (result.clienteActualizado) {
          this.state.cliente = result.clienteActualizado;
          this.cdr.detectChanges();
        } else {
          // Si no se recibió el cliente actualizado, recargar desde el servidor
          this.cargarCliente();
        }
      }
    });
  }
}
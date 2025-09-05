import { Component, inject, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClient } from '@angular/common/http';
import { Sucursal } from '../../interfaces/sucursal.interface';
import { Producto } from '../../interfaces/producto.interface';
import { InscripcionRequest } from '../../interfaces/inscripcion.interface';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../interfaces/cliente.interface';

@Component({
  selector: 'app-sucursales',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule, 
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  templateUrl: './sucursales.component.html',
  styleUrls: ['./sucursales.component.scss']
})
export class SucursalesComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly dialogRef = inject(MatDialogRef<SucursalesComponent>);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly clienteService = inject(ClienteService);
  
  clienteId: string = '';
  cliente: Cliente | null = null;
  sucursales: Sucursal[] = [];
  productos: Producto[] = [];
  sucursalSeleccionada: Sucursal | null = null;
  cargando: boolean = false;
  cargandoProductos: boolean = false;
  cargandoCliente: boolean = false;
  error: boolean = false;
  errorProductos: boolean = false;
  errorCliente: boolean = false;
  montosInversion: (number | string | null)[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { clienteId: string }) {
    this.clienteId = data?.clienteId || '';
  }
  
  ngOnInit(): void {
    this.cargarSucursales();
    this.cargarCliente();
  }

  private cargarCliente(): void {
    if (!this.clienteId) {
      console.error('No se proporcionó ID de cliente');
      return;
    }

    this.cargandoCliente = true;
    this.errorCliente = false;
    this.cdr.detectChanges();

    this.clienteService.obtenerClientePorId(this.clienteId)
      .subscribe({
        next: (cliente) => {
          this.cliente = cliente;
          this.cargandoCliente = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al cargar cliente:', error);
          this.errorCliente = true;
          this.cargandoCliente = false;
          this.cdr.detectChanges();
        }
      });
  }

  private cargarSucursales(): void {
    this.cargando = true;
    this.error = false;
    this.cdr.detectChanges();
    
    this.http.get<Sucursal[]>('http://localhost:8080/api/sucursal')
      .subscribe({
        next: (sucursales) => {
          this.sucursales = sucursales;
          this.cargando = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al cargar sucursales:', error);
          this.error = true;
          this.cargando = false;
          this.cdr.detectChanges();
        }
      });
  }

  seleccionarSucursal(sucursal: Sucursal): void {
    this.sucursalSeleccionada = sucursal;
    this.cargarProductosPorSucursal(sucursal.id);
  }

  private cargarProductosPorSucursal(sucursalId: string): void {
    this.cargandoProductos = true;
    this.errorProductos = false;
    this.productos = [];
    this.montosInversion = []; // Resetear montos al cargar nuevos productos
    
    this.http.get<Producto[]>(`http://localhost:8080/api/productos/sucursal/${sucursalId}`)
      .subscribe({
        next: (productos) => {
          this.productos = productos;
          this.montosInversion = new Array(productos.length).fill('');
          this.cargandoProductos = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al cargar productos:', error);
          this.errorProductos = true;
          this.cargandoProductos = false;
          this.cdr.detectChanges();
        }
      });
  }

  volverASucursales(): void {
    this.sucursalSeleccionada = null;
    this.productos = [];
    this.errorProductos = false;
    this.cargandoProductos = false;
  }

  recargarProductos(): void {
    if (this.sucursalSeleccionada) {
      this.cargarProductosPorSucursal(this.sucursalSeleccionada.id);
    }
  }

  recargarSucursales(): void {
    this.cargarSucursales();
  }

  invertir(producto: Producto, monto: number | string | null): void {
    const montoNumerico = typeof monto === 'string' ? parseFloat(monto) : Number(monto);
    
    if (!monto || isNaN(montoNumerico) || montoNumerico < producto.montoMinimo) {
      this.snackBar.open('El monto debe ser mayor o igual al monto mínimo del producto', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    // Nueva validación: verificar que el monto no sea mayor al disponible del cliente
    if (this.cliente && montoNumerico > this.cliente.monto) {
      this.snackBar.open(`El monto a invertir no puede ser mayor a su saldo disponible: ${this.cliente.monto.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}`, 'Cerrar', {
        duration: 4000,
        panelClass: ['error-snackbar']
      });
      return;
    }
    
    if (!this.clienteId || !this.sucursalSeleccionada) {
      console.error('Faltan datos requeridos: clienteId o sucursal seleccionada');
      return;
    }

    const inscripcionRequest: InscripcionRequest = {
      idCliente: this.clienteId,
      idProducto: producto.id,
      idSucursal: this.sucursalSeleccionada.id,
      montoInvertido: montoNumerico,
      fechaTransaccion: new Date().toISOString()
    };

    console.log('Enviando inscripción:', inscripcionRequest);

    this.http.post('http://localhost:8080/api/inscripcion', inscripcionRequest)
      .subscribe({
        next: (response) => {
          console.log('Inscripción exitosa:', response);
          
          // Mostrar alerta de éxito
          this.dialog.open(AlertDialogComponent, {
            data: {
              title: 'Inscripción Exitosa',
              message: 'La inscripción se ha realizado correctamente.',
              type: 'success'
            },
            width: '400px',
            disableClose: false
          });
          
          // Cerrar el modal y enviar el resultado
          this.dialogRef.close({ success: true, data: response });
        },
        error: (error) => {
          console.error('Error al crear inscripción:', error);
          
          let title = 'Error';
          let message = 'Error al procesar la inscripción. Intente nuevamente.';
          
          // Manejar error específico de inscripción duplicada
          if (error.status === 400 && error.error?.error) {
            title = 'Inscripción Duplicada';
            message = error.error.error;
          }
          
          // Mostrar alerta de error
          this.dialog.open(AlertDialogComponent, {
            data: {
              title: title,
              message: message,
              type: 'error'
            },
            width: '400px',
            disableClose: false
          });
        }
      });
  }
  
  // Método para convertir string a number
  toNumber(value: any): number {
    return Number(value) || 0;
  }

  // Método para validar el monto en tiempo real
  validarMonto(monto: number | string | null, producto: Producto): boolean {
    const montoNumerico = typeof monto === 'string' ? parseFloat(monto) : Number(monto);
    
    if (!monto || isNaN(montoNumerico)) {
      return false;
    }
    
    if (montoNumerico < producto.montoMinimo) {
      return false;
    }
    
    if (this.cliente && montoNumerico > this.cliente.monto) {
      return false;
    }
    
    return true;
  }

  // Método para obtener el mensaje de error del monto
  obtenerMensajeErrorMonto(monto: number | string | null, producto: Producto): string {
    const montoNumerico = typeof monto === 'string' ? parseFloat(monto) : Number(monto);
    
    if (!monto || isNaN(montoNumerico)) {
      return 'Ingrese un monto válido';
    }
    
    if (montoNumerico < producto.montoMinimo) {
      return `Monto mínimo: ${producto.montoMinimo.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}`;
    }
    
    if (this.cliente && montoNumerico > this.cliente.monto) {
      return `Saldo insuficiente. Disponible: ${this.cliente.monto.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}`;
    }
    
    return '';
  }

  // Método helper para obtener el monto máximo permitido
  obtenerMontoMaximo(): number | null {
    return this.cliente ? this.cliente.monto : null;
  }
}
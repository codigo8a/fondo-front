import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
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
import { ClienteService } from '../../services/cliente.service';
import { InscripcionService } from '../../services/inscripcion.service';
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
    MatTooltipModule
  ],
  templateUrl: './sucursales.component.html',
  styleUrls: ['./sucursales.component.scss']
})
export class SucursalesComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly dialogRef = inject(MatDialogRef<SucursalesComponent>);
  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly clienteService = inject(ClienteService);
  private readonly inscripcionService = inject(InscripcionService);
  private readonly dialog = inject(MatDialog);
  
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

  ngOnInit(): void {
    this.clienteId = this.data?.clienteId || '';
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
    
    this.http.get<Sucursal[]>('https://fondo-back-af12d1147ad0.herokuapp.com/api/sucursal')
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
    this.montosInversion = [];
    
    this.http.get<Producto[]>(`https://fondo-back-af12d1147ad0.herokuapp.com/api/productos/sucursal/${sucursalId}`)
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
    
    // Validar si el monto es válido usando el método de validación existente
    if (!this.validarMonto(monto, producto)) {
      const mensajeError = this.obtenerMensajeErrorMonto(monto, producto);
      
      // Mostrar alerta de error de validación
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'Error de Validación',
          message: mensajeError,
          type: 'error'
        },
        width: '400px',
        disableClose: false
      });
      return;
    }
    
    if (!this.clienteId || !this.sucursalSeleccionada) {
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'Error',
          message: 'Faltan datos requeridos para procesar la inversión.',
          type: 'error'
        },
        width: '400px',
        disableClose: false
      });
      return;
    }

    const inscripcionRequest: InscripcionRequest = {
      idCliente: this.clienteId,
      idProducto: producto.id,
      idSucursal: this.sucursalSeleccionada.id,
      montoInvertido: montoNumerico,
      fechaTransaccion: new Date().toISOString()
    };

    this.inscripcionService.crearInscripcion(inscripcionRequest)
      .subscribe({
        next: (response) => {
          console.log('Inscripción exitosa:', response);
          
          // Actualizar el monto del cliente después de la inscripción exitosa
          if (this.cliente) {
            const nuevoMonto = this.cliente.monto - montoNumerico;
            
            this.clienteService.actualizarMonto(this.clienteId!, nuevoMonto)
              .subscribe({
                next: () => {
                  console.log('Monto del cliente actualizado exitosamente');
                  
                  // Recargar los datos completos del cliente desde el backend
                  this.clienteService.obtenerClientePorId(this.clienteId!)
                    .subscribe({
                      next: (clienteActualizado) => {
                        this.cliente = clienteActualizado;
                        this.cdr.detectChanges();
                        
                        // Mostrar alerta de éxito después de recargar los datos
                        this.dialog.open(AlertDialogComponent, {
                          data: {
                            title: 'Inscripción Exitosa',
                            message: 'La inscripción se ha realizado correctamente y su saldo ha sido actualizado.',
                            type: 'success'
                          },
                          width: '400px',
                          disableClose: false
                        });
                        
                        // Cerrar el modal y enviar los datos actualizados del cliente
                        this.dialogRef.close({ 
                          success: true, 
                          data: response, 
                          clienteActualizado: clienteActualizado 
                        });
                      },
                      error: (errorRecarga) => {
                        console.error('Error al recargar datos del cliente:', errorRecarga);
                        
                        // Mostrar alerta de éxito pero con advertencia sobre la recarga
                        this.dialog.open(AlertDialogComponent, {
                          data: {
                            title: 'Inscripción Exitosa',
                            message: 'La inscripción se realizó correctamente y el saldo fue actualizado, pero hubo un problema al recargar los datos. Actualice la página para ver los cambios.',
                            type: 'warning'
                          },
                          width: '400px',
                          disableClose: false
                        });
                        
                        this.dialogRef.close({ 
                          success: true, 
                          data: response,
                          shouldRefreshClient: true
                        });
                      }
                    });
                },
                error: (error) => {
                  console.error('Error al actualizar el monto del cliente:', error);
                  
                  // Mostrar alerta de advertencia - la inscripción fue exitosa pero el monto no se actualizó
                  this.dialog.open(AlertDialogComponent, {
                    data: {
                      title: 'Inscripción Exitosa',
                      message: 'La inscripción se realizó correctamente, pero hubo un problema al actualizar su saldo. Por favor, contacte al administrador.',
                      type: 'warning'
                    },
                    width: '400px',
                    disableClose: false
                  });
                  
                  // Cerrar el modal y indicar que se debe refrescar el cliente
                  this.dialogRef.close({ 
                    success: true, 
                    data: response,
                    shouldRefreshClient: true
                  });
                }
              });
          }
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
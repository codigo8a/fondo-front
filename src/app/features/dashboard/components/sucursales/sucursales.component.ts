import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClient } from '@angular/common/http';
import { Sucursal } from '../../interfaces/sucursal.interface';
import { Producto } from '../../interfaces/producto.interface';

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
  
  sucursales: Sucursal[] = [];
  productos: Producto[] = [];
  sucursalSeleccionada: Sucursal | null = null;
  cargando: boolean = false;
  cargandoProductos: boolean = false;
  error: boolean = false;
  errorProductos: boolean = false;
  montosInversion: (number | string | null)[] = [];

  ngOnInit(): void {
    this.cargarSucursales();
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
      console.warn('El monto debe ser mayor o igual al monto mínimo del producto');
      return;
    }
    
    console.log('Invirtiendo en producto:', producto.nombre, 'Monto:', montoNumerico);
    // Aquí puedes agregar la lógica para procesar la inversión
    // Por ejemplo, llamar a un endpoint de inversión
  }
  
  // Método para convertir string a number
  toNumber(value: any): number {
    return Number(value) || 0;
  }
}
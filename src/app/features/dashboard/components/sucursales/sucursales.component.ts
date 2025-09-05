import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClient } from '@angular/common/http';
import { Sucursal } from '../../interfaces/sucursal.interface';
import { Producto } from '../../interfaces/producto.interface';

@Component({
  selector: 'app-sucursales',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatDialogModule, 
    MatIconModule,
    MatProgressSpinnerModule
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
    this.cdr.detectChanges();
    
    this.http.get<Producto[]>(`http://localhost:8080/api/productos/sucursal/${sucursalId}`)
      .subscribe({
        next: (productos) => {
          this.productos = productos;
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
}
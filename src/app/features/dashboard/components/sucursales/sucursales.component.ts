import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClient } from '@angular/common/http';
import { Sucursal } from '../../interfaces/sucursal.interface';

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
  cargando: boolean = false;
  error: boolean = false;

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

  recargarSucursales(): void {
    this.cargarSucursales();
  }
}
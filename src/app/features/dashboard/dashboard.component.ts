import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { Cliente } from './interfaces/cliente.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule
  ],
  template: `
    <mat-toolbar color="primary">
      <span>Dashboard</span>
    </mat-toolbar>
    
    <div class="dashboard-container">
      <div class="hola-container">
        <h1>{{ clienteIdAleatorio }}</h1>
      </div>
      
      <div class="button-container">
        <button mat-raised-button color="primary" (click)="obtenerClienteAleatorio()">
          Obtener Cliente Aleatorio
        </button>
        <button mat-raised-button color="accent" (click)="reiniciarHistorial()" style="margin-left: 10px;">
          Reiniciar
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      flex-direction: column;
      height: calc(100vh - 64px);
    }
    
    .hola-container {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
      font-size: 3rem;
      font-weight: bold;
      color: #333;
    }
    
    .button-container {
      display: flex;
      justify-content: center;
      padding: 20px;
    }
    
    h1 {
      margin: 0;
      text-align: center;
      word-break: break-all;
    }
  `]
})
export class DashboardComponent {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  clienteIdAleatorio: string = 'HOLA';
  private idsUtilizados: Set<string> = new Set();
  private todosLosClientes: Cliente[] = [];

  obtenerClienteAleatorio(): void {
    this.http.get<Cliente[]>('http://localhost:8080/api/clientes')
      .subscribe({
        next: (clientes) => {
          if (clientes && clientes.length > 0) {
            this.todosLosClientes = clientes;
            
            // Si ya se usaron todos los IDs, reiniciar el historial
            if (this.idsUtilizados.size >= clientes.length) {
              this.idsUtilizados.clear();
            }
            
            // Filtrar clientes no utilizados
            const clientesDisponibles = clientes.filter(cliente => 
              !this.idsUtilizados.has(cliente.id)
            );
            
            if (clientesDisponibles.length > 0) {
              const indiceAleatorio = Math.floor(Math.random() * clientesDisponibles.length);
              const clienteSeleccionado = clientesDisponibles[indiceAleatorio];
              
              this.clienteIdAleatorio = clienteSeleccionado.id;
              this.idsUtilizados.add(clienteSeleccionado.id);
            } else {
              // Fallback: si no hay disponibles, tomar cualquiera
              const indiceAleatorio = Math.floor(Math.random() * clientes.length);
              this.clienteIdAleatorio = clientes[indiceAleatorio].id;
            }
            
            this.cdr.detectChanges();
          }
        },
        error: (error) => {
          console.error('Error al obtener clientes:', error);
          this.clienteIdAleatorio = 'Error al cargar';
          this.cdr.detectChanges();
        }
      });
  }
  
  reiniciarHistorial(): void {
    this.idsUtilizados.clear();
    this.clienteIdAleatorio = 'HOLA';
    this.cdr.detectChanges();
  }
}
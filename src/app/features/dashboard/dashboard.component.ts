import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { Cliente } from './interfaces/cliente.interface';
import { ClienteComponent } from './components/cliente/cliente.component';
import { InscripcionesComponent } from './components/inscripciones/inscripciones.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    ClienteComponent,
    InscripcionesComponent
  ],
  template: `
    <mat-toolbar color="primary">
      <span>Dashboard</span>
    </mat-toolbar>
    
    <div class="dashboard-container">     
      <div class="components-container">
        <div class="component-left">
          <app-cliente [clienteId]="clienteIdAleatorio"></app-cliente>
        </div>
        
        <div class="component-right">
          <app-inscripciones [clienteId]="clienteIdAleatorio"></app-inscripciones>
        </div>
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
      padding: 20px;
      box-sizing: border-box;
      width: 100%;
    }
    
    .hola-container {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 20px;
      font-size: 3rem;
      font-weight: bold;
      color: #333;
      width: 100%;
    }
    
    .components-container {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
      flex: 1;
      width: 100%;
      box-sizing: border-box;
      min-height: 0;
    }
    
    .component-left,
    .component-right {
      flex: 1;
      display: flex;
      align-items: flex-start;
      width: calc(50% - 10px);
      min-width: 0;
      box-sizing: border-box;
    }
    
    .component-left app-cliente,
    .component-right app-inscripciones {
      width: 100%;
      height: 100%;
      display: block;
    }
    
    .button-container {
      display: flex;
      justify-content: center;
      padding: 20px;
      width: 100%;
      box-sizing: border-box;
      flex-shrink: 0;
    }
    
    h1 {
      margin: 0;
      text-align: center;
      word-break: break-all;
      width: 100%;
    }
  `]
})
export class DashboardComponent {
  private readonly http = inject(HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);
  
  clienteIdAleatorio: string = '';
  private readonly idsUtilizados: Set<string> = new Set();

  obtenerClienteAleatorio(): void {
    // Primero establecer un valor temporal para forzar detección de cambios
    this.clienteIdAleatorio = 'loading...';
    this.cdr.detectChanges();
    
    this.http.get<Cliente[]>('http://localhost:8080/api/clientes')
      .subscribe({
        next: (clientes) => {
          if (clientes && clientes.length > 0) {
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
          this.clienteIdAleatorio = 'error';
          this.cdr.detectChanges();
        }
      });
  }
  
  reiniciarHistorial(): void {
    this.idsUtilizados.clear();
    this.clienteIdAleatorio = '';
    this.cdr.detectChanges();
  }
}
import { Component, inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { Cliente } from './interfaces/cliente.interface';
import { ClienteComponent } from './components/cliente/cliente.component';
import { InscripcionesComponent } from './components/inscripciones/inscripciones.component';
import { LogComponent } from './components/log/log.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    ClienteComponent,
    InscripcionesComponent,
    LogComponent
  ],
  template: `
    <mat-toolbar color="primary">
      <span>Dashboard</span>
    </mat-toolbar>
    
    <div class="dashboard-container">     
      <div class="components-container">
        <div class="component-left">
          <div class="left-row cliente-row">
            <app-cliente 
              #clienteComponent
              [clienteId]="clienteIdAleatorio"
              (inscripcionCreada)="onInscripcionCreada()"
              (logActualizado)="onLogActualizado()">
            </app-cliente>
          </div>
          
          <div class="left-row log-row">
            <app-log 
              #logComponent
              [clienteId]="clienteIdAleatorio">
            </app-log>
          </div>
        </div>
        
        <div class="component-right">
          <app-inscripciones 
            #inscripcionesComponent
            [clienteId]="clienteIdAleatorio"
            (clienteActualizado)="onClienteActualizado()"
            (logActualizado)="onLogActualizado()">
          </app-inscripciones>
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
      gap: 10px; // Reducido de 20px a 10px
      margin-bottom: 20px;
      flex: 1;
      width: 100%;
      box-sizing: border-box;
      min-height: 0;
    }
    
    .component-left {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px; // Reducido aún más
      width: calc(50% - 10px);
      min-width: 0;
      box-sizing: border-box;
    }
    
    .component-right {
      flex: 1;
      display: flex;
      align-items: flex-start;
      width: calc(50% - 10px);
      min-width: 0;
      box-sizing: border-box;
    }
    
    .left-row {
      flex: none; // Cambiado de flex: 1 a flex: none
      display: flex;
      align-items: flex-start;
      min-height: 0; // Eliminado min-height fijo
      box-sizing: border-box;
    }
    
    .cliente-row {
      height: auto; // Cambiado de min-height: 300px a height: auto
      margin-bottom: 4px; // Pequeño margen para separación
    }
    
    .log-row {
      height: auto; // Cambiado de min-height: 200px a height: auto
    }
    
    .left-row app-cliente,
    .left-row app-log,
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
  @ViewChild('inscripcionesComponent') inscripcionesComponent!: InscripcionesComponent;
  @ViewChild('clienteComponent') clienteComponent!: ClienteComponent;
  @ViewChild('logComponent') logComponent!: LogComponent;
  
  private readonly http = inject(HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);
  
  clienteIdAleatorio: string = '';
  private readonly idsUtilizados: Set<string> = new Set();

  obtenerClienteAleatorio(): void {
    // NO usar valores temporales, simplemente hacer la petición
    this.http.get<Cliente[]>('https://fondo-back-af12d1147ad0.herokuapp.com/api/clientes')
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
          } else {
            console.warn('No se encontraron clientes');
            this.clienteIdAleatorio = '';
          }
          
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al obtener clientes:', error);
          this.clienteIdAleatorio = '';
          this.cdr.detectChanges();
        }
      });
  }
  
  reiniciarHistorial(): void {
    this.idsUtilizados.clear();
    this.clienteIdAleatorio = '';
    this.cdr.detectChanges();
  }
  
  onInscripcionCreada(): void {
    // Recargar las inscripciones cuando se crea una nueva
    if (this.inscripcionesComponent) {
      this.inscripcionesComponent.recargarInscripciones();
    }
  }
  
  onClienteActualizado(): void {
    // Recargar los datos del cliente cuando se actualiza el monto
    if (this.clienteComponent) {
      this.clienteComponent.cargarCliente();
    }
  }
  
  onLogActualizado(): void {
    // Recargar los logs cuando se crea o elimina una inscripción
    if (this.logComponent) {
      this.logComponent.cargarLogs();
    }
  }
}
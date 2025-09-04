import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { IClienteRandomService, ClienteRandomService } from './services/cliente-random.service';

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
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly clienteRandomService: IClienteRandomService = inject(ClienteRandomService);
  
  clienteIdAleatorio: string = 'HOLA';

  obtenerClienteAleatorio(): void {
    this.clienteRandomService.obtenerClienteAleatorio().subscribe({
      next: (clienteId) => {
        this.clienteIdAleatorio = clienteId;
        this.cdr.detectChanges();
      }
    });
  }
  
  reiniciarHistorial(): void {
    this.clienteRandomService.reiniciarHistorial();
    this.clienteIdAleatorio = 'HOLA';
    this.cdr.detectChanges();
  }
}
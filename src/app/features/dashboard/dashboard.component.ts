import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatToolbarModule
  ],
  template: `
    <mat-toolbar color="primary">
      <mat-icon>dashboard</mat-icon>
      <span>Dashboard</span>
    </mat-toolbar>
    
    <div class="dashboard-container">
      <mat-grid-list cols="2" rowHeight="200px" gutterSize="16px">
        <mat-grid-tile>
          <mat-card class="dashboard-card">
            <mat-card-header>
              <mat-card-title>Estadísticas</mat-card-title>
              <mat-card-subtitle>Resumen general</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>Contenido de estadísticas aquí</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="primary">Ver más</button>
            </mat-card-actions>
          </mat-card>
        </mat-grid-tile>
        
        <mat-grid-tile>
          <mat-card class="dashboard-card">
            <mat-card-header>
              <mat-card-title>Actividad Reciente</mat-card-title>
              <mat-card-subtitle>Últimas acciones</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>Lista de actividades recientes</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="accent">Ver historial</button>
            </mat-card-actions>
          </mat-card>
        </mat-grid-tile>
      </mat-grid-list>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
      background-color: #f5f5f5;
      min-height: calc(100vh - 64px);
    }
    
    .dashboard-card {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    
    mat-card-content {
      flex-grow: 1;
    }
  `]
})
export class DashboardComponent {
  private cdr = inject(ChangeDetectorRef);
  
  // Para operaciones asíncronas, llama manualmente a detectChanges()
  async loadData() {
    // ... operación asíncrona
    this.cdr.detectChanges(); // Detección manual de cambios
  }
}
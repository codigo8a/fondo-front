import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule
  ],
  template: `
    <mat-toolbar color="primary">
      <span>Dashboard</span>
    </mat-toolbar>
    
    <div class="hola-container">
      <h1>HOLA</h1>
    </div>
  `,
  styles: [`
    .hola-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: calc(100vh - 64px);
      font-size: 3rem;
      font-weight: bold;
      color: #333;
    }
    
    h1 {
      margin: 0;
      text-align: center;
    }
  `]
})
export class DashboardComponent {
  // Componente simplificado - solo muestra HOLA
}
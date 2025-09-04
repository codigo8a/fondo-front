import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h1>Dashboard</h1>
      <div class="dashboard-content">
        <div class="card">
          <h2>Bienvenido</h2>
          <p>Esta es tu aplicación de dashboard simplificada.</p>
        </div>
        
        <div class="stats-grid">
          <div class="stat-card">
            <h3>Estadística 1</h3>
            <p class="stat-number">{{ stat1 }}</p>
          </div>
          
          <div class="stat-card">
            <h3>Estadística 2</h3>
            <p class="stat-number">{{ stat2 }}</p>
          </div>
          
          <div class="stat-card">
            <h3>Estadística 3</h3>
            <p class="stat-number">{{ stat3 }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .dashboard-content {
      margin-top: 20px;
    }
    
    .card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 20px;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }
    
    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: center;
    }
    
    .stat-number {
      font-size: 2em;
      font-weight: bold;
      color: #007bff;
      margin: 10px 0;
    }
    
    h1 {
      color: #333;
      margin-bottom: 20px;
    }
    
    h2, h3 {
      color: #555;
    }
  `]
})
export class DashboardComponent {
  stat1 = 150;
  stat2 = 75;
  stat3 = 230;
}
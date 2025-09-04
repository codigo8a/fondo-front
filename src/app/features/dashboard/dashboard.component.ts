import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Observable } from 'rxjs';

import { IDashboardService } from './interfaces/dashboard-service.interface';
import { DashboardWidget, WidgetType } from './interfaces/dashboard-widget.interface';
import { DashboardService } from './services/dashboard.service';
import { BaseWidgetComponent } from './components/base-widget/base-widget.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatToolbarModule,
    BaseWidgetComponent
  ],
  template: `
    <mat-toolbar color="primary">
      <mat-icon>dashboard</mat-icon>
      <span>Dashboard</span>
    </mat-toolbar>
    
    <div class="dashboard-container">
      <p>Total widgets: {{ widgets.length }}</p>
      <mat-grid-list cols="2" rowHeight="200px" gutterSize="16px">
        @for (widget of widgets; track widget.id) {
          <mat-grid-tile>
            <p>Widget: {{ widget.title }}</p>
            <app-base-widget 
              [widget]="widget"
              [primaryActionText]="getPrimaryActionText(widget.type)"
              [secondaryActionText]="getSecondaryActionText(widget.type)"
              (primaryAction)="handlePrimaryAction(widget)"
              (secondaryAction)="handleSecondaryAction(widget)">
              
              <!-- Contenido específico del widget -->
              @switch (widget.type) {
                @case ('statistics') {
                  <div>
                    <p>Contenido de estadísticas aquí</p>
                  </div>
                }
                @case ('activity') {
                  <div>
                    <p>Lista de actividades recientes</p>
                  </div>
                }
              }
            </app-base-widget>
          </mat-grid-tile>
        }
      </mat-grid-list>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
      background-color: #f5f5f5;
      min-height: calc(100vh - 64px);
    }
  `]
})
export class DashboardComponent implements OnInit {
  private dashboardService: IDashboardService = inject(DashboardService);
  
  // Hacer WidgetType accesible en el template
  readonly WidgetType = WidgetType;
  
  widgets: DashboardWidget[] = [];

  async ngOnInit(): Promise<void> {
    await this.loadWidgets();
  }

  private async loadWidgets(): Promise<void> {
    try {
      console.log('Cargando widgets...');
      this.widgets = await this.dashboardService.getWidgets();
      console.log('Widgets cargados:', this.widgets);
      console.log('Número de widgets:', this.widgets.length);
    } catch (error) {
      console.error('Error loading widgets:', error);
    }
  }

  getPrimaryActionText(widgetType: WidgetType): string {
    switch (widgetType) {
      case WidgetType.STATISTICS: return 'Ver más';
      case WidgetType.ACTIVITY: return 'Ver historial';
      case WidgetType.CHART: return 'Ver gráfico';
      default: return 'Acción';
    }
  }

  getSecondaryActionText(widgetType: WidgetType): string | undefined {
    switch (widgetType) {
      case WidgetType.STATISTICS: return 'Exportar';
      case WidgetType.ACTIVITY: return 'Filtrar';
      case WidgetType.CHART: return 'Configurar';
      default: return undefined;
    }
  }

  async handlePrimaryAction(widget: DashboardWidget): Promise<void> {
    // Lógica específica por tipo de widget
    console.log(`Primary action for widget: ${widget.id}`);
  }

  async handleSecondaryAction(widget: DashboardWidget): Promise<void> {
    // Lógica específica por tipo de widget
    console.log(`Secondary action for widget: ${widget.id}`);
  }
}
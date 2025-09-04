import { Injectable } from '@angular/core';
import { IDashboardService } from '../interfaces/dashboard-service.interface';
import { DashboardWidget, WidgetType } from '../interfaces/dashboard-widget.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService implements IDashboardService {
  
  async getWidgets(): Promise<DashboardWidget[]> {
    return [
      {
        id: 'stats',
        title: 'Estadísticas',
        subtitle: 'Resumen general',
        type: WidgetType.STATISTICS
      },
      {
        id: 'activity',
        title: 'Actividad Reciente',
        subtitle: 'Últimas acciones',
        type: WidgetType.ACTIVITY
      }
    ];
  }

  async getWidgetData(widgetId: string): Promise<any> {
    // Implementación específica por widget
    switch (widgetId) {
      case 'stats':
        return this.getStatisticsData();
      case 'activity':
        return this.getActivityData();
      default:
        throw new Error(`Widget ${widgetId} not found`);
    }
  }

  async refreshWidget(widgetId: string): Promise<void> {
    // Lógica de refresh específica
  }

  private async getStatisticsData(): Promise<any> {
    // Lógica para obtener estadísticas
    return { totalUsers: 100, activeUsers: 80 };
  }

  private async getActivityData(): Promise<any> {
    // Lógica para obtener actividad
    return [{ action: 'Login', time: new Date() }];
  }
}
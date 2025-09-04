import { DashboardWidget } from "./dashboard-widget.interface";

export interface IDashboardService {
  getWidgets(): Promise<DashboardWidget[]>;
  getWidgetData(widgetId: string): Promise<any>;
  refreshWidget(widgetId: string): Promise<void>;
}

export interface IDashboardLayoutService {
  getLayout(): DashboardLayout;
  updateLayout(layout: DashboardLayout): void;
}

export interface DashboardLayout {
  columns: number;
  rowHeight: string;
  gutterSize: string;
}
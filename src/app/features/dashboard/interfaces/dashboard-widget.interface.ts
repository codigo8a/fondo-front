export interface DashboardWidget {
  id: string;
  title: string;
  subtitle?: string;
  type: WidgetType;
}

export interface WidgetData {
  load(): Promise<any>;
  refresh(): Promise<void>;
}

export interface WidgetActions {
  onPrimaryAction(): void;
  onSecondaryAction?(): void;
}

export enum WidgetType {
  STATISTICS = 'statistics',
  ACTIVITY = 'activity',
  CHART = 'chart'
}
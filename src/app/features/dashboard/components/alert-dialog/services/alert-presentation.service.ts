import { Injectable } from '@angular/core';
import { AlertType } from '../interfaces/alert-dialog.interfaces';

@Injectable({
  providedIn: 'root'
})
export class AlertPresentationService {
  getIconForType(type: AlertType): string {
    const iconMap: Record<AlertType, string> = {
      success: 'check_circle',
      error: 'error',
      warning: 'warning',
      info: 'info'
    };
    return iconMap[type] || 'info';
  }

  getButtonColorForType(type: AlertType): string {
    const colorMap: Record<AlertType, string> = {
      success: 'primary',
      error: 'warn',
      warning: 'accent',
      info: 'primary'
    };
    return colorMap[type] || 'primary';
  }

  getCssClassForType(type: AlertType): string {
    return `alert-${type}`;
  }
}
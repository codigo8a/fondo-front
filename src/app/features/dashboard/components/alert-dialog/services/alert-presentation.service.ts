import { Injectable } from '@angular/core';
import { AlertType } from '../interfaces/alert-dialog.interfaces';

@Injectable({
  providedIn: 'root'
})
export class AlertPresentationService {
  getIcon(type: AlertType): string {
    const iconMap: Record<AlertType, string> = {
      success: 'check_circle',
      error: 'error',
      warning: 'warning',
      info: 'info',
      confirm: 'help_outline'
    };
    return iconMap[type] || 'info';
  }

  getButtonColor(type: AlertType): string {
    const colorMap: Record<AlertType, string> = {
      success: 'primary',
      error: 'warn',
      warning: 'accent',
      info: 'primary',
      confirm: 'primary'
    };
    return colorMap[type] || 'primary';
  }
}
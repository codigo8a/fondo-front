import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertDialogComponent } from '../alert-dialog.component';
import { IAlertDialogData, IAlertDialogConfig, AlertType } from '../interfaces/alert-dialog.interfaces';

@Injectable({
  providedIn: 'root'
})
export class AlertDialogService {
  constructor(private dialog: MatDialog) {}

  openAlert(
    title: string,
    message: string,
    type: AlertType,
    config?: IAlertDialogConfig
  ): MatDialogRef<AlertDialogComponent> {
    const dialogData: IAlertDialogData = {
      title,
      message,
      type
    };

    const defaultConfig: IAlertDialogConfig = {
      width: '400px',
      maxWidth: '90vw',
      disableClose: false,
      panelClass: 'custom-dialog-container',
      backdropClass: 'custom-dialog-backdrop'
    };

    const finalConfig = { ...defaultConfig, ...config };

    return this.dialog.open(AlertDialogComponent, {
      data: dialogData,
      ...finalConfig
    });
  }

  openSuccessAlert(title: string, message: string, config?: IAlertDialogConfig) {
    return this.openAlert(title, message, 'success', config);
  }

  openErrorAlert(title: string, message: string, config?: IAlertDialogConfig) {
    return this.openAlert(title, message, 'error', config);
  }

  openWarningAlert(title: string, message: string, config?: IAlertDialogConfig) {
    return this.openAlert(title, message, 'warning', config);
  }

  openInfoAlert(title: string, message: string, config?: IAlertDialogConfig) {
    return this.openAlert(title, message, 'info', config);
  }
}
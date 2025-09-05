import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  IAlertDialogData,
  IAlertDialogActions,
  IAlertDialogPresentation
} from './interfaces/alert-dialog.interfaces';
import { AlertPresentationService } from './services/alert-presentation.service';

@Component({
  selector: 'app-alert-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss']
})
export class AlertDialogComponent implements IAlertDialogActions, IAlertDialogPresentation {
  constructor(
    public dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IAlertDialogData,
    private alertPresentationService: AlertPresentationService
  ) {
    console.log('AlertDialogComponent data:', this.data);
  }

  close(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  getIcon(): string {
    return this.alertPresentationService.getIcon(this.data.type);
  }

  getButtonColor(): string {
    return this.alertPresentationService.getButtonColor(this.data.type);
  }
}
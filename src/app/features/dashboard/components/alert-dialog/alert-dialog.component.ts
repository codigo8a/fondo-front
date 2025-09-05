import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
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
    private presentationService: AlertPresentationService
  ) {
    // Debug: Verificar que los datos se reciben correctamente
    console.log('AlertDialogComponent data:', this.data);
  }

  getIcon(): string {
    const icon = this.presentationService.getIconForType(this.data.type || 'info');
    console.log('Icon for type', this.data.type, ':', icon);
    return icon;
  }

  getButtonColor(): string {
    const color = this.presentationService.getButtonColorForType(this.data.type || 'info');
    console.log('Button color for type', this.data.type, ':', color);
    return color;
  }

  close(): void {
    this.dialogRef.close();
  }
}
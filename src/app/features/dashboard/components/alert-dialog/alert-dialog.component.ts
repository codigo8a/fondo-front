import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

export interface AlertDialogData {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Component({
  selector: 'app-alert-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="alert-dialog" [ngClass]="'alert-' + data.type">
      <div class="alert-header">
        <mat-icon class="alert-icon">{{ getIcon() }}</mat-icon>
        <h2 mat-dialog-title>{{ data.title }}</h2>
      </div>
      <div mat-dialog-content class="alert-content">
        <p>{{ data.message }}</p>
      </div>
      <div mat-dialog-actions class="alert-actions">
        <button mat-raised-button [color]="getButtonColor()" (click)="close()">
          Aceptar
        </button>
      </div>
    </div>
  `,
  styles: [`
    .alert-dialog {
      min-width: 300px;
      max-width: 500px;
    }
    
    .alert-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }
    
    .alert-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
    
    .alert-success .alert-icon {
      color: #4caf50;
    }
    
    .alert-error .alert-icon {
      color: #f44336;
    }
    
    .alert-warning .alert-icon {
      color: #ff9800;
    }
    
    .alert-info .alert-icon {
      color: #2196f3;
    }
    
    .alert-content {
      margin-bottom: 20px;
    }
    
    .alert-actions {
      display: flex;
      justify-content: flex-end;
    }
    
    h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 500;
    }
    
    p {
      margin: 0;
      color: rgba(0, 0, 0, 0.7);
    }
  `]
})
export class AlertDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AlertDialogData
  ) {}

  getIcon(): string {
    switch (this.data.type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'info';
    }
  }

  getButtonColor(): string {
    switch (this.data.type) {
      case 'success': return 'primary';
      case 'error': return 'warn';
      case 'warning': return 'accent';
      case 'info': return 'primary';
      default: return 'primary';
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
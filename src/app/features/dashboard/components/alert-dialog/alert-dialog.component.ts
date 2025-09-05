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
        <div class="icon-container">
          <mat-icon class="alert-icon">{{ getIcon() }}</mat-icon>
        </div>
        <h2 mat-dialog-title>{{ data.title }}</h2>
      </div>
      <div mat-dialog-content class="alert-content">
        <p>{{ data.message }}</p>
      </div>
      <div mat-dialog-actions class="alert-actions">
        <button mat-raised-button [color]="getButtonColor()" (click)="close()" class="action-button">
          Aceptar
        </button>
      </div>
    </div>
  `,
  styles: [`
    .alert-dialog {
      min-width: 350px;
      max-width: 550px;
      padding: 24px;
      border-radius: 16px;
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.2);
      position: relative;
      overflow: hidden;
    }
    
    .alert-dialog::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #e3f2fd, #bbdefb, #90caf9);
    }
    
    .alert-success::before {
      background: linear-gradient(90deg, #e8f5e8, #c8e6c9, #a5d6a7);
    }
    
    .alert-error::before {
      background: linear-gradient(90deg, #ffebee, #ffcdd2, #ef9a9a);
    }
    
    .alert-warning::before {
      background: linear-gradient(90deg, #fff3e0, #ffe0b2, #ffcc02);
    }
    
    .alert-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    }
    
    .icon-container {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.9);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .alert-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }
    
    .alert-success .icon-container {
      background: linear-gradient(135deg, #e8f5e8, #c8e6c9);
    }
    
    .alert-success .alert-icon {
      color: #2e7d32;
    }
    
    .alert-error .icon-container {
      background: linear-gradient(135deg, #ffebee, #ffcdd2);
    }
    
    .alert-error .alert-icon {
      color: #c62828;
    }
    
    .alert-warning .icon-container {
      background: linear-gradient(135deg, #fff3e0, #ffe0b2);
    }
    
    .alert-warning .alert-icon {
      color: #ef6c00;
    }
    
    .alert-info .icon-container {
      background: linear-gradient(135deg, #e3f2fd, #bbdefb);
    }
    
    .alert-info .alert-icon {
      color: #1565c0;
    }
    
    .alert-content {
      margin-bottom: 24px;
      padding: 0 8px;
    }
    
    .alert-actions {
      display: flex;
      justify-content: flex-end;
      padding-top: 16px;
      border-top: 1px solid rgba(0, 0, 0, 0.08);
    }
    
    .action-button {
      min-width: 100px;
      height: 40px;
      border-radius: 20px;
      font-weight: 500;
      text-transform: none;
      letter-spacing: 0.5px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
    
    .action-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    
    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #1a1a1a;
      letter-spacing: 0.3px;
    }
    
    p {
      margin: 0;
      font-size: 15px;
      line-height: 1.6;
      color: #424242;
      font-weight: 400;
    }
    
    /* Responsive design */
    @media (max-width: 480px) {
      .alert-dialog {
        min-width: 280px;
        padding: 20px;
      }
      
      .alert-header {
        gap: 12px;
      }
      
      .icon-container {
        width: 40px;
        height: 40px;
      }
      
      .alert-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
      
      h2 {
        font-size: 18px;
      }
      
      p {
        font-size: 14px;
      }
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
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DashboardWidget, WidgetActions } from '../../interfaces/dashboard-widget.interface';

@Component({
  selector: 'app-base-widget',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <mat-card class="dashboard-card">
      <mat-card-header>
        <mat-card-title>{{ widget.title }}</mat-card-title>
        @if (widget.subtitle) {
          <mat-card-subtitle>{{ widget.subtitle }}</mat-card-subtitle>
        }
      </mat-card-header>
      <mat-card-content>
        <ng-content></ng-content>
      </mat-card-content>
      <mat-card-actions>
        <button mat-button color="primary" (click)="onPrimaryAction()">
          {{ primaryActionText }}
        </button>
        @if (secondaryActionText) {
          <button mat-button color="accent" (click)="onSecondaryAction()">
            {{ secondaryActionText }}
          </button>
        }
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .dashboard-card {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: box-shadow 0.3s ease;
    }
    
    .dashboard-card:hover {
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }
    
    mat-card-content {
      flex-grow: 1;
      padding: 16px;
    }
    
    mat-card-actions {
      padding: 8px 16px;
      border-top: 1px solid #e0e0e0;
      display: flex;
      gap: 8px;
    }
    
    mat-card-header {
      padding: 16px 16px 0 16px;
    }
    
    mat-card-title {
      font-size: 1.2em;
      font-weight: 500;
      margin-bottom: 4px;
    }
    
    mat-card-subtitle {
      font-size: 0.9em;
      color: #666;
    }
  `]
})
export class BaseWidgetComponent implements WidgetActions {
  @Input() widget!: DashboardWidget;
  @Input() primaryActionText: string = 'Ver más';
  @Input() secondaryActionText?: string;
  
  @Output() primaryAction = new EventEmitter<void>();
  @Output() secondaryAction = new EventEmitter<void>();

  onPrimaryAction(): void {
    this.primaryAction.emit();
  }

  onSecondaryAction(): void {
    this.secondaryAction.emit();
  }
}
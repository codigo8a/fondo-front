import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-inscripciones',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card class="inscripciones-card">
      <mat-card-header>
        <mat-card-title>Inscripciones</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="inscripciones-id">
          <h2>{{ clienteId }}</h2>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .inscripciones-card {
      width: 100%;
      height: 200px;
      display: flex;
      flex-direction: column;
    }
    
    .inscripciones-id {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
    }
    
    .inscripciones-id h2 {
      margin: 0;
      font-size: 1.5rem;
      color: #388e3c;
      text-align: center;
      word-break: break-all;
    }
    
    mat-card-header {
      background-color: #f5f5f5;
      margin: -16px -16px 16px -16px;
      padding: 16px;
    }
  `]
})
export class InscripcionesComponent {
  @Input() clienteId: string = '';
}
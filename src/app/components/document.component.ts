import { Component } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'ngx-document',
  imports: [MatCard, MatCardContent],
  template: `
    <mat-card appearance="outlined">
      <mat-card-content>
        <h1>🤝 CRUD Controls Next!!!!</h1>
      </mat-card-content>
    </mat-card>
  `,
})
export class DocumentComponent {}

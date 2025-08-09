import { UpperCasePipe } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { StructuralSubType } from '../../services/mfe-remote.service';

@Component({
  selector: 'ngx-structural-subtypes',
  imports: [
    ReactiveFormsModule,
    MatSelectModule,
    MatExpansionModule,
    UpperCasePipe,
  ],
  template: `
    <mat-form-field>
      <mat-label>Type</mat-label>
      <mat-select [formControl]="structuralSubTypeControl()">
        @for (type of structuralSubType; track type) {
        <mat-option [value]="type">{{ type | uppercase }}</mat-option>
        }
      </mat-select>
    </mat-form-field>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class StructuralSubTypesComponent {
  structuralSubTypeControl = input.required<FormControl>();

  structuralSubType = Object.values(StructuralSubType);

  readonly panelOpenState = signal(false);

  structuralSubTypes = [
    { value: StructuralSubType.HEADER, label: 'Header' },
    { value: StructuralSubType.FOOTER, label: 'Footer' },
    { value: StructuralSubType.NAV, label: 'Navigation' },
  ];
}

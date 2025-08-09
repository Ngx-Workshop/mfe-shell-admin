import { Component, input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { StructuralSubType } from '../../services/mfe-remote.service';

@Component({
  selector: 'ngx-structural-subtypes',
  imports: [
    ReactiveFormsModule,
    MatRadioGroup,
    MatRadioButton,
    MatExpansionModule,
  ],
  template: `
    <div class="subtypes-container">
      <div class="subtype-section">
        <label>Sub Type:</label>
        <mat-radio-group [formControl]="structuralSubTypeControl()">
          @for (mode of structuralSubTypes; track mode.value) {
          <mat-radio-button [value]="mode.value">{{
            mode.label
          }}</mat-radio-button>
          }
        </mat-radio-group>
      </div>
    </div>
  `,
  styles: [
    `
      .subtypes-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        .subtype-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          label {
            font-weight: 500;
            font-size: 0.9em;
          }
          mat-radio-group {
            display: flex;
            flex-direction: row;
            gap: 1rem;
            flex-wrap: wrap;
            justify-content: space-between;
          }
        }
      }
    `,
  ],
})
export class StructuralSubTypesComponent {
  structuralSubTypeControl = input.required<FormControl>();

  readonly panelOpenState = signal(false);

  structuralSubTypes = [
    { value: StructuralSubType.HEADER, label: 'Header' },
    { value: StructuralSubType.FOOTER, label: 'Footer' },
    { value: StructuralSubType.NAV, label: 'Navigation' },
  ];
}

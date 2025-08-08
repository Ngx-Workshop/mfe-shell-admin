import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { StructuralOverrideMode } from '../services/mfe-remote.service';

@Component({
  selector: 'ngx-structural-overrides',
  imports: [ReactiveFormsModule, MatRadioGroup, MatRadioButton],
  template: `
    <div
      class="structural-overrides-group"
      [formGroup]="structuralOverridesForm()"
    >
      <h3>Structural Overrides</h3>
      <div class="overrides-container">
        <div class="override-section">
          <label>Header:</label>
          <mat-radio-group formControlName="header">
            @for (mode of structuralOverrideModes; track mode.value) {
            <mat-radio-button [value]="mode.value">{{
              mode.label
            }}</mat-radio-button>
            }
          </mat-radio-group>
        </div>

        <div class="override-section">
          <label>Navigation:</label>
          <mat-radio-group formControlName="nav">
            @for (mode of structuralOverrideModes; track mode.value) {
            <mat-radio-button [value]="mode.value">{{
              mode.label
            }}</mat-radio-button>
            }
          </mat-radio-group>
        </div>

        <div class="override-section">
          <label>Footer:</label>
          <mat-radio-group formControlName="footer">
            @for (mode of structuralOverrideModes; track mode.value) {
            <mat-radio-button [value]="mode.value">{{
              mode.label
            }}</mat-radio-button>
            }
          </mat-radio-group>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .structural-overrides-group {
        margin-top: 1rem;
        h3 {
          margin: 0 0 1rem 0;
          font-size: 1.1em;
          font-weight: 500;
        }
        .overrides-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          .override-section {
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
      }
    `,
  ],
})
export class StructuralOverridesComponent {
  structuralOverridesForm = input.required<FormGroup>();

  structuralOverrideModes = [
    { value: StructuralOverrideMode.FULL, label: 'Full' },
    { value: StructuralOverrideMode.VERBOSE, label: 'Verbose' },
    { value: StructuralOverrideMode.MINIMAL, label: 'Minimal' },
    { value: StructuralOverrideMode.COMPACT, label: 'Compact' },
    { value: StructuralOverrideMode.DISABLED, label: 'Disabled' },
  ];
}

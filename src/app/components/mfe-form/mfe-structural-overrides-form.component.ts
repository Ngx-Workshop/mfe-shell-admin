import { UpperCasePipe } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import {
  StructuralNavOverrideMode,
  StructuralOverrideMode,
} from '../../services/mfe-remote.service';

@Component({
  selector: 'ngx-structural-overrides',
  imports: [
    ReactiveFormsModule,
    MatRadioGroup,
    MatRadioButton,
    MatExpansionModule,
    UpperCasePipe,
  ],
  template: `
    <div
      class="structural-overrides-group"
      [formGroup]="structuralOverridesForm()"
    >
      <mat-accordion>
        <mat-expansion-panel
          (opened)="panelOpenState.set(true)"
          (closed)="panelOpenState.set(false)"
        >
          <mat-expansion-panel-header>
            <mat-panel-title>Structural Overrides</mat-panel-title>
            <mat-panel-description>
              <span
                >Header:
                {{
                  structuralOverridesForm().get('header')?.value | uppercase
                }}</span
              >
              <span
                >Nav:
                {{
                  structuralOverridesForm().get('nav')?.value | uppercase
                }}</span
              >
              <span>
                Footer:
                {{
                  structuralOverridesForm().get('footer')?.value | uppercase
                }}</span
              >
            </mat-panel-description>
          </mat-expansion-panel-header>
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
                @for (mode of structuralNavOverrideModes; track mode.value) {
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
        </mat-expansion-panel>
      </mat-accordion>
    </div>
  `,
  styles: [
    `
      mat-panel-description.mat-expansion-panel-header-description {
        justify-content: space-around;
      }
      .structural-overrides-group {
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

  readonly panelOpenState = signal(false);

  structuralOverrideModes = [
    { value: StructuralOverrideMode.FULL, label: 'Full' },
    { value: StructuralOverrideMode.COMPACT, label: 'Compact' },
    { value: StructuralOverrideMode.DISABLED, label: 'Disabled' },
  ];

  structuralNavOverrideModes = [
    { value: StructuralNavOverrideMode.VERBOSE, label: 'Verbose' },
    { value: StructuralNavOverrideMode.MINIMAL, label: 'Minimal' },
    { value: StructuralNavOverrideMode.DISABLED, label: 'Disabled' },
  ];
}

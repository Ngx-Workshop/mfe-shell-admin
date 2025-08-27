import { Component, input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { StructuralOverrides } from './form-mfe-structural-overrides';
import { StructuralSubTypeOptions } from './form-mfe-structural-subtypes';

import type { MfeRemoteType } from '@tmdjr/ngx-mfe-orchestrator-contracts';

@Component({
  selector: 'ngx-structural-fields',
  imports: [
    StructuralOverrides,
    StructuralSubTypeOptions,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  template: `
    @if(formGroup(); as mfeRemoteForm) {
    <mat-form-field>
      <mat-label>Type</mat-label>
      <mat-select formControlName="type">
        @for (type of mfeTypes; track type) {
        <mat-option [value]="type">{{ type }}</mat-option>
        }
      </mat-select>
    </mat-form-field>
    @if (mfeRemoteForm.get('type')?.value === 'user-journey') {
    <ngx-structural-overrides
      [structuralOverridesForm]="$any(mfeRemoteForm.get('structuralOverrides'))"
    ></ngx-structural-overrides>
    } @else {
    <ngx-structural-subtypes
      [structuralSubTypeControl]="$any(mfeRemoteForm.get('structuralSubType'))"
    ></ngx-structural-subtypes>
    } }
  `,
  styles: [
    `
      :host {
        display: contents;
        ngx-structural-overrides {
          margin-bottom: 1.7rem;
        }
      }
    `,
  ],
})
export class StructuralFields {
  formGroup = input.required<FormGroup>({ alias: 'mfeRemoteForm' });
  mfeTypes: MfeRemoteType[] = ['structural', 'user-journey'];
}

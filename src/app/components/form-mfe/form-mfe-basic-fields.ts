import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import type { MfeRemoteType } from '@tmdjr/ngx-mfe-orchestrator-contracts';

@Component({
  selector: 'ngx-mfe-basic-fields',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  template: `
    <div [formGroup]="form()">
      <mat-form-field>
        <mat-label>Name</mat-label>
        <input formControlName="name" matInput />
        @if (form().get('name')?.errors) {
        <mat-error>{{ errorMessages()['name'] }}</mat-error>
        }
      </mat-form-field>
      <mat-form-field>
        <mat-label>Description</mat-label>
        <textarea formControlName="description" matInput></textarea>
      </mat-form-field>
      <div class="remote-entry-url-group">
        <mat-form-field>
          <mat-label>Remote Entry URL</mat-label>
          <input formControlName="remoteEntryUrl" matInput />
          @if (form().get('remoteEntryUrl')?.errors) {
          <mat-error>{{ errorMessages()['remoteEntryUrl'] }}</mat-error>
          }
        </mat-form-field>
        <button mat-button (click)="verifyUrl()">Verify</button>
      </div>
      <mat-form-field>
        <mat-label>Type</mat-label>
        <mat-select formControlName="type">
          @for (type of mfeTypes; track type) {
          <mat-option [value]="type">{{ type }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
    </div>
  `,
  styles: [
    `
      :host {
        display: contents;
        > div {
          display: contents;
          .remote-entry-url-group {
            display: flex;
            flex-direction: row;
            gap: 0.5em;
            align-items: baseline;
            mat-form-field {
              flex: 1;
            }
          }
        }
      }
    `,
  ],
})
export class MfeBasicFields {
  form = input.required<FormGroup>();
  errorMessages = input.required<{ [key: string]: string }>();
  mfeTypes: MfeRemoteType[] = ['structural', 'user-journey'];
  verifyUrlClick = output<string>();

  verifyUrl() {
    const url = this.form().get('remoteEntryUrl')?.value;
    if (url) {
      this.verifyUrlClick.emit(url);
    }
  }
}

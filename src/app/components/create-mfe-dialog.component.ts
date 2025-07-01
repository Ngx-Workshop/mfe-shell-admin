import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MfeFormComponent } from './mfe-form.component';

@Component({
  selector: 'ngx-create-mfe-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MfeFormComponent,
  ],
  template: `
    <h2 mat-dialog-title>Create MFE Remote catalog entry?</h2>
    <mat-dialog-content>
      <ngx-mfe-form [value]="mfeRemote"></ngx-mfe-form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button matButton (click)="dialogRef.close()">Cancel</button>
      <button
        matButton
        (click)="createRemote()"
      >
        Create
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      :host {
        mat-dialog-content {
          display: flex;
          flex-direction: column;
          gap: 0.5em;
        }
      }
    `,
  ],
})
export class CreateMFEDialog {
  dialogRef = inject(MatDialogRef<CreateMFEDialog>);

  mfeRemote = {
    name: '',
    description: '',
    remoteEntryUrl: '',
  }

  createRemote() {
    console.log('Creating MFE Remote:', this.mfeRemote);
    // this.dialogRef.close(this.mfeRemote);
  }
}

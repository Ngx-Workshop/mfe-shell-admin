import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { of, startWith, withLatestFrom, map, mergeMap, tap } from 'rxjs';

type ViewModel = {
  mfeRemoteForm: FormGroup;
  formErrorMessages: { [key: string]: string };
  errorMessages: { [key: string]: string };
};

@Component({
  selector: 'ngx-create-mfe-dialog',
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
  template: `
    @if (viewModel$ | async; as vm) {
    <h2 mat-dialog-title>Create MFE Remote catalog entry?</h2>
    <form [formGroup]="vm.mfeRemoteForm">
      <mat-dialog-content>
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input formControlName="name" matInput />
          @if (vm.mfeRemoteForm.get('name')?.errors) {
          <mat-error>{{ vm.formErrorMessages['name'] }}</mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <textarea formControlName="description" matInput></textarea>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Remote Entry URL</mat-label>
          <input formControlName="remoteEntryUrl" matInput />
          @if (vm.mfeRemoteForm.get('remoteEntryUrl')?.errors) {
          <mat-error>{{ vm.formErrorMessages['remoteEntryUrl'] }}</mat-error>
          }
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button matButton (click)="dialogRef.close()">Cancel</button>
        <button
          matButton
          (click)="createRemote(vm.mfeRemoteForm)"
          [disabled]="vm.mfeRemoteForm.invalid"
        >
          Create
        </button>
      </mat-dialog-actions>
    </form>
    }
  `,
  styles: [
    `
      :host {
        mat-dialog-content {
          display: flex;
          flex-direction: column;
          gap: .5em;
        }
      }
    `,
  ],
})
export class CreateMFEDialog {
  formBuilder = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<CreateMFEDialog>);

  viewModel$ = of({
    mfeRemoteForm: this.formBuilder.nonNullable.group({
      name: ['', Validators.required],
      description: [''],
      remoteEntryUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
    }),
    errorMessages: {
      required: 'Required',
      pattern: 'Must be a valid URL',
    },
    formErrorMessages: {
      name: 'Required',
      remoteEntryUrl: 'Required',
    },
  }).pipe(
    mergeMap((viewModel: ViewModel) =>
      this.watchStatusChanges(viewModel).pipe(
        startWith(null),
        withLatestFrom(of(viewModel)),
        map(([_status, vm]) => vm)
      )
    )
  );

  watchStatusChanges(viewModel: ViewModel) {
    return viewModel.mfeRemoteForm.statusChanges.pipe(
      tap(() => this.setErrorsMessages(viewModel))
    );
  }

  createRemote(mfeRemoteForm: FormGroup) {
    this.dialogRef.close(mfeRemoteForm.getRawValue());
  }

  // ! Quick and Drity way to set error messages
  setErrorsMessages({
    mfeRemoteForm,
    formErrorMessages,
    errorMessages,
  }: ViewModel): void {
    Object.keys(mfeRemoteForm.controls).forEach((element) => {
      const errors = mfeRemoteForm.get(element)?.errors;
      if (errors) {
        const error = Object.keys(errors)[0];
        formErrorMessages[element] = errorMessages[error];
      }
    });
  }
}

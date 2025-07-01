import { AsyncPipe } from '@angular/common';
import { Component, inject, input, model } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { of, startWith, withLatestFrom, map, mergeMap, tap } from 'rxjs';
import { IMfeRemote } from '../services/mfe-remote.service';

type ViewModel = {
  mfeRemoteForm: FormGroup;
  formErrorMessages: { [key: string]: string };
  errorMessages: { [key: string]: string };
};

@Component({
  selector: 'ngx-mfe-form',
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    @if (viewModel$ | async; as vm) {
    <form [formGroup]="vm.mfeRemoteForm">
      <mat-form-field>
        <mat-label>Name</mat-label>
        <input formControlName="name" matInput />
        @if (vm.mfeRemoteForm.get('name')?.errors) {
        <mat-error>{{ vm.formErrorMessages['name'] }}</mat-error>
        }
      </mat-form-field>
      <mat-form-field>
        <mat-label>Description</mat-label>
        <textarea formControlName="description" matInput></textarea>
      </mat-form-field>
      <mat-form-field>
        <mat-label>Remote Entry URL</mat-label>
        <input formControlName="remoteEntryUrl" matInput />
        @if (vm.mfeRemoteForm.get('remoteEntryUrl')?.errors) {
        <mat-error>{{ vm.formErrorMessages['remoteEntryUrl'] }}</mat-error>
        }
      </mat-form-field>
    </form>
    }
  `,
  styles: [
    `
      :host {
        form {
          display: flex;
          flex-direction: column;
          gap: 0.5em;
        }
      }
    `,
  ],
})
export class MfeFormComponent {
  formBuilder = inject(FormBuilder);

  value = input<Partial<IMfeRemote>>({
    name: '',
    description: '',
    remoteEntryUrl: '',
  });
  value$ = toObservable(this.value);

  viewModel$ = this.value$.pipe(
    map((value) => ({
      mfeRemoteForm: this.formBuilder.nonNullable.group({
        name: [value.name, Validators.required, Validators.minLength(3)],
        description: [value.description],
        remoteEntryUrl: [
          value.remoteEntryUrl,
          [Validators.required, Validators.pattern('https?://.+')],
        ],
      }),
      errorMessages: {
        required: 'Required',
        pattern: 'Must be a valid URL',
        minlength: 'Must be at least 3 characters long',

        
      },
      formErrorMessages: {
        name: '',
        remoteEntryUrl: '',
      },
    })),
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

import { AsyncPipe } from '@angular/common';
import { Component, inject, input, model, output } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
  FormControlStatus,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  of,
  startWith,
  withLatestFrom,
  map,
  mergeMap,
  tap,
  forkJoin,
} from 'rxjs';
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

  valueChange = output<Partial<IMfeRemote>>();
  formStatus = output<FormControlStatus | null>();
  initValue = input<Partial<IMfeRemote>>({
    name: '',
    description: '',
    remoteEntryUrl: '',
  });
  initValue$ = toObservable(this.initValue);

  viewModel$ = this.initValue$.pipe(
    map((value) => ({
      mfeRemoteForm: this.formBuilder.nonNullable.group({
        name: [value.name, Validators.required],
        description: [value.description],
        remoteEntryUrl: [
          value.remoteEntryUrl,
          [Validators.required, Validators.pattern('https?://.+')],
        ],
      }),
      errorMessages: {
        required: 'Required',
        pattern: 'Must be a valid URL',
      },
      formErrorMessages: {
        name: '',
        remoteEntryUrl: '',
      },
    })),
    mergeMap((viewModel: ViewModel) =>
      forkJoin([
        this.watchStatusChanges(viewModel),
        this.watchFormValueChanges(viewModel),
      ]).pipe(
        startWith(null),
        map(() => viewModel)
      )
    )
  );

  watchStatusChanges(viewModel: ViewModel) {
    return viewModel.mfeRemoteForm.statusChanges.pipe(
      tap((status) => this.formStatus.emit(status)),
      tap(() => this.setErrorsMessages(viewModel))
    );
  }

  watchFormValueChanges(viewModel: ViewModel) {
    return viewModel.mfeRemoteForm.valueChanges.pipe(
      tap((value) => this.valueChange.emit(value))
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

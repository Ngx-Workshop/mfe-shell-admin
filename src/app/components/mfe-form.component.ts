import { AsyncPipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
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
import { startWith, map, mergeMap, tap, forkJoin, lastValueFrom } from 'rxjs';
import { IMfeRemote, MfeRemoteService } from '../services/mfe-remote.service';

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
      <div class="remote-entry-url-group">
        <mat-form-field>
          <mat-label>Remote Entry URL</mat-label>
          <input formControlName="remoteEntryUrl" matInput />
          @if (vm.mfeRemoteForm.get('remoteEntryUrl')?.errors) {
          <mat-error>{{ vm.formErrorMessages['remoteEntryUrl'] }}</mat-error>
          }
        </mat-form-field>
        <button mat-button (click)="vm.verifyMfeUrl()">Verify</button>
      </div>
      <mat-form-field>
        <mat-label>Description</mat-label>
        <textarea formControlName="description" matInput></textarea>
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
export class MfeFormComponent {
  formBuilder = inject(FormBuilder);
  mfeRemoteService = inject(MfeRemoteService);

  valueChange = output<Partial<IMfeRemote>>();
  formStatus = output<FormControlStatus | null>();
  initialValue = input<Partial<IMfeRemote>>({
    name: '',
    description: '',
    remoteEntryUrl: '',
  });
  initialValue$ = toObservable(this.initialValue);

  viewModel$ = this.initialValue$.pipe(
    map((value) => ({
      mfeRemoteForm: this.formBuilder.nonNullable.group({
        name: [value.name, Validators.required],
        description: [value.description],
        remoteEntryUrl: [value.remoteEntryUrl, [Validators.required]],
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
        map(() => ({
          ...viewModel,
          verifyMfeUrl: () =>
            this.verifyMfeUrl(viewModel.mfeRemoteForm.value.remoteEntryUrl),
        }))
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

  verifyMfeUrl(url: string) {
    lastValueFrom(this.mfeRemoteService.verifyMfeUrl(url));
  }
}

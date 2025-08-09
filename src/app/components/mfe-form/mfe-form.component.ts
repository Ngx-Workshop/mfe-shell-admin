import { AsyncPipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormControlStatus,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { forkJoin, lastValueFrom, map, mergeMap, startWith, tap } from 'rxjs';
import {
  IMfeRemote,
  MfeRemoteService,
  MfeRemoteType,
  StructuralNavOverrideMode,
  StructuralOverrideMode,
  StructuralSubType,
} from '../../services/mfe-remote.service';
import { MfeBasicFieldsComponent } from './mfe-basic-fields-form.component';
import { StructuralOverridesComponent } from './mfe-structural-overrides-form.component';
import { StructuralSubTypesComponent } from './mfe-structural-subtypes-form.component';

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
    MatExpansionModule,
    MfeBasicFieldsComponent,
    StructuralOverridesComponent,
    StructuralSubTypesComponent,
  ],
  template: `
    @if (viewModel$ | async; as vm) {
    <form [formGroup]="vm.mfeRemoteForm">
      <ngx-mfe-basic-fields
        [form]="vm.mfeRemoteForm"
        [errorMessages]="vm.formErrorMessages"
        [mfeTypes]="mfeTypes"
        (verifyUrlClick)="verifyMfeUrl($event)"
      ></ngx-mfe-basic-fields>

      @if (vm.mfeRemoteForm.get('type')?.value === 'user-journey') {
      <ngx-structural-overrides
        [structuralOverridesForm]="
          $any(vm.mfeRemoteForm.get('structuralOverrides'))
        "
      ></ngx-structural-overrides>
      } @else {
      <ngx-structural-subtypes
        [structuralSubTypeControl]="
          $any(vm.mfeRemoteForm.get('structuralSubType'))
        "
      ></ngx-structural-subtypes>
      }
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
  mfeRemoteService = inject(MfeRemoteService);

  valueChange = output<Partial<IMfeRemote>>();
  formStatus = output<FormControlStatus | null>();
  initialValue = input<Partial<IMfeRemote>>({
    name: '',
    description: '',
    remoteEntryUrl: '',
    type: MfeRemoteType.USER_JOURNEY,
    structuralSubType: StructuralSubType.HEADER,
    structuralOverrides: {
      header: StructuralOverrideMode.DISABLED,
      nav: StructuralNavOverrideMode.DISABLED,
      footer: StructuralOverrideMode.DISABLED,
    },
  });
  initialValue$ = toObservable(this.initialValue);

  mfeTypes = Object.values(MfeRemoteType);

  private createFormGroup(baseFormGroup: any, value: Partial<IMfeRemote>): any {
    if (value.type === MfeRemoteType.USER_JOURNEY) {
      return {
        ...baseFormGroup,
        structuralOverrides: this.createStructuralOverridesFormGroup(
          value.structuralOverrides
        ),
      };
    }

    // STRUCTURAL: ensure the structuralSubType control exists at creation time
    return {
      ...baseFormGroup,
      structuralSubType: new FormControl(
        value.structuralSubType ?? StructuralSubType.HEADER,
        { nonNullable: true }
      ),
    };
  }

  private createStructuralOverridesFormGroup(
    structuralOverrides?: Partial<{
      header: StructuralOverrideMode;
      nav: StructuralNavOverrideMode;
      footer: StructuralOverrideMode;
    }>
  ): FormGroup {
    return this.formBuilder.nonNullable.group({
      header: [
        structuralOverrides?.header || StructuralOverrideMode.DISABLED,
        Validators.required,
      ],
      nav: [
        structuralOverrides?.nav || StructuralOverrideMode.DISABLED,
        Validators.required,
      ],
      footer: [
        structuralOverrides?.footer || StructuralOverrideMode.DISABLED,
        Validators.required,
      ],
    });
  }

  viewModel$ = this.initialValue$.pipe(
    map((value) => {
      const baseFormGroup = {
        name: [value.name, Validators.required],
        description: [value.description],
        remoteEntryUrl: [value.remoteEntryUrl, [Validators.required]],
        type: [value.type, [Validators.required]],
      };

      const formGroup = this.createFormGroup(baseFormGroup, value);

      return {
        mfeRemoteForm: this.formBuilder.nonNullable.group(formGroup),
        errorMessages: {
          required: 'Required',
          pattern: 'Must be a valid URL',
        },
        formErrorMessages: {
          name: '',
          remoteEntryUrl: '',
        },
      };
    }),
    mergeMap((viewModel: ViewModel) =>
      forkJoin([
        this.watchStatusChanges(viewModel),
        this.watchFormValueChanges(viewModel),
        this.watchTypeChanges(viewModel),
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
      tap((value) => {
        // If type is STRUCTURAL, remove structuralOverrides from the emitted value
        if (value.type === MfeRemoteType.STRUCTURAL) {
          const { structuralOverrides, ...valueWithoutOverrides } = value;
          this.valueChange.emit(valueWithoutOverrides);
        } else {
          this.valueChange.emit(value);
        }
      })
    );
  }

  watchTypeChanges(viewModel: ViewModel) {
    return viewModel.mfeRemoteForm.get('type')!.valueChanges.pipe(
      tap((type) => {
        if (type === MfeRemoteType.USER_JOURNEY) {
          viewModel.mfeRemoteForm.removeControl('structuralSubType');
          viewModel.mfeRemoteForm.addControl(
            'structuralOverrides',
            this.createStructuralOverridesFormGroup()
          );
        } else if (type === MfeRemoteType.STRUCTURAL) {
          viewModel.mfeRemoteForm.removeControl('structuralOverrides');
          viewModel.mfeRemoteForm.addControl(
            'structuralSubType',
            new FormControl(StructuralSubType.HEADER, { nonNullable: true })
          );
        }
      })
    );
  }

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

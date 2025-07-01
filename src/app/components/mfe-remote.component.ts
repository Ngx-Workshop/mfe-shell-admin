import { Component, inject, input, effect, output } from '@angular/core';
import { IMfeRemote } from '../services/mfe-remote.service';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-mfe-remote',
  imports: [
    MatCardModule,
    MatButton,
    MatFormFieldModule,
    MatInputModule,
    DatePipe,
    ReactiveFormsModule,
  ],
  template: `
    @if (mfeRemote(); as mfe) {
    <form [formGroup]="mfeRemoteForm">
      <mat-card appearance="filled">
        <mat-card-header>
          <h3>Version {{ mfe.version }}</h3>
          <div class="flex-spacer"></div>
          <h5>Last Updated: {{ mfe.lastUpdated | date }}</h5>
        </mat-card-header>
        <mat-card-content>
          <mat-form-field appearance="outline">
            <mat-label>Name</mat-label>
            <input formControlName="name" matInput />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Description</mat-label>
            <textarea formControlName="description" matInput></textarea>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Remote Entry URL</mat-label>
            <input formControlName="remoteEntryUrl" matInput />
          </mat-form-field>
        </mat-card-content>
        <mat-card-actions>
          <button matButton (click)="updateRemote()">Update</button>
          <button matButton (click)="archiveRemote()">
            {{ mfe.archived ? 'Archived' : 'Archive' }}
          </button>
        </mat-card-actions>
      </mat-card>
    </form>
    }
  `,
  styles: [
    `
      :host {
        mat-card-content {
          display: flex;
          flex-direction: column;
        }
        mat-card-header {
          display: flex;
          flex-direction: row;
        }
      }
    `,
  ],
})
export class MfeRemoteComponent {
  formBuilder = inject(FormBuilder);
  mfeRemote = input.required<IMfeRemote>();

  update = output<IMfeRemote>();
  archive = output<IMfeRemote>();

  mfeRemoteForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
    remoteEntryUrl: ['', [Validators.required]],
  });

  constructor() {
    effect(() => {
      const mfe = this.mfeRemote();
      this.mfeRemoteForm.patchValue({
        name: mfe.name,
        description: mfe.description || '',
        remoteEntryUrl: mfe.remoteEntryUrl || '',
      });
    });
  }

  updateRemote() {
    this.mfeRemoteForm.valid
      ? this.update.emit({
          ...this.mfeRemote(),
          ...this.mfeRemoteForm.getRawValue(),
        })
      : console.warn('Form is invalid', this.mfeRemoteForm.errors);
  }

  archiveRemote() {
    this.archive.emit(this.mfeRemote());
  }
}
